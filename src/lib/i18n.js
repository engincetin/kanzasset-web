// App-wide language: 'en' | 'tr'
let _lang = 'en';
const _subs = new Set();

export const getLang = () => _lang;
export const setLang = (l) => {
  if ((l !== 'en' && l !== 'tr') || l === _lang) return;
  _lang = l;
  _subs.forEach(fn => { try { fn(); } catch { /* noop */ } });
};
export const subscribeLang = (fn) => { _subs.add(fn); return () => _subs.delete(fn); };

// t('English', 'Türkçe') → returns the string for the active language.
export const t = (en, tr) => (_lang === 'tr' ? (tr ?? en) : en);
