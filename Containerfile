# Build stage
FROM node:22-alpine AS build

RUN apk add --no-cache curl ca-certificates nodejs npm \
    && npm install -g pnpm@10.3.0 \
    && pnpm --version

WORKDIR /usr/src/app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm build

# Server stage
FROM node:22-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/public ./public
EXPOSE 3000
CMD ["node", "./dist/server.js"]
