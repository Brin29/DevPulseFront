import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userProfileService } from "../services/profile.service";
import type { UpdateProfileRequest } from "../models/user.model";
import type { ApiResponseError } from "../models/api.model";

export const profileUserServiceKey = {
  all: ["profileUser"] as const,
  lists: () => [...profileUserServiceKey.all, "list"] as const,
  details: () => [...profileUserServiceKey.all, "detail"] as const,
};

export const profileUserMutations = () => {
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateProfileRequest) =>
      userProfileService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileUserServiceKey.lists(),
      });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  return {
    updateProfile: updateProfileMutation,
  };
};
