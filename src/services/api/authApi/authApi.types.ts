import type { IUser } from '@/modules/auth/types';

import type { UserFullDTO } from '@/core/types/user';

export interface CheckUserRequest {
  username: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface ResendActivationEmailResponse {
  message: string;
}

export interface TwoFactorRequired {
  twoFactorRequired: boolean;
  tempToken: string;
}

export type AuthResult = AuthResponse | TwoFactorRequired;

export interface AuthErrorResponse {
  message: string;
  errors?: { field: string }[];
}

export interface CheckUserResponse {
  exists: boolean;
}

export interface VerifyTwoFactorResponse {
  user: UserFullDTO;
  accessToken: string;
  refreshToken: string;
}
