FROM node:6.11.3-alpine
ARG NPM_TOKEN
ARG ENVIRONMENT=local
RUN mkdir -p /usr/src && apk add --no-cache ca-certificates
WORKDIR /usr/src
COPY src /usr/src
RUN npm i \
  && ./node_modules/.bin/webpack --config ./webpack.dll.js --bail --hide-modules \
  && ./node_modules/.bin/webpack --config ./webpack.config.js --bail --hide-modules \
  && npm prune --production
EXPOSE 80
CMD node .
