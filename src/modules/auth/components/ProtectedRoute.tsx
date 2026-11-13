'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Spinner, toast } from '@heroui/react';

import { useTranslations } from '@/shared/hooks/useTranslations';

import {
  hasUserToken,
  removeUserToken,
} from '@/modules/auth/utils/token/token';
import { useActiveUserStore } from '@/modules/users/stores/activeUser';

import { extractErrorMessage } from '@/utils/http/http';
import { APP_ROUTES } from '@/shared/constants/routes';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { tRaw } = useTranslations();
  const user = useActiveUserStore((state) => state.user);
  const fetchUser = useActiveUserStore((state) => state.fetchUser);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    const checkAccess = async (): Promise<void> => {
      if (!hasUserToken()) {
        router.replace(APP_ROUTES.AUTH_LOGIN);
        return;
      }

      try {
        if (!user) {
          await fetchUser();
        }
      } catch (error: unknown) {
        removeUserToken();
        toast.danger(
          axios.isAxiosError(error)
            ? extractErrorMessage(error)
            : tRaw('errors.common.unknown')
        );
        router.replace(APP_ROUTES.AUTH_LOGIN);
        return;
      }

      setIsCheckingAccess(false);
    };

    void checkAccess();
  }, [fetchUser, router, tRaw, user]);

  if (isCheckingAccess || !user) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        role="status"
        aria-label={tRaw('auth.checkingSession')}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  return children;
}
