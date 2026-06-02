// Shared UI primitives for AHLG / Kanzasset mobile prototype.
// Brand: minimal, white surfaces, black type, red accents.

const BRAND = {
  red: '#D4202B',
  redDark: '#B81824',
  ink: '#0A0A0A',
  ink2: '#1A1A1A',
  muted: '#8A8A8E',
  line: '#ECECEC',
  surface: '#F5F5F5',
  surface2: '#FAFAFA',
  white: '#FFFFFF',
};

const FONT = `'Manrope', 'Avenir Next', -apple-system, system-ui, sans-serif`;

// Number formatter — always 1,000.00 style (en-US grouping)
function fmt(n, decimals = 2) {
  if (n === null || n === undefined || isNaN(n)) return '0.00';
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Parse a possibly-formatted string back to a number
function parseNum(s) {
  if (typeof s === 'number') return s;
  return parseFloat(String(s ?? '').replace(/,/g, '')) || 0;
}

// ─── Shared account model ──────────────────────────────────────
// Rates expressed as: 1 unit of asset = N USDT (≈ N USD).
const RATES = {
  AHLG: 151.56,
  USDT: 1,
  USDC: 1,
  USD:  1,
  AED:  0.27225,
  EUR:  1.08,
  GBP:  1.27,
};
const BALANCES = {
  AHLG: 2500,
  USDT: 10000,
  USDC: 5000,
  AED:  100000,
  USD:  50000,
  EUR:  0,
  GBP:  0,
};
function totalInUSDT() {
  let s = 0;
  for (const k of Object.keys(BALANCES)) s += BALANCES[k] * RATES[k];
  return s;
}
function totalIn(symbol) {
  return totalInUSDT() / (RATES[symbol] ?? 1);
}
function decimalsFor(symbol) {
  return symbol === 'AHLG' ? 4 : 2;
}

// Brand mark — uses the official PNG with transparent background
function KMark({ size = 22 }) {
  // Aspect ratio is 384/304 ≈ 1.263
  const w = Math.round(size * (384/304));
  return (
    <img
      src="assets/kanzasset-mark-transparent.png"
      alt="Kanzasset"
      width={w}
      height={size}
      style={{ display: 'block', objectFit: 'contain' }}
    />
  );
}

function Logotype({ color = BRAND.ink }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: FONT, fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color,
    }}>
      <KMark size={20} />
      <span>Kanzasset</span>
    </div>
  );
}

// Top header — small mark left, bell right
function TopBar({ onBell }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 24px 0',
    }}>
      <KMark size={24} />
      <button onClick={onBell} style={{
        width: 36, height: 36, borderRadius: 18, background: BRAND.surface,
        border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer',
        position: 'relative',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9z" stroke={BRAND.ink} strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M10 21a2 2 0 0 0 4 0" stroke={BRAND.ink} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <span style={{
          position: 'absolute', top: 7, right: 9, width: 7, height: 7,
          borderRadius: 4, background: BRAND.red, border: `2px solid ${BRAND.surface}`,
        }}/>
      </button>
    </div>
  );
}

// Big page title (lowercase, ultra-tight)
function PageTitle({ children }) {
  return (
    <h1 style={{
      fontFamily: FONT, fontWeight: BRAND.titleWeight ?? 800, fontSize: 40, lineHeight: '44px',
      letterSpacing: BRAND.titleCase === 'uppercase' ? '0.01em' : '-0.04em',
      textTransform: BRAND.titleCase ?? 'lowercase',
      color: BRAND.ink, margin: '20px 24px 24px',
    }}>{typeof children === 'string' ? T(children) : children}</h1>
  );
}

// Primary CTA — solid red, bold
function PrimaryButton({ children, onClick, disabled = false, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', height: 56, borderRadius: 16, border: 'none',
      background: disabled ? '#E8E8E8' : BRAND.red,
      color: disabled ? '#A0A0A0' : '#fff',
      fontFamily: FONT, fontWeight: 700, fontSize: 17, letterSpacing: '-0.01em',
      cursor: disabled ? 'default' : 'pointer',
      boxShadow: disabled ? 'none' : '0 8px 18px rgba(212,32,43,0.18)',
      transition: 'transform .12s ease, box-shadow .12s ease',
      ...style,
    }}
    onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(0.985)')}
    onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >{typeof children === 'string' ? T(children) : children}</button>
  );
}

function SecondaryButton({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      height: 48, padding: '0 18px', borderRadius: 14,
      background: BRAND.white, border: `1px solid ${BRAND.line}`,
      color: BRAND.ink, fontFamily: FONT, fontWeight: 600, fontSize: 14,
      cursor: 'pointer', ...style,
    }}>{typeof children === 'string' ? T(children) : children}</button>
  );
}

// Card surface
function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: BRAND.white, border: `1px solid ${BRAND.line}`,
      borderRadius: 20, padding: 20, ...style,
    }}>{children}</div>
  );
}

// Currency / asset row
function AssetRow({ symbol, name, amount, fiat, color = BRAND.ink, last = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 0',
      borderBottom: last ? 'none' : `1px solid ${BRAND.line}`,
    }}>
      <CoinDot symbol={symbol} color={color} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: BRAND.ink, letterSpacing: '-0.01em' }}>{T(name)}</div>
        <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 2 }}>{symbol}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: BRAND.ink, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>{amount}</div>
        {fiat !== undefined && <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{fiat}</div>}
      </div>
    </div>
  );
}

function CoinDot({ symbol, color }) {
  const palette = {
    AHLG: BRAND.red, USDT: '#26A17B', USDC: '#2775CA',
    AED: '#0A0A0A', USD: '#0A0A0A', EUR: '#0A0A0A', GBP: '#0A0A0A',
  };
  const fill = palette[symbol] ?? color;
  const isAhlg = symbol === 'AHLG';
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 18,
      background: isAhlg ? BRAND.white : '#F2F2F2',
      border: isAhlg ? `1.5px solid ${BRAND.red}` : 'none',
      display: 'grid', placeItems: 'center',
      color: isAhlg ? BRAND.red : fill,
      fontFamily: FONT, fontWeight: 700, fontSize: 10, letterSpacing: '0.02em',
    }}>
      {isAhlg ? <KMark size={18} /> : symbol.slice(0, symbol.length > 3 ? 4 : 3)}
    </div>
  );
}

// Inline label chip
function Chip({ children, active = false, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      height: 32, padding: '0 14px', borderRadius: 16,
      background: active ? BRAND.ink : BRAND.surface,
      color: active ? '#fff' : BRAND.ink,
      border: 'none', cursor: 'pointer',
      fontFamily: FONT, fontWeight: 600, fontSize: 12, letterSpacing: '0.01em',
      ...style,
    }}>{typeof children === 'string' ? T(children) : children}</button>
  );
}

// Bottom nav — 4 tabs
function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'wallet',  label: 'wallet',  icon: WalletIcon },
    { id: 'mint',    label: 'mint',    icon: MintIcon },
    { id: 'redeem',  label: 'redeem',  icon: RedeemIcon },
    { id: 'profile', label: 'profile', icon: ProfileIcon },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: BRAND.white, borderTop: `1px solid ${BRAND.line}`,
      padding: '10px 12px 28px',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4,
      zIndex: 30,
    }}>
      {tabs.map(t => {
        const Icon = t.icon;
        const on = t.id === active;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '6px 0', color: on ? BRAND.ink : BRAND.muted,
            fontFamily: FONT, fontWeight: on ? 700 : 500, fontSize: 11,
            letterSpacing: '-0.01em',
          }}>
            <Icon active={on} />
            <span>{T(t.label)}</span>
          </button>
        );
      })}
    </div>
  );
}

// Icons
function WalletIcon({ active }) {
  const c = active ? BRAND.ink : BRAND.muted;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="14" rx="3" stroke={c} strokeWidth="1.7"/>
      <path d="M3 10h18" stroke={c} strokeWidth="1.7"/>
      <circle cx="17" cy="15" r="1.2" fill={c}/>
    </svg>
  );
}
function MintIcon({ active }) {
  const c = active ? BRAND.ink : BRAND.muted;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke={c} strokeWidth="1.7"/>
      <path d="M12 7v10M7 12h10" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
}
function RedeemIcon({ active }) {
  const c = active ? BRAND.ink : BRAND.muted;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 4v12m0 0l-4-4m4 4l4-4" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 18h16" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
}
function ProfileIcon({ active }) {
  const c = active ? BRAND.ink : BRAND.muted;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="3.5" stroke={c} strokeWidth="1.7"/>
      <path d="M5 20c1.5-3.5 4.2-5 7-5s5.5 1.5 7 5" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
}

// Common chevron / arrow icons
function ChevDown({ size = 14, color = BRAND.ink }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function ChevRight({ size = 14, color = BRAND.muted }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Sheet / modal — title + scrolling body + optional sticky footer
function Sheet({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 80,
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: BRAND.white,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        maxHeight: '85%', display: 'flex', flexDirection: 'column',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
        animation: 'sheet-up .22s ease-out',
      }}>
        {/* Sticky header */}
        <div style={{ padding: '12px 0 0', flexShrink: 0 }}>
          <div style={{
            width: 40, height: 4, borderRadius: 2, background: BRAND.line,
            margin: '0 auto 10px',
          }}/>
          {title && (
            <div style={{
              fontFamily: FONT, fontWeight: 700, fontSize: 16, color: BRAND.ink,
              padding: '8px 24px 14px', borderBottom: `1px solid ${BRAND.line}`,
            }}>{typeof title === 'string' ? T(title) : title}</div>
          )}
        </div>
        {/* Scrollable body */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '8px 0' }}>{children}</div>
        {/* Sticky footer */}
        {footer && (
          <div style={{
            flexShrink: 0, padding: '14px 24px 32px',
            borderTop: `1px solid ${BRAND.line}`, background: BRAND.white,
          }}>{footer}</div>
        )}
        {!footer && <div style={{ height: 24, flexShrink: 0 }}/>}
      </div>
    </div>
  );
}

// Expose globally
Object.assign(window, {
  BRAND, FONT, fmt, parseNum,
  RATES, BALANCES, totalInUSDT, totalIn, decimalsFor,
  KMark, Logotype, TopBar, PageTitle,
  PrimaryButton, SecondaryButton, Card, AssetRow, CoinDot, Chip, BottomNav, Sheet,
  ChevDown, ChevRight,
});
