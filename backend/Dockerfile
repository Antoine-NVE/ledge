FROM node:24-slim AS build

WORKDIR /app/shared
COPY shared/package*.json ./
RUN npm ci
COPY shared ./

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend ./
RUN npm run build


FROM node:24-slim

ENV NODE_ENV=production

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/backend/dist ./dist

USER node
EXPOSE 3000
CMD ["node", "."]
