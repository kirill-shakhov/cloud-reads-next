import { BookDetailsView } from '@/modules/book/components/BookDetailsView';

interface BookPageProps {
  params: Promise<{ bookId: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { bookId } = await params;

  return <BookDetailsView bookId={bookId} />;
}
