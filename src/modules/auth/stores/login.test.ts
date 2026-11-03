import { AxiosError, type AxiosResponse } from 'axios';

import { authApi } from '@/services/api/authApi';

import { ACCESS_TOKEN_STORAGE_KEY } from '@/modules/auth/constants';

import { useLoginStore } from './login';

vi.mock('@heroui/react', () => ({
  toast: { danger: vi.fn(), success: vi.fn() },
}));

vi.mock('@/services/api/authApi', () => ({
  authApi: { login: vi.fn(), verifyTwoFactor: vi.fn() },
}));

const credentials = { username: 'john', password: 'secret1' };

const createAxiosError = (data: unknown): AxiosError =>
  new AxiosError('Request failed', undefined, undefined, undefined, {
    data,
    status: 400,
    statusText: '',
    headers: {},
  } as AxiosResponse);

describe('useLoginStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useLoginStore.getState().resetState();
    vi.mocked(authApi.login).mockReset();
    vi.mocked(authApi.verifyTwoFactor).mockReset();
  });

  describe('submitForm', () => {
    it('stores the access token and reports success', async () => {
      vi.mocked(authApi.login).mockResolvedValue({
        accessToken: 'access-1',
        refreshToken: 'refresh-1',
        user: { id: '1', email: 'a@b.c', isActivated: true, roles: [] },
      });

      const outcome = await useLoginStore
        .getState()
        .submitForm(credentials, vi.fn());

      expect(outcome).toBe('success');
      expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBe('access-1');
      expect(useLoginStore.getState().isLoading).toBe(false);
    });

    it('switches to the two-factor step and keeps the temp token', async () => {
      vi.mocked(authApi.login).mockResolvedValue({
        twoFactorRequired: true,
        tempToken: 'temp-1',
      });

      const outcome = await useLoginStore
        .getState()
        .submitForm(credentials, vi.fn());

      expect(outcome).toBe('two-factor');
      expect(useLoginStore.getState().isTwoFactorRequired).toBe(true);
      expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBe('temp-1');
    });

    it('maps a server error to the field returned by the backend', async () => {
      vi.mocked(authApi.login).mockRejectedValue(
        createAxiosError({
          message: 'Wrong password',
          errors: [{ field: 'password' }],
        })
      );
      const setFieldError = vi.fn();

      const outcome = await useLoginStore
        .getState()
        .submitForm(credentials, setFieldError);

      expect(outcome).toBe('error');
      expect(setFieldError).toHaveBeenCalledWith('password', 'Wrong password');
    });

    it('falls back to the username field when no field is provided', async () => {
      vi.mocked(authApi.login).mockRejectedValue(
        createAxiosError({ message: 'User not found' })
      );
      const setFieldError = vi.fn();

      await useLoginStore.getState().submitForm(credentials, setFieldError);

      expect(setFieldError).toHaveBeenCalledWith('username', 'User not found');
    });
  });

  describe('verifyTwoFactorCode', () => {
    it('stores the access token returned by a valid code', async () => {
      vi.mocked(authApi.verifyTwoFactor).mockResolvedValue({
        accessToken: 'access-2',
        refreshToken: 'refresh-2',
        user: {} as never,
      });
      useLoginStore.getState().setCode('123456');

      await expect(
        useLoginStore.getState().verifyTwoFactorCode()
      ).resolves.toBe(true);

      expect(authApi.verifyTwoFactor).toHaveBeenCalledWith('123456');
      expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBe('access-2');
      expect(useLoginStore.getState().isLoadingVerify).toBe(false);
    });

    it('returns false when the code is rejected', async () => {
      vi.mocked(authApi.verifyTwoFactor).mockRejectedValue(
        createAxiosError({ message: 'Invalid code' })
      );

      await expect(
        useLoginStore.getState().verifyTwoFactorCode()
      ).resolves.toBe(false);
    });
  });

  it('resetState restores the initial state', () => {
    useLoginStore.getState().startTwoFactor('temp-2');
    useLoginStore.getState().setCode('111111');

    useLoginStore.getState().resetState();

    expect(useLoginStore.getState()).toMatchObject({
      code: '',
      isTwoFactorRequired: false,
      isLoading: false,
      isLoadingVerify: false,
    });
  });
});
