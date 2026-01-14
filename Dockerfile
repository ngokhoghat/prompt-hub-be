FROM node:lts-alpine

WORKDIR /usr/src/app

# Add current src and install file
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:prod" ]