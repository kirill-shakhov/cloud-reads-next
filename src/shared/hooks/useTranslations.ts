import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export type TranslateParams = Record<string, unknown>;

// Mirrors the Vue useTranslations helper: `t` is scoped to a key prefix, `tRaw` is not.
export function useTranslations(keyPrefix = '') {
  const { t: rawT } = useTranslation();

  const t = useCallback(
    (key: string, params: TranslateParams = {}): string =>
      rawT(keyPrefix ? `${keyPrefix}.${key}` : key, params),
    [rawT, keyPrefix]
  );

  const tRaw = useCallback(
    (key: string, params: TranslateParams = {}): string => rawT(key, params),
    [rawT]
  );

  return { t, tRaw };
}
