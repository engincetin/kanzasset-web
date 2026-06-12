// ─── Brand tokens + theming ───────────────────────────────────
// Light / dark palettes. WBRAND is a live object; applyTheme() copies the
// chosen palette into it and notifies subscribers so the whole app re-renders.
import { getLang } from './i18n.js';

const WLIGHT = {
  red:     '#D4202B',
  redDeep: '#A8161F',
  redSoft: 'rgba(212,32,43,0.08)',
  ink:     '#0A0A0A',   // primary text
  ink2:    '#1F1F1F',
  muted:   '#7A7A7E',
  muted2:  '#A8A8AB',
  line:    '#ECECEA',
  line2:   '#E0E0DD',
  surface: '#F7F7F4',   // page background
  surface2:'#FBFBF9',   // subtle fills
  white:   '#FFFFFF',   // card background
  positive:'#0F7A47',
  warn:    '#B7791F',
  panel:   '#26272C',   // dark accent surface (soft charcoal, not pure black)
  selBg:   '#ECECEA',   // selected / active state (light grey)
  onBrand: '#FFFFFF',   // text/icon colour on top of the brand colour
  heroBg:  '#2C2D33',   // holdings hero (charcoal grey in light)
};

const WDARK = {
  red:     '#E5484D',
  redDeep: '#C13B40',
  redSoft: 'rgba(229,72,77,0.16)',
  ink:     '#F3F3F1',
  ink2:    '#DDDDDB',
  muted:   '#9A9AA2',
  muted2:  '#6E6F77',
  line:    '#2A2B30',
  line2:   '#34353B',
  surface: '#0E0F12',
  surface2:'#191A1E',
  white:   '#17181C',
  positive:'#3DD68C',
  warn:    '#E0A042',
  panel:   '#24252C',
  selBg:   '#2A2B31',
  onBrand: '#FFFFFF',
  heroBg:  '#121317',   // holdings hero (deep, distinct from page in dark)
};

export const WBRAND = { ...WLIGHT };

let _theme = 'light';               // stored preference: 'light' | 'dark' | 'system'
const _themeSubs = new Set();
const _resolve = (t) => t === 'system'
  ? (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  : t;

export const getTheme = () => _theme;
export const isDark = () => _resolve(_theme) === 'dark';
let _themeAnimTimer = null;
export const applyTheme = (t) => {
  if (t !== 'light' && t !== 'dark' && t !== 'system') return;
  _theme = t;
  Object.assign(WBRAND, _resolve(t) === 'dark' ? WDARK : WLIGHT);
  _applyBrand();   // re-apply the chosen brand colour over the theme palette
  if (typeof document !== 'undefined') {
    document.body.style.background = WBRAND.surface;
    // Briefly let every element transition its colors so the theme
    // crossfades instead of snapping.
    document.documentElement.classList.add('kz-theme-anim');
    clearTimeout(_themeAnimTimer);
    _themeAnimTimer = setTimeout(() => document.documentElement.classList.remove('kz-theme-anim'), 500);
  }
  try { localStorage.setItem('kz-theme', t); } catch { /* noop */ }
  _themeSubs.forEach(fn => { try { fn(); } catch { /* noop */ } });
};
export const subscribeTheme = (fn) => { _themeSubs.add(fn); return () => _themeSubs.delete(fn); };

// ─── Brand colour (board-demo palette) ────────────────────────
// The whole accent ("red" token family) + logo follow this choice.
export const BRANDS = [
  { id: 'black',     name: 'Siyah',    hex: '#000000', deep: '#1A1A1A', soft: 'rgba(0,0,0,0.07)' },
  { id: 'red',       name: 'Kırmızı',  hex: '#D4202B', deep: '#A8161F', soft: 'rgba(212,32,43,0.08)' },
  { id: 'orange',    name: 'Turuncu',  hex: '#FF5E25', deep: '#D8430F', soft: 'rgba(255,94,37,0.10)' },
  { id: 'turquoise', name: 'Turkuaz',  hex: '#00AFCB', deep: '#0089A0', soft: 'rgba(0,175,203,0.12)' },
  { id: 'purple',    name: 'Mor',      hex: '#5B2EFF', deep: '#4A1FD6', soft: 'rgba(91,46,255,0.10)' },
  { id: 'blue',      name: 'Mavi',     hex: '#0000D5', deep: '#0000A8', soft: 'rgba(0,0,213,0.10)' },
];

let _brand = 'red';
try { const b = localStorage.getItem('kz-brand'); if (b && BRANDS.some(x => x.id === b)) _brand = b; } catch { /* noop */ }

const _isLightHex = (hex) => {
  if (typeof hex !== 'string' || hex[0] !== '#' || hex.length < 7) return false;
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) > 175;
};

const _applyBrand = () => {
  const p = BRANDS.find(x => x.id === _brand) || BRANDS[1];
  // The black brand is invisible on dark surfaces — flip the accent to
  // white in dark mode so charts, buttons and links stay visible.
  if (p.id === 'black' && _resolve(_theme) === 'dark') {
    WBRAND.red = '#FFFFFF';
    WBRAND.redDeep = '#E2E2E2';
    WBRAND.redSoft = 'rgba(255,255,255,0.12)';
  } else {
    WBRAND.red = p.hex;
    WBRAND.redDeep = p.deep;
    WBRAND.redSoft = p.soft;
  }
  // Text/icon colour that sits on top of the brand colour.
  WBRAND.onBrand = _isLightHex(WBRAND.red) ? '#0A0A0A' : '#FFFFFF';
};

export const getBrand = () => _brand;
export const setBrand = (id) => {
  if (!BRANDS.some(x => x.id === id) || id === _brand) return;
  _brand = id;
  _applyBrand();
  try { localStorage.setItem('kz-brand', id); } catch { /* noop */ }
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('kz-theme-anim');
    clearTimeout(_themeAnimTimer);
    _themeAnimTimer = setTimeout(() => document.documentElement.classList.remove('kz-theme-anim'), 500);
  }
  _themeSubs.forEach(fn => { try { fn(); } catch { /* noop */ } });
};

// ─── Logo variant (board-demo) ────────────────────────────────
export const LOGOS = [
  { id: 'classic', name: 'Klasik' },
  { id: 'sharp',   name: 'Keskin' },
];
let _logo = 'classic';
try { const l = localStorage.getItem('kz-logo'); if (l && LOGOS.some(x => x.id === l)) _logo = l; } catch { /* noop */ }
export const getLogo = () => _logo;
export const setLogo = (id) => {
  if (!LOGOS.some(x => x.id === id) || id === _logo) return;
  _logo = id;
  try { localStorage.setItem('kz-logo', id); } catch { /* noop */ }
  _themeSubs.forEach(fn => { try { fn(); } catch { /* noop */ } });
};

// Restore saved preference on load
if (typeof window !== 'undefined') {
  let saved = 'light';
  try { saved = localStorage.getItem('kz-theme') || 'light'; } catch { /* noop */ }
  applyTheme(saved);
}

export const WFONT = `'Manrope', 'Avenir Next', -apple-system, system-ui, sans-serif`;
export const WMONO = `'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace`;

// ─── Number formatting ─────────────────────────────────────────
// App-wide number style: 'us' → 1,234.56  ·  'eu' → 1.234,56
let _numStyle = 'us';
const _numSubs = new Set();
export const getNumberStyle = () => _numStyle;
export const setNumberStyle = (s) => {
  if ((s !== 'us' && s !== 'eu') || s === _numStyle) return;
  _numStyle = s;
  _numSubs.forEach(fn => { try { fn(); } catch { /* noop */ } });
};
export const subscribeNumberStyle = (fn) => { _numSubs.add(fn); return () => _numSubs.delete(fn); };
const _seps = () => _numStyle === 'eu' ? { th: '.', dec: ',' } : { th: ',', dec: '.' };

export function wfmt(n, decimals = 2) {
  const locale = _numStyle === 'eu' ? 'de-DE' : 'en-US';
  const v = (n === null || n === undefined || isNaN(n)) ? 0 : Number(n);
  return v.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function wparse(s) {
  if (typeof s === 'number') return s;
  let str = String(s ?? '').trim();
  const { th, dec } = _seps();
  str = str.split(th).join('');           // drop thousand separators
  if (dec !== '.') str = str.split(dec).join('.'); // normalise decimal mark
  return parseFloat(str) || 0;
}

// Group a plain numeric value (JS '.'-decimal) into the current display style.
export function wgroup(value) {
  const { th, dec } = _seps();
  let s = String(value ?? '');
  if (s === '') return '';
  const neg = s.startsWith('-');
  if (neg) s = s.slice(1);
  let [int, frac] = s.split('.');
  int = (int || '0').replace(/\B(?=(\d{3})+(?!\d))/g, th);
  return (neg ? '-' : '') + int + (frac !== undefined ? dec + frac : '');
}

// Re-group a string the user is typing (already in the current display style).
export function wregroup(typed) {
  const { th, dec } = _seps();
  let s = String(typed ?? '');
  if (s === '') return '';
  s = s.split(th).join('');
  let out = '', seenDec = false;
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') out += ch;
    else if (ch === dec && !seenDec) { out += dec; seenDec = true; }
  }
  if (out === '') return '';
  let [int, frac] = out.split(dec);
  int = (int || '').replace(/^0+(?=\d)/, '');
  if (int === '') int = '0';
  int = int.replace(/\B(?=(\d{3})+(?!\d))/g, th);
  return seenDec ? `${int}${dec}${frac}` : int;
}

// ─── Account model ────────────────────────────────────────────
export const WRATES = {
  AGOLD: 135.82, USDT: 1, USDC: 1, USD: 1,
  AED: 0.27225, EUR: 1.08, GBP: 1.27,
};

export const WBALANCES = {
  AGOLD: 7500, USDT: 10000, USDC: 5000,
  AED: 100000, USD: 50000, EUR: 0, GBP: 0,
};

export const WMETA = {
  AGOLD: { name: 'AGOLD',       kind: 'crypto' },
  USDT: { name: 'Tether',         kind: 'crypto' },
  USDC: { name: 'USD Coin',       kind: 'crypto' },
  AED:  { name: 'UAE Dirham',     kind: 'fiat'   },
  USD:  { name: 'US Dollar',      kind: 'fiat'   },
  EUR:  { name: 'Euro',           kind: 'fiat'   },
  GBP:  { name: 'Pound Sterling', kind: 'fiat'   },
};

export function wdecimals(s) { return s === 'AGOLD' ? 4 : 2; }

export function wTotalUSDT() {
  let s = 0;
  for (const k of Object.keys(WBALANCES)) s += WBALANCES[k] * WRATES[k];
  return s;
}

export function wTotalIn(sym) { return wTotalUSDT() / (WRATES[sym] ?? 1); }

// ─── Transaction history ──────────────────────────────────────
export const WTXS = [
  { id: 'tx-9312', ts: '2026-05-13 10:15:00', type: 'Delivery', asset: 'AGOLD', amount: -1000.0000, paid: "Brink's · Dubai",    status: 'pending'   },
  { id: 'tx-9301', ts: '2026-05-12 09:42:11', type: 'Mint',     asset: 'AGOLD', amount:   1.2000, paid: '162.98 USDT',  status: 'completed' },
  { id: 'tx-9298', ts: '2026-05-11 14:08:03', type: 'Deposit',  asset: 'USDT', amount:   5000.00, paid: '—',            status: 'completed' },
  { id: 'tx-9277', ts: '2026-05-10 18:51:44', type: 'Redeem',   asset: 'AGOLD', amount:  -0.8000, paid: '108.66 USDT',  status: 'completed' },
  { id: 'tx-9251', ts: '2026-05-09 11:30:09', type: 'Withdraw', asset: 'AED',  amount: -12000.00, paid: '—',            status: 'completed' },
  { id: 'tx-9218', ts: '2026-05-07 10:05:18', type: 'Mint',     asset: 'AGOLD', amount:   3.5000, paid: '475.37 USDT',  status: 'completed' },
  { id: 'tx-9201', ts: '2026-05-06 19:47:32', type: 'Deposit',  asset: 'AED',  amount:  80000.00, paid: '—',            status: 'completed' },
  { id: 'tx-9189', ts: '2026-05-05 13:14:01', type: 'Redeem',   asset: 'AGOLD', amount:  -0.5000, paid: '67.91 USDT',   status: 'pending'   },
  { id: 'tx-9165', ts: '2026-05-04 15:20:00', type: 'Delivery', asset: 'AGOLD', amount: -2000.0000, paid: "Brink's · Istanbul", status: 'completed' },
  { id: 'tx-9131', ts: '2026-05-03 09:40:00', type: 'Delivery', asset: 'AGOLD', amount: -1000.0000, paid: "Brink's · Dubai",    status: 'completed' },
  { id: 'tx-9070', ts: '2026-04-29 16:05:00', type: 'Delivery', asset: 'AGOLD', amount: -3000.0000, paid: "Brink's · Dubai",    status: 'completed' },
  { id: 'tx-9163', ts: '2026-05-04 09:11:25', type: 'Mint',     asset: 'AGOLD', amount:   2.0000, paid: '271.64 USDT',  status: 'completed' },
  { id: 'tx-9142', ts: '2026-05-03 17:38:12', type: 'Deposit',  asset: 'USDC', amount:   5000.00, paid: '—',            status: 'completed' },
  { id: 'tx-9120', ts: '2026-05-02 12:00:58', type: 'Redeem',   asset: 'AGOLD', amount:  -1.0000, paid: '135.82 USDT',  status: 'completed' },
  { id: 'tx-9098', ts: '2026-05-01 08:24:39', type: 'Mint',     asset: 'AGOLD', amount:   0.7500, paid: '101.87 USDT',  status: 'completed' },
  { id: 'tx-9054', ts: '2026-04-28 14:09:47', type: 'Deposit',  asset: 'USDT', amount:  10000.00, paid: '—',            status: 'completed' },
  { id: 'tx-9032', ts: '2026-04-27 11:30:00', type: 'Mint',     asset: 'AGOLD', amount:   5.0000, paid: '679.10 USDT',  status: 'completed' },
];

// ─── Price chart data ─────────────────────────────────────────
const WMONTHS_TR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const wMonthLabel = (d) => getLang() === 'tr'
  ? WMONTHS_TR[d.getMonth()]
  : d.toLocaleString('en-US', { month: 'short' });

export function wMakePriceData(points = 90, base = 133, drift = 0.05, vol = 0.012) {
  const data = [];
  let v = base;
  const start = new Date(2026, 2, 19); // 90 daily points → last point lands on Jun 16, 2026
  for (let i = 0; i < points; i++) {
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    const noise = (seed - Math.floor(seed)) - 0.5;
    v = v * (1 + (drift / points) + noise * vol);
    const d = new Date(start.getTime() + i * 86400000);
    const t = `${wMonthLabel(d)} ${d.getDate()}`;
    data.push({ t, v });
  }
  data[data.length - 1].v = 135.82;
  return data;
}
