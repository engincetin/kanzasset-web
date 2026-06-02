// ─── Kanzasset Web — shared primitives ────────────────────────
// Brand: minimal white, ink black, single red accent (#D4202B).
// Slightly warmer / more institutional than the mobile bright surface.

const WBRAND = {
  red:     '#D4202B',
  redDeep: '#A8161F',
  redSoft: 'rgba(212,32,43,0.08)',
  ink:     '#0A0A0A',
  ink2:    '#1F1F1F',
  muted:   '#7A7A7E',
  muted2:  '#A8A8AB',
  line:    '#ECECEA',
  line2:   '#E0E0DD',
  surface: '#F7F7F4',   // body bg / panels
  surface2:'#FBFBF9',
  white:   '#FFFFFF',
  positive:'#0F7A47',
  warn:    '#B7791F',
};

const WFONT = `'Manrope', 'Avenir Next', -apple-system, system-ui, sans-serif`;
const WMONO = `'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace`;

// ─── Number formatting ────────────────────────────────────────
function wfmt(n, decimals = 2) {
  if (n === null || n === undefined || isNaN(n)) return '0.00';
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
function wparse(s) {
  if (typeof s === 'number') return s;
  return parseFloat(String(s ?? '').replace(/,/g, '')) || 0;
}

// ─── Account model (mirrors mobile) ───────────────────────────
const WRATES = {
  AHLG: 151.56, USDT: 1, USDC: 1, USD: 1,
  AED: 0.27225, EUR: 1.08, GBP: 1.27,
};
const WBALANCES = {
  AHLG: 2500, USDT: 10000, USDC: 5000,
  AED: 100000, USD: 50000, EUR: 0, GBP: 0,
};
const WMETA = {
  AHLG: { name: 'AHL GOLD',        kind: 'crypto' },
  USDT: { name: 'Tether',          kind: 'crypto' },
  USDC: { name: 'USD Coin',        kind: 'crypto' },
  AED:  { name: 'UAE Dirham',      kind: 'fiat'   },
  USD:  { name: 'US Dollar',       kind: 'fiat'   },
  EUR:  { name: 'Euro',            kind: 'fiat'   },
  GBP:  { name: 'Pound Sterling',  kind: 'fiat'   },
};
function wdecimals(s) { return s === 'AHLG' ? 4 : 2; }
function wTotalUSDT() {
  let s = 0;
  for (const k of Object.keys(WBALANCES)) s += WBALANCES[k] * WRATES[k];
  return s;
}
function wTotalIn(sym) { return wTotalUSDT() / (WRATES[sym] ?? 1); }

// ─── Brand mark ───────────────────────────────────────────────
function WMark({ size = 24 }) {
  const w = Math.round(size * (384/304));
  const src = (typeof window !== 'undefined' && window.__resources && window.__resources.ahlgMark)
    || 'assets/kanzasset-mark-transparent.png';
  return (
    <img
      src={src}
      alt="Kanzasset"
      width={w} height={size}
      style={{ display: 'block', objectFit: 'contain' }}
    />
  );
}

function WLogotype({ color = WBRAND.ink, mark = 26, type = 18 }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      fontFamily: WFONT, fontWeight: 800, fontSize: type,
      letterSpacing: '-0.02em', color,
    }}>
      <WMark size={mark} />
      <span>Kanzasset</span>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────
function WCard({ children, style = {}, padding = 24, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: WBRAND.white, border: `1px solid ${WBRAND.line}`,
      borderRadius: 16, padding, ...style,
    }}>{children}</div>
  );
}

// ─── Buttons ──────────────────────────────────────────────────
function WPrimary({ children, onClick, style = {}, size = 'md', icon }) {
  const h = size === 'lg' ? 52 : size === 'sm' ? 36 : 44;
  const fs = size === 'lg' ? 15 : size === 'sm' ? 13 : 14;
  return (
    <button onClick={onClick} style={{
      height: h, padding: '0 20px', borderRadius: 10,
      background: WBRAND.red, color: '#fff',
      border: 'none', cursor: 'pointer',
      fontFamily: WFONT, fontWeight: 700, fontSize: fs,
      letterSpacing: '-0.005em',
      display: 'inline-flex', alignItems: 'center', gap: 8,
      boxShadow: '0 1px 0 rgba(168,22,31,0.6) inset, 0 1px 2px rgba(168,22,31,0.25)',
      ...style,
    }}>
      {icon}
      {children}
    </button>
  );
}

function WSecondary({ children, onClick, style = {}, size = 'md', icon }) {
  const h = size === 'lg' ? 52 : size === 'sm' ? 32 : 40;
  const fs = size === 'lg' ? 15 : size === 'sm' ? 12 : 13;
  return (
    <button onClick={onClick} style={{
      height: h, padding: '0 16px', borderRadius: 10,
      background: WBRAND.white, color: WBRAND.ink,
      border: `1px solid ${WBRAND.line2}`, cursor: 'pointer',
      fontFamily: WFONT, fontWeight: 600, fontSize: fs,
      letterSpacing: '-0.005em',
      display: 'inline-flex', alignItems: 'center', gap: 8,
      ...style,
    }}>
      {icon}
      {children}
    </button>
  );
}

function WGhost({ children, onClick, style = {}, active = false }) {
  return (
    <button onClick={onClick} style={{
      height: 32, padding: '0 12px', borderRadius: 8,
      background: active ? WBRAND.surface : 'transparent',
      color: active ? WBRAND.ink : WBRAND.muted,
      border: 'none', cursor: 'pointer',
      fontFamily: WFONT, fontWeight: 600, fontSize: 12,
      letterSpacing: '0.01em',
      ...style,
    }}>{children}</button>
  );
}

// ─── Inline flag SVGs (designed to read at 24–40px circular crop) ─
function FlagUS({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <rect width="24" height="24" fill="#fff"/>
      {[1, 5, 9, 13, 17, 21].map(y => <rect key={y} width="24" height="2" y={y} fill="#B22234"/>)}
      <rect width="11" height="13" fill="#3C3B6E"/>
      {[2.5, 5.5, 8.5].flatMap(y => [2, 5, 8].map(x =>
        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.55" fill="#fff"/>
      ))}
    </svg>
  );
}
function FlagAE({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <rect x="0" y="0" width="6"  height="24" fill="#EF3340"/>
      <rect x="6" y="0" width="18" height="8"  fill="#009A44"/>
      <rect x="6" y="8" width="18" height="8"  fill="#fff"/>
      <rect x="6" y="16" width="18" height="8" fill="#000"/>
    </svg>
  );
}
function FlagEU({ size }) {
  // 12 five-point stars in a ring (real EU flag layout)
  const star = "M0,-2.2L0.65,-0.68L2.1,-0.68L0.93,0.26L1.34,1.78L0,0.88L-1.34,1.78L-0.93,0.26L-2.1,-0.68L-0.65,-0.68Z";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <rect width="24" height="24" fill="#003399"/>
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const r = 8;
        const cx = 12 + r * Math.cos(angle);
        const cy = 12 + r * Math.sin(angle);
        return <path key={i} d={star} fill="#FFCC00" transform={`translate(${cx} ${cy})`}/>;
      })}
    </svg>
  );
}
function FlagGB({ size }) {
  // Union Jack — diagonals + cross, layered red over white
  return (
    <svg width={size} height={size} viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <rect width="60" height="30" fill="#012169"/>
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" strokeWidth="6"/>
      <path d="M0 0 L60 30" stroke="#C8102E" strokeWidth="2.5"/>
      <path d="M60 0 L0 30" stroke="#C8102E" strokeWidth="2.5"/>
      <rect x="25" y="0"  width="10" height="30" fill="#fff"/>
      <rect x="0"  y="10" width="60" height="10" fill="#fff"/>
      <rect x="27" y="0"  width="6"  height="30" fill="#C8102E"/>
      <rect x="0"  y="12" width="60" height="6"  fill="#C8102E"/>
    </svg>
  );
}

// Stablecoin marks — inline so the app is fully offline / standalone-safe
function CoinUSDT({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
      <circle cx="16" cy="16" r="16" fill="#26A17B"/>
      <path d="M17.9 17.4v-1.9h4.3v-2.9H9.8v2.9h4.3v1.9c-3.5.16-6.1.85-6.1 1.68 0 .83 2.6 1.52 6.1 1.68v6.04h3.8v-6.04c3.5-.16 6.1-.85 6.1-1.68 0-.83-2.6-1.52-6.1-1.68zm0 2.85v-.01c-.09.01-.55.04-1.57.04-.82 0-1.4-.02-1.6-.04v.01c-3.1-.14-5.4-.68-5.4-1.33 0-.65 2.3-1.19 5.4-1.33v2.12c.2.01.79.05 1.61.05.98 0 1.47-.05 1.56-.05v-2.12c3.1.14 5.39.68 5.39 1.33 0 .65-2.29 1.19-5.39 1.33z" fill="#fff"/>
    </svg>
  );
}
function CoinUSDC({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
      <circle cx="16" cy="16" r="16" fill="#2775CA"/>
      <path d="M20.5 18.5c0-2.4-1.4-3.2-4.3-3.5-2-.3-2.4-.8-2.4-1.7 0-.9.66-1.5 2-1.5 1.2 0 1.86.4 2.18 1.4.06.2.24.33.44.33h1.06c.27 0 .47-.2.47-.47v-.06a3.3 3.3 0 0 0-2.95-2.7V8.86c0-.27-.2-.47-.53-.54h-1c-.27 0-.47.2-.54.54v1.66c-2 .27-3.27 1.6-3.27 3.27 0 2.27 1.4 3.13 4.3 3.46 1.87.33 2.46.73 2.46 1.8 0 1.06-.93 1.8-2.2 1.8-1.73 0-2.33-.74-2.53-1.74-.06-.26-.26-.4-.46-.4h-1.13c-.27 0-.47.2-.47.47v.06c.27 1.66 1.33 2.86 3.53 3.2v1.66c0 .27.2.47.53.54h1c.27 0 .47-.2.54-.54v-1.66c2-.34 3.33-1.74 3.33-3.54z" fill="#fff"/>
      <path d="M12.7 25.3c-5.2-1.87-7.87-7.67-5.93-12.8 1-2.8 3.2-4.94 5.93-5.94.27-.13.4-.33.4-.66v-.93c0-.27-.13-.47-.4-.54-.06 0-.2 0-.26.07a10.5 10.5 0 0 0-6.87 13.27 10.43 10.43 0 0 0 6.87 6.66c.27.14.53 0 .6-.27.06-.06.06-.13.06-.26v-.93c0-.2-.2-.47-.4-.6zm6.6-21.2c-.27-.13-.53 0-.6.27-.06.06-.06.13-.06.27v.93c0 .27.2.53.4.66 5.2 1.87 7.87 7.67 5.93 12.8-1 2.8-3.2 4.94-5.93 5.94-.27.13-.4.33-.4.66v.93c0 .27.13.47.4.54.06 0 .2 0 .26-.07a10.5 10.5 0 0 0 6.87-13.27 10.55 10.55 0 0 0-6.87-6.66z" fill="#fff"/>
    </svg>
  );
}

// ─── Coin dot (compact, financial) ────────────────────────────
// AHLG → in-house mark
// USDT/USDC → inline branded SVG marks
// USD/AED/EUR/GBP → inline SVG flags (clipped to circle)
const COIN_ICONS = {
  USDT: { kind: 'flag', comp: CoinUSDT },
  USDC: { kind: 'flag', comp: CoinUSDC },
  USD:  { kind: 'flag', comp: FlagUS },
  AED:  { kind: 'flag', comp: FlagAE },
  EUR:  { kind: 'flag', comp: FlagEU },
  GBP:  { kind: 'flag', comp: FlagGB },
};

function WCoinDot({ symbol, size = 32 }) {
  const isAhlg = symbol === 'AHLG';
  const meta = COIN_ICONS[symbol];

  // AHL Gold — in-house mark with red ring
  if (isAhlg) {
    return (
      <div style={{
        width: size, height: size, borderRadius: size / 2,
        background: WBRAND.white,
        border: `1.5px solid ${WBRAND.red}`,
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        <WMark size={size * 0.58} />
      </div>
    );
  }

  // Crypto logo (transparent PNG, white bg, no border)
  if (meta && meta.kind === 'img') {
    return (
      <div style={{
        width: size, height: size, borderRadius: size / 2,
        background: WBRAND.white,
        display: 'grid', placeItems: 'center', flexShrink: 0,
        overflow: 'hidden',
      }}>
        <img src={meta.src} alt={symbol}
          width={size} height={size}
          style={{ display: 'block', objectFit: 'contain' }}
        />
      </div>
    );
  }

  // Country flag — inline SVG, clipped to circle via overflow:hidden
  if (meta && meta.kind === 'flag') {
    const Flag = meta.comp;
    return (
      <div style={{
        width: size, height: size, borderRadius: size / 2,
        flexShrink: 0, overflow: 'hidden',
      }}>
        <Flag size={size}/>
      </div>
    );
  }

  // Fallback — text monogram
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      background: WBRAND.surface,
      border: `1px solid ${WBRAND.line}`,
      display: 'grid', placeItems: 'center',
      color: WBRAND.ink,
      fontFamily: WFONT, fontWeight: 700, fontSize: size * 0.31,
      letterSpacing: '-0.01em', flexShrink: 0,
    }}>
      {symbol.slice(0, symbol.length > 3 ? 4 : 3)}
    </div>
  );
}

// ─── Labels & numerics ────────────────────────────────────────
function WEyebrow({ children, style = {} }) {
  return (
    <div style={{
      fontFamily: WFONT, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      color: WBRAND.muted, ...style,
    }}>{children}</div>
  );
}

function WNum({ children, size = 14, weight = 600, color, style = {} }) {
  return (
    <span style={{
      fontFamily: WFONT, fontSize: size, fontWeight: weight,
      color: color ?? WBRAND.ink, fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.01em', ...style,
    }}>{children}</span>
  );
}

function WMonoNum({ children, size = 13, color, style = {} }) {
  return (
    <span style={{
      fontFamily: WMONO, fontSize: size, fontWeight: 500,
      color: color ?? WBRAND.ink, fontVariantNumeric: 'tabular-nums',
      ...style,
    }}>{children}</span>
  );
}

function WPill({ children, tone = 'neutral', style = {} }) {
  const tones = {
    neutral:  { bg: WBRAND.surface, fg: WBRAND.ink },
    positive: { bg: 'rgba(15,122,71,0.10)', fg: WBRAND.positive },
    negative: { bg: WBRAND.redSoft, fg: WBRAND.red },
    warn:     { bg: 'rgba(183,121,31,0.10)', fg: WBRAND.warn },
    accent:   { bg: WBRAND.redSoft, fg: WBRAND.red },
    inkInv:   { bg: WBRAND.ink, fg: '#fff' },
  };
  const t = tones[tone] ?? tones.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: t.bg, color: t.fg,
      borderRadius: 6, padding: '3px 8px',
      fontFamily: WFONT, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.01em', ...style,
    }}>{children}</span>
  );
}

// ─── Section header ───────────────────────────────────────────
function WSectionTitle({ title, sub, trailing, style = {} }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      marginBottom: 14, ...style,
    }}>
      <div>
        <h2 style={{
          margin: 0, fontFamily: WFONT, fontSize: 18, fontWeight: 700,
          color: WBRAND.ink, letterSpacing: '-0.02em',
        }}>{title}</h2>
        {sub && <div style={{
          fontFamily: WFONT, fontSize: 13, color: WBRAND.muted,
          marginTop: 4, letterSpacing: '-0.005em',
        }}>{sub}</div>}
      </div>
      {trailing}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────
const WIcon = {
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

// ─── Price chart (SVG line + area + grid) ─────────────────────
// data = array of { t, v }, height in px, width in px
function WPriceChart({ data, width = 760, height = 260, color = WBRAND.red, showGrid = true, showAxis = true, padding = { top: 16, right: 12, bottom: 28, left: 56 } }) {
  const pad = padding;
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const min = Math.min(...data.map(d => d.v));
  const max = Math.max(...data.map(d => d.v));
  const range = max - min || 1;
  const yMin = min - range * 0.08;
  const yMax = max + range * 0.08;
  const yRange = yMax - yMin;

  const x = i => pad.left + (i / (data.length - 1)) * innerW;
  const y = v => pad.top + (1 - (v - yMin) / yRange) * innerH;

  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.v).toFixed(1)}`).join(' ');
  const area = `${path} L ${x(data.length - 1).toFixed(1)} ${pad.top + innerH} L ${x(0).toFixed(1)} ${pad.top + innerH} Z`;

  // Y axis grid lines (5 ticks)
  const yTicks = [];
  for (let i = 0; i <= 4; i++) {
    const v = yMin + (yRange * (4 - i)) / 4;
    yTicks.push({ v, y: pad.top + (i / 4) * innerH });
  }

  // X axis labels (first, middle, last)
  const xTicks = [];
  if (showAxis) {
    for (const i of [0, Math.floor(data.length / 4), Math.floor(data.length / 2), Math.floor(data.length * 3/4), data.length - 1]) {
      xTicks.push({ x: x(i), t: data[i].t });
    }
  }

  const gradId = 'wpc-grad-' + Math.random().toString(36).slice(2, 8);

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor={color} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {showGrid && yTicks.map((t, i) => (
        <line key={i} x1={pad.left} y1={t.y} x2={pad.left + innerW} y2={t.y}
          stroke={WBRAND.line} strokeWidth="1" strokeDasharray={i === 4 ? '0' : '3 3'} />
      ))}
      {showAxis && yTicks.map((t, i) => (
        <text key={'yt' + i} x={pad.left - 8} y={t.y + 3}
          fontFamily={WMONO} fontSize="10" fill={WBRAND.muted} textAnchor="end">
          {wfmt(t.v, 2)}
        </text>
      ))}
      <path d={area} fill={`url(#${gradId})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* End dot */}
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1].v)} r="4" fill={color} />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1].v)} r="8" fill={color} opacity="0.18" />
      {showAxis && xTicks.map((t, i) => (
        <text key={'xt' + i} x={t.x} y={pad.top + innerH + 18}
          fontFamily={WMONO} fontSize="10" fill={WBRAND.muted} textAnchor="middle">
          {t.t}
        </text>
      ))}
    </svg>
  );
}

// Build a synthetic but plausible AHLG price series — 90 daily points,
// trending upward with some chop.
function wMakePriceData(points = 90, base = 148, drift = 0.05, vol = 0.012) {
  const data = [];
  let v = base;
  const start = new Date(2026, 1, 15); // Feb 15, 2026
  for (let i = 0; i < points; i++) {
    // pseudo-random but deterministic
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    const noise = (seed - Math.floor(seed)) - 0.5;
    v = v * (1 + (drift / points) + noise * vol);
    const d = new Date(start.getTime() + i * 86400000);
    const t = `${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()}`;
    data.push({ t, v });
  }
  // Force last point to be near current rate (151.56)
  const last = data[data.length - 1];
  last.v = 151.56;
  return data;
}

// Tiny sparkline (no axis)
function WSparkline({ data, width = 140, height = 36, color = WBRAND.red }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data.map(d => d.v));
  const max = Math.max(...data.map(d => d.v));
  const r = max - min || 1;
  const x = i => (i / (data.length - 1)) * width;
  const y = v => height - 2 - ((v - min) / r) * (height - 4);
  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.v).toFixed(1)}`).join(' ');
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Time-range tabs ──────────────────────────────────────────
function WRangeTabs({ value, onChange, options = ['1D', '1W', '1M', '3M', '1Y', 'ALL'] }) {
  return (
    <div style={{
      display: 'inline-flex', gap: 2, padding: 3,
      background: WBRAND.surface, borderRadius: 8,
    }}>
      {options.map(o => {
        const on = o === value;
        return (
          <button key={o} onClick={() => onChange(o)} style={{
            height: 26, padding: '0 10px', border: 'none', cursor: 'pointer',
            background: on ? WBRAND.white : 'transparent',
            color: on ? WBRAND.ink : WBRAND.muted,
            fontFamily: WFONT, fontWeight: 600, fontSize: 11,
            letterSpacing: '0.02em',
            borderRadius: 6,
            boxShadow: on ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
          }}>{o}</button>
        );
      })}
    </div>
  );
}

// ─── Demo transaction history (used by Portfolio + Activity) ──
const WTXS = [
  { id: 'tx-9301', ts: '2026-05-12 09:42:11', type: 'Mint',     asset: 'AHLG', amount:  1.2000, paid: '181.87 USDT', status: 'completed' },
  { id: 'tx-9298', ts: '2026-05-11 14:08:03', type: 'Deposit',  asset: 'USDT', amount:  5000.00, paid: '—',           status: 'completed' },
  { id: 'tx-9277', ts: '2026-05-10 18:51:44', type: 'Redeem',   asset: 'AHLG', amount: -0.8000, paid: '121.25 USDT', status: 'completed' },
  { id: 'tx-9251', ts: '2026-05-09 11:30:09', type: 'Withdraw', asset: 'AED',  amount: -12000.00, paid: '—',          status: 'completed' },
  { id: 'tx-9237', ts: '2026-05-08 16:22:50', type: 'Transfer', asset: 'USDT', amount: -250.00,  paid: '@selin',      status: 'completed' },
  { id: 'tx-9218', ts: '2026-05-07 10:05:18', type: 'Mint',     asset: 'AHLG', amount:  3.5000, paid: '530.46 USDT', status: 'completed' },
  { id: 'tx-9201', ts: '2026-05-06 19:47:32', type: 'Deposit',  asset: 'AED',  amount:  80000.00, paid: '—',          status: 'completed' },
  { id: 'tx-9189', ts: '2026-05-05 13:14:01', type: 'Redeem',   asset: 'AHLG', amount: -0.5000, paid: '75.78 USDT',  status: 'pending'   },
  { id: 'tx-9163', ts: '2026-05-04 09:11:25', type: 'Mint',     asset: 'AHLG', amount:  2.0000, paid: '303.12 USDT', status: 'completed' },
  { id: 'tx-9142', ts: '2026-05-03 17:38:12', type: 'Deposit',  asset: 'USDC', amount:  5000.00, paid: '—',           status: 'completed' },
  { id: 'tx-9120', ts: '2026-05-02 12:00:58', type: 'Redeem',   asset: 'AHLG', amount: -1.0000, paid: '151.56 USDT', status: 'completed' },
  { id: 'tx-9098', ts: '2026-05-01 08:24:39', type: 'Mint',     asset: 'AHLG', amount:  0.7500, paid: '113.67 USDT', status: 'completed' },
  { id: 'tx-9077', ts: '2026-04-29 20:51:14', type: 'Transfer', asset: 'AHLG', amount: -0.3000, paid: '@mehmet.k',    status: 'completed' },
  { id: 'tx-9054', ts: '2026-04-28 14:09:47', type: 'Deposit',  asset: 'USDT', amount:  10000.00, paid: '—',          status: 'completed' },
  { id: 'tx-9032', ts: '2026-04-27 11:30:00', type: 'Mint',     asset: 'AHLG', amount:  5.0000, paid: '757.80 USDT', status: 'completed' },
];

// ─── Quote countdown — live 10s loop with pulsing dot ────────
function WQuoteCountdown({ seconds = 10 }) {
  const [n, setN] = React.useState(seconds);
  React.useEffect(() => {
    const t = setInterval(() => setN(x => (x <= 1 ? seconds : x - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);
  // SVG progress ring (12px radius, animated by stroke-dashoffset)
  const r = 5;
  const C = 2 * Math.PI * r;
  const offset = C * (1 - n / seconds);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: WBRAND.redSoft, color: WBRAND.red,
      borderRadius: 6, padding: '3px 10px 3px 6px',
      fontFamily: WMONO, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.02em', fontVariantNumeric: 'tabular-nums',
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14" style={{ display: 'block', transform: 'rotate(-90deg)' }}>
        <circle cx="7" cy="7" r={r} fill="none" stroke={WBRAND.red} strokeWidth="1.5" opacity="0.22"/>
        <circle cx="7" cy="7" r={r} fill="none" stroke={WBRAND.red} strokeWidth="1.5"
          strokeDasharray={C} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset .9s linear' }}/>
      </svg>
      {n}s
    </span>
  );
}

// Expose globally
Object.assign(window, {
  WBRAND, WFONT, WMONO, wfmt, wparse,
  WRATES, WBALANCES, WMETA, wdecimals, wTotalUSDT, wTotalIn,
  WMark, WLogotype, WCard, WPrimary, WSecondary, WGhost,
  WCoinDot, WEyebrow, WNum, WMonoNum, WPill, WSectionTitle,
  WIcon, WPriceChart, WSparkline, WRangeTabs, wMakePriceData, WTXS,
  WQuoteCountdown,
});
