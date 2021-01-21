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

const lang = localStorage.getItem('translation-lastLang');
if (lang) {
    i18n.changeLanguage(lang);
}

export const changeLanguage = (lang : string) : void => {
    localStorage.setItem('translation-lastLang', lang);
    i18n.changeLanguage(lang);
}

export default i18n;
