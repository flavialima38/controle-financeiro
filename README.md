# 🏠 Controle Financeiro de Casa

Sistema de controle financeiro doméstico para gerenciar contribuições, despesas e compras de mercado.

## Stack
- **Frontend:** Next.js + React + TypeScript
- **Backend:** Flask + SQLAlchemy
- **Banco:** SQLite (dev) / PostgreSQL (produção via Render)
- **Auth:** Supabase Auth (email + senha)

## Configuração do Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **Authentication → Users** e cadastre os 5 moradores
3. Copie as credenciais em **Project Settings → API**

## Rodar Localmente

```bash
# Backend
cd Backend
pip install -r requirements.txt
# Preencha SUPABASE_JWT_SECRET no .env
python app.py

# Frontend (outro terminal)
cd frontend-next
npm install
cp .env.example .env.local
# Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local
npm run dev
```

Acesse: http://localhost:3000 → você será redirecionado para `/login`

## Variáveis de Ambiente

| Arquivo | Variável | Onde obter |
|---|---|---|
| `frontend-next/.env.local` | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `frontend-next/.env.local` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `Backend/.env` | `SUPABASE_JWT_SECRET` | Supabase → Project Settings → API → JWT Secret |

## Deploy
- **Frontend:** Vercel (configurar as 3 variáveis acima + `NEXT_PUBLIC_API_URL`)
- **Backend:** Render (usa `render.yaml` Blueprint — configurar `SUPABASE_JWT_SECRET` e `CORS_ORIGINS` manualmente no painel)
