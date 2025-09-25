# Usar Python 3.9 que es compatible con Rasa 3.6.21
FROM python:3.9-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    make \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements.txt primero para aprovechar el cache de Docker
COPY requirements.txt .

# Actualizar pip e instalar las dependencias de Python
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiar el resto de los archivos del proyecto
COPY . .

# Crear configuración de supervisor para manejar múltiples procesos
RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Crear script de inicio
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Exponer los puertos que usaremos
EXPOSE 8000 5005

# Variables de entorno
ENV PYTHONUNBUFFERED=1

# Usar supervisor para ejecutar múltiples servicios
CMD ["/start.sh"]