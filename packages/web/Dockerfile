FROM node:20-alpine

WORKDIR /app

# Copia solo package.json y package-lock.json primero
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
