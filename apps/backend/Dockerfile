FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run prisma:generate

RUN npm run build

CMD ["npm", "run", "start:prod"]
