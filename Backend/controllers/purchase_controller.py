"""Controller para compras registradas."""
import json
from database import db
from models.purchase_model import Compra
from controllers.finance_controller import FinanceController


class PurchaseController:

    @staticmethod
    def get_purchases(year, month):
        fm = FinanceController._get_or_create(year, month)
        compras = Compra.query.filter_by(finance_month_id=fm.id).all()
        return [c.to_dict() for c in compras]

    @staticmethod
    def add_purchase(year, month, data):
        loja = data.get("loja", "").strip()
        valor = float(data.get("valor", 0))
        if not loja:
            return None, "Nome do mercado é obrigatório"
        if valor <= 0:
            return None, "Valor deve ser positivo"

        fm = FinanceController._get_or_create(year, month)
        compra = Compra(
            finance_month=fm,
            loja=loja,
            data=data.get("data", ""),
            valor=valor,
            img_b64=data.get("imgB64"),
            ai_items=json.dumps(data.get("aiItems", [])),
        )
        db.session.add(compra)
        db.session.commit()
        return compra.to_dict(), "Compra registrada"

    @staticmethod
    def remove_purchase(year, month, index):
        fm = FinanceController._get_or_create(year, month)
        compras = Compra.query.filter_by(finance_month_id=fm.id).all()
        if 0 <= index < len(compras):
            removed = compras[index].to_dict()
            db.session.delete(compras[index])
            db.session.commit()
            return removed, "Compra removida"
        return None, "Índice inválido"
