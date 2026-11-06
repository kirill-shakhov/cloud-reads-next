'use client';

import { type Control } from 'react-hook-form';

import { FormCountrySelector } from '@/shared/components/FormCountrySelector/FormCountrySelector';
import { FormTextField } from '@/shared/components/FormTextField/FormTextField';
import { useTranslations } from '@/shared/hooks/useTranslations';

import type { RegistrationData } from '@/modules/auth/types';

interface RegistrationStepFourProps {
  control: Control<RegistrationData>;
}

export function RegistrationStepFour({ control }: RegistrationStepFourProps) {
  const { tRaw } = useTranslations();

  return (
    <>
      <FormCountrySelector control={control} name="country" />
      <FormTextField control={control} name="bio" label={tRaw('fields.bio')} />
    </>
  );
}
