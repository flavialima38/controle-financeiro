"""Controller para lista de mercado com banco de dados."""
from database import db
from models.market_model import MarketItem

# Lista padrão resumida (categorias)
MKT_DEFAULT = [
    ("🍚 Alimentos Básicos", [("Arroz","8-10 pct"),("Feijão","8-10 pct"),("Macarrão","12-15 pct"),("Açúcar","4 kg"),("Óleo","4 un"),("Molho de tomate","8-10 un")]),
    ("🍗 Proteínas", [("Frango","10-12 kg"),("Carne","4 kg"),("Ovos","8-10 dúzias"),("Linguiça","2 kg")]),
    ("🥛 Laticínios", [("Leite","40-50 litros"),("Queijo","1,5 kg"),("Iogurte","20-30 un"),("Margarina","4 un")]),
    ("🧼 Limpeza", [("Detergente","12-16 un"),("Sabão em pó","5-6 kg"),("Papel higiênico","36 rolos")]),
]


class MarketController:

    @staticmethod
    def _ensure_items(year, month):
        """Garante que existam itens para o mês."""
        count = MarketItem.query.filter_by(year=year, month=month).count()
        if count == 0:
            item_id = 1
            for cat_name, items in MKT_DEFAULT:
                for nome, qty in items:
                    db.session.add(MarketItem(
                        year=year, month=month, item_id=item_id,
                        cat=cat_name, nome=nome, qty=qty,
                        done=False, custom=False, comprado=0,
                    ))
                    item_id += 1
            db.session.commit()

    @staticmethod
    def get_list(year, month):
        MarketController._ensure_items(year, month)
        items = MarketItem.query.filter_by(year=year, month=month).all()
        max_id = max((it.item_id for it in items), default=0)
        return {
            "list": [it.to_dict() for it in items],
            "nextId": max_id + 1,
        }

    @staticmethod
    def save_list(year, month, data):
        """Salva a lista inteira (limpa e recria)."""
        MarketItem.query.filter_by(year=year, month=month).delete()
        for it in data.get("list", []):
            db.session.add(MarketItem(
                year=year, month=month,
                item_id=it.get("id", 0),
                cat=it.get("cat", ""),
                nome=it.get("nome", ""),
                qty=it.get("qty", "—"),
                done=it.get("done", False),
                custom=it.get("custom", False),
                comprado=it.get("comprado", 0),
            ))
        db.session.commit()
        return True, "Lista salva"

    @staticmethod
    def toggle_item(year, month, item_id):
        it = MarketItem.query.filter_by(year=year, month=month, item_id=item_id).first()
        if it:
            it.done = not it.done
            db.session.commit()
            return it.to_dict(), "Atualizado"
        return None, "Item não encontrado"

    @staticmethod
    def add_item(year, month, data):
        """Adiciona um item personalizado à lista do mês."""
        nome = (data.get("nome") or "").strip()
        if not nome:
            return None, "Nome do item é obrigatório"
        MarketController._ensure_items(year, month)
        items = MarketItem.query.filter_by(year=year, month=month).all()
        max_id = max((it.item_id for it in items), default=0)
        new_item = MarketItem(
            year=year, month=month, item_id=max_id + 1,
            cat=data.get("cat", "✏️ Adicionados por você"),
            nome=nome,
            qty=data.get("qty", "—"),
            done=False, custom=True, comprado=0,
        )
        db.session.add(new_item)
        db.session.commit()
        return new_item.to_dict(), "Item adicionado"

    @staticmethod
    def update_bought(year, month, item_id, qty):
        """Atualiza a quantidade comprada de um item."""
        it = MarketItem.query.filter_by(year=year, month=month, item_id=item_id).first()
        if not it:
            return None, "Item não encontrado"
        it.comprado = max(0, int(qty))
        # Auto-marca como done se atingiu a quantidade necessária
        import re
        match = re.search(r'(\d+)', it.qty)
        needed = int(match.group(1)) if match else 0
        if needed > 0 and it.comprado >= needed:
            it.done = True
        db.session.commit()
        return it.to_dict(), "Quantidade atualizada"

    @staticmethod
    def reset_list(year, month):
        items = MarketItem.query.filter_by(year=year, month=month).all()
        for it in items:
            it.done = False
            it.comprado = 0
        db.session.commit()
        return MarketController.get_list(year, month)
