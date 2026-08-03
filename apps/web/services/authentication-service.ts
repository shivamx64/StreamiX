import { apiEndpoints } from "@/constants/api-endpoints";
import { apiClient } from "@/lib/api-client";
import type {
  AuthTokens,
  LoginRequest,
  RegisterRequest,
} from "@/types/authentication-types";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type LoginApiResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
};

type RegisterApiResponse = {
  id: string;
  email: string;
  created_at: string;
};

export const authenticationService = {
  async login(request: LoginRequest): Promise<AuthTokens> {
    const { data } = await apiClient.post<ApiEnvelope<LoginApiResponse>>(
      apiEndpoints.auth.login,
      request,
    );

    const tokens = data?.data;
    if (!tokens?.access_token || !tokens?.refresh_token) {
      throw new Error("Invalid authentication response");
    }

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
  },

  async register(request: RegisterRequest): Promise<void> {
    const { data } = await apiClient.post<ApiEnvelope<RegisterApiResponse>>(
      apiEndpoints.auth.register,
      { email: request.email, password: request.password },
    );

    if (!data?.data?.id) {
      throw new Error("Invalid registration response");
    }
  },
};