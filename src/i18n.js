import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en/translation.json';
import fr from './locales/fr/translation.json';
import rw from './locales/rw/translation.json';

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
  rw: {
    translation: rw,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'rw', // default language
    fallbackLng: 'rw',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 