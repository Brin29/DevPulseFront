import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GenerateCodeRequest, MagicLinkGenerate, SignInRequest, VerifyCodeRequest } from "../models/auth.model";
import { generateCode, magicLinkGenerate, signIn, signUp, verificationCode, verificationMagicLink, type SignUpPayload } from "../services/auth.service";



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
      })
    }
  })

  const register = useMutation({
    mutationFn: (payload: SignUpPayload) => signUp(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authUserServiceKey.lists(),
      })
    }
  })

  const createMagicLink = useMutation({
    mutationFn: (payload: MagicLinkGenerate) => magicLinkGenerate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authUserServiceKey.lists(),
      });
    },
  });

  const createCode = useMutation({
    mutationFn: (payload: GenerateCodeRequest) => generateCode(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authUserServiceKey.lists(),
      });
    },
  });

  const verifyCode = useMutation({
    mutationFn: (payload: VerifyCodeRequest) => verificationCode(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authUserServiceKey.lists(),
      })
    }
  });

  const verfifyMagicLink = useMutation({
    mutationFn: (payload: any) => verificationMagicLink(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authUserServiceKey.lists(),
      })
    }
  })

  return {
    login,
    register,
    createMagicLink,
    createCode,
    verifyCode,
    verfifyMagicLink
  }
};
