'use client';

import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button, toast } from '@heroui/react';

import { useTranslations } from '@/shared/hooks/useTranslations';

import { IMAGE_MIME_TYPES } from '@/shared/constants/files';

interface UploadFileProps {
  id: string;
  onChange: (file: File) => void;
}

const acceptedMimeTypes: readonly string[] = IMAGE_MIME_TYPES;

export function UploadFile({ id, onChange }: UploadFileProps) {
  const { t } = useTranslations('uiUploadFile');
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(
    () => () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl]
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!acceptedMimeTypes.includes(file.type)) {
      toast.danger(t('unsupportedFileType'));
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    onChange(file);
  };

  return (
    <div className="flex flex-col items-center">
      {previewUrl && (
        <Image
          src={previewUrl}
          alt={t('preview')}
          width={160}
          height={160}
          unoptimized
          className="h-40 w-40 rounded-full object-cover p-1 ring-2 ring-gray-300 dark:ring-gray-500"
        />
      )}

      <input
        ref={inputRef}
        id={`uploadFile-${id}`}
        type="file"
        accept={acceptedMimeTypes.join(',')}
        className="hidden"
        aria-label={t('selectFileToUpload')}
        onChange={handleFileChange}
      />

      <Button
        className="mt-5"
        variant="secondary"
        onPress={() => inputRef.current?.click()}
      >
        {t('upload')}
      </Button>
    </div>
  );
}
