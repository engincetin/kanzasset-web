import { useState, useEffect, useRef } from 'react';
import { t } from '../lib/i18n.js';
import { WBRAND, WFONT, WMONO } from '../lib/index.js';
import { WIcon } from './icons.jsx';

// ─── Count-up number animation ────────────────────────────────
// Rolls from the previous value (0 on first mount) to the new one.
export function useCountUp(value, duration = 750) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const from = prev.current;
    const to = value;
    if (from === to) { setDisplay(to); return; }
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setDisplay(from + (to - from) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); prev.current = to; };
  }, [value, duration]);
  return display;
}

// ─── Card ──────────────────────────────────────────────────────
export function WCard({ children, style = {}, padding = 24, onClick }) {
  return (
    <div onClick={onClick} className="kz-card" style={{
      background: WBRAND.white, border: `1px solid ${WBRAND.line}`,
      borderRadius: 16, padding,
      boxShadow: '0 1px 2px rgba(16,17,20,0.04), 0 12px 32px -18px rgba(16,17,20,0.12)',
      ...style,
    }}>{children}</div>
  );
}

// Is a hex colour light enough to need dark text on top?
function isLightHex(hex) {
  if (typeof hex !== 'string' || hex[0] !== '#' || hex.length < 7) return false;
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) > 175;
}

// ─── Buttons ──────────────────────────────────────────────────
export function WPrimary({ children, onClick, style = {}, size = 'md', icon, disabled, tone = 'brand' }) {
  const h = size === 'lg' ? 52 : size === 'sm' ? 36 : 44;
  const fs = size === 'lg' ? 15 : size === 'sm' ? 13 : 14;
  // On a light brand surface (e.g. white accent in dark mode) use dark text.
  const brandFg = isLightHex(WBRAND.red) ? WBRAND.ink : '#fff';
  const tones = {
    // brand follows the colour picker; green/red are STATIC (buy / sell)
    brand: { bg: `linear-gradient(180deg, ${WBRAND.red}, ${WBRAND.redDeep})`, shadow: '0 1px 0 rgba(255,255,255,0.12) inset, 0 2px 8px -3px rgba(16,17,20,0.4)', cls: '', fg: brandFg },
    green: { bg: 'linear-gradient(180deg, #18A765, #0F7A47)',                 shadow: '0 1px 0 rgba(255,255,255,0.14) inset, 0 2px 8px -2px rgba(15,122,71,0.45)', cls: ' kz-btn-green', fg: '#fff' },
    red:   { bg: 'linear-gradient(180deg, #D4202B, #A8161F)',                 shadow: '0 1px 0 rgba(255,255,255,0.14) inset, 0 2px 8px -2px rgba(168,22,31,0.45)', cls: ' kz-btn-red', fg: '#fff' },
  };
  const tn = tones[tone] ?? tones.brand;
  return (
    <button onClick={onClick} disabled={disabled} className={'kz-btn-primary' + tn.cls} style={{
      height: h, padding: '0 20px', borderRadius: 10,
      background: tn.bg,
      color: tn.fg,
      border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: WFONT, fontWeight: 700, fontSize: fs,
      letterSpacing: '-0.005em',
      display: 'inline-flex', alignItems: 'center', gap: 8,
      boxShadow: tn.shadow,
      opacity: disabled ? 0.5 : 1,
      ...style,
    }}>
      {icon}
      {children}
    </button>
  );
}

export function WSecondary({ children, onClick, style = {}, size = 'md', icon, disabled }) {
  const h = size === 'lg' ? 52 : size === 'sm' ? 32 : 40;
  const fs = size === 'lg' ? 15 : size === 'sm' ? 12 : 13;
  return (
    <button onClick={onClick} disabled={disabled} className="kz-btn-secondary" style={{
      height: h, padding: '0 16px', borderRadius: 10,
      background: WBRAND.white, color: WBRAND.ink,
      border: `1px solid ${WBRAND.line2}`, cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: WFONT, fontWeight: 600, fontSize: fs,
      letterSpacing: '-0.005em',
      display: 'inline-flex', alignItems: 'center', gap: 8,
      boxShadow: '0 1px 2px rgba(16,17,20,0.04)',
      opacity: disabled ? 0.5 : 1,
      ...style,
    }}>
      {icon}
      {children}
    </button>
  );
}

// ─── Copy-to-clipboard button (shows a "Copied" state) ────────
export function WCopyButton({ text, label = 'Copy', copiedLabel = 'Copied', size = 'sm', style = {} }) {
  const [copied, setCopied] = useState(false);

  const doCopy = async (e) => {
    e?.stopPropagation?.();
    const value = String(text ?? '');
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* noop */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <WSecondary
      size={size}
      onClick={doCopy}
      icon={copied ? WIcon.check(WBRAND.positive) : WIcon.copy(WBRAND.ink)}
      style={copied ? { color: WBRAND.positive, borderColor: WBRAND.positive, ...style } : style}
    >
      {copied ? t(copiedLabel) : t(label)}
    </WSecondary>
  );
}

export function WGhost({ children, onClick, style = {}, active = false }) {
  return (
    <button onClick={onClick} className={active ? undefined : 'kz-ghost'} style={{
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

// ─── Typography ───────────────────────────────────────────────
export function WEyebrow({ children, style = {} }) {
  return (
    <div style={{
      fontFamily: WFONT, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      color: WBRAND.muted, ...style,
    }}>{children}</div>
  );
}

export function WNum({ children, size = 14, weight = 600, color, style = {} }) {
  return (
    <span style={{
      fontFamily: WFONT, fontSize: size, fontWeight: weight,
      color: color ?? WBRAND.ink, fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.01em', ...style,
    }}>{children}</span>
  );
}

export function WMonoNum({ children, size = 13, color, weight, style = {} }) {
  return (
    <span style={{
      fontFamily: WMONO, fontSize: size, fontWeight: weight ?? 500,
      color: color ?? WBRAND.ink, fontVariantNumeric: 'tabular-nums',
      ...style,
    }}>{children}</span>
  );
}

export function WPill({ children, tone = 'neutral', style = {} }) {
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

export function WSectionTitle({ title, sub, trailing, style = {} }) {
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
