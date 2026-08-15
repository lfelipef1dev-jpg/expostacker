import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const lang = url.pathname.split('/')[1];
  return lang in ui ? (lang as keyof typeof ui) : defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}
