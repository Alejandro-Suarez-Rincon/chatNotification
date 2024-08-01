FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Asegúrate de que el script dev esté definido en package.json
# Si utilizas una versión de Node.js que necesita bibliotecas adicionales, agrégalas aquí

COPY . .

# Aquí puede que no necesites construir el proyecto si solo ejecutas Express en desarrollo
# RUN npm run build 

EXPOSE 4000

CMD ["npm", "run", "dev"]  # Ajusta según el comando necesario para tu aplicación Express
