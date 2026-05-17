import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";
import type { ApiRequest, ApiResponse } from "../models/api.model";

const api: AxiosInstance = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
});

export async function sendRequest<ReqData, ResData>(
  endpoint: string,
  payload: ReqData,
  config?: AxiosRequestConfig,
  method: "post" | "put" | "patch" | "delete" = "post"
): Promise<ApiResponse<ResData>> {
  const body: ApiRequest<ReqData> = {
    data: payload,
  };

  if (method === "delete") {
    const { data } = await api.delete<ApiResponse<ResData>>(endpoint, {
      ...config,
      data: body,
    });
    return data;
  }
  const { data } = await api[method]<ApiResponse<ResData>>(endpoint, body, config);
  return data;
}