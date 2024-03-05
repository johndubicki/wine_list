from wine_list import db

class Wine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    row = db.Column(db.String())
    position = db.Column(db.String())
    quantity = db.Column(db.String())
    vintage = db.Column(db.String())
    category = db.Column(db.String())
    varietal = db.Column(db.String())
    country = db.Column(db.String())
    region = db.Column(db.String())
    subregion = db.Column(db.String())
    producer = db.Column(db.String())
    name = db.Column(db.String())
    size = db.Column(db.String())
    window_start = db.Column(db.String(), default='?')
    window_end = db.Column(db.String(), default='?')
    tags = db.Column(db.String())

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}