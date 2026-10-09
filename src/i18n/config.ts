import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Locale resources — imports estàtics (Vite els bundleja) ─────────────
import esCommon         from './locales/es/common.json';
import esHome           from './locales/es/home.json';
import esFuncionalidades from './locales/es/funcionalidades.json';
import esDemos          from './locales/es/demos.json';
import esAlternativas   from './locales/es/alternativas.json';
import esBlog           from './locales/es/blog.json';
import esLegal          from './locales/es/legal.json';
import esSeo            from './locales/es/seo.json';
import esPersonas       from './locales/es/personas.json';
import esComparativa    from './locales/es/comparativa.json';
import esEmbut          from './locales/es/embut.json';

import caCommon         from './locales/ca/common.json';
import caHome           from './locales/ca/home.json';
import caFuncionalidades from './locales/ca/funcionalidades.json';
import caDemos          from './locales/ca/demos.json';
import caAlternativas   from './locales/ca/alternativas.json';
import caBlog           from './locales/ca/blog.json';
import caLegal          from './locales/ca/legal.json';
import caSeo            from './locales/ca/seo.json';
import caPersonas       from './locales/ca/personas.json';
import caComparativa    from './locales/ca/comparativa.json';
import caEmbut          from './locales/ca/embut.json';

export const SUPPORTED_LANGS = ['es', 'ca'] as const;
export type Lang = typeof SUPPORTED_LANGS[number];
export const DEFAULT_LANG: Lang = 'es';

export const NAMESPACES = [
  'common', 'home', 'funcionalidades', 'demos',
  'alternativas', 'blog', 'legal', 'seo', 'personas', 'comparativa', 'embut',
] as const;

export const resources = {
  es: {
    common: esCommon,
    home: esHome,
    funcionalidades: esFuncionalidades,
    demos: esDemos,
    alternativas: esAlternativas,
    blog: esBlog,
    legal: esLegal,
    seo: esSeo,
    personas: esPersonas,
    comparativa: esComparativa,
    embut: esEmbut,
  },
  ca: {
    common: caCommon,
    home: caHome,
    funcionalidades: caFuncionalidades,
    demos: caDemos,
    alternativas: caAlternativas,
    blog: caBlog,
    legal: caLegal,
    seo: caSeo,
    personas: caPersonas,
    comparativa: caComparativa,
    embut: caEmbut,
  },
} as const;

/* ─── Detector personalitzat: prioritza URL (/es/, /ca/) ─── */
const urlPathDetector = {
  name: 'urlPath',
  lookup() {
    if (typeof window === 'undefined') return undefined;
    const seg = window.location.pathname.split('/').filter(Boolean)[0];
    return SUPPORTED_LANGS.includes(seg as Lang) ? (seg as Lang) : undefined;
  },
  cacheUserLanguage() { /* no-op: cachejarem amb localStorage */ },
};

const detector = new LanguageDetector();
detector.addDetector(urlPathDetector);

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANG,
    supportedLngs: SUPPORTED_LANGS as unknown as string[],
    defaultNS: 'common',
    ns: NAMESPACES as unknown as string[],
    interpolation: {
      escapeValue: false, // React ja escapa
    },
    detection: {
      order: ['urlPath', 'localStorage', 'navigator'],
      lookupLocalStorage: 'hostly_lang',
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false, // millor control sobre fallbacks
    },
  });

export default i18n;
