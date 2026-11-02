import $api from '@/services/api/createAxiosInstance';

import type { UserFullDTO } from '@/shared/types/user';

import type {
  AuthResponse,
  AuthResult,
  CheckUserRequest,
  CheckUserResponse,
  ResendActivationEmailResponse,
  VerifyTwoFactorResponse,
} from './authApi.types';

class AuthApi {
  async login(username: string, password: string): Promise<AuthResult> {
    const { data } = await $api.post<AuthResult>('auth/login', {
      username,
      password,
    });

    return data;
  }

  async activate(token: string): Promise<AuthResponse> {
    const { data } = await $api.get<AuthResponse>(`/auth/activate/${token}`);

    return data;
  }

  async resendActivationEmail(
    email: string
  ): Promise<ResendActivationEmailResponse> {
    const { data } = await $api.post<ResendActivationEmailResponse>(
      'auth/resend-activation',
      { email }
    );

    return data;
  }

  async loginWithGoogle(token: string): Promise<AuthResult> {
    const { data } = await $api.post<AuthResult>('auth/google', { token });

    return data;
  }

  async registration(request: FormData): Promise<AuthResponse> {
    const { data } = await $api.post<AuthResponse>(
      'auth/registration',
      request
    );

    return data;
  }

  async logout(): Promise<void> {
    await $api.post('/auth/logout');
  }

  async checkUser(request: CheckUserRequest): Promise<CheckUserResponse> {
    const { data } = await $api.post<CheckUserResponse>(
      'auth/check-user',
      request
    );

    return data;
  }

  async getUser(): Promise<UserFullDTO> {
    const { data } = await $api.get<UserFullDTO>('/profile');

    return data;
  }

  async verifyTwoFactor(code: string): Promise<VerifyTwoFactorResponse> {
    const { data } = await $api.post<VerifyTwoFactorResponse>(
      'auth/2fa/verify',
      {
        code,
      }
    );

    return data;
  }
}

export const authApi = new AuthApi();
