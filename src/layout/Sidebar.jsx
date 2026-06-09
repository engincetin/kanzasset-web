import { WBRAND, WFONT, WMONO } from '../lib/index.js';
import { t } from '../lib/i18n.js';
import { WMark, WLogotype, AHLGMark } from '../components/coinicons.jsx';

const NAV_TR = {
  Overview: 'Genel', Funds: 'Fonlar', 'AHL Gold': 'AHL Altın', Account: 'Hesap',
  Dashboard: 'Panel', Wallet: 'Cüzdan', Deposit: 'Para Yatır', Withdraw: 'Para Çek',
  Mint: 'Üret', Redeem: 'Boz', Activity: 'İşlemler', Support: 'Destek', Profile: 'Profil',
};
const navT = (s) => t(s, NAV_TR[s] ?? s);

export const NAV_GROUPS = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      {
        id: 'dashboard', label: 'Dashboard',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="8" height="8"  rx="1.5" stroke={c} strokeWidth="1.7"/>
          <rect x="13" y="3" width="8" height="5" rx="1.5" stroke={c} strokeWidth="1.7"/>
          <rect x="13" y="10" width="8" height="11" rx="1.5" stroke={c} strokeWidth="1.7"/>
          <rect x="3" y="13" width="8" height="8" rx="1.5" stroke={c} strokeWidth="1.7"/>
        </svg>,
      },
    ],
  },
  {
    id: 'funds',
    label: 'Funds',
    items: [
      {
        id: 'wallet', label: 'Wallet',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="18" height="14" rx="2" stroke={c} strokeWidth="1.7"/>
          <path d="M3 10h18" stroke={c} strokeWidth="1.7"/>
          <circle cx="17" cy="15" r="1.3" fill={c}/>
        </svg>,
      },
      {
        id: 'deposit', label: 'Deposit',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 4v12m0 0l-4-4m4 4l4-4" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 20h16" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
        </svg>,
      },
      {
        id: 'withdraw', label: 'Withdraw',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 20V8m0 0l-4 4m4-4l4 4" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 4h16" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
        </svg>,
      },
      {
        id: 'activity', label: 'Activity',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M3 12h4l3-7 4 14 3-7h4" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>,
      },
    ],
  },
  {
    id: 'ahlg',
    label: 'AHL Gold',
    items: [
      {
        id: 'trade', label: 'Buy / Sell', badge: 'NEW',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M7 4v13m0 0l-3-3m3 3l3-3M17 20V7m0 0l-3 3m3-3l3 3" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>,
      },
      {
        id: 'physical', label: 'Physical delivery',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/>
          <path d="M3 7l9 4 9-4M12 11v10" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/>
        </svg>,
      },
    ],
  },
  {
    id: 'account',
    label: 'Help',
    items: [
      {
        id: 'support', label: 'Support',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/>
        </svg>,
      },
      {
        id: 'docs', label: 'Documentation', external: 'https://docs.kanzasset.com',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M5 4a1 1 0 011-1h9l4 4v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4z" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/>
          <path d="M14 3v5h5M8 13h8M8 17h5" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>,
      },
    ],
  },
];

export const NAV_ITEMS = NAV_GROUPS.flatMap(g => g.items);

export function WSidebar({ active, onNavigate, collapsed: collapsedProp = false, onToggleCollapse, mobile = false, mobileOpen = false, onClose }) {
  // On mobile the sidebar is a full-width drawer — never the collapsed rail.
  const collapsed = mobile ? false : collapsedProp;
  const width = collapsed ? 64 : 240;

  // Navigating from the drawer should also close it.
  const go = (id) => { onNavigate(id); if (mobile && onClose) onClose(); };

  const aside = (
    <aside style={{
      width, background: WBRAND.white,
      borderRight: `1px solid ${WBRAND.line}`,
      display: 'flex', flexDirection: 'column',
      padding: collapsed ? '0 10px 16px' : '0 16px 20px',
      flexShrink: 0,
      transition: mobile ? 'transform .24s ease' : 'width .22s ease, padding .22s ease',
      ...(mobile
        ? {
            position: 'fixed', top: 0, left: 0, height: '100%', zIndex: 60,
            transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
            boxShadow: mobileOpen ? '0 0 40px rgba(0,0,0,0.18)' : 'none',
          }
        : { position: 'relative' }),
    }}>
      {!mobile && <button onClick={onToggleCollapse} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} style={{
        position: 'absolute', top: 36, right: -12,
        width: 22, height: 22, borderRadius: 11,
        background: WBRAND.white, border: `1px solid ${WBRAND.line}`,
        cursor: 'pointer', display: 'grid', placeItems: 'center',
        color: WBRAND.muted, padding: 0, zIndex: 5,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{
          transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform .2s ease',
        }}>
          <path d="M7.5 3L4.5 6L7.5 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>}

      <div style={{
        height: 72, flexShrink: 0, marginBottom: collapsed ? 18 : 16,
        padding: collapsed ? 0 : '0 8px',
        display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        {collapsed ? <WMark size={32}/> : <WLogotype mark={32} type={22}/>}
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        {NAV_GROUPS.slice(0, -1).map((g, gi) => (
          <div key={g.id} style={{ marginTop: gi === 0 ? 0 : (collapsed ? 10 : 14) }}>
            {!collapsed && (
              <div style={{
                fontFamily: WFONT, fontSize: 10, fontWeight: 700,
                color: WBRAND.muted2, letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: gi === 0 ? '0 12px 6px' : '8px 12px 6px',
              }}>{navT(g.label)}</div>
            )}
            {collapsed && gi > 0 && (
              <div style={{ width: 20, height: 1, background: WBRAND.line, margin: '4px auto 8px' }}/>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {g.items.map(it => {
                const on = it.id === active;
                return (
                  <button key={it.id} onClick={() => it.external ? window.open(it.external, '_blank', 'noopener') : go(it.id)}
                    title={collapsed ? it.label : undefined}
                    style={{
                      display: 'flex', alignItems: 'center',
                      gap: collapsed ? 0 : 12,
                      padding: collapsed ? '10px 0' : '9px 12px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      borderRadius: 8,
                      background: on ? WBRAND.panel : 'transparent',
                      color: on ? '#fff' : WBRAND.ink,
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      fontFamily: WFONT, fontWeight: on ? 700 : 500, fontSize: 13,
                      letterSpacing: '-0.005em',
                      position: 'relative',
                    }}>
                    {it.icon(on ? '#fff' : WBRAND.muted)}
                    {!collapsed && <span style={{ flex: 1 }}>{navT(it.label)}</span>}
                    {!collapsed && it.external && !on && (
                      <span style={{ display: 'inline-grid', placeItems: 'center', opacity: 0.7 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 5h10v10M19 5L9 15M5 9v10h10" stroke={WBRAND.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    )}
                    {!collapsed && it.badge && !on && (
                      <span style={{
                        fontFamily: WFONT, fontSize: 9, fontWeight: 800,
                        color: WBRAND.red, background: WBRAND.redSoft,
                        padding: '2px 6px', borderRadius: 4, letterSpacing: '0.04em',
                      }}>{t(it.badge, 'YENİ')}</span>
                    )}
                    {collapsed && it.badge && !on && (
                      <span style={{
                        position: 'absolute', top: 6, right: 6,
                        width: 6, height: 6, borderRadius: 3, background: WBRAND.red,
                      }}/>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Pinned last nav group (Help) — items only, no label */}
        {(() => {
          const g = NAV_GROUPS[NAV_GROUPS.length - 1];
          return (
            <div>
              {!collapsed
                ? <div style={{ height: 8 }}/>
                : <div style={{ width: 20, height: 1, background: WBRAND.line, margin: '0 auto 8px' }}/>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {g.items.map(it => {
                  const on = it.id === active;
                  return (
                    <button key={it.id} onClick={() => it.external ? window.open(it.external, '_blank', 'noopener') : go(it.id)}
                      title={collapsed ? it.label : undefined}
                      style={{
                        display: 'flex', alignItems: 'center',
                        gap: collapsed ? 0 : 12,
                        padding: collapsed ? '10px 0' : '9px 12px',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        borderRadius: 8,
                        background: on ? WBRAND.panel : 'transparent',
                        color: on ? '#fff' : WBRAND.ink,
                        border: 'none', cursor: 'pointer', textAlign: 'left',
                        fontFamily: WFONT, fontWeight: on ? 700 : 500, fontSize: 13,
                        letterSpacing: '-0.005em', position: 'relative',
                      }}>
                      {it.icon(on ? '#fff' : WBRAND.muted)}
                      {!collapsed && <span style={{ flex: 1 }}>{navT(it.label)}</span>}
                      {!collapsed && it.external && !on && (
                        <span style={{ display: 'inline-grid', placeItems: 'center', opacity: 0.7 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 5h10v10M19 5L9 15M5 9v10h10" stroke={WBRAND.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {!collapsed ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px', borderRadius: 8, background: WBRAND.surface,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: WBRAND.positive, boxShadow: `0 0 0 3px rgba(15,122,71,0.16)` }}/>
            <span style={{ fontFamily: WFONT, fontSize: 11, fontWeight: 600, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{t('All systems operational', 'Tüm sistemler çalışıyor')}</span>
          </div>
        ) : (
          <div title="All systems operational" style={{ display: 'grid', placeItems: 'center', padding: '8px 0' }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: WBRAND.positive, boxShadow: `0 0 0 3px rgba(15,122,71,0.16)` }}/>
          </div>
        )}
      </div>
    </aside>
  );

  if (!mobile) return aside;

  // Mobile: drawer + dimmed backdrop
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 55,
          background: 'rgba(0,0,0,0.45)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity .24s ease',
        }}
      />
      {aside}
    </>
  );
}
