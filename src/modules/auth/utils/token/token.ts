import { ACCESS_TOKEN_STORAGE_KEY } from '@/modules/auth/constants';

const isBrowser = (): boolean => typeof window !== 'undefined';

export function getUserToken(): string | null {
  return isBrowser() ? localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) : null;
}

export function hasUserToken(): boolean {
  return !!getUserToken();
}

export function setUserToken(token: string): void {
  if (isBrowser()) {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  }
}

export function removeUserToken(): void {
  if (isBrowser()) {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  }
}
