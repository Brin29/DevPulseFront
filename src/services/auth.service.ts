import type { AxiosRequestConfig } from "axios";
import type { ApiResponse } from "../models/api.model";
import type {
  CheckEmailRequest,
  GenerateCodeRequest,
  MagicLinkGenerate,
  SignInRequest,
  SignInResponseData,
  SignUpRequest,
  VerifyCodeRequest,
} from "../models/auth.model";
import { sendRequest } from "./api";

export interface SignUpPayload {
  data: SignUpRequest;
  verificationToken: string;
}

async function authCall<TRes, TReq = object>(
  endpoint: string,
  payload: TReq,
  headers?: AxiosRequestConfig,
): Promise<ApiResponse<TRes>> {
  try {
    const response = await sendRequest<TReq, TRes>(endpoint, payload, headers);

    return {
      ...response,
      message: response ?? "Sin mensaje",
    } as ApiResponse<TRes>;
  } catch (error) {
    throw error;
  }
}

export const signIn = (signInRequest: SignInRequest) =>
  authCall<SignInResponseData, SignInRequest>("/auth/login", signInRequest);

export const checkEmail = (checkEmail: CheckEmailRequest) =>
  authCall<any, CheckEmailRequest>("/auth/check-email", checkEmail);

export const verificationCode = (verifyCode: VerifyCodeRequest) =>
  authCall<any, VerifyCodeRequest>("/auth/verify-code", verifyCode);

export const generateCode = (generateCode: GenerateCodeRequest) =>
  authCall<any, GenerateCodeRequest>("/auth/request-code", generateCode);

export const magicLinkGenerate = (magicLinkGenerate: MagicLinkGenerate) =>
  authCall<any, MagicLinkGenerate>(
    "/auth/magic-link-generate",
    magicLinkGenerate,
  );

export const verificationMagicLink = (verifyMagicLink: any) =>
  authCall<any, any>("/auth/verify-magic-token", verifyMagicLink);

export const signUp = ({
  data,
  verificationToken,
}: SignUpPayload) =>
  authCall<any, SignUpRequest>("/auth/register", data, {
    headers: {
      Authorization: `Bearer ${verificationToken}`,
    },
  });

export const logout = () => console.log("");

export const me = () => console.log("");
