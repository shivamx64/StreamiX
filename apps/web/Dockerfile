# syntax=docker/dockerfile:1

FROM node:24-alpine AS base

RUN apk add --no-cache libc6-compat \
    && npm install --global pnpm@11.21.0

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS builder

ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_TELEMETRY_DISABLED=1

COPY . .

RUN pnpm build

FROM node:24-alpine AS runner

RUN apk add --no-cache libc6-compat \
    && addgroup -S nextjs \
    && adduser -S -G nextjs nextjs

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

STOPSIGNAL SIGTERM

CMD ["node", "server.js"]
