import { tr } from './translations.js';

// App-wide language: 'en' | 'tr'. Default Turkish; restore the user's last
// saved choice from localStorage if present.
let _lang = 'tr';
try {
  const saved = typeof localStorage !== 'undefined' && localStorage.getItem('kz-lang');
  if (saved === 'en' || saved === 'tr') _lang = saved;
} catch { /* noop */ }

const _subs = new Set();

// Set <html lang> so CSS text-transform uses the correct (Turkish) casing.
const _applyLangAttr = () => { try { if (typeof document !== 'undefined') document.documentElement.lang = _lang; } catch { /* noop */ } };
_applyLangAttr();

export const getLang = () => _lang;
export const setLang = (l) => {
  if ((l !== 'en' && l !== 'tr') || l === _lang) return;
  _lang = l;
  _applyLangAttr();
  try { localStorage.setItem('kz-lang', l); } catch { /* noop */ }
  _subs.forEach(fn => { try { fn(); } catch { /* noop */ } });
};
export const subscribeLang = (fn) => { _subs.add(fn); return () => _subs.delete(fn); };

// t('English text') → Turkish from the dictionary when active, else English.
// Missing keys fall back to the English text, so nothing ever breaks.
export const t = (en) => (_lang === 'tr' ? (tr[en] ?? en) : en);
