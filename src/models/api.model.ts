export interface ApiRequest<T = unknown> {
  data: T;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  code: string;
  message?: string;
  trace_id?: string;
  data: T;
  errors?: string[];
}

