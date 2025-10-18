FROM node:lts-slim AS deps
# ================================
# stage 1: dependencies
# ================================

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:lts-slim AS builder
# ================================
# stage 2: build
# ================================

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY tsconfig*.json ./
COPY env.d.ts ./
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate
RUN npm run build

FROM node:lts-slim AS runner
# ================================
# stage 3: production
# ================================

# install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN mkdir -p /app/tmp
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/src/generated ./src/generated
COPY package*.json ./
COPY openapi.json ./
COPY env.d.ts ./
COPY .env.schema ./
COPY prisma ./prisma
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/docs', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

ENTRYPOINT ["./docker-entrypoint.sh"]

CMD ["node", "build/main.js"]
