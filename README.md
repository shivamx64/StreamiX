# StreamiX

StreamiX is a distributed media processing platform built to explore the engineering behind large-scale video infrastructure. Users upload videos, a background worker transcodes them into adaptive streaming formats (HLS), and a dashboard tracks every job through its lifecycle.

The project is a learning-oriented implementation of the systems that power modern media platforms: asynchronous job processing, object storage, distributed workers, realtime updates, and secure authentication. It is written as production-grade Go services with a Next.js frontend, and every layer is kept small enough to read end to end.

## Features

### Current

**Authentication**
- Email/password registration with bcrypt password hashing
- JWT access and refresh tokens (HS256)
- Protected API routes via Bearer token middleware
- Ownership checks on all user-scoped resources

**Video upload**
- Multipart uploads up to 2 GB (MP4, WebM, MOV)
- Direct-to-storage uploads through a pluggable `Storage` interface
- Immediate database record creation with rollback of orphaned objects on failure

**Transcoding pipeline**
- Job queue backed by Redis Streams with consumer groups
- At-least-once delivery: failed jobs stay pending and are reclaimed by workers for retry (`XAUTOCLAIM`), with dead-lettering after the retry window
- FFprobe metadata extraction (duration, resolution)
- HLS transcoding into multiple renditions (1080p/720p/480p, falling back to 240p for low-resolution sources)
- Master playlist generation with proper bandwidth metadata
- Thumbnail extraction
- Outputs written to storage alongside the source object

**Processing lifecycle**
- Videos transition through `uploaded → queued → processing → completed | failed`
- Status endpoint for polling, with 5-second polling built into the frontend

**Web application**
- Landing page with product sections
- Login and signup with client-side validation (react-hook-form + zod)
- Dashboard with video library, upload flow with progress bar, and per-video detail pages
- Protected route groups that redirect unauthenticated users

**Engineering foundations**
- Structured logging (`log/slog`), request IDs, recovery middleware, CORS
- Standard response envelopes for success and error payloads
- Unit tests for storage, video service, queue, and transcoder packages

### Not yet implemented

The following are tracked in the roadmap and intentionally absent from this version:

- An endpoint to serve the generated HLS output (playback in the dashboard)
- Refresh token rotation (`/auth/refresh` is referenced by the web client but not implemented server-side)
- Object storage drivers beyond the local filesystem (S3-compatible)
- Containerization and deployment tooling

## Architecture

```text
Client
   │
   ▼
Frontend (Next.js)          ── polls status every 5s
   │
   ▼
API Service (Go/Gin)
   ├── PostgreSQL            users, videos
   ├── Redis Streams         video-transcode queue
   └── Object Storage        source files, HLS segments, thumbnails
            │
            ▼
        Worker Service       consumes jobs, runs FFmpeg
            │
            ▼
            FFmpeg           HLS renditions + thumbnail
```

### Frontend

A Next.js App Router application with three route groups:

- `(marketing)` — the public landing page and docs page
- `(auth)` — login and signup
- `(authentication)/(dashboard)` — the protected dashboard: overview, upload, video library, and video detail pages

Server state is managed with TanStack Query; authentication state lives in a React context backed by localStorage and an axios request interceptor that attaches the Bearer token. Forms use react-hook-form with zod validation, uploads use react-dropzone, and video status is polled every five seconds.

### Backend

The API is a layered Gin application. `bootstrap` wires configuration, database, storage, and the queue into a dependency container, and `routes` registers handlers. Handlers parse requests and map errors to the standard envelope; services hold business logic (ownership checks, status transitions); repositories are thin GORM wrappers. Interfaces are defined at the point of use (service → repository, service → storage, service → queue), which keeps the core testable with mocks.

### Authentication

Registration hashes passwords with bcrypt and stores the hash. Login verifies the password and issues two signed JWTs: a short-lived access token (15 minutes by default) carried as `Authorization: Bearer <token>`, and a longer-lived refresh token. The `Auth` middleware validates the access token and injects the user ID into the request context; every video route derives the acting user from the token, never from the request body.

### Storage

The `internal/storage` package defines a minimal interface (`Save`, `Open`, `Delete`) and ships a local-filesystem implementation. Object keys are namespaced per user and video:

```text
storage/{user_id}/{video_id}/{original_filename}   source file
storage/{user_id}/{video_id}/hls/master.m3u8       master playlist
storage/{user_id}/{video_id}/hls/{rendition}/...   variant playlists + segments
storage/{user_id}/{video_id}/thumbnail.jpg         poster frame
```

The interface is the seam through which an S3-compatible driver can be added without touching services.

### Upload pipeline

1. The client uploads the file as `multipart/form-data` to `POST /api/v1/videos`.
2. The API stores the object, creates the video record, and publishes a job (`{video_id, user_id, storage_key, filename}`) to the `video-transcode` Redis Stream.
3. The worker consumes the job, marks the video `processing`, downloads the source, probes it, and transcodes into HLS renditions plus a thumbnail.
4. Outputs are written back to storage under the `hls/` prefix.
5. The video is marked `completed`; failures are marked `failed`, while transient errors leave the message pending for the queue to reclaim and retry.

The API and worker are independent processes that only share the database, storage, and queue — the worker can be scaled horizontally, with consumer groups distributing jobs across instances.

## Technology Stack

### Frontend

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn-style primitives built on radix slots |
| Server state | TanStack Query |
| Forms | react-hook-form + zod |
| Uploads | react-dropzone |
| Auth state | React context + axios interceptors |
| Animation | framer-motion |
| Notifications | sonner |
| Icons | lucide-react |

### Backend

| Area | Choice |
|---|---|
| Language | Go 1.25 |
| HTTP | Gin |
| Database access | GORM (PostgreSQL driver) |
| Job queue | Redis Streams (`go-redis`) |
| Auth | `golang-jwt/jwt/v5`, `golang.org/x/crypto/bcrypt` |
| Video tooling | system FFmpeg / FFprobe binaries |
| Logging | `log/slog` |
| Config | environment variables via `godotenv` |

### Tooling

- pnpm for the frontend workspace
- SQL migrations maintained under `migrations/` for reference; the API also auto-migrates the schema on startup with GORM `AutoMigrate`
- Go unit tests for the core packages (`go test ./...`)

## Repository Structure

```text
apps/
  api/
    cmd/api/                  API binary entrypoint
    internal/
      bootstrap/              wires config, db, storage, queue, routes
      container/              dependency container (DI)
      routes/                 HTTP route registration
    worker/
      cmd/worker/             worker binary entrypoint (consume loop)
      internal/processor/     per-job pipeline: download, transcode, upload, status
internal/
  auth/                       JWT token manager and claims
  config/                     env-driven configuration with defaults
  database/                   PostgreSQL connection + schema migration
  http/                       standard response/error envelope helpers
  logger/                     slog setup
  middleware/                 request ID, recovery, logging, CORS, auth
  queue/                      Redis Streams producer/consumer with retry
  storage/                    storage abstraction + local filesystem driver
  transcoder/                 ffprobe/FFmpeg wrapper: HLS renditions, thumbnails
  users/                      user model, repository, service, handler
  videos/                     video model, repository, service, handler, job types
migrations/                   SQL schema migrations (reference)
apps/web/                     Next.js application
  app/                        route groups: marketing, auth, dashboard
  components/                 ui, dashboard, auth, landing-page primitives
  hooks/                      TanStack Query hooks (auth, profile, videos)
  lib/                        api client, environment config, utilities
  providers/                  auth, query-client, theme providers
  services/                   typed API service wrappers
  types/                      shared API types
  validations/                zod schemas
```

Key packages are deliberately scoped: `internal/queue` knows nothing about videos, `internal/transcoder` knows nothing about storage, and `internal/videos` depends only on narrow interfaces it defines itself. This keeps the worker reusable and the packages independently testable.

## Local Development

### Prerequisites

- Go 1.25+
- PostgreSQL (running locally)
- Redis 7+ (or a compatible server such as Valkey)
- FFmpeg and FFprobe on `PATH` (required by the worker)
- Node.js 20+ and pnpm

### Setup

```bash
git clone https://github.com/shivamx64/streamix.git
cd streamix

# Backend dependencies
go mod download

# Frontend dependencies
cd apps/web
pnpm install
cd ../..
```

### Environment

Copy the required values into `.env` at the repository root (see the environment variables table below). The API, worker, and any direct Go invocations load this file automatically. At minimum, set the database connection and `JWT_SECRET`:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=streamix
JWT_SECRET=change-me
```

### Database

Create the database:

```bash
createdb streamix
```

The API auto-migrates the schema on startup via GORM. For a fresh install with the SQL migrations instead:

```bash
psql -d streamix -f migrations/001_create_users_table.sql
psql -d streamix -f migrations/002_create_videos_table.sql
```

### Running the backend

```bash
go run ./apps/api/cmd/api
```

The API listens on `http://localhost:8080` and answers `GET /health`.

### Running the worker

```bash
go run ./apps/api/worker/cmd/worker
```

Start Redis first (`redis-server`), or the worker exits on startup. With both processes running, uploads flow through the full pipeline automatically.

### Running the frontend

```bash
cd apps/web
pnpm dev
```

The app is served at `http://localhost:3000` and expects the API at `http://localhost:8080/api/v1` (override with `NEXT_PUBLIC_API_BASE_URL`).

### Tests

```bash
go test ./...
```

Transcoder tests generate real media with FFmpeg and are skipped when the binaries are unavailable.

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `APP_NAME` | no | `streamix-api` | Application name used in logs |
| `APP_ENV` | no | `development` | Runtime environment; switches log format to JSON in production |
| `APP_VERSION` | no | `dev` | Version reported by the health endpoint |
| `HTTP_HOST` | no | `0.0.0.0` | API bind address |
| `HTTP_PORT` | no | `8080` | API bind port |
| `DB_HOST` | yes | — | PostgreSQL host |
| `DB_PORT` | yes | — | PostgreSQL port |
| `DB_USER` | yes | — | PostgreSQL user |
| `DB_PASSWORD` | yes | — | PostgreSQL password |
| `DB_NAME` | yes | — | PostgreSQL database name |
| `DB_SSLMODE` | no | `disable` | PostgreSQL SSL mode |
| `JWT_SECRET` | yes | — | Secret used to sign and verify JWTs |
| `JWT_ACCESS_TOKEN_TTL` | no | `15m` | Access token lifetime (Go duration) |
| `JWT_REFRESH_TOKEN_TTL` | no | `168h` | Refresh token lifetime (Go duration) |
| `STORAGE_DRIVER` | no | `local` | Storage backend (only `local` is implemented) |
| `LOCAL_STORAGE_ROOT` | no | `storage` | Root directory for local storage |
| `QUEUE_DRIVER` | no | `redis` | Job queue backend (only `redis` is implemented) |
| `REDIS_ADDR` | no | `localhost:6379` | Redis address |
| `REDIS_PASSWORD` | no | — | Redis password |
| `REDIS_DB` | no | `0` | Redis logical database |
| `QUEUE_STREAM` | no | `video-transcode` | Redis Stream used for transcode jobs |
| `QUEUE_GROUP` | no | `transcode-workers` | Consumer group name |
| `QUEUE_CLAIM_IDLE` | no | `3s` | How long a failed job waits before a worker reclaims it |
| `NEXT_PUBLIC_API_BASE_URL` | no | `http://localhost:8080/api/v1` | API base URL used by the web client |

## API

All endpoints except `/health`, `/auth/register`, and `/auth/login` require `Authorization: Bearer <access_token>`.

Every response uses one of two envelopes:

```json
{ "success": true, "message": "...", "data": { } }
```

```json
{ "success": false, "error": { "code": "NOT_FOUND", "message": "..." } }
```

### Health

`GET /health` — public.

```json
{
  "success": true,
  "message": "Service is healthy",
  "data": { "status": "healthy", "environment": "development", "version": "dev" }
}
```

### Auth

#### Register

`POST /api/v1/auth/register` — public.

Body:

```json
{ "email": "user@example.com", "password": "password123" }
```

`password` must be at least 8 characters. Responds `201` with the created user (no tokens — register then login):

```json
{
  "success": true,
  "message": "user registered successfully",
  "data": { "id": "…", "email": "user@example.com", "created_at": "…" }
}
```

Errors: `409` if the email is already registered, `400` on invalid payload.

#### Login

`POST /api/v1/auth/login` — public.

Body:

```json
{ "email": "user@example.com", "password": "password123" }
```

Responds `200` with tokens:

```json
{
  "success": true,
  "message": "login successful",
  "data": {
    "access_token": "…",
    "refresh_token": "…",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

Errors: `401` on invalid credentials.

#### Current user

`GET /api/v1/auth/me` — authenticated.

Responds `200` with the authenticated user:

```json
{
  "success": true,
  "message": "current user retrieved successfully",
  "data": { "id": "…", "email": "user@example.com", "created_at": "…" }
}
```

### Videos

All video routes are authenticated and enforce ownership: a video can only be read, polled, or deleted by the user who uploaded it. Access to another user's video returns `403`.

#### Upload video

`POST /api/v1/videos` — authenticated, `multipart/form-data`.

Field `file` (video file, up to 2 GB). Responds `201` with the video ID and its initial status:

```json
{
  "success": true,
  "message": "video uploaded successfully",
  "data": { "id": "…", "status": "queued" }
}
```

#### List videos

`GET /api/v1/videos` — authenticated.

Responds `200` with the user's videos, newest first:

```json
{
  "success": true,
  "message": "videos retrieved successfully",
  "data": [
    {
      "id": "…",
      "user_id": "…",
      "original_filename": "clip.mp4",
      "storage_key": "…/clip.mp4",
      "mime_type": "video/mp4",
      "size": 123456,
      "status": "completed",
      "created_at": "…",
      "updated_at": "…"
    }
  ]
}
```

#### Get video

`GET /api/v1/videos/:id` — authenticated, owner only.

Responds `200` with a single video object (same shape as list items). Errors: `404` unknown id, `403` another user's video.

#### Get video status

`GET /api/v1/videos/:id/status` — authenticated, owner only.

Responds `200` with the processing status, intended for polling:

```json
{
  "success": true,
  "message": "video status retrieved successfully",
  "data": { "id": "…", "status": "processing" }
}
```

Possible statuses: `uploaded`, `queued`, `processing`, `completed`, `failed`.

#### Delete video

`DELETE /api/v1/videos/:id` — authenticated, owner only.

Removes the video record and its stored source object. Responds `204 No Content`. Errors: `404` unknown id, `403` another user's video.

## Screenshots

Screenshots are not yet captured. The following placeholders will be filled as the UI stabilizes:

| Page | Description | Screenshot |
|---|---|---|
| Landing page | Marketing page with hero, workflow, features, pricing, FAQ, and CTA sections | `docs/screenshots/landing.png` |
| Login | Email/password sign-in with validation | `docs/screenshots/login.png` |
| Dashboard | Overview with video library and processing badges | `docs/screenshots/dashboard.png` |
| Upload flow | Drag-and-drop upload with progress indicator | `docs/screenshots/upload.png` |

## Development Philosophy

**Small packages, narrow interfaces.** Backend code lives in `internal/*` packages that each own one concern. Dependencies flow in one direction — handlers call services, services call repositories — and services depend on interfaces they define, never on concrete implementations. This is what makes the video service testable with in-memory mocks and the worker independent of the API process.

**Infrastructure as seams.** Storage, queue, and transcoding are all behind interfaces with real, runnable local implementations. Adding an S3 driver or swapping Redis for another broker should never touch business logic.

**Failures are explicit.** Uploads roll back orphaned objects, jobs that fail transiently are retried by the queue, and permanent failures dead-letter to a `failed` status instead of looping forever. Error responses are a single standard envelope so clients and the frontend handle errors uniformly.

**Conventions.**
- Go code is formatted with `gofmt` and vetted with `go vet`; every new feature ships with tests (`go test ./...`)
- Frontend code passes `pnpm lint` (ESLint) and TypeScript's strict mode
- SQL migrations live in `migrations/`; schema changes must update both the SQL file and the GORM model
- Handlers stay thin: request parsing and error mapping only, no business logic
- Status transitions and ownership checks are enforced in the service layer, never left to handlers

## Roadmap

The following milestones follow naturally from the current implementation:

1. **HLS serving** — an endpoint that serves the generated `hls/` output (playlists, segments, thumbnails) with auth, plus an in-dashboard video player. This makes the transcoding pipeline end-to-end usable.
2. **S3-compatible storage driver** — a second implementation of the `Storage` interface so uploads and HLS outputs can live in object storage.
3. **Containerized development** — Docker Compose for PostgreSQL, Redis, API, worker, and web, with the FFmpeg binaries baked into the worker image.
4. **Realtime status** — replace 5-second polling with WebSocket or SSE updates pushed from the worker.
5. **Deployment** — Kubernetes manifests and CI/CD for the API, worker, and web application.
6. **Observability** — request metrics, worker job metrics (duration, failure rate), and structured log aggregation.

## Contributing

Contributions are welcome. The project favors small, focused changes over large rewrites.

### Workflow

1. Fork the repository and create a branch from `main`:
   - `feat/…` for new features
   - `fix/…` for bug fixes
   - `docs/…` for documentation
2. Keep changes scoped to the branch's purpose.
3. Ensure the full test suite and linting pass:

   ```bash
   go build ./...
   go vet ./...
   go test ./...
   cd apps/web && pnpm lint
   ```

4. Open a pull request against `main` describing what changed and why, referencing any related issue.

### Commits

Commit messages follow the repository's existing style — short imperative summaries, optionally scoped:

```text
feat(videos): implement transcoding worker pipeline
fix(queue): reclaim pending messages for retry
enhance dashboard
```

### Formatting

- Go: `gofmt` and `go vet` clean; no unused exports; interfaces at the point of use
- Frontend: TypeScript strict mode; ESLint clean; no unused imports
- SQL: new migrations get a sequential `NNN_` prefix

## License

MIT
