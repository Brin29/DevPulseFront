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

export interface SignUpRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface CodeRequest {
  email: string;
}

export interface GenerateCodeRequest {
  email: string;
}

export interface CheckEmailRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface MagicLinkGenerate {
  email: string;
}
