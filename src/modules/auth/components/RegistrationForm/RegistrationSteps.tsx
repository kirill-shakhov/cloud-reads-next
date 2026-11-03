'use client';

import { type Control } from 'react-hook-form';

import { FormCountrySelector } from '@/shared/components/FormCountrySelector/FormCountrySelector';
import { FormTextField } from '@/shared/components/FormTextField/FormTextField';
import { UploadFile } from '@/shared/components/UploadFile/UploadFile';
import { useTranslations } from '@/shared/hooks/useTranslations';

import type { RegistrationData } from '@/modules/auth/types';

interface StepProps {
  control: Control<RegistrationData>;
}

export function RegistrationStepOne({ control }: StepProps) {
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

export function RegistrationStepTwo({ control }: StepProps) {
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

interface StepThreeProps extends StepProps {
  onImageChange: (file: File) => void;
}

export function RegistrationStepThree({
  control,
  onImageChange,
}: StepThreeProps) {
  const { tRaw } = useTranslations();

  return (
    <>
      <FormTextField
        control={control}
        name="email"
        label={tRaw('fields.email')}
        type="email"
        autoComplete="email"
      />
      <UploadFile id="registration-image" onChange={onImageChange} />
    </>
  );
}

export function RegistrationStepFour({ control }: StepProps) {
  const { tRaw } = useTranslations();

  return (
    <>
      <FormCountrySelector control={control} name="country" />
      <FormTextField control={control} name="bio" label={tRaw('fields.bio')} />
    </>
  );
}
