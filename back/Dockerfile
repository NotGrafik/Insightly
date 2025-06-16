# Backend - Node.js
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --prod

COPY . .

EXPOSE 3001

CMD ["node", "index.js"]
