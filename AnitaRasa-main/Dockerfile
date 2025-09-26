# Usa la imagen de Python 3.8.10 como base
FROM python:3.9-slim-bullseye

# Establece el directorio de trabajo
WORKDIR /app

# Copia todos los archivos de tu proyecto al contenedor
COPY . /app

USER root
# Instala las dependencias del sistema necesarias
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

# Instala Rasa y las dependencias de tus acciones
# ¡Importante! Aquí instalamos el 'requirements.txt'
RUN pip install rasa==3.6.21
RUN pip install -r requirements.txt

# Copia el script de inicio y dale permisos de ejecución
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Define el punto de entrada para ejecutar tu script
ENTRYPOINT ["entrypoint.sh"]