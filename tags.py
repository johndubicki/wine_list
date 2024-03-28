import json

from wine_list import db, create_app
from wine_list.models import Wine

app = create_app()

def make_list(col: str) -> list:
    terms = [word.strip().lower() for word in col.split() if word]
    return terms

with app.app_context():
    wines = Wine.query.all()
    for wine in wines:
        tags = []
        tags.append(wine.vintage)
        tags.append(wine.category.lower())
        tags.append(wine.size.lower())
        tags.extend(make_list(wine.varietal))
        tags.extend(make_list(wine.country))
        tags.extend(make_list(wine.region))
        tags.extend(make_list(wine.subregion))
        tags.extend(make_list(wine.producer))
        tags.extend(make_list(wine.name))
        wine.tags = json.dumps(list(set(tags)))
    db.session.commit()