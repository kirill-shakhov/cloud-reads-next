import $api from '@/services/api/createAxiosInstance';

import type { Book } from '@/modules/book/types';

import type {
  AuthorsResponse,
  BooksResponse,
  GenresResponse,
  UploadBookResponse,
} from './bookApi.types';

class BookApi {
  async getUserBooks(): Promise<BooksResponse> {
    const { data } = await $api.get<BooksResponse>('/books');

    return data;
  }

  async getBook(id: string): Promise<Book> {
    const { data } = await $api.get<Book>(`/books/${encodeURIComponent(id)}`);

    return data;
  }

  async uploadNewBook(request: FormData): Promise<UploadBookResponse> {
    const { data } = await $api.post<UploadBookResponse>(
      '/books/upload',
      request
    );

    return data;
  }

  async deleteBook(id: string): Promise<string> {
    const { data } = await $api.delete<string>(
      `/books/${encodeURIComponent(id)}`
    );

    return data;
  }

  async getGenres(): Promise<GenresResponse> {
    const { data } = await $api.get<GenresResponse>('/books/genres');

    return data;
  }

  async getAuthors(): Promise<AuthorsResponse> {
    const { data } = await $api.get<AuthorsResponse>('/books/authors');

    return data;
  }
}

export const bookApi = new BookApi();
