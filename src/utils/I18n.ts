import i18n from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import esTranslation from '../locales/es/translation.json';

i18n
    .use(I18nextBrowserLanguageDetector)
    .init({
        fallbackLng: 'en',
        detection: {
            order: ['navigator'],
            caches: [],
        },
        interpolation: {
            escapeValue: false,
        },
        react: {
            wait: true,
        },
        resources: {
            es: {
                translation: esTranslation,
            },
        },
    });

export default i18n;
