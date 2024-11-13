FROM node:20-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm install && echo "npm install completed"

COPY . /app/

EXPOSE 4000

CMD ["npm", "start"]
