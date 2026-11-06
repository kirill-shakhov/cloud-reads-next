'use client';

import { Suspense, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { buttonVariants, Spinner } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import JSConfetti from 'js-confetti';

import { useTranslations } from '@/shared/hooks/useTranslations';

import { AuthPageLayout } from '@/modules/auth/components/AuthPageLayout/AuthPageLayout';
import { useRegistrationStore } from '@/modules/auth/stores/registration';

export function EmailConfirmationView() {
  return (
    <Suspense>
      <EmailConfirmationContent />
    </Suspense>
  );
}

function EmailConfirmationContent() {
  const { t } = useTranslations('pages.emailConfirmation');
  const searchParams = useSearchParams();
  const activateEmail = useRegistrationStore((state) => state.activateEmail);

  const token = searchParams.get('token');

  const {
    mutate,
    isSuccess,
    isError: isActivationError,
  } = useMutation({ mutationFn: activateEmail });

  const isError = !token || isActivationError;
  const errorMessage = token ? t('activationFailed') : t('noToken');
  const isLoading = !isSuccess && !isError;
  // The activation token is single-use, so Strict Mode must not run the request twice.
  const hasStartedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!token || hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    mutate(encodeURIComponent(token), {
      onSuccess: () => {
        new JSConfetti().addConfetti();
      },
    });
  }, [token, mutate]);

  return (
    <AuthPageLayout title={t('title')}>
      {isLoading && (
        <div className="flex flex-col items-center text-center">
          <Spinner size="lg" />

          <p className="mt-4 text-sm text-gray-600 dark:text-neutral-400">
            {t('activating')}
          </p>
        </div>
      )}

      {isSuccess && (
        <div className="space-y-6">
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-center text-sm font-medium text-green-800 dark:text-green-300">
              {t('success')}
            </p>
          </div>

          <p className="text-center text-sm text-gray-600 dark:text-neutral-400">
            {t('successMessage')}
          </p>

          <Link href="/" className={buttonVariants({ fullWidth: true })}>
            {t('backToHome')}
          </Link>
        </div>
      )}

      {isError && (
        <div className="space-y-6">
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-center text-sm font-medium text-red-800 dark:text-red-300">
              {errorMessage}
            </p>
          </div>

          <p className="text-center text-sm text-gray-600 dark:text-neutral-400">
            {t('errorMessage')}
          </p>

          <Link
            href="/auth/login"
            className={buttonVariants({ fullWidth: true })}
          >
            {t('backToLogin')}
          </Link>
        </div>
      )}
    </AuthPageLayout>
  );
}
