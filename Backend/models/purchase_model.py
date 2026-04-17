"""Modelo de compra registrada."""
from database import db


class Compra(db.Model):
    """Compra de mercado registrada."""
    __tablename__ = "compras"

    id = db.Column(db.Integer, primary_key=True)
    finance_month_id = db.Column(db.Integer, db.ForeignKey("finance_months.id"), nullable=False)
    loja = db.Column(db.String(200), nullable=False)
    data = db.Column(db.String(20), default="")
    valor = db.Column(db.Float, default=0)
    img_b64 = db.Column(db.Text, nullable=True)
    ai_items = db.Column(db.Text, default="[]")  # JSON string

    def to_dict(self):
        import json
        try:
            ai = json.loads(self.ai_items) if self.ai_items else []
        except (json.JSONDecodeError, TypeError):
            ai = []
        return {
            "loja": self.loja,
            "data": self.data,
            "valor": self.valor,
            "imgB64": self.img_b64,
            "aiItems": ai,
        }
