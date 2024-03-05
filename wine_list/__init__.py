import json

from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///wine_cellar.db'

    from .models import Wine

    db.init_app(app)

    @app.route('/', methods=['GET', 'POST'])
    @app.route('/<id>', methods=['PATCH'])
    def index(id: str=None):
        if id and request.method == 'PATCH':
            details = request.get_json()
            wine = Wine.query.filter_by(id=int(id)).first()
            tags = []
            for k, v in details.items():
                setattr(wine, k, v)
                tags.append(v)
            wine.tags = json.dumps(tags)
            try:
                db.session.commit()
                response = {"status": "success"}
            except Exception:
                response = {"status": "error"}
            return response
        all_wine = Wine.query.all()
        if request.method == 'POST':
            details = request.get_json()
            new_wine = Wine()
            tags = []
            for k, v in details.items():
                setattr(new_wine, k, v)
                tags.append(v)
            new_wine.tags = json.dumps(tags)
            db.session.add(new_wine)
            try:
                db.session.commit()
                response = {"status": "success"}
            except Exception:
                response = {"status": "error"}
            return response
        return render_template('index.html', wines=all_wine)
    
    @app.route('/search', methods=['POST'])
    @app.route('/search/<id>', methods=['GET'])
    def search(id: str=None):
        if id:
            matching_wine = Wine.query.filter_by(id=int(id)).first()
            return {
                'status': 'success',
                'data': matching_wine.to_dict()
            }
        if request.method == 'POST':
            all_wine = Wine.query.all()
            data = request.get_json()
            search_list = [term.strip() for term in str(data['terms']).split(',')]
            print(search_list)
            matching_wine = [wine.to_dict() for wine in all_wine if set(search_list).issubset(set(json.loads(wine.tags)))]
            return {
                'status': 'success',
                'data': matching_wine
            }

    return app