import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  GenerateCodeRequest,
  MagicLinkGenerate,
  SignInRequest,
  VerifyCodeRequest,
} from "../models/auth.model";
import {
  generateCode,
  magicLinkGenerate,
  signIn,
  signUp,
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

  return {
    login,
    register,
    createMagicLink,
    createCode,
    verifyCode,
    verfifyMagicLink,
  };
};
