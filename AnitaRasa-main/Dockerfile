# Usa la imagen de Python 3.8 como base
FROM python:3.8.10-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY . /app

# Actualiza apt y instala las dependencias necesarias
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    python3-dev \
    libffi-dev \
    libssl-dev \
    build-essential \
    tzdata

# Instala pip y actualiza
RUN pip install --upgrade pip

# Instala Rasa
RUN pip install rasa==3.6.21

# Instala las dependencias de Python desde el archivo requirements.txt
RUN pip install -r requirements.txt
