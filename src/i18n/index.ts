import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import en from './locales/en.json';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    resources: { en: { translation: en } },
    initAsync: false,
    // en.json keeps the vue-i18n `{name}` syntax.
    interpolation: { prefix: '{', suffix: '}', escapeValue: false },
  });
}

export default i18n;
