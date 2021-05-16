# Dockerfile, Image, Container
FROM node:alpine

WORKDIR /jump-backend

COPY package.json .

RUN npm install

COPY . .

CMD [ "npm", "start" ]