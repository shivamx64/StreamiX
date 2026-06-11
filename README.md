# Streamix

Streamix is a cloud-native media processing platform built to explore the engineering behind large-scale video infrastructure.

The project allows users to upload videos, process them through a distributed transcoding pipeline, generate adaptive streaming outputs, and monitor processing jobs in real time.

Rather than being a simple video upload application, Streamix focuses on the systems that power modern media platforms: asynchronous job processing, object storage, distributed workers, realtime updates, authentication, observability, and cloud-native infrastructure.

## Goals

* Learn distributed systems through a real-world product.
* Build production-grade backend services in Go.
* Design scalable APIs and worker architectures.
* Implement secure authentication and session management.
* Process videos using FFmpeg.
* Store and serve media through object storage.
* Stream video using HLS.
* Build a modern dashboard using Next.js and TypeScript.
* Containerize services with Docker.
* Deploy and operate workloads using Kubernetes.

## Core Features

* User authentication and session management
* Direct-to-storage video uploads
* Distributed transcoding workers
* Adaptive bitrate streaming (HLS)
* Thumbnail generation
* Realtime processing updates
* Video library and management dashboard
* Metrics and observability
* CI/CD automation

## Architecture

```text
Client
   │
   ▼
Frontend (Next.js)
   │
   ▼
API Service (Go)
   │
   ├── PostgreSQL
   ├── Redis Streams
   └── Object Storage (S3)
                │
                ▼
        Worker Services
                │
                ▼
            FFmpeg
```

## Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Zustand
* TanStack Query

### Backend

* Go
* Gin
* PostgreSQL
* Redis Streams
* JWT Authentication

### Infrastructure

* Docker
* Kubernetes
* GitHub Actions
* AWS S3

## Project Status

Currently under active development.

The initial focus is establishing the project architecture, authentication system, media pipeline, and distributed processing infrastructure.

## License

MIT
