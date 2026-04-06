# SvelteKit Frontend - Production multi-stage build
# Stage 1: Build
FROM node:25-alpine AS builder

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile; \
    else \
      pnpm install; \
    fi

COPY . .

ARG PUBLIC_POCKETBASE_URL
ENV PUBLIC_POCKETBASE_URL=${PUBLIC_POCKETBASE_URL}

RUN pnpm build

# Stage 2: Production
FROM node:25-alpine AS production

# Securite : utilisateur non-root
RUN addgroup -S sveltekit && adduser -S sveltekit -G sveltekit

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

USER sveltekit

EXPOSE 3000

ENV NODE_ENV=production
CMD ["node", "build"]
