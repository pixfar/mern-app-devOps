# Stage 1: install full deps (cached separately from source changes)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: build
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: production-only deps (no devDependencies)
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Stage 4: final runtime image
FROM node:20-alpine

# bash: entrypoint script | gettext: envsubst | shadow+util-linux: su/runuser
RUN apk add --no-cache bash gettext shadow util-linux

WORKDIR /home/pixfar/app
RUN addgroup -S pixfar && adduser -S pixfar -G pixfar

COPY --from=build --chown=pixfar:pixfar /app/dist ./dist
COPY --from=prod-deps --chown=pixfar:pixfar /app/node_modules ./node_modules
COPY --chown=pixfar:pixfar package.json ./
COPY --chown=pixfar:pixfar docker ./docker
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"]
