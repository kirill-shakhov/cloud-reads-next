'use client';

import type { ReactNode } from 'react';
import { Toast } from '@heroui/react';

import { PageLoader } from '@/shared/components/PageLoader/PageLoader';

import { I18nProvider } from '@/i18n/I18nProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      {children}
      <PageLoader />
      <Toast.Provider />
    </I18nProvider>
  );
}
