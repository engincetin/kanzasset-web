import { useState, useEffect } from 'react';
import { WBRAND, WFONT, WMONO, wfmt } from '../lib/index.js';
import { t } from '../lib/i18n.js';
import { WIcon } from '../components/icons.jsx';
import { AGOLDMark, WMark } from '../components/coinicons.jsx';

// Live AGOLD price chip — gently jitters every few seconds to feel alive.
function LivePriceChip({ onClick }) {
  const [px, setPx] = useState(135.82);
  const [delta, setDelta] = useState(0.24);
  useEffect(() => {
    const id = setInterval(() => {
      const d = (Math.random() - 0.47) * 0.16;
      setPx(p => Math.max(150.9, Math.min(152.3, p + d)));
      setDelta(prev => Math.max(-0.9, Math.min(0.9, prev + d / 1.5)));
    }, 4000);
    return () => clearInterval(id);
  }, []);
  const up = delta >= 0;
  return (
    <button onClick={onClick} title={t('Buy / Sell')} className="kz-btn-secondary" style={{
      height: 38, padding: '0 12px 0 6px', borderRadius: 8,
      background: WBRAND.white, border: `1px solid ${WBRAND.line}`,
      display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
    }}>
      <AGOLDMark size={24}/>
      <span style={{ fontFamily: WMONO, fontSize: 13, fontWeight: 700, color: WBRAND.ink, fontVariantNumeric: 'tabular-nums' }}>${wfmt(px, 2)}</span>
      <span style={{ fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: up ? WBRAND.positive : WBRAND.red, fontVariantNumeric: 'tabular-nums' }}>
        {up ? '▲' : '▼'} {wfmt(Math.abs(delta), 2)}%
      </span>
      <span className="kz-pulse" style={{ width: 6, height: 6, borderRadius: 3, background: up ? WBRAND.positive : WBRAND.red, flexShrink: 0 }}/>
    </button>
  );
}

export function WTopbar({ title, sub, onNavigate, onNotifs, mobile = false, onMenu }) {
  const iconBtn = {
    width: 38, height: 38, borderRadius: 8, flexShrink: 0,
    background: WBRAND.white, border: `1px solid ${WBRAND.line}`,
    display: 'grid', placeItems: 'center', cursor: 'pointer', padding: 0,
  };

  return (
    <header style={{
      height: 72, flexShrink: 0,
      background: WBRAND.white, borderBottom: `1px solid ${WBRAND.line}`,
      padding: mobile ? '0 14px' : '0 32px',
      display: 'flex', alignItems: 'center', gap: mobile ? 10 : 24,
    }}>
      {/* Mobile: brand logo on the left (the sidebar carries it on desktop) */}
      {mobile && (
        <button onClick={() => onNavigate && onNavigate('dashboard')} title="Kanzasset" className="kz-btn-secondary" style={{ ...iconBtn, border: 'none', background: 'transparent' }}>
          <WMark size={30}/>
        </button>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <h1 style={{
            margin: 0, fontFamily: WFONT, fontSize: mobile ? 17 : 22, fontWeight: 800,
            color: WBRAND.ink, letterSpacing: '-0.02em',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{title}</h1>
          {sub && !mobile && <span style={{
            fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, fontWeight: 500,
            letterSpacing: '-0.005em',
          }}>{sub}</span>}
        </div>
      </div>

      {/* Notifications */}
      <button onClick={onNotifs} className="kz-btn-secondary" style={{ ...iconBtn, position: 'relative' }}>
        <span className="kz-ring">{WIcon.bell()}</span>
        <span style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: 4, background: WBRAND.red, border: `2px solid ${WBRAND.white}` }}/>
      </button>

      {/* Mobile: menu button on the right, grouped with notifications */}
      {mobile && onMenu && (
        <button onClick={onMenu} title="Menu" className="kz-btn-secondary" style={iconBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h18" stroke={WBRAND.ink} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </header>
  );
}
