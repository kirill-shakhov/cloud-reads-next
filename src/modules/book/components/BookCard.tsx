import Image from 'next/image';
import Link from 'next/link';

import type { Book } from '@/modules/book/types';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link
      href={`/books/${encodeURIComponent(book._id)}`}
      className="group flex w-full max-w-[18rem] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
    >
      <div className="relative mx-4 mt-4 h-72 overflow-hidden rounded-xl bg-gray-200 dark:bg-neutral-700">
        {book.image ? (
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 100vw, 288px"
            unoptimized
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-neutral-300"
            aria-label={book.title}
          >
            {book.title}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="line-clamp-2 text-xl font-medium text-gray-900 dark:text-white">
          {book.title}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
          {book.author.name}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
          {book.genre.name}
        </p>
      </div>
    </Link>
  );
}
