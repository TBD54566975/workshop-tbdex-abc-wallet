FROM node:20.5-buster AS build

WORKDIR /wallet

COPY src ./src
COPY .eslintrc.cjs index.html package.json package-lock.json .env.production tailwind.config.js tsconfig.json tsconfig.node.json vite.config.ts ./

RUN npm install
RUN npm run build

FROM nginx:1.25.1-alpine

ARG NGINX_PORT=8080
ENV NGINX_PORT=${NGINX_PORT}
EXPOSE ${NGINX_PORT}

COPY --from=build  /wallet/dist /usr/share/nginx/html
COPY dockerfiles/conf/nginx.conf /etc/nginx/nginx.conf
COPY dockerfiles/conf/server.conf.template /etc/nginx/templates/server.conf.template

CMD ["nginx", "-g", "daemon off;"]