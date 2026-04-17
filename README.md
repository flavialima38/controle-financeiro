# 🏠 Controle Financeiro de Casa

Sistema de controle financeiro doméstico para gerenciar contribuições, despesas e compras de mercado.

## Stack
- **Frontend:** Next.js 16 + React 19 + TypeScript
- **Backend:** Flask + SQLAlchemy
- **Banco:** SQLite (dev) / PostgreSQL (produção)

## Rodar Localmente

```bash
# Backend
cd Backend
pip install -r requirements.txt
python app.py

# Frontend (outro terminal)
cd frontend-next
npm install
cp .env.example .env.local
npm run dev
```

Acesse: http://localhost:3000

## Deploy
- **Frontend:** Vercel (configurar `NEXT_PUBLIC_API_URL`)
- **Backend:** Render (usa `render.yaml` Blueprint)
