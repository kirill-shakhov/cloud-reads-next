'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { bookApi } from '@/services/api/bookApi/bookApi';

import { useTranslations } from '@/shared/hooks/useTranslations';

import { BookCard } from '@/modules/book/components/BookCard';
import type { Book } from '@/modules/book/types';

import { extractErrorMessage } from '@/utils/http/http';
import { APP_ROUTES } from '@/shared/constants/routes';

interface BooksCollectionProps {
  mode?: 'grid' | 'shelf';
  showLibraryLink?: boolean;
}

export function BooksCollection({
  mode = 'grid',
  showLibraryLink = false,
}: BooksCollectionProps) {
  const { t, tRaw } = useTranslations();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchBooks = async (): Promise<void> => {
      try {
        const response = await bookApi.getUserBooks();

        if (isMounted) {
          setBooks(response.books);
        }
      } catch (error: unknown) {
        if (isMounted) {
          setErrorMessage(
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

    void fetchBooks();

    return () => {
      isMounted = false;
    };
  }, [tRaw]);

  const isShelf = mode === 'shelf';

  return (
    <section className="w-full">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">
          {isShelf ? t('home.title') : t('booksLayout.library')}
        </h1>
        {showLibraryLink && (
          <Link
            href={APP_ROUTES.BOOKS_LIBRARY}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            {t('home.viewLibrary')}
          </Link>
        )}
      </div>

      {isLoading ? (
        <div
          className={
            isShelf
              ? 'flex gap-4 overflow-hidden'
              : 'flex flex-wrap justify-center gap-4 md:justify-start'
          }
          role="status"
          aria-label={t('home.loadingBooks')}
        >
          {Array.from({ length: isShelf ? 3 : 6 }, (_, index) => (
            <div
              key={index}
              className="h-[26rem] w-full max-w-[18rem] shrink-0 animate-pulse rounded-xl bg-gray-200 dark:bg-neutral-700"
            />
          ))}
        </div>
      ) : errorMessage ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : books.length === 0 ? (
        <p className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
          {t('dashboardSection.noData')}
        </p>
      ) : (
        <div
          className={
            isShelf
              ? 'flex gap-4 overflow-x-auto pb-5'
              : 'flex flex-wrap justify-center gap-4 md:justify-start'
          }
        >
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
}
