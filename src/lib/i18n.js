import { tr } from './translations.js';

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

// t('English text') → Turkish from the dictionary when active, else English.
// Missing keys fall back to the English text, so nothing ever breaks.
export const t = (en) => (_lang === 'tr' ? (tr[en] ?? en) : en);
