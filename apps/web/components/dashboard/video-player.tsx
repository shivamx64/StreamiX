"use client";

import { useEffect, useRef, useState } from "react";
import type Hls from "hls.js";
import { AlertCircle, Loader2 } from "lucide-react";

import { apiEndpoints } from "@/constants/api-endpoints";
import { useVideoThumbnail } from "@/hooks/use-video-thumbnail";
import { getAccessToken } from "@/lib/api-client";
import { environment } from "@/lib/environment";
import { videoProcessingService } from "@/services/video-processing-service";
import type { Video } from "@/types/video-types";

type VideoPlayerProps = {
  video: Video;
};

export function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const thumbnailUrl = useVideoThumbnail(video.id);

  const sourceUrl = `${environment.apiBaseUrl}${apiEndpoints.videos.hls(video.id)}`;

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    let disposed = false;
    let hls: Hls | null = null;
    let authRetried = false;

    const fail = (message: string) => {
      if (disposed) return;

      setIsReady(false);
      setError(message);
    };

    const recoverFromExpiredSession = () => {
      if (authRetried) {
        fail(
          "Your session expired while loading this video. Refresh the page and try again.",
        );
        return;
      }

      authRetried = true;

      void videoProcessingService
        .details(video.id)
        .then(() => {
          if (disposed || !hls) return;

          setError(null);
          setIsReady(false);
          hls.loadSource(sourceUrl);
          hls.startLoad();
        })
        .catch(() => {
          fail(
            "Your session expired while loading this video. Refresh the page and try again.",
          );
        });
    };

    void import("hls.js")
      .then(({ default: HlsPlayer }) => {
        if (disposed) return;

        if (!HlsPlayer.isSupported()) {
          fail("This browser does not support HLS playback.");
          return;
        }

        hls = new HlsPlayer({
          enableWorker: true,
          backBufferLength: 30,
          xhrSetup(xhr) {
            const token = getAccessToken();

            if (token) {
              xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            }
          },
        });

        hls.on(HlsPlayer.Events.MANIFEST_PARSED, () => {
          if (disposed) return;

          authRetried = false;
          setIsReady(true);
        });

        hls.on(HlsPlayer.Events.ERROR, (_event, data) => {
          if (!data.fatal) return;

          if (data.response?.code === 401) {
            recoverFromExpiredSession();
            return;
          }

          fail("This video could not be played. Please try again.");
        });

        hls.loadSource(sourceUrl);
        hls.attachMedia(element);
      })
      .catch(() => {
        fail("The video player could not be loaded.");
      });

    return () => {
      disposed = true;
      hls?.destroy();
    };
  }, [sourceUrl, video.id]);

  return (
    <div className="relative aspect-video overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="h-full w-full"
        controls
        playsInline
        preload="metadata"
        poster={thumbnailUrl ?? undefined}
        aria-label={`${video.original_filename} video player`}
      >
        <track kind="captions" />
      </video>

      {!isReady && !error && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted via-accent/60 to-muted text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
          <p className="text-xs font-medium" aria-live="polite">
            Preparing stream...
          </p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/85 px-6 text-center text-white"
        >
          <AlertCircle className="h-6 w-6 text-danger" aria-hidden="true" />
          <p className="text-sm font-medium">{error}</p>
          <p className="max-w-sm text-xs text-white/70">
            HLS playback requires a supported browser and an active session.
          </p>
        </div>
      )}
    </div>
  );
}
