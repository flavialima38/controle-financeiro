"""
Middleware de autenticação — valida o JWT do Supabase.
Suporta ECC (P-256 / ES256) — algoritmo atual do Supabase —
e HS256 como fallback para projetos legados.
"""
import os
import jwt
from functools import wraps
from flask import request, jsonify

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")

# Cache da chave pública para não buscar a cada request
_jwks_client = None


def _get_jwks_client():
    """Retorna o cliente JWKS cacheado (busca a chave pública do Supabase)."""
    global _jwks_client
    if _jwks_client is None and SUPABASE_URL:
        from jwt import PyJWKClient
        _jwks_client = PyJWKClient(
            f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json",
            cache_keys=True,
        )
    return _jwks_client


def _verify_token(token: str) -> dict:
    """
    Verifica o JWT tentando ES256 (atual) e HS256 (legado) em sequência.
    Lança jwt.InvalidTokenError se nenhum método funcionar.
    """
    # 1️⃣ Tentativa principal: ES256 via JWKS (chave ECC atual)
    if SUPABASE_URL:
        try:
            client = _get_jwks_client()
            if client:
                signing_key = client.get_signing_key_from_jwt(token)
                return jwt.decode(
                    token,
                    signing_key.key,
                    algorithms=["ES256", "RS256"],
                    audience="authenticated",
                )
        except jwt.ExpiredSignatureError:
            raise  # Re-lança expirado — não tenta HS256
        except Exception:
            pass  # Tenta HS256 como fallback

    # 2️⃣ Fallback: HS256 com JWT Secret legado
    if SUPABASE_JWT_SECRET:
        return jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )

    raise jwt.InvalidTokenError("Nenhuma credencial Supabase configurada.")


def require_auth(f):
    """
    Decorador que exige um token JWT válido do Supabase.
    Uso: @require_auth antes de qualquer rota protegida.
    Se SUPABASE_URL e SUPABASE_JWT_SECRET estiverem vazios → permite tudo (dev local).
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        # Modo desenvolvimento sem credenciais — libera tudo
        if not SUPABASE_URL and not SUPABASE_JWT_SECRET:
            return f(*args, **kwargs)

        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token não fornecido."}), 401

        token = auth_header.split(" ", 1)[1]

        try:
            payload = _verify_token(token)
            request.user_id = payload.get("sub")
            request.user_email = payload.get("email")
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expirado. Faça login novamente."}), 401
        except jwt.InvalidTokenError as e:
            return jsonify({"error": f"Token inválido: {e}"}), 401
        except Exception:
            return jsonify({"error": "Erro interno ao verificar autenticação."}), 401

        return f(*args, **kwargs)

    return decorated
