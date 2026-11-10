# syntax=docker/dockerfile:1

FROM golang:1.25-alpine AS build-base

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .

FROM build-base AS build-binaries

RUN GOMAXPROCS=2 GOGC=50 CGO_ENABLED=0 GOOS=linux \
    go build -p 2 -trimpath -ldflags="-s -w" -o /out/ \
    ./apps/api/cmd/api ./apps/api/worker/cmd/worker

FROM alpine:3.22 AS runtime-base

RUN apk add --no-cache ca-certificates tzdata \
    && addgroup -S app \
    && adduser -S -G app app \
    && mkdir -p /data/storage \
    && chown -R app:app /data/storage

WORKDIR /app

ENV LOCAL_STORAGE_ROOT=/data/storage

ENTRYPOINT ["/usr/local/bin/streamix"]

FROM runtime-base AS api

COPY --from=build-binaries /out/api /usr/local/bin/streamix

USER app

EXPOSE 8080

STOPSIGNAL SIGTERM

FROM runtime-base AS worker

RUN apk add --no-cache ffmpeg

COPY --from=build-binaries /out/worker /usr/local/bin/streamix

USER app

STOPSIGNAL SIGTERM
