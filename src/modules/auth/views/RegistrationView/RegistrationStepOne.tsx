'use client';

import { type Control } from 'react-hook-form';

import { FormTextField } from '@/shared/components/FormTextField/FormTextField';
import { useTranslations } from '@/shared/hooks/useTranslations';

import type { RegistrationData } from '@/modules/auth/types';

interface RegistrationStepOneProps {
  control: Control<RegistrationData>;
}

export function RegistrationStepOne({ control }: RegistrationStepOneProps) {
  const { tRaw } = useTranslations();

  return (
    <>
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
        autoComplete="new-password"
      />
      <FormTextField
        control={control}
        name="confirmPassword"
        label={tRaw('fields.confirmPassword')}
        type="password"
        autoComplete="new-password"
      />
    </>
  );
}
