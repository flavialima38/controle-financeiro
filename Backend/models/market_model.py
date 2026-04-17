"""Modelos do banco de dados para lista de mercado."""
from database import db


class MarketItem(db.Model):
    """Item da lista de mercado."""
    __tablename__ = "market_items"

    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)
    item_id = db.Column(db.Integer, nullable=False)
    cat = db.Column(db.String(100), nullable=False)
    nome = db.Column(db.String(200), nullable=False)
    qty = db.Column(db.String(100), default="—")
    done = db.Column(db.Boolean, default=False)
    custom = db.Column(db.Boolean, default=False)
    comprado = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.item_id,
            "cat": self.cat,
            "nome": self.nome,
            "qty": self.qty,
            "done": self.done,
            "custom": self.custom,
            "comprado": self.comprado,
        }


class MarketBudget(db.Model):
    """Orçamento do mercado por mês."""
    __tablename__ = "market_budgets"

    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)
    valor = db.Column(db.Float, default=0)

    __table_args__ = (db.UniqueConstraint("year", "month", name="uq_budget_year_month"),)
