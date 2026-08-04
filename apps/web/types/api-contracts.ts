export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type ApiErrorPayload = {
  success: boolean;
  error: {
    code: string;
    message: string;
  };
};
