import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Configurações da aplicação."""
    SECRET_KEY = os.getenv("SECRET_KEY", "chave-secreta-dev-2026")
    DEBUG = os.getenv("FLASK_DEBUG", "True").lower() == "true"
    HOST = os.getenv("FLASK_HOST", "0.0.0.0")
    PORT = int(os.getenv("FLASK_PORT", 5000))

    # Banco de dados — usa PostgreSQL em produção, SQLite local para dev
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///" + os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "controle.db")
    )
    # Render usa "postgres://" mas SQLAlchemy precisa de "postgresql://"
    if SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_TRACK_MODIFICATIONS = False
