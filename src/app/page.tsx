'use client';

import { AppHeader } from '@/shared/components/AppHeader/AppHeader';

import { ProtectedRoute } from '@/modules/auth/components/ProtectedRoute';
import { BooksCollection } from '@/modules/book/components/BooksCollection';
import { useActiveUserStore } from '@/modules/users/stores/activeUser';

export default function Home() {
  const user = useActiveUserStore((state) => state.user);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <AppHeader user={user} />

        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 lg:px-8">
          <BooksCollection mode="shelf" showLibraryLink />
        </main>
        
      </div>
    </ProtectedRoute>
  );
}
