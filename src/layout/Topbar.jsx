import { useState } from 'react';
import { WBRAND, WFONT, WMONO, getTheme, applyTheme } from '../lib/index.js';
import { t } from '../lib/i18n.js';
import { WIcon } from '../components/icons.jsx';
import { WPill } from '../components/primitives.jsx';

export function WTopbar({ title, sub, onNavigate, onNotifs, onLogout, mobile = false, onMenu }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{
      height: 72, flexShrink: 0,
      background: WBRAND.white, borderBottom: `1px solid ${WBRAND.line}`,
      padding: mobile ? '0 14px' : '0 32px',
      display: 'flex', alignItems: 'center', gap: mobile ? 12 : 24,
    }}>
      {onMenu && (
        <button onClick={onMenu} title="Menu" style={{
          width: 38, height: 38, borderRadius: 8, flexShrink: 0,
          background: WBRAND.white, border: `1px solid ${WBRAND.line}`,
          display: 'grid', placeItems: 'center', cursor: 'pointer', padding: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h18" stroke={WBRAND.ink} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
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

      <button onClick={onNotifs} style={{
        width: 38, height: 38, borderRadius: 8,
        background: WBRAND.white, border: `1px solid ${WBRAND.line}`,
        display: 'grid', placeItems: 'center', cursor: 'pointer',
        position: 'relative',
      }}>
        {WIcon.bell()}
        <span style={{
          position: 'absolute', top: 8, right: 9, width: 7, height: 7,
          borderRadius: 4, background: WBRAND.red,
          border: `2px solid ${WBRAND.white}`,
        }}/>
      </button>

      <div style={{ position: 'relative' }}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '4px 10px 4px 4px', height: 38, borderRadius: 8,
          background: menuOpen ? WBRAND.surface : WBRAND.white,
          border: `1px solid ${WBRAND.line}`,
          cursor: 'pointer',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 6,
            background: 'linear-gradient(135deg, #1F1F1F, #4a4a4a)',
            color: '#fff', display: 'grid', placeItems: 'center',
            fontFamily: WFONT, fontWeight: 700, fontSize: 12,
          }}>AY</div>
          {!mobile && <div style={{ textAlign: 'left', minWidth: 0 }}>
            <div style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>Ahmet Yılmaz</div>
            <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, marginTop: 1 }}>{t('Verified · Tier 3', 'Doğrulanmış · Kademe 3')}</div>
          </div>}
          {!mobile && <span style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .15s ease', display: 'inline-grid', placeItems: 'center' }}>{WIcon.arrowDown(WBRAND.muted)}</span>}
        </button>

        {menuOpen && (
          <>
            <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }}/>
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: WBRAND.white, border: `1px solid ${WBRAND.line}`,
              borderRadius: 12, minWidth: 280, zIndex: 50,
              boxShadow: '0 12px 32px rgba(0,0,0,0.10)', overflow: 'hidden',
            }}>
              <div style={{ padding: '16px 18px 14px', background: WBRAND.surface2, borderBottom: `1px solid ${WBRAND.line}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(135deg, #1F1F1F, #4a4a4a)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: WFONT, fontWeight: 800, fontSize: 14 }}>AY</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.005em' }}>Ahmet Yılmaz</div>
                    <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>ahmet@kanzasset.com</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <WPill tone="positive" style={{ fontSize: 10, padding: '3px 8px' }}>{WIcon.check(WBRAND.positive)} Verified</WPill>
                  <WPill tone="accent" style={{ fontSize: 10, padding: '3px 8px' }}>Tier 3</WPill>
                </div>
              </div>

              <div style={{ padding: 6 }}>
                {[
                  { id: 'account',      label: t('Account settings', 'Hesap ayarları'),         icon: 'M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zM3 22c0-5 4-9 9-9s9 4 9 9' },
                  { id: 'security',     label: t('Security & 2FA', 'Güvenlik ve 2FA'),           icon: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z' },
                  { id: 'destinations', label: t('Whitelisted destinations', 'Beyaz liste adresleri'), icon: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4' },
                  { id: 'prefs',        label: t('Preferences', 'Tercihler'),              icon: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.01a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' },
                ].map(it => (
                  <button key={it.id} onClick={() => { setMenuOpen(false); onNavigate && onNavigate('profile', it.id); }} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '9px 12px', borderRadius: 6, border: 'none',
                    background: 'transparent', cursor: 'pointer', textAlign: 'left',
                    fontFamily: WFONT, fontSize: 13, fontWeight: 500, color: WBRAND.ink,
                    letterSpacing: '-0.005em',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d={it.icon} stroke={WBRAND.muted} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ flex: 1 }}>{it.label}</span>
                  </button>
                ))}
              </div>

              <div style={{ padding: '4px 12px 12px', borderTop: `1px solid ${WBRAND.line}`, marginTop: 4 }}>
                <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '10px 0 8px' }}>{t('Appearance', 'Görünüm')}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, padding: 3, background: WBRAND.surface, borderRadius: 8 }}>
                  {['Light', 'Dark', 'System'].map(m => {
                    const on = getTheme() === m.toLowerCase();
                    return (
                      <button key={m} onClick={() => applyTheme(m.toLowerCase())} style={{
                        padding: '6px 0', border: 'none', cursor: 'pointer',
                        background: on ? WBRAND.white : 'transparent',
                        color: on ? WBRAND.ink : WBRAND.muted,
                        borderRadius: 6,
                        fontFamily: WFONT, fontWeight: 700, fontSize: 11,
                        boxShadow: on ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                      }}>{t(m, m === 'Light' ? 'Açık' : m === 'Dark' ? 'Koyu' : 'Sistem')}</button>
                    );
                  })}
                </div>
              </div>

              <div style={{ padding: 6, borderTop: `1px solid ${WBRAND.line}` }}>
                <button onClick={() => { setMenuOpen(false); onNavigate && onNavigate('profile', 'help'); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: WFONT, fontSize: 13, fontWeight: 500, color: WBRAND.ink, letterSpacing: '-0.005em' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={WBRAND.muted} strokeWidth="1.7"/><path d="M12 17v.01M12 14a2 2 0 011-2 2 2 0 10-2-3" stroke={WBRAND.muted} strokeWidth="1.7" strokeLinecap="round"/></svg>
                  <span style={{ flex: 1 }}>{t('Help & support', 'Yardım ve destek')}</span>
                  {WIcon.external(WBRAND.muted)}
                </button>
                <button onClick={() => { setMenuOpen(false); onLogout && onLogout(); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.red, letterSpacing: '-0.005em' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 12H4M4 12l4-4M4 12l4 4" stroke={WBRAND.red} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 4h9a2 2 0 012 2v12a2 2 0 01-2 2H9" stroke={WBRAND.red} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ flex: 1 }}>{t('Sign out', 'Çıkış yap')}</span>
                </button>
              </div>

              <div style={{ padding: '10px 14px', background: WBRAND.surface2, borderTop: `1px solid ${WBRAND.line}`, fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Kanzasset · v4.2.0</span>
                <span style={{ fontFamily: WMONO }}>EN · UTC+3</span>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
