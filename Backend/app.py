"""
Controle Financeiro de Casa — Backend API
==========================================
Servidor Flask com PostgreSQL.

Local:  python app.py (usa SQLite)
Deploy: gunicorn app:app (usa PostgreSQL via DATABASE_URL)
"""
import os
from flask import Flask, request as flask_request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from config import Config
from database import db


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ── Limite de tamanho de request (2 MB) ──
    app.config["MAX_CONTENT_LENGTH"] = 2 * 1024 * 1024

    # Inicializa o banco de dados
    os.makedirs(os.path.join(os.path.dirname(__file__), "data"), exist_ok=True)
    db.init_app(app)

    # ── CORS — lê origens permitidas da env CORS_ORIGINS ──
    cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    CORS(app, resources={r"/api/*": {"origins": [o.strip() for o in cors_origins]}})

    # ── Rate Limiting — proteção contra abuso ──
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=["60 per minute"],           # Limite geral: 60 req/min por IP
        storage_uri="memory://",                     # Em memória (ok para instância única)
    )

    # Limites mais rígidos para rotas de escrita (POST/PUT/DELETE)
    @app.before_request
    def _rate_limit_writes():
        """Aplica limite extra em operações de escrita."""
        pass  # O limiter já aplica o default; limites por rota são definidos abaixo

    # ── Headers de segurança ──
    @app.after_request
    def _security_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        # Não expor info do servidor
        response.headers.pop("Server", None)
        return response

    # Importa e registra as rotas
    from routes.finance_routes import finance_bp
    from routes.market_routes import market_bp
    from routes.purchase_routes import purchase_bp

    app.register_blueprint(finance_bp)
    app.register_blueprint(market_bp)
    app.register_blueprint(purchase_bp)

    # Aplica limites mais rígidos para rotas de escrita
    limiter.limit("20 per minute")(finance_bp)
    limiter.limit("30 per minute")(market_bp)
    limiter.limit("15 per minute")(purchase_bp)

    @app.route("/")
    def index():
        return {
            "app": "Controle Financeiro de Casa",
            "version": "2.1.0",
            "status": "online",
            "database": "connected",
        }

    # Handler para erro de rate limit
    @app.errorhandler(429)
    def _rate_limit_exceeded(e):
        return jsonify({"error": "Muitas requisições. Aguarde um momento."}), 429

    # Handler para request muito grande
    @app.errorhandler(413)
    def _request_too_large(e):
        return jsonify({"error": "Requisição muito grande (máx 2MB)."}), 413

    # Cria as tabelas na primeira execução
    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    print(f"\n  Controle Financeiro -- Backend v2.1")
    print(f"   http://{Config.HOST}:{Config.PORT}")
    print(f"   DB: {Config.SQLALCHEMY_DATABASE_URI[:50]}...\n")
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)

