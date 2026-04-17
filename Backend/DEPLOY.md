# Render.com — Deploy Config
# https://render.com/docs/deploy-flask

# Para deploy no Render:
# 1. Crie uma conta em render.com
# 2. Conecte seu repositório GitHub
# 3. Crie um "Web Service" apontando para a pasta Backend/
# 4. Configure:
#    - Build Command: pip install -r requirements.txt
#    - Start Command: gunicorn app:app
#    - Environment: Python 3
# 5. Crie um PostgreSQL database no Render 
# 6. Copie a "Internal Database URL" e cole como variável de ambiente:
#    DATABASE_URL = postgres://...
# 7. Adicione também:
#    SECRET_KEY = (uma chave aleatória forte)
#    FLASK_DEBUG = False
