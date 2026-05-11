# Plataforma-Twilors
Software para streamers com foco em performance, personalização e experiência em tempo real. A plataforma oferece ferramentas modernas para gerenciamento de lives, overlays dinâmicos, integração com chat, alertas e recursos interativos para creators e comunidades.

# Plataforma Twilors

Uma plataforma de streaming construída com Django (backend) e React (frontend).

## Pré-requisitos
- Python 3.10+
- Node.js 18+
- pip e npm

## Instalação

### Backend
1. Instale as dependências Python:
   ```
   pip install django djangorestframework djangorestframework-simplejwt psycopg2-binary
   ```
   Ou use virtualenv:
   ```
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   pip install -r backend/requirements.txt
   ```

2. Execute migrações:
   ```
   cd backend
   python manage.py migrate
   ```

3. Inicie o servidor:
   ```
   python manage.py runserver
   ```

### Frontend
1. Instale as dependências:
   ```
   cd frontend
   npm install
   ```

2. Inicie o servidor:
   ```
   npm start
   ```

## Features
- Autenticação de usuários (JWT)
- API REST para streams
- Interface responsiva com Tailwind CSS
- Futuro: Chat em tempo real, uploads de streams
