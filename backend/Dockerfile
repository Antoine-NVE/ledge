FROM node:24-slim AS build

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend .
COPY shared ../shared

RUN npm run build


FROM node:24-slim

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/shared ../shared

EXPOSE 3000

CMD ["npm", "run", "start"]
