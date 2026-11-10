import { APP_ROUTES } from '@/shared/constants/routes';

type QueryParams = Record<string, string | number | boolean>;

export const buildUrl = (
  page: (typeof APP_ROUTES)[keyof typeof APP_ROUTES],
  queryParams?: QueryParams
): string => {
  if (!queryParams || Object.keys(queryParams).length === 0) {
    return page;
  }

  const searchParams = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    searchParams.set(key, String(value));
  });

  return `${page}?${searchParams.toString()}`;
};
