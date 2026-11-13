'use client';

import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { getQueryClient } from '@/services/api/queryClient';

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}
