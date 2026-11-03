import axios from 'axios';
import { create } from 'zustand';
import { toast } from '@heroui/react';

import { authApi } from '@/services/api/authApi';

import { REGISTRATION_TOTAL_STEPS } from '@/modules/auth/constants';
import type { RegistrationData, RegistrationStep } from '@/modules/auth/types';
import { setUserToken } from '@/modules/auth/utils/token/token';

import { extractErrorMessage } from '@/utils/http/http';
import i18n from '@/i18n';
import { collectFormData } from '@/shared/utils/collectFormData/collectFormData';

interface RegistrationState {
  currentStep: RegistrationStep;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  nextStep: () => void;
  previousStep: () => void;
  checkUserExists: (username: string) => Promise<boolean>;
  submitForm: (data: RegistrationData) => Promise<boolean>;
  activateEmail: (token: string) => Promise<void>;
  resendActivationEmail: (email: string) => Promise<void>;
  resetState: () => void;
}

const notifyError = (e: unknown): void => {
  toast.danger(
    axios.isAxiosError(e)
      ? extractErrorMessage(e)
      : i18n.t('errors.common.unknown')
  );
};

export const useRegistrationStore = create<RegistrationState>((set, get) => ({
  currentStep: 1,
  isLoading: false,

  setIsLoading: (isLoading) => set({ isLoading }),

  nextStep: () => {
    const { currentStep } = get();

    if (currentStep < REGISTRATION_TOTAL_STEPS) {
      set({ currentStep: (currentStep + 1) as RegistrationStep });
    }
  },

  previousStep: () => {
    const { currentStep } = get();

    if (currentStep > 1) {
      set({ currentStep: (currentStep - 1) as RegistrationStep });
    }
  },

  checkUserExists: async (username) => {
    const response = await authApi.checkUser({ username });

    return response.exists;
  },

  submitForm: async (data) => {
    try {
      set({ isLoading: true });

      await authApi.registration(
        collectFormData({
          username: data.username,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          image: data.image,
          country: data.country,
          bio: data.bio,
        })
      );

      return true;
    } catch {
      toast.danger(i18n.t('pages.register.registrationFailed'));

      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  activateEmail: async (token) => {
    try {
      const response = await authApi.activate(token);
      setUserToken(response.accessToken);

      toast.success(i18n.t('pages.register.emailActivated'));
    } catch (e: unknown) {
      notifyError(e);
      throw e;
    }
  },

  resendActivationEmail: async (email) => {
    try {
      const response = await authApi.resendActivationEmail(email);

      toast.success(response.message);
    } catch (e: unknown) {
      notifyError(e);
      throw e;
    }
  },

  resetState: () => set({ currentStep: 1, isLoading: false }),
}));
