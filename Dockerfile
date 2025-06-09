FROM node:20-slim
RUN apt-get update && apt-get install curl -y
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./server.js .
COPY ./public ./public
CMD node server.js
