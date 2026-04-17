"""Controller para operações financeiras com banco de dados."""
import json
from database import db
from models.finance_model import FinanceMonth, Entrada, Despesa, Observacao, Devendo, PESSOAS


class FinanceController:

    @staticmethod
    def _get_or_create(year, month):
        """Busca ou cria o registro do mês."""
        fm = FinanceMonth.query.filter_by(year=year, month=month).first()
        if not fm:
            fm = FinanceMonth(year=year, month=month, next_item_id=10)
            db.session.add(fm)
            # Criar entradas padrão
            for p in PESSOAS:
                db.session.add(Entrada(finance_month=fm, pessoa=p, valor=0))
                db.session.add(Observacao(finance_month=fm, pessoa=p, texto=""))
                db.session.add(Devendo(finance_month=fm, pessoa=p, valor=0))
            # Despesas padrão
            defaults = [
                (1, "💧", "Água", 0),
                (2, "⚡", "Luz", 0),
                (3, "🔥", "Gás", 0),
            ]
            for item_id, icon, nome, valor in defaults:
                db.session.add(Despesa(finance_month=fm, item_id=item_id, icon=icon, nome=nome, valor=valor))
            db.session.commit()
        return fm

    @staticmethod
    def get_state(year, month):
        fm = FinanceController._get_or_create(year, month)
        return fm.to_dict()

    @staticmethod
    def save_state(year, month, data):
        fm = FinanceController._get_or_create(year, month)

        # Atualizar entradas
        for e in fm.entradas:
            if e.pessoa in data.get("entradas", {}):
                e.valor = float(data["entradas"][e.pessoa] or 0)

        # Atualizar observações
        for o in fm.observacoes:
            if o.pessoa in data.get("obs", {}):
                o.texto = str(data["obs"][o.pessoa] or "")

        # Atualizar devendo
        for d in fm.devendos:
            if d.pessoa in data.get("devendo", {}):
                d.valor = float(data["devendo"][d.pessoa] or 0)

        # Atualizar despesas — limpa e recria
        Despesa.query.filter_by(finance_month_id=fm.id).delete()
        for item in data.get("itens", []):
            db.session.add(Despesa(
                finance_month=fm,
                item_id=item.get("id", 0),
                icon=item.get("icon", "📦"),
                nome=item.get("nome", ""),
                valor=float(item.get("valor", 0)),
                status=item.get("status", "pendente"),
                forma=item.get("forma", ""),
                data_pgto=item.get("dataPgto", ""),
                comprovante=item.get("comprovante"),
            ))

        # Atualizar compras — limpa e recria
        from models.purchase_model import Compra
        Compra.query.filter_by(finance_month_id=fm.id).delete()
        for c in data.get("compras", []):
            db.session.add(Compra(
                finance_month=fm,
                loja=c.get("loja", ""),
                data=c.get("data", ""),
                valor=float(c.get("valor", 0)),
                img_b64=c.get("imgB64"),
                ai_items=json.dumps(c.get("aiItems", [])),
            ))

        fm.next_item_id = data.get("nextId", fm.next_item_id)
        db.session.commit()
        return True, "Dados salvos com sucesso"

    @staticmethod
    def get_summary(year, month):
        """Retorna o resumo financeiro do mês."""
        fm = FinanceController._get_or_create(year, month)
        state = fm.to_dict()
        entradas = state.get("entradas", {})
        itens = state.get("itens", [])
        compras = state.get("compras", [])

        fundo_total = sum(float(v) for v in entradas.values())
        total_contas = sum(float(it.get("valor", 0)) for it in itens)
        total_mercado = sum(float(c.get("valor", 0)) for c in compras)
        total_saidas = total_contas + total_mercado

        return {
            "fundoTotal": fundo_total,
            "totalContas": total_contas,
            "totalMercado": total_mercado,
            "totalSaidas": total_saidas,
            "saldoFundo": fundo_total - total_saidas,
            "partePorPessoa": total_contas / len(PESSOAS) if total_contas > 0 else 0,
        }

    @staticmethod
    def reset_state(year, month):
        fm = FinanceMonth.query.filter_by(year=year, month=month).first()
        if fm:
            db.session.delete(fm)
            db.session.commit()
        return FinanceController.get_state(year, month)
