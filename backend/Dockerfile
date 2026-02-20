FROM node:24-slim AS build

WORKDIR /app/backend

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:24-slim

WORKDIR /app/backend

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start"]
