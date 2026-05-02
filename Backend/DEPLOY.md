# Render.com — Deploy Config
# https://render.com/docs/deploy-flask

# Para deploy no Render:
# 1. Crie uma conta em render.com
# 2. Conecte seu repositório GitHub
# 3. Vá em "Blueprints" e aponte para o render.yaml — ele cria tudo automaticamente.
# 4. Após criar, configure MANUALMENTE no painel do Render as variáveis:
#
#    SUPABASE_JWT_SECRET = (Supabase → Project Settings → API → JWT Secret)
#    CORS_ORIGINS        = https://seu-frontend.vercel.app
#
# 5. O DATABASE_URL é preenchido automaticamente pelo render.yaml via fromDatabase.
#
# Variáveis automáticas (geradas pelo render.yaml):
#    SECRET_KEY    → gerado automaticamente
#    DATABASE_URL  → vem do banco PostgreSQL conectado
#    FLASK_DEBUG   → False
#    PYTHON_VERSION → 3.12.0
