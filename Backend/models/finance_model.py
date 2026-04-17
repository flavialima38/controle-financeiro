"""Modelos do banco de dados para o estado financeiro mensal."""
from database import db

PESSOAS = ["Flavia", "Igor", "Luli", "Daniel"]
META_CONTRIBUICAO = 1000


class FinanceMonth(db.Model):
    """Registro de controle mensal."""
    __tablename__ = "finance_months"

    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)
    next_item_id = db.Column(db.Integer, default=10)

    entradas = db.relationship("Entrada", backref="finance_month", cascade="all, delete-orphan", lazy=True)
    despesas = db.relationship("Despesa", backref="finance_month", cascade="all, delete-orphan", lazy=True)
    observacoes = db.relationship("Observacao", backref="finance_month", cascade="all, delete-orphan", lazy=True)
    devendos = db.relationship("Devendo", backref="finance_month", cascade="all, delete-orphan", lazy=True)
    compras = db.relationship("Compra", backref="finance_month", cascade="all, delete-orphan", lazy=True)

    __table_args__ = (db.UniqueConstraint("year", "month", name="uq_year_month"),)

    def to_dict(self):
        entradas = {e.pessoa: e.valor for e in self.entradas}
        obs = {o.pessoa: o.texto for o in self.observacoes}
        devendo = {d.pessoa: d.valor for d in self.devendos}
        # Garantir que todas as pessoas existam
        for p in PESSOAS:
            entradas.setdefault(p, 0)
            obs.setdefault(p, "")
            devendo.setdefault(p, 0)
        return {
            "entradas": entradas,
            "obs": obs,
            "devendo": devendo,
            "itens": [d.to_dict() for d in self.despesas],
            "compras": [c.to_dict() for c in self.compras],
            "nextId": self.next_item_id,
        }


class Entrada(db.Model):
    """Contribuição de cada pessoa."""
    __tablename__ = "entradas"

    id = db.Column(db.Integer, primary_key=True)
    finance_month_id = db.Column(db.Integer, db.ForeignKey("finance_months.id"), nullable=False)
    pessoa = db.Column(db.String(50), nullable=False)
    valor = db.Column(db.Float, default=0)


class Despesa(db.Model):
    """Despesa/conta do mês."""
    __tablename__ = "despesas"

    id = db.Column(db.Integer, primary_key=True)
    finance_month_id = db.Column(db.Integer, db.ForeignKey("finance_months.id"), nullable=False)
    item_id = db.Column(db.Integer, nullable=False)
    icon = db.Column(db.String(10), default="📦")
    nome = db.Column(db.String(200), nullable=False)
    valor = db.Column(db.Float, default=0)
    status = db.Column(db.String(20), default="pendente")
    forma = db.Column(db.String(50), default="")
    data_pgto = db.Column(db.String(20), default="")
    comprovante = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.item_id,
            "icon": self.icon,
            "nome": self.nome,
            "valor": self.valor,
            "status": self.status,
            "forma": self.forma,
            "dataPgto": self.data_pgto,
            "comprovante": self.comprovante,
        }


class Observacao(db.Model):
    """Observação por pessoa."""
    __tablename__ = "observacoes"

    id = db.Column(db.Integer, primary_key=True)
    finance_month_id = db.Column(db.Integer, db.ForeignKey("finance_months.id"), nullable=False)
    pessoa = db.Column(db.String(50), nullable=False)
    texto = db.Column(db.Text, default="")


class Devendo(db.Model):
    """Quanto cada pessoa ainda deve."""
    __tablename__ = "devendos"

    id = db.Column(db.Integer, primary_key=True)
    finance_month_id = db.Column(db.Integer, db.ForeignKey("finance_months.id"), nullable=False)
    pessoa = db.Column(db.String(50), nullable=False)
    valor = db.Column(db.Float, default=0)
