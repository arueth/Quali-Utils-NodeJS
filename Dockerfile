FROM node:7.10.0-alpine

EXPOSE 80

RUN apk update \
&& apk upgrade \
&& apk add git \
&& rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

COPY app/package.json ./

RUN npm install \
&& mkdir -p /usr/src/app/www/public/static \
&& mv /usr/src/app/node_modules/amcharts3/amcharts /usr/src/app/www/public/static/amcharts \
&& mv /usr/src/app/node_modules/bootstrap/dist /usr/src/app/www/public/static/bootstrap \
&& rm -r /usr/src/app/node_modules/amcharts3 /usr/src/app/node_modules/bootstrap

COPY app/ ./

CMD ["npm", "start"]
