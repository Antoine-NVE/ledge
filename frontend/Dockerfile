FROM node:24-slim AS build

WORKDIR /app

COPY shared/package*.json ./shared/
RUN cd shared && npm ci

COPY shared ./shared
RUN cd shared && npm run build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci

COPY frontend ./

ENV VITE_API_URL="PLACEHOLDER_API_URL"

RUN npm run build


FROM nginx:alpine

COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY frontend/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
