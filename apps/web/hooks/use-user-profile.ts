import { useQuery } from "@tanstack/react-query";

import { userAccountService } from "@/services/user-account-service";

export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => userAccountService.me(),
  });
}