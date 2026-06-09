import { useState } from 'react';
import { t } from '../lib/i18n.js';
import { WBRAND, WFONT, WMONO } from '../lib/index.js';
import { WIcon } from './icons.jsx';

// ─── Card ──────────────────────────────────────────────────────
export function WCard({ children, style = {}, padding = 24, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: WBRAND.white, border: `1px solid ${WBRAND.line}`,
      borderRadius: 16, padding, ...style,
    }}>{children}</div>
  );
}

// ─── Buttons ──────────────────────────────────────────────────
export function WPrimary({ children, onClick, style = {}, size = 'md', icon, disabled }) {
  const h = size === 'lg' ? 52 : size === 'sm' ? 36 : 44;
  const fs = size === 'lg' ? 15 : size === 'sm' ? 13 : 14;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      height: h, padding: '0 20px', borderRadius: 10,
      background: WBRAND.red, color: '#fff',
      border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: WFONT, fontWeight: 700, fontSize: fs,
      letterSpacing: '-0.005em',
      display: 'inline-flex', alignItems: 'center', gap: 8,
      boxShadow: '0 1px 0 rgba(168,22,31,0.6) inset, 0 1px 2px rgba(168,22,31,0.25)',
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
    <button onClick={onClick} disabled={disabled} style={{
      height: h, padding: '0 16px', borderRadius: 10,
      background: WBRAND.white, color: WBRAND.ink,
      border: `1px solid ${WBRAND.line2}`, cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: WFONT, fontWeight: 600, fontSize: fs,
      letterSpacing: '-0.005em',
      display: 'inline-flex', alignItems: 'center', gap: 8,
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
