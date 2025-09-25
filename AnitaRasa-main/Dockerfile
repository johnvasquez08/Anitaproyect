# Usa la imagen oficial de Rasa como base
FROM rasa/rasa:3.7.0-full

# Establece el directorio de trabajo
WORKDIR /app

# Copia todos los archivos de tu proyecto al contenedor
COPY . /app

# Instala solo las dependencias específicas para tus acciones
# Esto es lo único que necesitas instalar manualmente
RUN pip install --no-cache-dir -r requirements.txt

# Copia el script de inicio y dale permisos de ejecución
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Define el punto de entrada para ejecutar tu script
ENTRYPOINT ["entrypoint.sh"]