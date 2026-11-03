import type { ReactNode } from 'react';

import { Logo } from '@/shared/components/Logo/Logo';

interface AuthPageLayoutProps {
  title: string;
  children: ReactNode;
  header?: ReactNode;
}

export function AuthPageLayout({
  title,
  children,
  header,
}: AuthPageLayoutProps) {
  return (
    <main className="flex min-h-full flex-1 flex-col px-6 py-12 lg:px-8">
      <section className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Logo className="mx-auto h-auto w-[70px]" />

        <h1 className="mt-10 text-center text-2xl leading-9 font-bold tracking-tight text-gray-900 dark:text-neutral-100">
          {title}
        </h1>

        {header}
      </section>

      <section className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {children}
      </section>
    </main>
  );
}
