import { apiEndpoints } from "@/constants/api-endpoints";
import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api-contracts";
import type { VideoUploadResponse } from "@/types/video-types";

export type UploadResult = {
  id: string;
  progress: number;
};

export type UploadCallbacks = {
  onProgress?: (percent: number) => void;
};

export const uploadService = {
  async upload(
    file: File,
    callbacks: UploadCallbacks = {},
  ): Promise<UploadResult> {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post<ApiEnvelope<VideoUploadResponse>>(
      apiEndpoints.videos.upload,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: (event) => {
          if (!event.total) return;

          const percent = Math.round(
            (event.loaded / event.total) * 100,
          );
          callbacks.onProgress?.(percent);
        },
      },
    );

    const video = data?.data;
    if (!video?.id) {
      throw new Error("Invalid upload response");
    }

    return {
      id: video.id,
      progress: 100,
    };
  },
};