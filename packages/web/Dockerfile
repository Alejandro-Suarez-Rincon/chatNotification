FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Construye el proyecto
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]
