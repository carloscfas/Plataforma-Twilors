# 📺 Plataforma Twilors

Software para streamers com foco em performance, personalização e experiência em tempo real. A plataforma oferece ferramentas modernas para gerenciamento de lives, integração com chat em tempo real e recursos interativos.

---

## 🚀 Como Iniciar (Modo Docker - Recomendado)

A maneira mais rápida e consistente de rodar o projeto é utilizando o Docker Compose. Isso garante que o Backend, Frontend e o Banco de Dados (Redis) estejam perfeitamente configurados.

### Pré-requisitos
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Passo a Passo

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/plataforma-twilors.git
   cd plataforma-twilors
   ```

2. **Configurar Variáveis de Ambiente:**
   Crie um arquivo `.env` dentro da pasta `backend/` seguindo o exemplo das configurações necessárias (como `SECRET_KEY`).

3. **Subir os containers:**
   ```bash
   docker compose up --build
   ```

4. **Acessar a Plataforma:**
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend (API):** [http://localhost:8000](http://localhost:8000)
   - **Admin Django:** [http://localhost:8000/admin](http://localhost:8000/admin)

### Comandos Úteis (Docker)

- **Para e remove volumes (Limpeza Total):** `docker compose down -v`
- **Reiniciar apenas o backend:** `docker compose restart backend`
- **Ver logs em tempo real:** `docker compose logs -f`
- **Criar um superusuário (Django):** 
  ```bash
  docker exec -it twilors_backend python manage.py createsuperuser
  ```

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Python 3.11, Django 4.2, Django Rest Framework (DRF)
- **Real-time:** Django Channels, WebSockets, Redis 6
- **Frontend:** React, Tailwind CSS, Axios
- **Database:** SQLite (Desenvolvimento)
- **Containerização:** Docker & Docker Compose

---

## ✨ Features Implementadas

- [x] **Autenticação JWT:** Login, Registro e persistência de sessão segura.
- [x] **Gestão de Streams:** CRUD completo de lives (título, descrição, thumbnails).
- [x] **Dashboard do Streamer:** Área exclusiva para criar e gerenciar transmissões.
- [x] **Player de Vídeo:** Integração robusta com YouTube Iframe API.
- [x] **Chat em Tempo Real:** Comunicação instantânea via WebSockets (resiliente e autenticada).
- [ ] **Histórico de Chat:** Carregamento de mensagens anteriores (Próxima tarefa).
- [ ] **Upload de Mídia:** Armazenamento em nuvem para thumbnails e vídeos (S3/Cloudinary).

---

## 🐍 Instalação Manual (Desenvolvedores)

Se preferir rodar sem Docker:

### Backend
1. Crie um ambiente virtual: `python -m venv venv`
2. Ative: `source venv/bin/activate` (Linux/Mac) ou `venv\Scripts\activate` (Windows)
3. Instale: `pip install -r backend/requirements.txt`
4. Redis: Certifique-se de ter um Redis rodando em `127.0.0.1:6379`.
5. Execute: `python backend/manage.py migrate` e `python backend/manage.py runserver`

### Frontend
1. Instale: `cd frontend && npm install`
2. Execute: `npm start`
