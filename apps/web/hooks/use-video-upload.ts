import { useMutation } from "@tanstack/react-query";

import { uploadService, type UploadCallbacks } from "@/services/upload-service";

export function useVideoUpload() {
  return useMutation({
    mutationFn: ({
      file,
      callbacks,
    }: {
      file: File;
      callbacks?: UploadCallbacks;
    }) => uploadService.upload(file, callbacks),
  });
}