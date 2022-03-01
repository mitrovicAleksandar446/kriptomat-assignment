####### DEV ENV #######
FROM node:17-alpine as dev
RUN apk --update add postgresql-client

WORKDIR /app

COPY app/package*.json ./

RUN npm install

COPY ./app .

RUN npm run build

####### PROD ENV #######
FROM node:17-alpine as prod
RUN apk --update add postgresql-client

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY app/package*.json ./

RUN npm ci --production

COPY ./app .

COPY --from=dev /app/dist ./dist

CMD ["node", "dist/src/main.js"]
