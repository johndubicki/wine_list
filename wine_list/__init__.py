import json
from datetime import datetime

from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///wine_cellar.db"

    from .models import Wine

    db.init_app(app)

    @app.route("/", methods=["GET", "POST"])
    @app.route("/<id>", methods=["PATCH", "DELETE"])
    def index(id: str = None):
        if request.method == "GET":
            all_wine = Wine.query.all()
            old_wine, in_window_wine = generate_old_and_in_window_wines(all_wine)
            return render_template(
                "index.html",
                wines=sorted(all_wine, key=lambda x: x.producer),
                old_wine=old_wine,
                in_window_wine=in_window_wine,
            )
        if request.method == "POST":
            details = request.get_json()
            new_wine = Wine()
            tags = []
            for k, v in details.items():
                setattr(new_wine, k, v)
                tags.append(v)
            new_wine.tags = json.dumps(tags)
            db.session.add(new_wine)
        if request.method == "PATCH" and id:
            details = request.get_json()
            wine = Wine.query.filter_by(id=int(id)).first()
            tags = []
            for k, v in details.items():
                setattr(wine, k, v)
                tags.append(v)
            wine.tags = json.dumps(tags)
        if request.method == "DELETE" and id:
            wine = Wine.query.filter_by(id=int(id)).delete()
        try:
            db.session.commit()
            response = {"status": "success"}
        except Exception:
            response = {"status": "error"}
        return response

    @app.route("/search", methods=["POST"])
    @app.route("/search/<id>", methods=["GET"])
    def search(id: str = None):
        if request.method == "GET" and id:
            matching_wine = Wine.query.filter_by(id=int(id)).first().to_dict()
        if request.method == "POST":
            all_wine = Wine.query.all()
            data = request.get_json()
            search_list = [term.strip() for term in str(data["terms"]).split(",")]
            matching_wine = [
                wine.to_dict()
                for wine in all_wine
                if set(search_list).issubset(set(json.loads(wine.tags)))
            ]
        return {"status": "success", "data": matching_wine}

    @app.route("/options", methods=["GET"])
    def create_options_dict():
        all_wine = Wine.query.all()
        options = {
            "vintage": set(),
            "varietal": set(),
            "name": set(),
            "producer": set(),
            "subregion": set(),
            "region": set(),
            "country": set(),
            "row": set(),
        }
        for wine in all_wine:
            options["vintage"].add(wine.vintage)
            options["varietal"].add(wine.varietal)
            options["name"].add(wine.name)
            options["producer"].add(wine.producer)
            options["subregion"].add(wine.subregion)
            options["region"].add(wine.region)
            options["country"].add(wine.country)
            options["row"].add(wine.row)
        options = {k: sorted(v) for k, v in options.items()}
        return options

    return app


def generate_old_and_in_window_wines(all_wine: list) -> tuple:
    current_year = int(datetime.now().strftime("%Y"))
    old_wines = []
    in_window_wines = []
    for wine in all_wine:
        try:
            if current_year > int(wine.window_end):
                old_wines.append(wine)
            if current_year >= int(wine.window_start) and current_year < int(
                wine.window_end
            ):
                in_window_wines.append(wine)
        except ValueError:
            pass
    return (
        sorted(old_wines, key=lambda x: x.window_end),
        sorted(in_window_wines, key=lambda x: x.window_end),
    )
