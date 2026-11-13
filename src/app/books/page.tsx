import { redirect } from 'next/navigation';

import { APP_ROUTES } from '@/shared/constants/routes';

export default function BooksPage() {
  redirect(APP_ROUTES.BOOKS_LIBRARY);
}
