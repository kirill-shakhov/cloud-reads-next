'use client';

import { type ChangeEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from '@heroui/react';

import { useTranslations } from '@/shared/hooks/useTranslations';

interface BookFileInputProps {
  id: string;
  accept: readonly string[];
  imagePreview?: boolean;
  onChange: (file: File) => void;
}

export function BookFileInput({
  id,
  accept,
  imagePreview = false,
  onChange,
}: BookFileInputProps) {
  const { t } = useTranslations('uiUploadFile');
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(
    () => () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!accept.includes(file.type)) {
      toast.danger(t('unsupportedFileType'));
      event.target.value = '';

      return;
    }

    setFileName(file.name);
    setPreviewUrl(
      imagePreview && file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : ''
    );
    onChange(file);
  };

  return (
    <div className="flex flex-col items-center">
      {imagePreview && previewUrl && (
        <Image
          src={previewUrl}
          alt={t('preview')}
          width={160}
          height={160}
          unoptimized
          className="h-40 w-40 rounded-full object-cover p-1 ring-2 ring-gray-300 dark:ring-gray-500"
        />
      )}
      <label
        htmlFor={`book-file-${id}`}
        className="mt-4 cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 dark:bg-neutral-700 dark:text-neutral-100 dark:ring-neutral-600 dark:hover:bg-neutral-600"
      >
        {t('upload')}
      </label>
      <input
        id={`book-file-${id}`}
        type="file"
        accept={accept.join(',')}
        className="sr-only"
        aria-label={t('selectFileToUpload')}
        onChange={handleChange}
      />
      {fileName && (
        <p className="mt-2 max-w-full truncate text-xs text-gray-600 dark:text-neutral-300">
          {fileName}
        </p>
      )}
    </div>
  );
}
