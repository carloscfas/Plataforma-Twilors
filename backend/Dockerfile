# Imagem base
FROM python:3.11-slim

# Evita que o Python gere arquivos .pyc e permite logs em tempo real
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Diretório de trabalho
WORKDIR /app

# Instala dependências do sistema necessárias para algumas libs Python
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copia e instala as dependências do Python
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código
COPY . /app/

# Expondo a porta do Django
EXPOSE 8000

# Comando para rodar o servidor (usaremos runserver para desenvolvimento com hot-reload)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
