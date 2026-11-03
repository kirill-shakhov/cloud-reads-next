import axios, { HttpStatusCode, type InternalAxiosRequestConfig } from 'axios';

import {
  getUserToken,
  removeUserToken,
  setUserToken,
} from '@/modules/auth/utils/token/token';

import type { AuthResponse } from './authApi/authApi.types';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _isRetry?: boolean;
  }
}

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// A failed login, Google sign-in or 2FA code must not trigger a refresh: it would drop the temp token.
const NO_REFRESH_URLS = ['auth/login', 'auth/google', 'auth/2fa/verify'];

const $api = axios.create({
  withCredentials: true,
  baseURL,
});

$api.interceptors.request.use((config) => {
  const token = getUserToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshPromise: Promise<string> | null = null;

// A bare axios call keeps the refresh request out of the interceptors below.
function refreshAccessToken(): Promise<string> {
  refreshPromise ??= axios
    .get<AuthResponse>('/auth/refresh', { baseURL, withCredentials: true })
    .then(({ data }) => {
      setUserToken(data.accessToken);

      return data.accessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

function shouldSkipRefresh(config: InternalAxiosRequestConfig): boolean {
  const url = config.url?.replace(/^\//, '') ?? '';

  return NO_REFRESH_URLS.some((skippedUrl) => url.startsWith(skippedUrl));
}

$api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config) {
      throw error;
    }

    const { config, response } = error;

    if (
      response?.status !== HttpStatusCode.Unauthorized ||
      config._isRetry ||
      shouldSkipRefresh(config)
    ) {
      throw error;
    }

    config._isRetry = true;

    try {
      const accessToken = await refreshAccessToken();
      config.headers.Authorization = `Bearer ${accessToken}`;
    } catch {
      removeUserToken();
      throw error;
    }

    return $api.request(config);
  }
);

export default $api;
