# Stage 1: Build frontend
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY server/ ./server/
COPY --from=build /app/dist ./dist
RUN cd server && npm init -y && npm install kafkajs

ENV KAFKA_BROKERS=localhost:9092
ENV KAFKA_TOPIC=bridgewise.alerts.normalized
ENV KAFKA_GROUP_ID=lovable-signals-app
ENV PORT=3000

EXPOSE 3000
CMD ["node", "server/index.js"]
