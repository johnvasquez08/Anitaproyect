# Usar una imagen base de Node.js
FROM node:20.14.0

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios primero (package.json y package-lock.json)
COPY package*.json .


# Instalar las dependencias correctamente
RUN npm install

# Copiar el resto de los archivos
COPY . .

EXPOSE 5173

# Asegurarse de que el contenedor use el comando correcto para iniciar el servidor
CMD ["npm", "run", "dev"]
