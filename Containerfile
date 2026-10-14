# Build stage
FROM node:26-alpine AS build

RUN npm install -g corepack && corepack enable

WORKDIR /usr/src/app
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Server stage
FROM node:26-alpine
RUN npm install -g corepack && corepack enable && apk add --no-cache curl su-exec
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/public ./public
EXPOSE 3000
CMD ["node", "./dist/server.js"]
