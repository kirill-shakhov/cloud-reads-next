'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button, toast } from '@heroui/react';

import { bookApi } from '@/services/api/bookApi/bookApi';

import { useTranslations } from '@/shared/hooks/useTranslations';

import type { Book } from '@/modules/book/types';

import { extractErrorMessage } from '@/utils/http/http';
import {
  BOOK_FILE_EXTENSION_TO_MIME_TYPE,
  DEFAULT_FILE_MIME_TYPE,
} from '@/shared/constants/files';
import { APP_ROUTES } from '@/shared/constants/routes';

interface BookDetailsViewProps {
  bookId: string;
}

export function BookDetailsView({ bookId }: BookDetailsViewProps) {
  const router = useRouter();
  const { t, tRaw } = useTranslations();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadBook = async (): Promise<void> => {
      try {
        const response = await bookApi.getBook(bookId);

        if (isMounted) {
          setBook(response);
        }
      } catch (error: unknown) {
        if (isMounted) {
          toast.danger(
            axios.isAxiosError(error)
              ? extractErrorMessage(error)
              : tRaw('errors.common.unknown')
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadBook();

    return () => {
      isMounted = false;
    };
  }, [bookId, tRaw]);

  const downloadBook = async (): Promise<void> => {
    if (!book?.book) {
      toast.danger(tRaw('bookDetails.downloadUnavailable'));

      return;
    }

    try {
      const response = await axios.get<Blob>(book.book, {
        responseType: 'blob',
      });
      const path = new URL(book.book, window.location.origin).pathname;
      const extension = path.slice(path.lastIndexOf('.')).toLowerCase();
      const mimeType =
        BOOK_FILE_EXTENSION_TO_MIME_TYPE[extension] ?? DEFAULT_FILE_MIME_TYPE;
      const fileExtension = mimeType.split('/')[1].split('+')[0];
      const objectUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: mimeType })
      );
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${book.title || 'downloadedBook'}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 0);
    } catch (error: unknown) {
      toast.danger(
        axios.isAxiosError(error)
          ? extractErrorMessage(error)
          : tRaw('errors.common.unknown')
      );
    }
  };

  const deleteBook = async (): Promise<void> => {
    setIsDeleting(true);

    try {
      await bookApi.deleteBook(bookId);
      router.push(APP_ROUTES.BOOKS_LIBRARY);
    } catch (error: unknown) {
      toast.danger(
        axios.isAxiosError(error)
          ? extractErrorMessage(error)
          : tRaw('errors.common.unknown')
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="mx-auto grid min-h-96 w-full max-w-6xl animate-pulse gap-8 md:grid-cols-2"
        role="status"
        aria-label={t('bookDetails.loading')}
      >
        <div className="min-h-80 rounded-xl bg-gray-200 dark:bg-neutral-700" />
        <div className="space-y-5 py-8">
          <div className="h-8 w-2/3 rounded bg-gray-200 dark:bg-neutral-700" />
          <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-neutral-700" />
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto w-full max-w-3xl rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-900">
        <p className="text-gray-700 dark:text-neutral-300">
          {t('bookDetails.notFound')}
        </p>
        <Button
          className="mt-5"
          variant="secondary"
          onPress={() => router.push(APP_ROUTES.BOOKS_LIBRARY)}
        >
          {t('booksLayout.library')}
        </Button>
      </div>
    );
  }

  return (
    <>
      <article className="mx-auto grid w-full max-w-6xl gap-8 py-8 md:grid-cols-2">
        <div className="relative min-h-96 overflow-hidden rounded-xl bg-gray-100 dark:bg-neutral-800">
          {book.image && (
            <Image
              src={book.image}
              alt={book.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
              className="object-contain"
            />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-lg font-medium text-rose-500 dark:text-rose-200">
            {t('bookDetails.new')}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100 md:text-4xl">
            {book.title}
          </h1>
          <p className="mt-6 text-gray-700 dark:text-gray-400">
            {t('bookDetails.genre')}
            {': '}
            {book.genre.name}
          </p>
          <p className="mt-2 text-gray-700 dark:text-gray-400">
            {t('bookDetails.author')}
            {': '}
            {book.author.name}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button onPress={downloadBook}>{t('bookDetails.download')}</Button>
            <Button variant="danger" onPress={() => setIsConfirmOpen(true)}>
              {t('bookDetails.delete')}
            </Button>
            <Button
              className="sm:col-span-2"
              variant="secondary"
              isDisabled={!book.book}
              onPress={() => {
                if (book.book) {
                  window.open(book.book, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              {t('bookDetails.read')}
            </Button>
          </div>
        </div>
      </article>

      {isConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={() => setIsConfirmOpen(false)}
        >
          <section
            aria-labelledby="delete-book-title"
            aria-modal="true"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-800"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="delete-book-title"
              className="text-lg font-semibold text-gray-900 dark:text-neutral-100"
            >
              {t('bookDetails.deleteBookTitle')}
            </h2>
            <p className="mt-3 text-sm text-gray-600 dark:text-neutral-300">
              {t('bookDetails.deleteBookConfirm')}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                isDisabled={isDeleting}
                onPress={() => setIsConfirmOpen(false)}
              >
                {t('bookDetails.cancelButton')}
              </Button>
              <Button
                variant="danger"
                isPending={isDeleting}
                onPress={deleteBook}
              >
                {t('bookDetails.deleteButton')}
              </Button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
