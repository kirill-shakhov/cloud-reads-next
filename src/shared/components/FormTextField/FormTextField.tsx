'use client';

import { useState } from 'react';
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import {
  Button,
  FieldError,
  Input,
  InputGroup,
  Label,
  TextField,
} from '@heroui/react';

import { useTranslations } from '@/shared/hooks/useTranslations';

interface FormTextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: 'text' | 'password' | 'email';
  autoComplete?: string;
}

function EyeIcon({ isCrossed }: { isCrossed: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
      {isCrossed && (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
      )}
    </svg>
  );
}

export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  autoComplete,
}: FormTextFieldProps<T>) {
  const { t } = useTranslations('uiInput');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const isPasswordInput = type === 'password';
  const actualType = isPasswordInput && isPasswordVisible ? 'text' : type;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          fullWidth
          name={field.name}
          type={actualType}
          autoComplete={autoComplete}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          isInvalid={fieldState.invalid}
          validationBehavior="aria"
        >
          <Label>{label}</Label>
          {isPasswordInput ? (
            <InputGroup fullWidth>
              <InputGroup.Input ref={field.ref} />
              <InputGroup.Suffix>
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  aria-label={t('togglePasswordVisibility')}
                  onPress={() =>
                    setIsPasswordVisible((isVisible) => !isVisible)
                  }
                >
                  <EyeIcon isCrossed={isPasswordVisible} />
                </Button>
              </InputGroup.Suffix>
            </InputGroup>
          ) : (
            <Input ref={field.ref} />
          )}
          <FieldError>{fieldState.error?.message}</FieldError>
        </TextField>
      )}
    />
  );
}
