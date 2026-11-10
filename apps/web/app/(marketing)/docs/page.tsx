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
import { TBody, TD, TH, THead, TR, Table } from "@/components/ui/table";

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
          <h1 className="font-display mt-6 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
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
              HLS renditions and stream them through short-lived, signed URLs.
              Every request below is made to your{" "}
              <code className="rounded-sm border border-border/60 bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">
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
                <code className="rounded-sm border border-border/60 bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">
                  Authorization
                </code>{" "}
                header on every request.
              </li>
              <li>
                Upload a video and poll its status until processing completes.
              </li>
              <li>
                Request a signed playback session and load the returned HLS
                URL in any web or mobile player.
              </li>
            </ol>

            {/* Authentication */}
            <DocsHeading id="authentication">Authentication</DocsHeading>
            <DocsParagraph>
              StreamiX uses JSON Web Tokens. Register and log in to receive an{" "}
              <code className="rounded-sm border border-border/60 bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">access_token</code>{" "}
              and a{" "}
              <code className="rounded-sm border border-border/60 bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">refresh_token</code>. Send
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
              <code className="rounded-sm border border-border/60 bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">multipart/form-data</code>. The
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

            <div className="mt-4 overflow-hidden rounded-lg border border-border/80 bg-card">
              <Table>
                <THead>
                  <TR className="hover:bg-transparent">
                    <TH>Status</TH>
                    <TH>Meaning</TH>
                  </TR>
                </THead>
                <TBody>
                  <TR>
                    <TD className="font-mono text-foreground">queued</TD>
                    <TD className="text-muted-foreground">
                      Waiting for a worker to pick it up.
                    </TD>
                  </TR>
                  <TR>
                    <TD className="font-mono text-foreground">processing</TD>
                    <TD className="text-muted-foreground">
                      Actively transcoding into renditions.
                    </TD>
                  </TR>
                  <TR>
                    <TD className="font-mono text-foreground">completed</TD>
                    <TD className="text-muted-foreground">
                      All outputs generated and ready to stream.
                    </TD>
                  </TR>
                  <TR>
                    <TD className="font-mono text-foreground">failed</TD>
                    <TD className="text-muted-foreground">
                      Processing errored — check the error details.
                    </TD>
                  </TR>
                </TBody>
              </Table>
            </div>

            <DocsHeading id="checking-status">Check processing status</DocsHeading>
            <DocsCodeBlock
              code={`curl ${baseUrl}/videos/<video_id>/status \\
  -H "Authorization: Bearer <access_token>"`}
            />
            <DocsCodeBlock
              code={`{
  "success": true,
  "message": "video status retrieved successfully",
  "data": {
    "id": "9f1c2f3e-7a6b-4c0d-9e1f-0a1b2c3d4e5f",
    "status": "completed"
  }
}`}
              label="json"
            />

            {/* Streaming */}
            <DocsHeading id="streaming">Streaming</DocsHeading>
            <DocsParagraph>
              Once a video is complete, request a playback session with the
              access token. The response contains a signed HLS URL and a signed
              thumbnail URL. Both are relative to the API base URL and work
              without an{" "}
              <code className="rounded-sm border border-border/60 bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">
                Authorization
              </code>{" "}
              header.
            </DocsParagraph>

            <DocsCodeBlock
              code={`curl ${baseUrl}/videos/<video_id>/playback \\
  -H "Authorization: Bearer <access_token>"`}
            />

            <DocsCodeBlock
              code={`{
  "success": true,
  "message": "playback session created",
  "data": {
    "token": "<signed-playback-jwt>",
    "expires_at": "2026-08-03T10:15:00Z",
    "hls_url": "/playback/<signed-playback-jwt>/hls/master.m3u8",
    "thumbnail_url": "/playback/<signed-playback-jwt>/thumbnail"
  }
}`}
              label="json"
            />

            <DocsParagraph>
              Pass the HLS URL to any HLS-compatible player. On browsers
              without native HLS support, use a library such as{" "}
              <code className="rounded-sm border border-border/60 bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">hls.js</code>.
            </DocsParagraph>

            <DocsCodeBlock
              code={`const playback = await fetch(
  \`${baseUrl}/videos/\${videoId}/playback\`,
  { headers: { Authorization: \`Bearer \${accessToken}\` } },
).then((response) => response.json());

const hls = new Hls();
hls.loadSource(\`${baseUrl}\${playback.data.hls_url}\`);
hls.attachMedia(videoElement);`}
              label="javascript"
            />

            <DocsCallout>
              Playback tokens are scoped to one video and expire after one hour
              by default. The token stays in the URL path, so variant playlists
              and segments remain signed without query-string rewriting. An
              expired or invalid link returns 401 — request a new session to
              recover.
            </DocsCallout>

            {/* Errors */}
            <DocsHeading id="errors">Errors</DocsHeading>
            <DocsParagraph>
              The API returns conventional HTTP status codes. Errors include a
              structured body to help you respond gracefully.
            </DocsParagraph>

            <div className="mt-4 overflow-hidden rounded-lg border border-border/80 bg-card">
              <Table>
                <THead>
                  <TR className="hover:bg-transparent">
                    <TH>Code</TH>
                    <TH>Meaning</TH>
                  </TR>
                </THead>
                <TBody>
                  <TR>
                    <TD className="font-mono text-foreground">400</TD>
                    <TD className="text-muted-foreground">
                      Invalid request body or parameters.
                    </TD>
                  </TR>
                  <TR>
                    <TD className="font-mono text-foreground">401</TD>
                    <TD className="text-muted-foreground">
                      Missing or invalid access token.
                    </TD>
                  </TR>
                  <TR>
                    <TD className="font-mono text-foreground">404</TD>
                    <TD className="text-muted-foreground">
                      The requested resource does not exist.
                    </TD>
                  </TR>
                  <TR>
                    <TD className="font-mono text-foreground">429</TD>
                    <TD className="text-muted-foreground">
                      Too many requests — slow down or paginate.
                    </TD>
                  </TR>
                  <TR>
                    <TD className="font-mono text-foreground">500</TD>
                    <TD className="text-muted-foreground">
                      Something went wrong on our side.
                    </TD>
                  </TR>
                </TBody>
              </Table>
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