'use client';

import { useMemo } from 'react';
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { ComboBox, FieldError, Input, Label, ListBox } from '@heroui/react';
import { countries, getEmojiFlag, type TCountryCode } from 'countries-list';

import { useTranslations } from '@/shared/hooks/useTranslations';

interface FormCountrySelectorProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
}

interface CountryOption {
  id: string;
  name: string;
  label: string;
}

export function FormCountrySelector<T extends FieldValues>({
  control,
  name,
}: FormCountrySelectorProps<T>) {
  const { t } = useTranslations('uiCountrySelector');

  const options = useMemo<CountryOption[]>(
    () =>
      Object.entries(countries).map(([code, country]) => ({
        id: country.name,
        name: country.name,
        label: `${getEmojiFlag(code as TCountryCode)} ${country.name}`,
      })),
    []
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <ComboBox
          fullWidth
          name={field.name}
          selectedKey={field.value || null}
          onSelectionChange={(key) => field.onChange(key ? String(key) : '')}
          onBlur={field.onBlur}
          isInvalid={fieldState.invalid}
          validationBehavior="aria"
          defaultFilter={(text, inputValue) =>
            text.toLowerCase().includes(inputValue.trim().toLowerCase())
          }
        >
          <Label>{t('label')}</Label>
          <ComboBox.InputGroup>
            <Input ref={field.ref} placeholder={t('label')} />
            <ComboBox.Trigger />
          </ComboBox.InputGroup>
          <ComboBox.Popover>
            <ListBox renderEmptyState={() => t('noResults')}>
              {options.map((option) => (
                <ListBox.Item
                  key={option.id}
                  id={option.id}
                  textValue={option.name}
                >
                  {option.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </ComboBox.Popover>
          <FieldError>{fieldState.error?.message}</FieldError>
        </ComboBox>
      )}
    />
  );
}
