import axios from 'axios';
import { create } from 'zustand';
import { toast } from '@heroui/react';

import { authApi, type AuthErrorResponse } from '@/services/api/authApi';

import { setUserToken } from '@/modules/auth/utils/token/token';

import { extractErrorMessage } from '@/utils/http/http';
import { usePageLoaderStore } from '@/shared/stores/pageLoader';

export interface LoginFormData {
  username: string;
  password: string;
}

export type LoginOutcome = 'success' | 'two-factor' | 'error';

export type SetFieldError = (field: string, message: string) => void;

interface LoginState {
  code: string;
  isLoading: boolean;
  isLoadingVerify: boolean;
  isTwoFactorRequired: boolean;
  setCode: (code: string) => void;
  submitForm: (
    data: LoginFormData,
    setFieldError: SetFieldError
  ) => Promise<LoginOutcome>;
  verifyTwoFactorCode: () => Promise<boolean>;
  startTwoFactor: (tempToken: string) => void;
  resetState: () => void;
}

const initialState = {
  code: '',
  isLoading: false,
  isLoadingVerify: false,
  isTwoFactorRequired: false,
};

export const useLoginStore = create<LoginState>((set, get) => ({
  ...initialState,

  setCode: (code) => set({ code }),

  startTwoFactor: (tempToken) => {
    setUserToken(tempToken);
    set({ isTwoFactorRequired: true });
  },

  submitForm: async (data, setFieldError) => {
    const { showPageLoader, hidePageLoader } = usePageLoaderStore.getState();

    try {
      set({ isLoading: true });
      showPageLoader();

      const response = await authApi.login(data.username, data.password);

      if ('twoFactorRequired' in response && response.twoFactorRequired) {
        get().startTwoFactor(response.tempToken);

        return 'two-factor';
      }

      if ('accessToken' in response && response.accessToken) {
        setUserToken(response.accessToken);

        return 'success';
      }

      return 'error';
    } catch (e: unknown) {
      if (axios.isAxiosError<AuthErrorResponse>(e)) {
        const field = e.response?.data?.errors?.[0]?.field || 'username';

        setFieldError(field, extractErrorMessage(e));
      }

      return 'error';
    } finally {
      set({ isLoading: false });
      hidePageLoader();
    }
  },

  verifyTwoFactorCode: async () => {
    const { showPageLoader, hidePageLoader } = usePageLoaderStore.getState();

    try {
      set({ isLoadingVerify: true });
      showPageLoader();

      const response = await authApi.verifyTwoFactor(get().code);
      setUserToken(response.accessToken);

      return true;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        toast.danger(extractErrorMessage(e));
      }

      return false;
    } finally {
      hidePageLoader();
      set({ isLoadingVerify: false });
    }
  },

  resetState: () => set(initialState),
}));
