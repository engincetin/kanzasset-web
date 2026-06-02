import { WBRAND, WFONT } from '../lib/index.js';

// ─── AHLG token mark — gold circle + white "A" ────────────────
export function AHLGMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 800 800" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M400 800C620.914 800 800 620.914 800 400C800 179.086 620.914 0 400 0C179.086 0 0 179.086 0 400C0 620.914 179.086 800 400 800Z" fill="#FAC043"/>
      <path d="M194.025 594C185.728 594 179.934 585.78 182.724 577.966L305.908 232.88C311.876 216.161 327.711 205 345.463 205H454.47C472.203 205 488.025 216.137 494.008 232.83L617.698 577.951C620.499 585.769 614.705 594 606.401 594H556.566C551.379 594 546.779 590.667 545.163 585.738L444.139 277.596H354.134L254.158 585.704C252.553 590.65 247.945 594 242.744 594H194.025Z" fill="white"/>
      <path d="M238.706 449.387H464.181C468.153 449.387 471.655 451.99 472.799 455.794L490.31 513.991C491.469 517.842 488.586 521.72 484.565 521.72H214.047L238.706 449.387Z" fill="white"/>
    </svg>
  );
}

// ─── Kanzasset platform mark (PNG) ────────────────────────────
export function WMark({ size = 24 }) {
  const w = Math.round(size * (384 / 304));
  return (
    <img
      src={`${import.meta.env.BASE_URL}assets/kanzasset-mark-transparent.png`}
      alt="Kanzasset"
      width={w}
      height={size}
      style={{ display: 'block', objectFit: 'contain' }}
    />
  );
}

export function WLogotype({ color = WBRAND.ink, mark = 26, type = 18 }) {
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

// ─── Inline flag SVGs ─────────────────────────────────────────
export function FlagUS({ size }) {
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

export function FlagAE({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <rect x="0" y="0" width="6"  height="24" fill="#EF3340"/>
      <rect x="6" y="0" width="18" height="8"  fill="#009A44"/>
      <rect x="6" y="8" width="18" height="8"  fill="#fff"/>
      <rect x="6" y="16" width="18" height="8" fill="#000"/>
    </svg>
  );
}

export function FlagEU({ size }) {
  const star = 'M0,-2.2L0.65,-0.68L2.1,-0.68L0.93,0.26L1.34,1.78L0,0.88L-1.34,1.78L-0.93,0.26L-2.1,-0.68L-0.65,-0.68Z';
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

export function FlagGB({ size }) {
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

// ─── Stablecoin marks ─────────────────────────────────────────
export function CoinUSDT({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
      <circle cx="16" cy="16" r="16" fill="#26A17B"/>
      <path d="M17.9 17.4v-1.9h4.3v-2.9H9.8v2.9h4.3v1.9c-3.5.16-6.1.85-6.1 1.68 0 .83 2.6 1.52 6.1 1.68v6.04h3.8v-6.04c3.5-.16 6.1-.85 6.1-1.68 0-.83-2.6-1.52-6.1-1.68zm0 2.85v-.01c-.09.01-.55.04-1.57.04-.82 0-1.4-.02-1.6-.04v.01c-3.1-.14-5.4-.68-5.4-1.33 0-.65 2.3-1.19 5.4-1.33v2.12c.2.01.79.05 1.61.05.98 0 1.47-.05 1.56-.05v-2.12c3.1.14 5.39.68 5.39 1.33 0 .65-2.29 1.19-5.39 1.33z" fill="#fff"/>
    </svg>
  );
}

export function CoinUSDC({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
      <circle cx="16" cy="16" r="16" fill="#2775CA"/>
      <path d="M20.5 18.5c0-2.4-1.4-3.2-4.3-3.5-2-.3-2.4-.8-2.4-1.7 0-.9.66-1.5 2-1.5 1.2 0 1.86.4 2.18 1.4.06.2.24.33.44.33h1.06c.27 0 .47-.2.47-.47v-.06a3.3 3.3 0 0 0-2.95-2.7V8.86c0-.27-.2-.47-.53-.54h-1c-.27 0-.47.2-.54.54v1.66c-2 .27-3.27 1.6-3.27 3.27 0 2.27 1.4 3.13 4.3 3.46 1.87.33 2.46.73 2.46 1.8 0 1.06-.93 1.8-2.2 1.8-1.73 0-2.33-.74-2.53-1.74-.06-.26-.26-.4-.46-.4h-1.13c-.27 0-.47.2-.47.47v.06c.27 1.66 1.33 2.86 3.53 3.2v1.66c0 .27.2.47.53.54h1c.27 0 .47-.2.54-.54v-1.66c2-.34 3.33-1.74 3.33-3.54z" fill="#fff"/>
      <path d="M12.7 25.3c-5.2-1.87-7.87-7.67-5.93-12.8 1-2.8 3.2-4.94 5.93-5.94.27-.13.4-.33.4-.66v-.93c0-.27-.13-.47-.4-.54-.06 0-.2 0-.26.07a10.5 10.5 0 0 0-6.87 13.27 10.43 10.43 0 0 0 6.87 6.66c.27.14.53 0 .6-.27.06-.06.06-.13.06-.26v-.93c0-.2-.2-.47-.4-.6zm6.6-21.2c-.27-.13-.53 0-.6.27-.06.06-.06.13-.06.27v.93c0 .27.2.53.4.66 5.2 1.87 7.87 7.67 5.93 12.8-1 2.8-3.2 4.94-5.93 5.94-.27.13-.4.33-.4.66v.93c0 .27.13.47.4.54.06 0 .2 0 .26-.07a10.5 10.5 0 0 0 6.87-13.27 10.55 10.55 0 0 0-6.87-6.66z" fill="#fff"/>
    </svg>
  );
}

// ─── Coin dot (financial icon component) ─────────────────────
const COIN_ICONS = {
  USDT: { kind: 'flag', comp: CoinUSDT },
  USDC: { kind: 'flag', comp: CoinUSDC },
  USD:  { kind: 'flag', comp: FlagUS },
  AED:  { kind: 'flag', comp: FlagAE },
  EUR:  { kind: 'flag', comp: FlagEU },
  GBP:  { kind: 'flag', comp: FlagGB },
};

export function WCoinDot({ symbol, size = 32 }) {
  const isAhlg = symbol === 'AHLG';
  const meta = COIN_ICONS[symbol];

  if (isAhlg) {
    return <AHLGMark size={size} />;
  }

  if (meta && meta.kind === 'flag') {
    const Flag = meta.comp;
    return (
      <div style={{
        width: size, height: size, borderRadius: size / 2,
        flexShrink: 0, overflow: 'hidden',
      }}>
        <Flag size={size} />
      </div>
    );
  }

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
