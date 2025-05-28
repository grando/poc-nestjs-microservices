FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production=false

CMD ["npm", "run", "start:dev"]

EXPOSE 3000
