import type { UpdateProfileRequest } from "../models/user.model";
import { sendRequest } from "./api";

export const userProfileService = {
  updateProfile: (payload: UpdateProfileRequest) =>
    sendRequest<UpdateProfileRequest, { id: string }>(
      `/auth/profile`,
      payload,
      { skipLoader: true },
      "patch",
    ).then((r) => r.data),

    
};
