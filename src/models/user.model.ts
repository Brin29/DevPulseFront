export interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  avatar?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
}