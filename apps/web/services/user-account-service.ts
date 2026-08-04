import { apiEndpoints } from "@/constants/api-endpoints";
import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api-contracts";
import type { User } from "@/types/user-types";

export const userAccountService = {
  async me(): Promise<User> {
    const { data } = await apiClient.get<ApiEnvelope<User>>(
      apiEndpoints.users.me,
    );

    if (!data?.data?.id) {
      throw new Error("Invalid user profile response");
    }

    return data.data;
  },
};