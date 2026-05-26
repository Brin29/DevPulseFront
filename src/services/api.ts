import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
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

export interface BaseRequest<T = Record<string, unknown>> {
  data: T;
}

export interface BaseResponse {
  access_token: string;
  refresh_token: string;
}

const BASE_URL = rawBaseUrl.replace(/\/+$/, "");

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;

let isLoggingOut = false;

let refreshSubscribers: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const subscribeTokenRefresh = () =>
  new Promise<string>((resolve, reject) => {
    refreshSubscribers.push({ resolve, reject });
  });

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((s) => s.resolve(token));
  refreshSubscribers = [];
};

const onRefreshFailed = (err: any) => {
  refreshSubscribers.forEach((s) => s.reject(err));
  refreshSubscribers = [];
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const storedAuthMeStr = localStorage.getItem("authMe");
    const storedUser = storedAuthMeStr ? JSON.parse(storedAuthMeStr) : null;
    const accessToken: string | undefined = storedUser?.access_token;

    if (accessToken) {
      if (!config.headers) config.headers = {} as AxiosRequestHeaders;
      (config.headers as AxiosRequestHeaders).Authorization =
        `Bearer ${accessToken}`;
    }

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
    const originalRequest =
      (error.config as AxiosRequestConfig & { _retry?: boolean }) || {};
    const url = originalRequest.url || "";

    pendingRequests--;
    if (pendingRequests <= 0) hideLoader();

    const status = error.response?.status;

    if (status === 401) {
      const storedUserStr = localStorage.getItem("authMe");
      const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
      const refreshToken: string | undefined = storedUser?.refresh_token;

      if (!refreshToken) {
        console.warn("⚠️ No hay refresh token, sesión inválida");
        // handleLogout();
        return Promise.reject({ ...error, isAuthError: true });
      }

      if (isRefreshing) {
        try {
          const newToken = await subscribeTokenRefresh();
          console.log(newToken)
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          } else {
            originalRequest.headers = { Authorization: `Bearer ${newToken}` };
          }
          return api(originalRequest);
        } catch (subErr) {
          const errObj =
            typeof subErr === "object" && subErr !== null
              ? subErr
              : { message: String(subErr) };
          return Promise.reject({ ...errObj, isAuthError: true });
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshData: BaseRequest<{ refresh_token: String }> = {
          data: {
            refresh_token: refreshToken,
          },
        };
        const refreshResp = await api.post<BaseResponse>(
          "/auth/refresh",
          refreshData,
          {
            headers: {
              Authorization: `Bearer ${storedUser?.access_token}`,
              "Content-Type": "application/json",
            },
          },
        );

        console.log(storedUser?.access_token)

        const newAccess = refreshResp.data.access_token;
        const newRefresh = refreshResp.data.refresh_token;

        const updatedAuth = storedUserStr
          ? { ...JSON.parse(storedUserStr), access_token: newAccess, refresh_token: newRefresh || refreshToken }
          : null;
        if (updatedAuth) {
          localStorage.setItem("authMe", JSON.stringify(updatedAuth));
        }

        console.log(newAccess)
        onRefreshed(newAccess);
        isRefreshing = false;

        api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Error al refrescar token", refreshError);
        isRefreshing = false;
        onRefreshFailed(refreshError);
        // handleLogout();
        const errObj =
          typeof refreshError === "object" && refreshError !== null
            ? refreshError
            : { message: String(refreshError) };
        return Promise.reject({ ...errObj, isAuthError: true });
      }
    }

    return Promise.reject(error);
  },
);

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

export default api;
