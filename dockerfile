FROM node:10-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 5000

ENV NODE_ENV=NODE_ENV \
  DB_HOST=HOST \
  DB_PORT=PORT \
  DB_USERNAME=DB_USERNAME \
  DB_PASSWORD=DB_PASSWORD \
  DB_DATABASE=DB_DATABASE \
  REDIS_PORT=REDIS_PORT \
  TOKEN_SECRET=TOKEN_SECRET
  

CMD [ "npm", "run", "start" ]
