import { useState, useEffect } from 'react';
import { WBRAND, WFONT, WMONO, wfmt, wdecimals } from '../lib/index.js';
import { t } from '../lib/i18n.js';

export function WSpinner({ size = 14, color }) {
  const arc = color || WBRAND.red;
  const track = color ? `${color}33` : WBRAND.redSoft;
  return (
    <>
      <style>{`@keyframes wspin{to{transform:rotate(360deg)}}`}</style>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: 'wspin .8s linear infinite', flexShrink: 0 }}>
        <circle cx="12" cy="12" r="9" stroke={track} strokeWidth="3"/>
        <path d="M12 3a9 9 0 0 1 9 9" stroke={arc} strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </>
  );
}

export function WCountdown({ seconds = 299, prefix = '' }) {
  const [n, setN] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setN(x => (x <= 0 ? 0 : x - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(n / 60)).padStart(2, '0');
  const ss = String(n % 60).padStart(2, '0');
  return <span style={{ fontFamily: WMONO, fontVariantNumeric: 'tabular-nums' }}>{prefix}{mm}:{ss}</span>;
}

export function WTimeline({ steps, active, stamps, done }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {steps.map((s, i) => {
        const isStepDone = i < active || (i === steps.length - 1 && done);
        const isCurrent = i === active && !isStepDone;
        const isPending = !isStepDone && !isCurrent;
        const isLast = i === steps.length - 1;
        const sub = typeof s.sub === 'function' ? s.sub() : s.sub;
        return (
          <div key={s.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch' }}>
              <div style={{
                width: 26, height: 26, borderRadius: 13, flexShrink: 0,
                display: 'grid', placeItems: 'center',
                background: isStepDone ? WBRAND.positive : isCurrent ? WBRAND.redSoft : WBRAND.surface,
                border: isCurrent ? `1.5px solid ${WBRAND.red}` : 'none',
              }}>
                {isStepDone ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5 9-9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : isCurrent ? (
                  <WSpinner size={13}/>
                ) : (
                  <div style={{ width: 7, height: 7, borderRadius: 4, background: WBRAND.line2 }}/>
                )}
              </div>
              {!isLast && (
                <div style={{ flex: 1, width: 2, background: isStepDone ? WBRAND.positive : WBRAND.line, minHeight: 20, marginTop: 3 }}/>
              )}
            </div>
            <div style={{ flex: 1, paddingBottom: isLast ? 4 : 22, paddingTop: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: WFONT, fontSize: 14, fontWeight: 700, color: isPending ? WBRAND.muted : WBRAND.ink, letterSpacing: '-0.01em' }}>{s.title}</span>
                {stamps[i] && <span style={{ fontFamily: WMONO, fontSize: 11, color: WBRAND.muted2 }}>{stamps[i]}</span>}
              </div>
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 3, lineHeight: 1.45 }}>{sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
import { WIcon } from './icons.jsx';
import { WCoinDot } from './coinicons.jsx';
import { WPill, WMonoNum } from './primitives.jsx';

// ─── Select field (form-style dropdown, used by Profile + Support) ─
export function SelectField({ value, options, groups, onChange }) {
  const [open, setOpen] = useState(false);
  const renderGroups = groups ?? [{ label: null, options: options ?? [] }];
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', height: 40, padding: '0 14px', borderRadius: 8, background: WBRAND.white, border: `1px solid ${open ? WBRAND.ink : WBRAND.line2}`, cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ flex: 1, fontFamily: WFONT, fontSize: 13, color: WBRAND.ink, fontWeight: 500, letterSpacing: '-0.005em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
        <span style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .15s ease', display: 'inline-grid', placeItems: 'center' }}>{WIcon.arrowDown(WBRAND.muted)}</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }}/>
          <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, borderRadius: 10, padding: 6, zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', maxHeight: 280, overflowY: 'auto' }}>
            {renderGroups.map((grp, gi) => (
              <div key={gi} style={{ marginTop: gi > 0 ? 4 : 0, paddingTop: gi > 0 ? 4 : 0, borderTop: gi > 0 ? `1px solid ${WBRAND.line}` : 'none' }}>
                {grp.label && <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 10px 4px' }}>{grp.label}</div>}
                {grp.options.map(o => {
                  const on = o === value;
                  return (
                    <button key={o} onClick={() => { onChange(o); setOpen(false); }} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: 'none', background: on ? WBRAND.surface : 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: WFONT, fontSize: 12, fontWeight: on ? 700 : 500, color: WBRAND.ink, display: 'flex', alignItems: 'center', justifyContent: 'space-between', letterSpacing: '-0.005em' }}>
                      {o}
                      {on && WIcon.check(WBRAND.ink)}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Transaction row (used in Dashboard + Activity) ───────────
export function WTxRow({ tx, last, onOpen }) {
  const typeIcon = {
    Mint:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke={WBRAND.ink} strokeWidth="1.6" /><path d="M12 8v8M8 12h8" stroke={WBRAND.ink} strokeWidth="1.6" strokeLinecap="round" /></svg>,
    Redeem:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4v12m0 0l-4-4m4 4l4-4M4 19h16" stroke={WBRAND.ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    Deposit:  WIcon.download(WBRAND.ink),
    Withdraw: WIcon.upload(WBRAND.ink),
    Transfer: WIcon.swap(WBRAND.ink),
  };
  const pos = tx.amount > 0;
  const date = tx.ts.slice(0, 10).split('-').reverse().join('/');
  const time = tx.ts.slice(11, 16);

  return (
    <div
      onClick={() => onOpen && onOpen(tx)}
      onMouseEnter={onOpen ? (e => e.currentTarget.style.background = WBRAND.surface2) : undefined}
      onMouseLeave={onOpen ? (e => e.currentTarget.style.background = 'transparent') : undefined}
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 1.2fr 1fr 1.2fr 1.2fr 1fr 110px',
        gap: 12, padding: '14px 22px', alignItems: 'center',
        borderBottom: last ? 'none' : `1px solid ${WBRAND.line}`,
        cursor: onOpen ? 'pointer' : 'default',
        transition: 'background .12s',
      }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, background: WBRAND.surface,
        display: 'grid', placeItems: 'center',
      }}>{typeIcon[tx.type]}</div>
      <div>
        <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{t(tx.type)}</div>
        <div style={{ fontFamily: WMONO, fontSize: 10, color: WBRAND.muted, marginTop: 2 }}>{tx.id}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <WCoinDot symbol={tx.asset} size={22} />
        <span style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink }}>{tx.asset}</span>
      </div>
      <WMonoNum size={13} weight={500} color={pos ? WBRAND.positive : WBRAND.ink}>
        {pos ? '+' : ''}{wfmt(tx.amount, wdecimals(tx.asset))}
      </WMonoNum>
      <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>{tx.paid}</span>
      <div>
        <WMonoNum size={12}>{date}</WMonoNum>
        <div style={{ fontFamily: WMONO, fontSize: 10, color: WBRAND.muted, marginTop: 2 }}>{time}</div>
      </div>
      <div>
        <WPill tone={tx.status === 'completed' ? 'positive' : tx.status === 'pending' ? 'warn' : 'negative'}>
          {tx.status === 'completed' && WIcon.check(WBRAND.positive)}
          {t(tx.status[0].toUpperCase() + tx.status.slice(1))}
        </WPill>
      </div>
    </div>
  );
}

// ─── Per-asset action button ──────────────────────────────────
export function AssetActionBtn({ label, onClick, icon, accent = false, disabled = false }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={label}
      style={{
        height: 28, minWidth: 76, padding: icon ? '0 10px' : '0 12px',
        border: `1px solid ${accent ? WBRAND.red : WBRAND.line2}`,
        background: accent ? WBRAND.red : WBRAND.white,
        color: accent ? '#fff' : WBRAND.ink,
        borderRadius: 6,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        fontFamily: WFONT, fontWeight: 600, fontSize: 11,
        letterSpacing: '-0.005em',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
        flexShrink: 0,
      }}>
      {icon}
      {label}
    </button>
  );
}

// ─── Asset selector pill (Mint + Redeem + Withdraw inputs) ────
export function WAssetSelector({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const sel = options.find(o => o.symbol === value) ?? options[0];

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        background: WBRAND.white, border: `1px solid ${WBRAND.line2}`,
        borderRadius: 999, padding: '6px 14px 6px 6px',
        display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
      }}>
        <WCoinDot symbol={sel.symbol} size={28}/>
        <span style={{ fontFamily: WFONT, fontWeight: 700, fontSize: 14, color: WBRAND.ink }}>{sel.symbol}</span>
        {WIcon.arrowDown(WBRAND.muted)}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }}/>
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            background: WBRAND.white, border: `1px solid ${WBRAND.line}`,
            borderRadius: 12, padding: 6, minWidth: 240,
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)', zIndex: 50,
          }}>
            {options.map(o => (
              <button key={o.symbol} onClick={() => { onChange(o.symbol); setOpen(false); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 8, border: 'none',
                background: o.symbol === value ? WBRAND.surface : 'transparent',
                cursor: 'pointer', textAlign: 'left',
              }}>
                <WCoinDot symbol={o.symbol} size={26}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink }}>{o.symbol}</div>
                  <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 1 }}>{o.name}</div>
                </div>
                <WMonoNum size={12} color={WBRAND.muted}>{wfmt(o.balance ?? 0, wdecimals(o.symbol))}</WMonoNum>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Decorative QR ────────────────────────────────────────────
export function FauxWebQR() {
  const cells = [];
  const r = 21;
  for (let y = 0; y < r; y++) {
    for (let x = 0; x < r; x++) {
      const on = ((x * 53 + y * 71 + x * y * 3) % 7) > 3
        || (x < 3 && y < 3) || (x > r - 4 && y < 3) || (x < 3 && y > r - 4);
      if (on) cells.push(<rect key={x + ',' + y} x={x * 4} y={y * 4} width={3.5} height={3.5} fill={WBRAND.ink} rx="0.4"/>);
    }
  }
  return <svg viewBox={`0 0 ${r * 4} ${r * 4}`} width="100%" height="100%">{cells}</svg>;
}
