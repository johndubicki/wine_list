from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///wine_cellar.db'

    from .models import Wine

    db.init_app(app)

    @app.route('/', methods=['GET', 'POST'])
    def index():
        all_wine = Wine.query.all()
        if request.method == 'POST':
            details = request.get_json()
            new_wine = Wine()
            for k, v in details.items():
                setattr(new_wine, k, v)
            db.session.add(new_wine)
            try:
                db.session.commit()
                response = {"status": "success"}
            except Exception:
                response = {"status": "error"}
            return response
        return render_template('index.html', wines=all_wine)
    
    return app