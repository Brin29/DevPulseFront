import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  GenerateCodeRequest,
  MagicLinkGenerate,
  SignInRequest,
  VerifyCodeRequest,
} from "../models/auth.model";
import {
  changeAvatar,
  changePassword,
  deleteAccount,
  generateCode,
  getProfile,
  magicLinkGenerate,
  signIn,
  signUp,
  updateProfile,
  verificationCode,
  verificationMagicLink,
  type SignUpPayload,
} from "../services/auth.service";
import type { ApiResponseError } from "../models/api.model";

export const authUserServiceKey = {
  all: ["authUser"] as const,
  lists: () => [...authUserServiceKey.all, "list"] as const,
  details: () => [...authUserServiceKey.all, "detail"] as const,
};

export const getUserProfile = () => {
  return useQuery({
    queryKey: authUserServiceKey.lists(),
    queryFn: () => getProfile(),
    placeholderData: keepPreviousData,
  })
}

export const authUserMutations = () => {
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: (payload: SignInRequest) => signIn(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authUserServiceKey.lists(),
      });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const register = useMutation({
    mutationFn: (payload: SignUpPayload) => signUp(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authUserServiceKey.lists(),
      });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const createMagicLink = useMutation({
    mutationFn: (payload: MagicLinkGenerate) => magicLinkGenerate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authUserServiceKey.lists(),
      });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const createCode = useMutation({
    mutationFn: (payload: GenerateCodeRequest) => generateCode(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authUserServiceKey.lists(),
      });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const verifyCode = useMutation({
    mutationFn: (payload: VerifyCodeRequest) => verificationCode(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authUserServiceKey.lists(),
      });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const verfifyMagicLink = useMutation({
    mutationFn: (payload: any) => verificationMagicLink(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authUserServiceKey.lists(),
      });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const avatarUpload = useMutation({
    mutationFn: (formData: FormData) => changeAvatar(formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: authUserServiceKey.lists(),
      });
      if (data?.user) {
        localStorage.setItem("meUser", JSON.stringify(data.user));
      }
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const profileUpdate = useMutation({
    mutationFn: (payload: { firstName?: string; lastName?: string }) => updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authUserServiceKey.lists(),
      });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const passwordChange = useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) => changePassword(payload),
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const accountDelete = useMutation({
    mutationFn: () => deleteAccount(),
    onSuccess: () => {
      localStorage.removeItem("meUser");
      queryClient.clear();
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  return {
    login,
    register,
    createMagicLink,
    createCode,
    verifyCode,
    verfifyMagicLink,
    avatarUpload,
    profileUpdate,
    passwordChange,
    accountDelete,
  };
};