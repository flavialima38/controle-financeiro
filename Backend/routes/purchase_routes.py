"""Rotas da API para compras registradas."""

from flask import Blueprint, request, jsonify
from controllers.purchase_controller import PurchaseController

purchase_bp = Blueprint("purchase", __name__, url_prefix="/api/purchases")


@purchase_bp.route("/<int:year>/<int:month>", methods=["GET"])
def get_purchases(year, month):
    """GET /api/purchases/{year}/{month} — Lista compras do mês."""
    purchases = PurchaseController.get_purchases(year, month)
    return jsonify(purchases)


@purchase_bp.route("/<int:year>/<int:month>", methods=["POST"])
def add_purchase(year, month):
    """POST /api/purchases/{year}/{month} — Registra nova compra."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Dados não fornecidos"}), 400
    purchase, msg = PurchaseController.add_purchase(year, month, data)
    if purchase:
        return jsonify({"message": msg, "purchase": purchase}), 201
    return jsonify({"error": msg}), 400


@purchase_bp.route("/<int:year>/<int:month>/<int:index>", methods=["DELETE"])
def remove_purchase(year, month, index):
    """DELETE /api/purchases/{year}/{month}/{index} — Remove compra."""
    removed, msg = PurchaseController.remove_purchase(year, month, index)
    if removed:
        return jsonify({"message": msg, "removed": removed})
    return jsonify({"error": msg}), 404
