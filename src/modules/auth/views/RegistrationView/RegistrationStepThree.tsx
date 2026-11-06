'use client';

import { type Control } from 'react-hook-form';

import { FormTextField } from '@/shared/components/FormTextField/FormTextField';
import { UploadFile } from '@/shared/components/UploadFile/UploadFile';
import { useTranslations } from '@/shared/hooks/useTranslations';

import type { RegistrationData } from '@/modules/auth/types';

interface RegistrationStepThreeProps {
  control: Control<RegistrationData>;
  onImageChange: (file: File) => void;
}

export function RegistrationStepThree({
  control,
  onImageChange,
}: RegistrationStepThreeProps) {
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
