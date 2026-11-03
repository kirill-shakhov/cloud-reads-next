'use client';

import { Spinner } from '@heroui/react';

import {
  selectIsPageLoading,
  usePageLoaderStore,
} from '@/shared/stores/pageLoader';

export function PageLoader() {
  const isLoading = usePageLoaderStore(selectIsPageLoading);

  if (!isLoading) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-black/60"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Spinner size="lg" />
    </div>
  );
}
