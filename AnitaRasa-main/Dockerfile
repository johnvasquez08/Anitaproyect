# Usa la imagen de Python 3.8.10 como base
FROM python:3.9-slim-bullseye

USER root
RUN apt-get update && apt-get install -y \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Directorio de trabajo
WORKDIR /app

# Copiar primero requirements.txt para aprovechar la caché
COPY requirements.txt /app/

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto de los archivos del proyecto
COPY . /app

# Dar permisos de ejecución al entrypoint
RUN chmod +x /app/entrypoint.sh

# Render asigna el puerto dinámicamente
ENV PORT=$PORT

# Exponer el puerto (Render lo necesita aunque es dinámico)
EXPOSE $PORT

# Usar entrypoint.sh para levantar actions y el bot
CMD ["./entrypoint.sh"]