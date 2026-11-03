import { ACCESS_TOKEN_STORAGE_KEY } from '@/modules/auth/constants';

import {
  getUserToken,
  hasUserToken,
  removeUserToken,
  setUserToken,
} from './token';

describe('token utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('hasUserToken', () => {
    it('should return false when no token is present', () => {
      expect(hasUserToken()).toBe(false);
    });

    it('should return true when a non-empty token exists', () => {
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'abc123');
      expect(hasUserToken()).toBe(true);
    });

    it('should return false when the token is an empty string', () => {
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, '');
      expect(hasUserToken()).toBe(false);
    });

    it('should return false after removing the token', () => {
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'x');
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      expect(hasUserToken()).toBe(false);
    });
  });

  it('stores, reads and removes the token under the storage key', () => {
    setUserToken('token-1');

    expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBe('token-1');
    expect(getUserToken()).toBe('token-1');

    removeUserToken();

    expect(getUserToken()).toBeNull();
  });
});
