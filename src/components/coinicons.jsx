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
    <svg width={size} height={size} viewBox="0 0 800 800" style={{ display: 'block' }}>
      <circle cx="400" cy="400" r="400" fill="#009393"/>
      <path fillRule="evenodd" fill="#fff" d="M400.49,428.59c68.79,0,126.28-11.63,140.33-27.17-11.93-13.18-55.08-23.56-109.88-26.4v32.83c-9.81.51-20.01.76-30.46.76s-20.65-.25-30.48-.76v-32.83c-54.78,2.84-97.95,13.22-109.88,26.4,14.07,15.54,71.57,27.17,140.36,27.17ZM522.71,274.06v45.21h-91.77v31.35c64.46,3.35,112.83,17.13,113.19,33.62v34.38c-.36,16.49-48.73,30.24-113.19,33.6v76.94h-60.93v-76.94c-64.46-3.35-112.81-17.11-113.17-33.6v-34.38c.36-16.49,48.71-30.27,113.17-33.62v-31.35h-91.77v-45.21h244.48ZM242.15,202.11h322.16c7.7,0,14.79,4.05,18.63,10.63l93.85,161.16c4.86,8.36,3.42,18.91-3.52,25.68l-258.34,252.18c-8.38,8.17-21.84,8.17-30.2,0L126.71,399.92c-7.09-6.94-8.43-17.79-3.2-26.19l100.33-161.49c3.91-6.28,10.85-10.12,18.32-10.12Z"/>
    </svg>
  );
}

export function CoinUSDC({ size }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}assets/usdc.png`}
      alt="USDC"
      width={size}
      height={size}
      style={{ display: 'block', borderRadius: size / 2 }}
    />
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

  let inner;
  if (isAhlg) {
    inner = <AHLGMark size={size} />;
  } else if (meta && meta.kind === 'flag') {
    const Flag = meta.comp;
    inner = (
      <div style={{
        width: size, height: size, borderRadius: size / 2,
        flexShrink: 0, overflow: 'hidden',
      }}>
        <Flag size={size} />
      </div>
    );
  } else {
    inner = (
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

  return <span className="kz-coin" style={{ flexShrink: 0 }}>{inner}</span>;
}
