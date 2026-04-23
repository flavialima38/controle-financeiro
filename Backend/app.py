"""
Controle Financeiro de Casa — Backend API
==========================================
Servidor Flask com PostgreSQL.

Local:  python app.py (usa SQLite)
Deploy: gunicorn app:app (usa PostgreSQL via DATABASE_URL)
"""
import os
from flask import Flask
from flask_cors import CORS
from config import Config
from database import db


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializa o banco de dados
    os.makedirs(os.path.join(os.path.dirname(__file__), "data"), exist_ok=True)
    db.init_app(app)

    # Habilita CORS — lê origens permitidas da env CORS_ORIGINS
    # Em produção, defina CORS_ORIGINS com o domínio do frontend (ex: https://meusite.vercel.app)
    # Múltiplas origens podem ser separadas por vírgula
    cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    CORS(app, resources={r"/api/*": {"origins": [o.strip() for o in cors_origins]}})

    # Importa e registra as rotas
    from routes.finance_routes import finance_bp
    from routes.market_routes import market_bp
    from routes.purchase_routes import purchase_bp

    app.register_blueprint(finance_bp)
    app.register_blueprint(market_bp)
    app.register_blueprint(purchase_bp)

    @app.route("/")
    def index():
        return {
            "app": "Controle Financeiro de Casa",
            "version": "2.0.0",
            "status": "online",
            "database": "connected",
        }

    # Cria as tabelas na primeira execução
    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    print(f"\n  Controle Financeiro -- Backend v2.0")
    print(f"   http://{Config.HOST}:{Config.PORT}")
    print(f"   DB: {Config.SQLALCHEMY_DATABASE_URI[:50]}...\n")
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
