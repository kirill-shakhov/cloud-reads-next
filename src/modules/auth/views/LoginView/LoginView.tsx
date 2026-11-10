'use client';

import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input, Label, TextField } from '@heroui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';

import { authApi } from '@/services/api/authApi';

import { FormTextField } from '@/shared/components/FormTextField/FormTextField';
import { LoadingButton } from '@/shared/components/LoadingButton/LoadingButton';
import { useTranslations } from '@/shared/hooks/useTranslations';

import { AuthPageLayout } from '@/modules/auth/components/AuthPageLayout/AuthPageLayout';
import { AuthProgressStrip } from '@/modules/auth/components/AuthProgressStrip/AuthProgressStrip';
import { GoogleSignInButton } from '@/modules/auth/components/GoogleSignInButton/GoogleSignInButton';
import { type LoginFormData, useLoginStore } from '@/modules/auth/stores/login';
import { setUserToken } from '@/modules/auth/utils/token/token';

import { APP_ROUTES } from '@/shared/constants/routes';

const createLoginSchema = (t: (key: string) => string) =>
  object({
    username: string().required(t('validation.usernameRequired')),
    password: string().required(t('validation.passwordRequired')),
  });

export function LoginView() {
  const router = useRouter();
  const { t, tRaw } = useTranslations('pages.login');

  const code = useLoginStore((state) => state.code);
  const isLoading = useLoginStore((state) => state.isLoading);
  const isLoadingVerify = useLoginStore((state) => state.isLoadingVerify);
  const isTwoFactorRequired = useLoginStore(
    (state) => state.isTwoFactorRequired
  );
  const setCode = useLoginStore((state) => state.setCode);
  const submitForm = useLoginStore((state) => state.submitForm);
  const startTwoFactor = useLoginStore((state) => state.startTwoFactor);
  const verifyTwoFactorCode = useLoginStore(
    (state) => state.verifyTwoFactorCode
  );
  const resetState = useLoginStore((state) => state.resetState);

  const [isGoogleAuthLoading, setIsGoogleAuthLoading] =
    useState<boolean>(false);

  const schema = useMemo(() => createLoginSchema(tRaw), [tRaw]);

  const { control, handleSubmit, setError } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: { username: '', password: '' },
  });

  useEffect(() => resetState, [resetState]);

  const onSubmit = handleSubmit(async (data) => {
    const outcome = await submitForm(data, (field, message) =>
      setError(field as keyof LoginFormData, { type: 'server', message })
    );

    if (outcome === 'success') {
      router.push(APP_ROUTES.HOME);
    }
  });

  const onSubmitTwoFactor = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (await verifyTwoFactorCode()) {
      router.push(APP_ROUTES.HOME);
    }
  };

  const handleGoogleLogin = async (credential: string): Promise<void> => {
    if (isGoogleAuthLoading) {
      return;
    }

    setIsGoogleAuthLoading(true);

    try {
      const response = await authApi.loginWithGoogle(credential);

      if ('tempToken' in response && response.tempToken) {
        startTwoFactor(response.tempToken);

        return;
      }

      if ('accessToken' in response && response.accessToken) {
        setUserToken(response.accessToken);
        router.push(APP_ROUTES.HOME);
      }
    } catch {
      // The user stays on the login page; the progress strip only shows the in-flight state.
    } finally {
      setIsGoogleAuthLoading(false);
    }
  };

  return (
    <AuthPageLayout title={t('title')}>
      <AuthProgressStrip
        isVisible={isGoogleAuthLoading}
        message={t('googleAuthInProgress')}
      />

      {isTwoFactorRequired ? (
        <form className="space-y-6" noValidate onSubmit={onSubmitTwoFactor}>
          <TextField
            fullWidth
            name="code"
            value={code}
            onChange={setCode}
            autoComplete="one-time-code"
          >
            <Label>{tRaw('fields.twoFactorCode')}</Label>
            <Input />
          </TextField>

          <LoadingButton fullWidth type="submit" isPending={isLoadingVerify}>
            {t('button')}
          </LoadingButton>
        </form>
      ) : (
        <form className="space-y-6" noValidate onSubmit={onSubmit}>
          <FormTextField
            control={control}
            name="username"
            label={tRaw('fields.username')}
            autoComplete="username"
          />

          <FormTextField
            control={control}
            name="password"
            label={tRaw('fields.password')}
            type="password"
            autoComplete="current-password"
          />

          <div>
            <LoadingButton fullWidth type="submit" isPending={isLoading}>
              {t('button')}
            </LoadingButton>

            <div className="mt-4">
              <GoogleSignInButton onLogin={handleGoogleLogin} />
            </div>
          </div>
        </form>
      )}

      <p className="mt-10 text-center text-sm text-gray-500 dark:text-neutral-400">
        {t('donTHaveAnAccount')}{' '}
        <Link
          href={APP_ROUTES.AUTH_REGISTRATION}
          className="leading-6 font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {t('signUp')}
        </Link>
      </p>
    </AuthPageLayout>
  );
}
