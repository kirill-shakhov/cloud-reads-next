import { toast } from '@heroui/react';

import { authApi } from '@/services/api/authApi';

import { ACCESS_TOKEN_STORAGE_KEY } from '@/modules/auth/constants';
import type { RegistrationData } from '@/modules/auth/types';

import { useRegistrationStore } from './registration';

vi.mock('@heroui/react', () => ({
  toast: { danger: vi.fn(), success: vi.fn() },
}));

vi.mock('@/services/api/authApi', () => ({
  authApi: {
    checkUser: vi.fn(),
    registration: vi.fn(),
    activate: vi.fn(),
    resendActivationEmail: vi.fn(),
  },
}));

const formData: RegistrationData = {
  username: 'john',
  password: 'secret1',
  confirmPassword: 'secret1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  image: null,
  country: 'Poland',
  bio: 'Hello',
};

describe('useRegistrationStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useRegistrationStore.getState().resetState();
    vi.clearAllMocks();
  });

  describe('steps', () => {
    it('does not go below the first step', () => {
      useRegistrationStore.getState().previousStep();

      expect(useRegistrationStore.getState().currentStep).toBe(1);
    });

    it('does not go past the last step', () => {
      const { nextStep } = useRegistrationStore.getState();

      Array.from({ length: 10 }).forEach(() => nextStep());

      expect(useRegistrationStore.getState().currentStep).toBe(4);
    });

    it('moves forward and back', () => {
      useRegistrationStore.getState().nextStep();
      useRegistrationStore.getState().nextStep();
      useRegistrationStore.getState().previousStep();

      expect(useRegistrationStore.getState().currentStep).toBe(2);
    });
  });

  it('checkUserExists returns the flag from the API', async () => {
    vi.mocked(authApi.checkUser).mockResolvedValue({ exists: true });

    await expect(
      useRegistrationStore.getState().checkUserExists('john')
    ).resolves.toBe(true);
    expect(authApi.checkUser).toHaveBeenCalledWith({ username: 'john' });
  });

  describe('submitForm', () => {
    it('sends the form without confirmPassword', async () => {
      vi.mocked(authApi.registration).mockResolvedValue({} as never);

      await expect(
        useRegistrationStore.getState().submitForm(formData)
      ).resolves.toBe(true);

      const sent = vi.mocked(authApi.registration).mock.calls[0][0];

      expect(sent.get('username')).toBe('john');
      expect(sent.get('email')).toBe('john@example.com');
      expect(sent.has('confirmPassword')).toBe(false);
      expect(useRegistrationStore.getState().isLoading).toBe(false);
    });

    it('shows an error toast and returns false on failure', async () => {
      vi.mocked(authApi.registration).mockRejectedValue(new Error('boom'));

      await expect(
        useRegistrationStore.getState().submitForm(formData)
      ).resolves.toBe(false);
      expect(toast.danger).toHaveBeenCalled();
    });
  });

  describe('activateEmail', () => {
    it('stores the access token and shows a success toast', async () => {
      vi.mocked(authApi.activate).mockResolvedValue({
        accessToken: 'access-1',
      } as never);

      await useRegistrationStore.getState().activateEmail('activation-token');

      expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBe('access-1');
      expect(toast.success).toHaveBeenCalled();
    });

    it('rethrows and shows an error toast when activation fails', async () => {
      vi.mocked(authApi.activate).mockRejectedValue(new Error('expired'));

      await expect(
        useRegistrationStore.getState().activateEmail('activation-token')
      ).rejects.toThrow('expired');
      expect(toast.danger).toHaveBeenCalled();
    });
  });

  it('resendActivationEmail shows the server message', async () => {
    vi.mocked(authApi.resendActivationEmail).mockResolvedValue({
      message: 'Sent',
    });

    await useRegistrationStore
      .getState()
      .resendActivationEmail('john@example.com');

    expect(toast.success).toHaveBeenCalledWith('Sent');
  });
});
