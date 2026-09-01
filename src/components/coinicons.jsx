import { WBRAND, WFONT, isDark, getBrand, getLogo } from '../lib/index.js';

// ─── AGOLD token mark — gold circle + white "A" ────────────────
export function AGOLDMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 800 800" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M400 800C620.914 800 800 620.914 800 400C800 179.086 620.914 0 400 0C179.086 0 0 179.086 0 400C0 620.914 179.086 800 400 800Z" fill="#FAC043"/>
      <path d="M194.025 594C185.728 594 179.934 585.78 182.724 577.966L305.908 232.88C311.876 216.161 327.711 205 345.463 205H454.47C472.203 205 488.025 216.137 494.008 232.83L617.698 577.951C620.499 585.769 614.705 594 606.401 594H556.566C551.379 594 546.779 590.667 545.163 585.738L444.139 277.596H354.134L254.158 585.704C252.553 590.65 247.945 594 242.744 594H194.025Z" fill="white"/>
      <path d="M238.706 449.387H464.181C468.153 449.387 471.655 451.99 472.799 455.794L490.31 513.991C491.469 517.842 488.586 521.72 484.565 521.72H214.047L238.706 449.387Z" fill="white"/>
    </svg>
  );
}

// ─── Kanzasset platform mark ──────────────────────────────────
// The PNG is used as a CSS mask so the mark takes the brand colour
// (or any passed colour) and recolours live when the brand changes.
export function WMark({ size = 24, color, variant }) {
  const v = variant || getLogo();
  // Default: the brand colour. Only the black brand flips to white in
  // dark mode (where black would be invisible); other colours stay as-is.
  const fill = color || ((isDark() && getBrand() === 'black') ? '#FFFFFF' : WBRAND.red);

  // Both variants are recolourable PNG masks (same 384×304 footprint).
  // ?v cache-buster forces browsers/CDN to refetch when the file is replaced.
  const w = Math.round(size * (384 / 304));
  const file = v === 'sharp' ? 'kanzasset-mark-transparent-2.png' : 'kanzasset-mark-transparent.png';
  const url = `${import.meta.env.BASE_URL}assets/${file}?v=3`;
  return (
    <span
      role="img"
      aria-label="Kanzasset"
      style={{
        display: 'inline-block', width: w, height: size, flexShrink: 0,
        background: fill,
        WebkitMaskImage: `url(${url})`, maskImage: `url(${url})`,
        WebkitMaskSize: 'contain', maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center', maskPosition: 'center',
      }}
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

// ─── Crypto coin marks ────────────────────────────────────────
export function CoinBTC({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
      <circle cx="16" cy="16" r="16" fill="#F7931A"/>
      <path fill="#fff" d="M23.19 14.02c.31-2.1-1.28-3.22-3.47-3.98l.71-2.84-1.73-.43-.69 2.76c-.45-.11-.92-.22-1.38-.32l.69-2.78-1.73-.43-.71 2.84c-.38-.09-.75-.17-1.1-.26v-.01l-2.39-.6-.46 1.85s1.28.29 1.26.31c.7.17.83.64.8 1.01l-.8 3.23c.05.01.11.03.18.06l-.18-.05-1.13 4.53c-.09.21-.3.53-.79.41.02.03-1.26-.31-1.26-.31l-.86 1.98 2.25.56c.42.11.83.22 1.23.32l-.72 2.87 1.73.43.71-2.84c.47.13.93.24 1.38.36l-.71 2.83 1.73.43.72-2.87c2.95.56 5.16.33 6.1-2.33.75-2.15-.04-3.39-1.59-4.19 1.13-.26 1.98-1 2.21-2.54zm-3.95 5.54c-.53 2.15-4.15.99-5.32.7l.95-3.81c1.17.29 4.93.87 4.37 3.11zm.54-5.57c-.49 1.95-3.5.96-4.47.72l.86-3.45c.98.24 4.12.7 3.61 2.73z"/>
    </svg>
  );
}

export function CoinETH({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
      <circle cx="16" cy="16" r="16" fill="#627EEA"/>
      <g fill="#fff">
        <path fillOpacity=".6" d="M16.5 4v8.87l7.5 3.35z"/>
        <path d="M16.5 4L9 16.22l7.5-3.35z"/>
        <path fillOpacity=".6" d="M16.5 21.97v6.03L24 17.62z"/>
        <path d="M16.5 28v-6.03L9 17.62z"/>
        <path fillOpacity=".2" d="M16.5 20.57l7.5-4.35-7.5-3.35z"/>
        <path fillOpacity=".6" d="M9 16.22l7.5 4.35v-7.7z"/>
      </g>
    </svg>
  );
}

export function CoinBNB({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
      <circle cx="16" cy="16" r="16" fill="#F3BA2F"/>
      <path fill="#fff" d="M12.12 14.4L16 10.52l3.89 3.89 2.26-2.26L16 6l-6.14 6.14 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.12 1.6L16 21.48l3.89-3.89 2.26 2.26L16 26l-6.14-6.14 2.26-2.26zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.19 0L16 18.29l-2.29-2.29.4-.4.2-.2L16 13.71 18.29 16z"/>
    </svg>
  );
}

export function CoinSOL({ size }) {
  const g = `solg-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={g} x1="4" y1="24" x2="26" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9945FF"/>
          <stop offset="1" stopColor="#14F195"/>
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="#131316"/>
      <g fill={`url(#${g})`}>
        <path d="M10.2 20.6c.14-.14.33-.22.53-.22h13.1c.34 0 .5.4.27.64l-2.6 2.6a.75.75 0 0 1-.53.22H7.87a.37.37 0 0 1-.27-.64z"/>
        <path d="M10.2 8.56c.15-.14.34-.22.53-.22h13.1c.34 0 .5.41.27.64l-2.6 2.6a.75.75 0 0 1-.53.22H7.87a.37.37 0 0 1-.27-.64z"/>
        <path d="M21.8 14.54a.75.75 0 0 0-.53-.22H8.17c-.34 0-.5.41-.27.64l2.6 2.6c.14.14.33.22.53.22h13.1c.34 0 .5-.4.27-.64z"/>
      </g>
    </svg>
  );
}

// ─── Coin dot (financial icon component) ─────────────────────
const COIN_ICONS = {
  USDT: { kind: 'flag', comp: CoinUSDT },
  USDC: { kind: 'flag', comp: CoinUSDC },
  BTC:  { kind: 'flag', comp: CoinBTC },
  ETH:  { kind: 'flag', comp: CoinETH },
  BNB:  { kind: 'flag', comp: CoinBNB },
  SOL:  { kind: 'flag', comp: CoinSOL },
  USD:  { kind: 'flag', comp: FlagUS },
  AED:  { kind: 'flag', comp: FlagAE },
  EUR:  { kind: 'flag', comp: FlagEU },
  GBP:  { kind: 'flag', comp: FlagGB },
};

export function WCoinDot({ symbol, size = 32 }) {
  const isAhlg = symbol === 'AGOLD';
  const meta = COIN_ICONS[symbol];

  let inner;
  if (isAhlg) {
    inner = <AGOLDMark size={size} />;
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
