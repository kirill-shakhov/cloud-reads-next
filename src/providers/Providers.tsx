'use client';

import type { ReactNode } from 'react';
import { Toast } from '@heroui/react';

import { I18nProvider } from './I18nProvider';
import { QueryProvider } from './QueryProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <QueryProvider>
        {children}
        <Toast.Provider />
      </QueryProvider>
    </I18nProvider>
  );
}
