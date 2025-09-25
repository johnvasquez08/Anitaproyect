# Usar una imagen base de Python
FROM python:3.8.10

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema necesarias para Rasa
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar todos los archivos del proyecto
COPY . /app

# Actualizar pip
RUN pip install --upgrade pip

# Instalar las dependencias de Python (necesitarás crear un requirements.txt combinado)
RUN pip install -r requirements.txt

# Instalar Rasa si no está en requirements.txt
RUN pip install rasa

# Exponer los puertos que usaremos
EXPOSE 8000 5005

# Crear un script para ejecutar ambos servicios
RUN chmod +x start.sh

# Comando por defecto
CMD ["./start.sh"]