'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Chip } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';

import { LoadingButton } from '@/shared/components/LoadingButton/LoadingButton';
import { Logo } from '@/shared/components/Logo/Logo';
import { useTranslations } from '@/shared/hooks/useTranslations';

import { useRegistrationStore } from '@/modules/auth/stores/registration';

export function EmailSentView() {
  return (
    <Suspense>
      <EmailSentContent />
    </Suspense>
  );
}

function EmailSentContent() {
  const { t } = useTranslations('pages.registerEmailSent');
  const searchParams = useSearchParams();
  const resendActivationEmail = useRegistrationStore(
    (state) => state.resendActivationEmail
  );

  const userEmail = searchParams.get('email')?.trim() ?? '';

  const { mutate, isPending } = useMutation({
    mutationFn: resendActivationEmail,
  });

  const resendEmail = (): void => {
    if (userEmail) {
      mutate(userEmail);
    }
  };

  return (
    <main className="relative flex min-h-full flex-1 flex-col overflow-hidden px-6 py-12 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#c7d2fe_0%,rgba(255,255,255,0)_50%),radial-gradient(circle_at_bottom,#bfdbfe_0%,rgba(255,255,255,0)_50%)]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Logo className="mx-auto h-auto w-[70px]" />

        <div className="mt-10 rounded-2xl border border-indigo-100 bg-white/90 p-8 shadow-xl shadow-indigo-100/50 backdrop-blur dark:border-indigo-500/20 dark:bg-neutral-900/90 dark:shadow-black/30">
          <p className="text-right text-sm font-semibold tracking-tight text-indigo-500 dark:text-indigo-400">
            {t('stepLabel')}
          </p>

          <h1 className="mt-3 text-2xl leading-9 font-bold tracking-tight text-gray-900 dark:text-neutral-100">
            {t('title')}
          </h1>

          <p className="mt-6 text-sm leading-6 text-gray-600 dark:text-neutral-300">
            {t('description')}
          </p>

          {userEmail && (
            <Chip className="mt-4">
              <Chip.Label>{userEmail}</Chip.Label>
            </Chip>
          )}

          <div className="mt-8 space-y-3">
            <LoadingButton
              fullWidth
              variant="secondary"
              isPending={isPending}
              onPress={resendEmail}
            >
              {t('sendAgain')}
            </LoadingButton>
          </div>
        </div>
      </div>
    </main>
  );
}
