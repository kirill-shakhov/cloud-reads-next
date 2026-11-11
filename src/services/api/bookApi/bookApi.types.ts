import type { Book } from '@/modules/book/types';

export interface BooksResponse {
  books: Book[];
}

export interface UploadBookResponse {
  message: string;
  book: {
    title: string;
    image: string;
    book: string;
    genre: string;
    author: string;
    user: string;
    _id: string;
    __v: number;
  };
}

export interface GenresResponse {
  genres: Array<{ name: string }>;
}

export interface AuthorsResponse {
  authors: Array<{ name: string }>;
}
