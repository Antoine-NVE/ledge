FROM node:24-slim AS build

ENV VITE_API_URL="PLACEHOLDER_API_URL"

WORKDIR /app/shared
COPY shared/package*.json ./
RUN npm ci
COPY shared ./

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build


FROM nginx:alpine

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY frontend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
