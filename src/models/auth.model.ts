export interface SignInResponseData {
  access: string;
  refresh: string;
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
}

export interface SignInRequest {
  username: string;
  password: string;
  app: string;
  device_id: string;
}