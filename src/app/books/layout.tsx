'use client';

import type { ReactNode } from 'react';

import { AppHeader } from '@/shared/components/AppHeader/AppHeader';

import { ProtectedRoute } from '@/modules/auth/components/ProtectedRoute';
import { useActiveUserStore } from '@/modules/users/stores/activeUser';

export default function BooksLayout({ children }: { children: ReactNode }) {
  const user = useActiveUserStore((state) => state.user);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-900">
        <AppHeader user={user} />
        <main className="mx-auto flex w-full max-w-7xl flex-1 gap-5 p-6 lg:px-8">
          {children}
        </main>

        <footer className="border-t border-gray-200 px-6 py-4 text-center text-sm text-gray-500 dark:border-neutral-700 dark:text-neutral-400">
          {'CloudReads'}
        </footer>
      </div>
    </ProtectedRoute>
  );
}
