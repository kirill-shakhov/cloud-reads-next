import { QueryClient } from '@tanstack/react-query';

let browserQueryClient: QueryClient | undefined;

// Server: fresh client per render so caches never leak between users. Browser: one shared instance.
export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    return new QueryClient();
  }

  browserQueryClient ??= new QueryClient();

  return browserQueryClient;
}
