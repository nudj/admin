FROM node:6.11.0
ARG NPM_TOKEN
RUN mkdir -p /usr/src
WORKDIR /usr/src
COPY src /usr/src
RUN npm i -g torus-cli \
  && npm i \
  && ./node_modules/.bin/webpack --config ./webpack.dll.js --bail --hide-modules \
  && ./node_modules/.bin/webpack --config ./webpack.config.js --bail --hide-modules \
  && npm prune --production
EXPOSE 80
CMD torus run -o nudj -p admin -e $ENVIRONMENT -- node .
