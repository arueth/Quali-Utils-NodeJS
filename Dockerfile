###############################################################################
# BUILD
###############################################################################
FROM node:8.1.3-alpine as builder

RUN apk update \
&& apk add git \
&& rm -rf /var/cache/apk/*

RUN npm install -g @angular/cli

RUN mkdir -p /usr/src/app /usr/src/angular

WORKDIR /usr/src/app

COPY app/package.json ./

RUN npm install \
&& mkdir -p /usr/src/app/www/public/static \
&& mv /usr/src/app/node_modules/amcharts3/amcharts /usr/src/app/www/public/static/amcharts \
&& rm -r /usr/src/app/node_modules/amcharts3

COPY app/ ./

WORKDIR /usr/src/angular

COPY angular/package.json ./

RUN npm install

COPY angular/ ./

RUN ng build --env=prod





###############################################################################
# FINAL
###############################################################################
FROM node:8.1.3-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

EXPOSE 8080

CMD ["npm", "start"]
