import { WBRAND } from '../lib/index.js';

export const WIcon = {
  arrowDown:  (c = WBRAND.ink) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  arrowUp:    (c = WBRAND.ink) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 15l6-6 6 6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  arrowRight: (c = WBRAND.muted) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus:       (c = WBRAND.ink) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  download:   (c = WBRAND.ink) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  upload:     (c = WBRAND.ink) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 20V8m0 0l-4 4m4-4l4 4M4 4h16" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  swap:       (c = WBRAND.ink) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 8h13l-3-3m3 3l-3 3M17 16H4l3 3m-3-3l3-3" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  bell:       (c = WBRAND.ink) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9z" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/><path d="M10 21a2 2 0 0 0 4 0" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></svg>,
  search:     (c = WBRAND.muted) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={c} strokeWidth="1.7"/><path d="M20 20l-3.5-3.5" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></svg>,
  filter:     (c = WBRAND.ink) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M7 12h10M10 18h4" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  external:   (c = WBRAND.muted) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 5h10v10M19 5L9 15M5 9v10h10" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check:      (c = '#fff') => <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  copy:       (c = WBRAND.ink) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2" stroke={c} strokeWidth="1.7"/><path d="M5 15V6a2 2 0 012-2h9" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  share:      (c = WBRAND.ink) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 12v6a2 2 0 002 2h10a2 2 0 002-2v-6" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  shield:     (c = WBRAND.ink) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/></svg>,
  vault:      (c = WBRAND.ink) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke={c} strokeWidth="1.7"/><circle cx="15" cy="12" r="3" stroke={c} strokeWidth="1.7"/><path d="M15 8v1M15 15v1M19 12h1M11 12h1" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></svg>,
  dots:       (c = WBRAND.muted) => <svg width="14" height="14" viewBox="0 0 24 24" fill={c}><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>,
};
