"use client";

import { useEffect, useRef, useState } from "react";
import type Hls from "hls.js";
import { AlertCircle, Loader2 } from "lucide-react";

import { useVideoPlayback } from "@/hooks/use-video-playback";
import { environment } from "@/lib/environment";
import type { Video } from "@/types/video-types";

type VideoPlayerProps = {
  video: Video;
};

export function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackQuery = useVideoPlayback(video.id);
  const refetchPlayback = playbackQuery.refetch;
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const retriedPlayback = useRef(false);
  const resumeTime = useRef(0);

  const playback = playbackQuery.data;
  const sourceUrl = playback
    ? `${environment.apiBaseUrl}${playback.hls_url}`
    : null;
  const posterUrl = playback
    ? `${environment.apiBaseUrl}${playback.thumbnail_url}`
    : undefined;

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !sourceUrl) return;

    let disposed = false;
    let hls: Hls | null = null;

    const fail = (message: string) => {
      if (disposed) return;

      setIsReady(false);
      setError(message);
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
        });

        hls.on(HlsPlayer.Events.MANIFEST_PARSED, () => {
          if (disposed) return;

          if (resumeTime.current > 0) {
            element.currentTime = resumeTime.current;
            resumeTime.current = 0;
          }

          retriedPlayback.current = false;
          setError(null);
          setIsReady(true);
        });

        hls.on(HlsPlayer.Events.ERROR, (_event, data) => {
          if (!data.fatal) return;

          if (data.response?.code === 401) {
            if (retriedPlayback.current) {
              fail("This playback link expired. Refresh the page to continue.");
              return;
            }

            retriedPlayback.current = true;
            resumeTime.current = element.currentTime;
            setIsReady(false);

            void refetchPlayback().then((result) => {
              if (disposed) return;

              if (result.error || !result.data) {
                fail(
                  "This playback link expired. Refresh the page to continue.",
                );
              }
            });
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
  }, [refetchPlayback, sourceUrl]);

  const displayError =
    error ??
    (playbackQuery.isError
      ? "Could not create a playback session. Please try again."
      : null);

  return (
    <div className="relative aspect-video overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="h-full w-full"
        controls
        playsInline
        preload="metadata"
        poster={posterUrl}
        aria-label={`${video.original_filename} video player`}
      >
        <track kind="captions" />
      </video>

      {!isReady && !displayError && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted via-accent/60 to-muted text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
          <p className="text-xs font-medium" aria-live="polite">
            Preparing stream...
          </p>
        </div>
      )}

      {displayError && (
        <div
          role="alert"
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/85 px-6 text-center text-white"
        >
          <AlertCircle className="h-6 w-6 text-danger" aria-hidden="true" />
          <p className="text-sm font-medium">{displayError}</p>
          <p className="max-w-sm text-xs text-white/70">
            Playback links are time-limited and require a supported HLS
            browser.
          </p>
        </div>
      )}
    </div>
  );
}
