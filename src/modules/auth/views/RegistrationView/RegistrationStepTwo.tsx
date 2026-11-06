'use client';

import { type Control } from 'react-hook-form';

import { FormTextField } from '@/shared/components/FormTextField/FormTextField';
import { useTranslations } from '@/shared/hooks/useTranslations';

import type { RegistrationData } from '@/modules/auth/types';

interface RegistrationStepTwoProps {
  control: Control<RegistrationData>;
}

export function RegistrationStepTwo({ control }: RegistrationStepTwoProps) {
  const { tRaw } = useTranslations();

  return (
    <>
      <FormTextField
        control={control}
        name="firstName"
        label={tRaw('fields.firstName')}
        autoComplete="given-name"
      />
      <FormTextField
        control={control}
        name="lastName"
        label={tRaw('fields.lastName')}
        autoComplete="family-name"
      />
    </>
  );
}
