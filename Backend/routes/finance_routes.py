"""Rotas da API para operações financeiras."""

from flask import Blueprint, request, jsonify
from controllers.finance_controller import FinanceController

finance_bp = Blueprint("finance", __name__, url_prefix="/api/finance")


@finance_bp.route("/<int:year>/<int:month>", methods=["GET"])
def get_state(year, month):
    """GET /api/finance/{year}/{month} — Retorna o estado financeiro do mês."""
    state = FinanceController.get_state(year, month)
    return jsonify(state)


@finance_bp.route("/<int:year>/<int:month>", methods=["PUT"])
def save_state(year, month):
    """PUT /api/finance/{year}/{month} — Salva o estado financeiro do mês."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Dados não fornecidos"}), 400
    ok, msg = FinanceController.save_state(year, month, data)
    if ok:
        return jsonify({"message": msg})
    return jsonify({"error": msg}), 400


@finance_bp.route("/<int:year>/<int:month>/summary", methods=["GET"])
def get_summary(year, month):
    """GET /api/finance/{year}/{month}/summary — Resumo financeiro."""
    summary = FinanceController.get_summary(year, month)
    return jsonify(summary)


@finance_bp.route("/<int:year>/<int:month>/reset", methods=["POST"])
def reset_state(year, month):
    """POST /api/finance/{year}/{month}/reset — Limpa o mês."""
    state = FinanceController.reset_state(year, month)
    return jsonify({"message": "Mês limpo", "state": state})
