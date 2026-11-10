import { useQuery } from "@tanstack/react-query";

import { videoProcessingService } from "@/services/video-processing-service";

export function useVideoPlayback(id: string) {
  return useQuery({
    queryKey: ["videos", id, "playback"],
    queryFn: () => videoProcessingService.playback(id),
    enabled: Boolean(id),
  });
}
