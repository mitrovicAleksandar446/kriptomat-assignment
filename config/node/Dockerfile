####### DEV ENV #######
FROM node:17-alpine as dev
RUN apk --update add postgresql-client

WORKDIR /app

ENV NODE_ENV=dev

COPY app/package*.json ./

RUN npm install

COPY . .

RUN npm run build

####### PROD ENV #######
FROM node:17-alpine as prod
RUN apk --update add postgresql-client

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm ci --production

COPY . .

COPY --from=dev /app/dist ./dist

CMD ["node", "dist/main"]
