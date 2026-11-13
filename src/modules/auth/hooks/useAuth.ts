import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from '@heroui/react';

import { authApi } from '@/services/api/authApi';

import { useTranslations } from '@/shared/hooks/useTranslations';

import { removeUserToken } from '@/modules/auth/utils/token/token';
import { useActiveUserStore } from '@/modules/users/stores/activeUser';

import { extractErrorMessage } from '@/utils/http/http';
import { APP_ROUTES } from '@/shared/constants/routes';

export function useAuth() {
  const router = useRouter();
  const { tRaw } = useTranslations();
  const resetUser = useActiveUserStore((state) => state.resetUser);

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error: unknown) {
      toast.danger(
        axios.isAxiosError(error)
          ? extractErrorMessage(error)
          : tRaw('errors.common.unknown')
      );
    } finally {
      resetUser();
      removeUserToken();
      router.push(APP_ROUTES.AUTH_LOGIN);
    }
  };

  return { logout };
}
