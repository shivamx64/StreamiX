import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { DocsCallout } from "@/components/docs/docs-callout";
import { DocsCodeBlock } from "@/components/docs/docs-code-block";
import { DocsEndpoint } from "@/components/docs/docs-endpoint";
import { DocsHeading } from "@/components/docs/docs-heading";
import { DocsParagraph } from "@/components/docs/docs-paragraph";
import {
  DocsSidebar,
  type DocsSection,
} from "@/components/docs/docs-sidebar";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "StreamiX API documentation — upload, transcode, and stream video in minutes.",
};

const sections: DocsSection[] = [
  { id: "getting-started", label: "Getting started" },
  { id: "authentication", label: "Authentication" },
  { id: "uploading-videos", label: "Uploading videos" },
  { id: "video-processing", label: "Processing" },
  { id: "streaming", label: "Streaming" },
  { id: "errors", label: "Errors" },
];

const baseUrl = "https://api.streamix.dev";

export default function DocumentationPage() {
  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10 md:py-20 lg:px-12">
        <header className="max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Documentation
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Everything you need to upload, transcode, and stream video with
            the StreamiX API. Start with the quick start below, then dive into
            the endpoint reference.
          </p>
        </header>

        <div className="mt-16 grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-20">
          <aside>
            <div className="sticky top-28 hidden lg:block">
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                On this page
              </p>
              <DocsSidebar sections={sections} />
            </div>

            <nav
              aria-label="Documentation navigation"
              className="flex gap-2 overflow-x-auto pb-2 lg:hidden"
            >
              {sections.map((section) => (
                <Link
                  key={section.id}
                  href={`#${section.id}`}
                  className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                >
                  {section.label}
                </Link>
              ))}
            </nav>
          </aside>

          <article className="min-w-0">
            {/* Getting started */}
            <DocsHeading id="getting-started">Getting started</DocsHeading>
            <DocsParagraph>
              StreamiX is a distributed video transcoding and streaming
              platform. Upload a video once, and we generate adaptive bitrate
              HLS renditions and serve them from the edge — no infrastructure
              to manage. Every request below is made to your{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-accent-foreground">
                NEXT_PUBLIC_API_BASE_URL
              </code>
              .
            </DocsParagraph>

            <DocsCallout>
              Use the base URL{" "}
              <code className="font-mono text-[0.9em]">{baseUrl}</code> to
              follow the examples here.
            </DocsCallout>

            <ol className="mt-6 list-decimal space-y-3 pl-5 text-base leading-7 text-muted-foreground marker:text-primary">
              <li>
                Register an account or log in to obtain a JWT access token.
              </li>
              <li>
                Include the token in the{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">
                  Authorization
                </code>{" "}
                header on every request.
              </li>
              <li>
                Upload a video and poll its status until processing completes.
              </li>
              <li>
                Play the generated HLS stream from any web or mobile player.
              </li>
            </ol>

            {/* Authentication */}
            <DocsHeading id="authentication">Authentication</DocsHeading>
            <DocsParagraph>
              StreamiX uses JSON Web Tokens. Register and log in to receive an{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">access_token</code>{" "}
              and a{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">refresh_token</code>. Send
              the access token as a bearer token:
            </DocsParagraph>

            <DocsCodeBlock
              code={'Authorization: Bearer <access_token>'}
              label="Header"
            />

            <DocsHeading id="register">Create an account</DocsHeading>
            <DocsCodeBlock
              code={`curl -X POST ${baseUrl}/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"you@example.com","password":"your-password"}'`}
            />

            <DocsHeading id="login">Log in</DocsHeading>
            <DocsCodeBlock
              code={`curl -X POST ${baseUrl}/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"you@example.com","password":"your-password"}'`}
            />

            <DocsParagraph>
              Access tokens eventually expire. Use the refresh token to obtain
              a new pair without forcing the user to log in again.
            </DocsParagraph>
            <DocsEndpoint
              method="POST"
              path="/auth/refresh"
              description="Exchange a refresh token for a fresh access token."
            />

            {/* Uploading videos */}
            <DocsHeading id="uploading-videos">Uploading videos</DocsHeading>
            <DocsParagraph>
              Upload a video as{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">multipart/form-data</code>. The
              file is streamed directly to object storage, which avoids proxy
              bottlenecks and arbitrary size limits.
            </DocsParagraph>

            <DocsCodeBlock
              code={`curl -X POST ${baseUrl}/videos \\
  -H "Authorization: Bearer <access_token>" \\
  -F "file=@movie.mp4"`}
            />

            <DocsEndpoint
              method="GET"
              path="/videos"
              description="List the current user's videos."
            />
            <DocsEndpoint
              method="GET"
              path="/videos/{id}"
              description="Get details for a single video."
            />
            <DocsEndpoint
              method="DELETE"
              path="/videos/{id}"
              description="Permanently delete a video and its outputs."
            />

            {/* Video processing */}
            <DocsHeading id="video-processing">Processing</DocsHeading>
            <DocsParagraph>
              Once uploaded, a video moves through a distributed FFmpeg
              pipeline. Its status transitions as it is picked up and
              transcoded into multiple HLS renditions.
            </DocsParagraph>

            <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-mono text-foreground">
                      queued
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Waiting for a worker to pick it up.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-foreground">
                      processing
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Actively transcoding into renditions.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-foreground">
                      completed
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      All outputs generated and ready to stream.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-foreground">
                      failed
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Processing errored — check the error details.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <DocsHeading id="checking-status">Check processing status</DocsHeading>
            <DocsCodeBlock
              code={`curl ${baseUrl}/videos/<video_id>/status \\
  -H "Authorization: Bearer <access_token>"`}
            />
            <DocsCodeBlock
              code={`{
  "id": "9f1c2f3e-7a6b-4c0d-9e1f-0a1b2c3d4e5f",
  "name": "movie.mp4",
  "status": "completed",
  "renditions": ["480p", "720p", "1080p"],
  "playlistUrl": "https://stream.streamix.dev/9f1c2f3e-7a6b-4c0d-9e1f-0a1b2c3d4e5f/playlist.m3u8",
  "createdAt": "2026-08-03T09:15:00Z"
}`}
              label="json"
            />

            {/* Streaming */}
            <DocsHeading id="streaming">Streaming</DocsHeading>
            <DocsParagraph>
              Once a video is complete, point any HLS-compatible player at its
              playlist URL. On browsers without native HLS support, use a
              library such as{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">hls.js</code>.
            </DocsParagraph>

            <DocsCodeBlock
              code={`<video id="video" controls></video>
<script src="https://cdn.jsdelivr.net/npm/hls.js@1"></script>
<script>
  if (Hls.isSupported()) {
    const video = document.getElementById("video");
    const hls = new Hls();
    hls.loadSource("https://stream.streamix.dev/<video_id>/playlist.m3u8");
    hls.attachMedia(video);
  }
</script>`}
              label="html"
            />

            <DocsCallout>
              Playback URLs are edge-cached and adaptive — bandwidth shifts
              to lower or higher renditions automatically during playback.
            </DocsCallout>

            {/* Errors */}
            <DocsHeading id="errors">Errors</DocsHeading>
            <DocsParagraph>
              The API returns conventional HTTP status codes. Errors include a
              structured body to help you respond gracefully.
            </DocsParagraph>

            <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 font-semibold">Code</th>
                    <th className="px-4 py-3 font-semibold">Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-mono text-foreground">400</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Invalid request body or parameters.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-foreground">401</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Missing or invalid access token.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-foreground">404</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      The requested resource does not exist.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-foreground">429</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Too many requests — slow down or paginate.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-foreground">500</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Something went wrong on our side.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <DocsCodeBlock
              code={`{
  "error": {
    "code": "validation_failed",
    "message": "Invalid request body"
  }
}`}
              label="json"
            />

            <DocsCallout variant="warning">
              Keep your access tokens out of version control. Expose them only
              through your server or a secure client secret.
            </DocsCallout>
          </article>
        </div>
      </div>
    </div>
  );
}