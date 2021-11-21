FROM node:lts-alpine as builder

WORKDIR /app

COPY package*.json .
RUN yarn install

COPY . .
RUN yarn build

FROM node:lts-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN yarn install --production=true

COPY docker/docker-entrypoint.sh /
RUN chmod 0755 /docker-entrypoint.sh

ENTRYPOINT [ "/docker-entrypoint.sh" ]