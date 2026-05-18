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
  email: string;
  password: string;
}