import { apiEndpoints } from "@/constants/api-endpoints";
import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api-contracts";
import type {
  Video,
  VideoPlaybackSession,
  VideoStatusResponse,
} from "@/types/video-types";

export const videoProcessingService = {
  async list(): Promise<Video[]> {
    const { data } = await apiClient.get<ApiEnvelope<Video[]>>(
      apiEndpoints.videos.list,
    );

    if (!Array.isArray(data?.data)) {
      throw new Error("Invalid video list response");
    }

    return data.data;
  },

  async details(id: string): Promise<Video> {
    const { data } = await apiClient.get<ApiEnvelope<Video>>(
      apiEndpoints.videos.details(id),
    );

    if (!data?.data?.id) {
      throw new Error("Invalid video detail response");
    }

    return data.data;
  },

  async status(id: string): Promise<VideoStatusResponse> {
    const { data } = await apiClient.get<ApiEnvelope<VideoStatusResponse>>(
      apiEndpoints.videos.status(id),
    );

    if (!data?.data) {
      throw new Error("Invalid video status response");
    }

    return data.data;
  },

  async playback(id: string): Promise<VideoPlaybackSession> {
    const { data } = await apiClient.get<ApiEnvelope<VideoPlaybackSession>>(
      apiEndpoints.videos.playback(id),
    );

    if (
      !data?.data?.token ||
      !data.data.expires_at ||
      !data.data.hls_url ||
      !data.data.thumbnail_url
    ) {
      throw new Error("Invalid playback session response");
    }

    return data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(apiEndpoints.videos.delete(id));
  },
};