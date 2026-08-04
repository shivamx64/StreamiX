import { useQuery, useMutation } from "@tanstack/react-query";

import { videoProcessingService } from "@/services/video-processing-service";

export function useVideos() {
  return useQuery({
    queryKey: ["videos"],
    queryFn: () => videoProcessingService.list(),
  });
}

export function useVideoDetails(id: string) {
  return useQuery({
    queryKey: ["videos", id],
    queryFn: () => videoProcessingService.details(id),
    enabled: Boolean(id),
  });
}

export function useVideoStatus(id: string) {
  return useQuery({
    queryKey: ["videos", id, "status"],
    queryFn: () => videoProcessingService.status(id),
    enabled: Boolean(id),
    refetchInterval: 5000,
  });
}

export function useDeleteVideo() {
  return useMutation({
    mutationFn: (id: string) => videoProcessingService.remove(id),
  });
}