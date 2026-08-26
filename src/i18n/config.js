import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import fa from '../locales/fa.json';

const savedLang = localStorage.getItem('waterSurveyLanguage') || 'en';

// تنظیم جهت HTML بلافاصله قبل از رندر
const setDocumentDir = (lang) => {
  const dir = lang === 'fa' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
};

setDocumentDir(savedLang);

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fa: { translation: fa }
    },
    lng: savedLang,
    fallbackLng: 'en',
    supportedLngs: ['en', 'fa'],
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false // جلوگیری از بلک شدن صفحه هنگام بارگیری ترجمه
    }
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('waterSurveyLanguage', lng);
  setDocumentDir(lng);
});

export default i18n;