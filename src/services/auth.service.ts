import type { ApiResponse } from "../models/api.model";
import type { SignInRequest, SignInResponseData } from "../models/auth.model";
import { sendRequest } from "./api";

async function authCall<TRes, TReq = object>(
  endpoint: string,
  payload: TReq,
): Promise<ApiResponse<TRes>>{
  try {
    const response = await sendRequest<TReq, TRes>(endpoint, payload);

    return {
      ...response,
      message: response.message ?? "Sin mensaje",
    } as ApiResponse<TRes>;
  }
  catch (error){
    return {
      errors: [error],
      message: "Sin mensaje",
    } as ApiResponse<TRes>;
  }
}

export const signIn = (signInRequest: SignInRequest) => authCall<SignInResponseData, SignInRequest>("", signInRequest);

export const signUp = () => console.log("");

export const logout = () => console.log("");

export const me = () => console.log("");