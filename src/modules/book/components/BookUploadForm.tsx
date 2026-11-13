'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from '@heroui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { mixed, object, string } from 'yup';

import { bookApi } from '@/services/api/bookApi/bookApi';

import { FormTextField } from '@/shared/components/FormTextField/FormTextField';
import { LoadingButton } from '@/shared/components/LoadingButton/LoadingButton';
import { useTranslations } from '@/shared/hooks/useTranslations';

import { BookFileInput } from '@/modules/book/components/BookFileInput';
import type { UploadBookData } from '@/modules/book/types';

import { extractErrorMessage } from '@/utils/http/http';
import {
  BOOK_DOCUMENT_MIME_TYPES,
  IMAGE_MIME_TYPES,
} from '@/shared/constants/files';
import { collectFormData } from '@/shared/utils/collectFormData/collectFormData';

const defaultValues: UploadBookData = {
  title: '',
  genreName: '',
  authorName: '',
  image: null,
  book: null,
};

interface Suggestion {
  name: string;
}

export function BookUploadForm() {
  const { t, tRaw } = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState<Suggestion[]>([]);
  const [authors, setAuthors] = useState<Suggestion[]>([]);

  const schema = useMemo(
    () =>
      object({
        title: string().required(tRaw('validation.titleRequired')),
        genreName: string().required(tRaw('validation.genreNameRequired')),
        authorName: string().required(tRaw('validation.authorNameRequired')),
        image: mixed<File>().nullable().defined(),
        book: mixed<File>().nullable().defined(),
      }),
    [tRaw]
  );

  const { control, handleSubmit, setValue } = useForm<UploadBookData>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    let isMounted = true;

    const loadSuggestions = async (): Promise<void> => {
      const [genresResult, authorsResult] = await Promise.allSettled([
        bookApi.getGenres(),
        bookApi.getAuthors(),
      ]);

      if (!isMounted) {
        return;
      }

      if (genresResult.status === 'fulfilled') {
        setGenres(genresResult.value.genres);
      } else {
        toast.danger(
          axios.isAxiosError(genresResult.reason)
            ? extractErrorMessage(genresResult.reason)
            : tRaw('errors.common.unknown')
        );
      }

      if (authorsResult.status === 'fulfilled') {
        setAuthors(authorsResult.value.authors);
      } else {
        toast.danger(
          axios.isAxiosError(authorsResult.reason)
            ? extractErrorMessage(authorsResult.reason)
            : tRaw('errors.common.unknown')
        );
      }
    };

    void loadSuggestions();

    return () => {
      isMounted = false;
    };
  }, [tRaw]);

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);

    try {
      const response = await bookApi.uploadNewBook(
        collectFormData({
          title: data.title,
          genreName: data.genreName,
          authorName: data.authorName,
          image: data.image,
          book: data.book,
        })
      );

      toast.success(response.message);
    } catch (error: unknown) {
      toast.danger(
        axios.isAxiosError(error)
          ? extractErrorMessage(error)
          : tRaw('errors.common.unknown')
      );
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form className="mx-auto w-full max-w-3xl" noValidate onSubmit={onSubmit}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">
          {t('bookUpload.uploadNewBook')}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          {t('bookUpload.uploadNewBookDescription')}
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        <div className="border-b border-gray-100 px-6 py-4 dark:border-neutral-700">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
            {t('bookUpload.sectionDetails')}
          </h2>
        </div>
        <div className="flex flex-col gap-6 px-6 py-6">
          <FormTextField
            control={control}
            name="title"
            label={t('bookUpload.title')}
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <FormTextField
                control={control}
                name="genreName"
                label={t('bookUpload.genre')}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre.name}
                    type="button"
                    className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-400/20"
                    onClick={() => setValue('genreName', genre.name)}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <FormTextField
                control={control}
                name="authorName"
                label={t('bookUpload.author')}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {authors.map((author) => (
                  <button
                    key={author.name}
                    type="button"
                    className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-400/20"
                    onClick={() => setValue('authorName', author.name)}
                  >
                    {author.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        <div className="border-b border-gray-100 px-6 py-4 dark:border-neutral-700">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
            {t('bookUpload.sectionFiles')}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 px-6 py-6 sm:grid-cols-2">
          <div className="flex flex-col items-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 dark:border-neutral-600 dark:bg-neutral-700/50">
            <p className="mb-3 text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t('bookUpload.photo')}
            </p>
            <BookFileInput
              id="cover"
              accept={IMAGE_MIME_TYPES}
              imagePreview
              onChange={(file) =>
                setValue('image', file, { shouldValidate: true })
              }
            />
          </div>
          <div className="flex flex-col items-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 dark:border-neutral-600 dark:bg-neutral-700/50">
            <p className="mb-3 text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t('bookUpload.book')}
            </p>
            <BookFileInput
              id="book"
              accept={BOOK_DOCUMENT_MIME_TYPES}
              onChange={(file) =>
                setValue('book', file, { shouldValidate: true })
              }
            />
          </div>
        </div>
      </section>

      <div className="mt-6 flex justify-end">
        <LoadingButton type="submit" isPending={isLoading}>
          {t('bookUpload.save')}
        </LoadingButton>
      </div>
    </form>
  );
}
