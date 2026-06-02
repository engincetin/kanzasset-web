// ─── Brand tokens ─────────────────────────────────────────────
export const WBRAND = {
  red:     '#D4202B',
  redDeep: '#A8161F',
  redSoft: 'rgba(212,32,43,0.08)',
  ink:     '#0A0A0A',
  ink2:    '#1F1F1F',
  muted:   '#7A7A7E',
  muted2:  '#A8A8AB',
  line:    '#ECECEA',
  line2:   '#E0E0DD',
  surface: '#F7F7F4',
  surface2:'#FBFBF9',
  white:   '#FFFFFF',
  positive:'#0F7A47',
  warn:    '#B7791F',
};

export const WFONT = `'Manrope', 'Avenir Next', -apple-system, system-ui, sans-serif`;
export const WMONO = `'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace`;

// ─── Number formatting ─────────────────────────────────────────
export function wfmt(n, decimals = 2) {
  if (n === null || n === undefined || isNaN(n)) return '0.00';
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function wparse(s) {
  if (typeof s === 'number') return s;
  return parseFloat(String(s ?? '').replace(/,/g, '')) || 0;
}

// ─── Account model ────────────────────────────────────────────
export const WRATES = {
  AHLG: 151.56, USDT: 1, USDC: 1, USD: 1,
  AED: 0.27225, EUR: 1.08, GBP: 1.27,
};

export const WBALANCES = {
  AHLG: 7500, USDT: 10000, USDC: 5000,
  AED: 100000, USD: 50000, EUR: 0, GBP: 0,
};

export const WMETA = {
  AHLG: { name: 'AHL GOLD',       kind: 'crypto' },
  USDT: { name: 'Tether',         kind: 'crypto' },
  USDC: { name: 'USD Coin',       kind: 'crypto' },
  AED:  { name: 'UAE Dirham',     kind: 'fiat'   },
  USD:  { name: 'US Dollar',      kind: 'fiat'   },
  EUR:  { name: 'Euro',           kind: 'fiat'   },
  GBP:  { name: 'Pound Sterling', kind: 'fiat'   },
};

export function wdecimals(s) { return s === 'AHLG' ? 4 : 2; }

export function wTotalUSDT() {
  let s = 0;
  for (const k of Object.keys(WBALANCES)) s += WBALANCES[k] * WRATES[k];
  return s;
}

export function wTotalIn(sym) { return wTotalUSDT() / (WRATES[sym] ?? 1); }

// ─── Transaction history ──────────────────────────────────────
export const WTXS = [
  { id: 'tx-9301', ts: '2026-05-12 09:42:11', type: 'Mint',     asset: 'AHLG', amount:   1.2000, paid: '181.87 USDT',  status: 'completed' },
  { id: 'tx-9298', ts: '2026-05-11 14:08:03', type: 'Deposit',  asset: 'USDT', amount:   5000.00, paid: '—',            status: 'completed' },
  { id: 'tx-9277', ts: '2026-05-10 18:51:44', type: 'Redeem',   asset: 'AHLG', amount:  -0.8000, paid: '121.25 USDT',  status: 'completed' },
  { id: 'tx-9251', ts: '2026-05-09 11:30:09', type: 'Withdraw', asset: 'AED',  amount: -12000.00, paid: '—',            status: 'completed' },
  { id: 'tx-9237', ts: '2026-05-08 16:22:50', type: 'Transfer', asset: 'USDT', amount:  -250.00, paid: '@selin',        status: 'completed' },
  { id: 'tx-9218', ts: '2026-05-07 10:05:18', type: 'Mint',     asset: 'AHLG', amount:   3.5000, paid: '530.46 USDT',  status: 'completed' },
  { id: 'tx-9201', ts: '2026-05-06 19:47:32', type: 'Deposit',  asset: 'AED',  amount:  80000.00, paid: '—',            status: 'completed' },
  { id: 'tx-9189', ts: '2026-05-05 13:14:01', type: 'Redeem',   asset: 'AHLG', amount:  -0.5000, paid: '75.78 USDT',   status: 'pending'   },
  { id: 'tx-9163', ts: '2026-05-04 09:11:25', type: 'Mint',     asset: 'AHLG', amount:   2.0000, paid: '303.12 USDT',  status: 'completed' },
  { id: 'tx-9142', ts: '2026-05-03 17:38:12', type: 'Deposit',  asset: 'USDC', amount:   5000.00, paid: '—',            status: 'completed' },
  { id: 'tx-9120', ts: '2026-05-02 12:00:58', type: 'Redeem',   asset: 'AHLG', amount:  -1.0000, paid: '151.56 USDT',  status: 'completed' },
  { id: 'tx-9098', ts: '2026-05-01 08:24:39', type: 'Mint',     asset: 'AHLG', amount:   0.7500, paid: '113.67 USDT',  status: 'completed' },
  { id: 'tx-9077', ts: '2026-04-29 20:51:14', type: 'Transfer', asset: 'AHLG', amount:  -0.3000, paid: '@mehmet.k',    status: 'completed' },
  { id: 'tx-9054', ts: '2026-04-28 14:09:47', type: 'Deposit',  asset: 'USDT', amount:  10000.00, paid: '—',            status: 'completed' },
  { id: 'tx-9032', ts: '2026-04-27 11:30:00', type: 'Mint',     asset: 'AHLG', amount:   5.0000, paid: '757.80 USDT',  status: 'completed' },
];

// ─── Price chart data ─────────────────────────────────────────
export function wMakePriceData(points = 90, base = 148, drift = 0.05, vol = 0.012) {
  const data = [];
  let v = base;
  const start = new Date(2026, 1, 15);
  for (let i = 0; i < points; i++) {
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    const noise = (seed - Math.floor(seed)) - 0.5;
    v = v * (1 + (drift / points) + noise * vol);
    const d = new Date(start.getTime() + i * 86400000);
    const t = `${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()}`;
    data.push({ t, v });
  }
  data[data.length - 1].v = 151.56;
  return data;
}
