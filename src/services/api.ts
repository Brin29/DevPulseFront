import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import type { ApiRequest, ApiResponse } from "../models/api.model";
import { hideLoader, showLoader } from "./loaderEvents";

let pendingRequests = 0;

let rawBaseUrl = import.meta.env.VITE_API_URL as string;

if (!/^https?:\/\//i.test(rawBaseUrl)) {
  rawBaseUrl = `https://${rawBaseUrl}`;
}

const BASE_URL = rawBaseUrl.replace(/\/+$/, "");

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    showLoader();
    pendingRequests++;
    return config;
  },
  (error) => {
    pendingRequests--;
    if (pendingRequests <= 0) hideLoader();
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    pendingRequests--;
    if (pendingRequests <= 0) hideLoader();
    return response;
  },
  async (error: AxiosError) => {
    pendingRequests--;
    if (pendingRequests <= 0) hideLoader();
  }
)

export async function sendRequest<ReqData, ResData>(
  endpoint: string,
  payload: ReqData,
  config?: AxiosRequestConfig,
  method: "post" | "put" | "patch" | "delete" = "post",
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
  const { data } = await api[method]<ApiResponse<ResData>>(
    endpoint,
    body,
    config,
  );
  return data;
}
