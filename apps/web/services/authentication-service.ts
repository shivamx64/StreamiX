import { apiEndpoints } from "@/constants/api-endpoints";
import { apiClient } from "@/lib/api-client";
import type {
  AuthTokens,
  LoginRequest,
  RegisterRequest,
} from "@/types/authentication-types";

export const authenticationService = {
  async login(request: LoginRequest): Promise<AuthTokens> {
    const { data } = await apiClient.post<AuthTokens>(
      apiEndpoints.auth.login,
      request,
    );

    return data;
  },

  async register(request: RegisterRequest): Promise<AuthTokens> {
    const { data } = await apiClient.post<AuthTokens>(
      apiEndpoints.auth.register,
      request,
    );

    return data;
  },
};