import { useMutation } from "@tanstack/react-query";

import { uploadService, type UploadCallbacks } from "@/services/upload-service";

export function useVideoUpload() {
  return useMutation({
    mutationFn: ({
      file,
      callbacks,
      signal,
    }: {
      file: File;
      callbacks?: UploadCallbacks;
      signal?: AbortSignal;
    }) => uploadService.upload(file, callbacks, signal),
  });
}
