import { useState, useEffect } from 'react';
import { WBRAND, WFONT } from '../lib/index.js';

// ─── Global toast store ───────────────────────────────────────
let _id = 0;
let _toasts = [];
const _subs = new Set();
const _emit = () => _subs.forEach(fn => fn(_toasts));

function dismiss(id) {
  _toasts = _toasts.filter(t => t.id !== id);
  _emit();
}

// toast('Saved', { tone: 'success' | 'info' | 'warn' | 'error', title, duration })
export function toast(message, opts = {}) {
  const id = ++_id;
  _toasts = [..._toasts, { id, message, tone: opts.tone || 'success', title: opts.title }];
  _emit();
  setTimeout(() => dismiss(id), opts.duration ?? 3200);
  return id;
}

const TONES = {
  success: { accent: WBRAND.positive, ring: 'rgba(15,122,71,0.12)' },
  info:    { accent: WBRAND.ink,      ring: WBRAND.surface },
  warn:    { accent: WBRAND.warn,     ring: 'rgba(183,121,31,0.14)' },
  error:   { accent: WBRAND.red,      ring: WBRAND.redSoft },
};

function ToastIcon({ tone, color }) {
  if (tone === 'success') {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4 4 10-10.5" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  }
  if (tone === 'error') {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth="2.2" strokeLinecap="round"/></svg>;
  }
  if (tone === 'warn') {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 8v5M12 16.5v.5" stroke={color} strokeWidth="2.2" strokeLinecap="round"/></svg>;
  }
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 11v6M12 7.5v.5" stroke={color} strokeWidth="2.2" strokeLinecap="round"/><circle cx="12" cy="12" r="9.2" stroke={color} strokeWidth="1.5"/></svg>;
}

function ToastItem({ t }) {
  const [shown, setShown] = useState(false);
  useEffect(() => { const r = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(r); }, []);
  const tone = TONES[t.tone] ?? TONES.success;

  return (
    <div style={{
      pointerEvents: 'auto', display: 'flex', alignItems: 'flex-start', gap: 12,
      minWidth: 280, maxWidth: 380, padding: '12px 14px',
      background: WBRAND.white, border: `1px solid ${WBRAND.line}`,
      borderLeft: `3px solid ${tone.accent}`,
      borderRadius: 12, boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
      transform: shown ? 'translateY(0)' : 'translateY(12px)',
      opacity: shown ? 1 : 0,
      transition: 'transform .22s cubic-bezier(.2,.7,.2,1), opacity .22s ease',
    }}>
      <div style={{ width: 26, height: 26, borderRadius: 13, background: tone.ring, color: tone.accent, display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 1 }}>
        <ToastIcon tone={t.tone} color={tone.accent}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {t.title && <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{t.title}</div>}
        <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: t.title ? 500 : 600, color: t.title ? WBRAND.muted : WBRAND.ink, marginTop: t.title ? 2 : 0, lineHeight: 1.4 }}>{t.message}</div>
      </div>
      <button onClick={() => dismiss(t.id)} style={{ width: 22, height: 22, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: WBRAND.muted2, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
}

export function ToastHost() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const fn = (list) => setItems([...list]);
    _subs.add(fn);
    return () => { _subs.delete(fn); };
  }, []);

  return (
    <div style={{
      position: 'fixed', right: 20, bottom: 20, zIndex: 200,
      display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end',
      pointerEvents: 'none',
    }}>
      {items.map(t => <ToastItem key={t.id} t={t}/>)}
    </div>
  );
}
