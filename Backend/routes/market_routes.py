"""Rotas da API para a lista de mercado."""

from flask import Blueprint, request, jsonify
from controllers.market_controller import MarketController

market_bp = Blueprint("market", __name__, url_prefix="/api/market")


@market_bp.route("/<int:year>/<int:month>", methods=["GET"])
def get_list(year, month):
    """GET /api/market/{year}/{month} — Retorna a lista de mercado."""
    data = MarketController.get_list(year, month)
    return jsonify(data)


@market_bp.route("/<int:year>/<int:month>", methods=["PUT"])
def save_list(year, month):
    """PUT /api/market/{year}/{month} — Salva a lista inteira."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Dados não fornecidos"}), 400
    ok, msg = MarketController.save_list(year, month, data)
    return jsonify({"message": msg})


@market_bp.route("/<int:year>/<int:month>/item", methods=["POST"])
def add_item(year, month):
    """POST /api/market/{year}/{month}/item — Adiciona item personalizado."""
    data = request.get_json()
    item, msg = MarketController.add_item(year, month, data)
    if item:
        return jsonify({"message": msg, "item": item}), 201
    return jsonify({"error": msg}), 400


@market_bp.route("/<int:year>/<int:month>/toggle/<int:item_id>", methods=["PATCH"])
def toggle_item(year, month, item_id):
    """PATCH /api/market/{year}/{month}/toggle/{id} — Marca/desmarca item."""
    item, msg = MarketController.toggle_item(year, month, item_id)
    if item:
        return jsonify({"message": msg, "item": item})
    return jsonify({"error": msg}), 404


@market_bp.route("/<int:year>/<int:month>/bought/<int:item_id>", methods=["PATCH"])
def update_bought(year, month, item_id):
    """PATCH /api/market/{year}/{month}/bought/{id} — Atualiza qty comprada."""
    data = request.get_json()
    qty = data.get("comprado", 0) if data else 0
    item, msg = MarketController.update_bought(year, month, item_id, qty)
    if item:
        return jsonify({"message": msg, "item": item})
    return jsonify({"error": msg}), 404


@market_bp.route("/<int:year>/<int:month>/reset", methods=["POST"])
def reset_list(year, month):
    """POST /api/market/{year}/{month}/reset — Desmarca todos."""
    state = MarketController.reset_list(year, month)
    return jsonify({"message": "Lista resetada", "data": state})
