# Usar la imagen oficial de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos package.json y package-lock.json primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalar dependencias con `--legacy-peer-deps` para evitar conflictos
RUN npm install --legacy-peer-deps

# Copiar todos los archivos del proyecto
COPY . .

# Exponer el puerto en el que corre el backend
EXPOSE 3000

# Comando para ejecutar el servidor
CMD ["npm", "run", "start"]
