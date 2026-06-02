import { WBRAND, WFONT, WMONO } from '../lib/index.js';
import { WMark, WLogotype } from '../components/coinicons.jsx';

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
    ],
  },
  {
    id: 'ahlg',
    label: 'AHL Gold',
    items: [
      {
        id: 'mint', label: 'Mint', badge: 'NEW',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/>
          <path d="M12 9v6M9 12h6" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
        </svg>,
      },
      {
        id: 'redeem', label: 'Redeem',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="8" width="18" height="4" rx="1" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/>
          <path d="M5 12v8a1 1 0 001 1h12a1 1 0 001-1v-8" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/>
          <path d="M12 8v13" stroke={c} strokeWidth="1.7"/>
          <path d="M12 8c-1.4 0-2.5-1-2.5-2.2 0-1 .8-1.8 1.7-1.6.9.2 1.5 1.4 2.3 3.8M12 8c1.4 0 2.5-1 2.5-2.2 0-1-.8-1.8-1.7-1.6-.9.2-1.5 1.4-2.3 3.8" stroke={c} strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>,
      },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    items: [
      {
        id: 'activity', label: 'Activity',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M3 12h4l3-7 4 14 3-7h4" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>,
      },
      {
        id: 'profile', label: 'Profile',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="9" r="3.5" stroke={c} strokeWidth="1.7"/>
          <path d="M5 20c1.5-3.5 4.2-5 7-5s5.5 1.5 7 5" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
        </svg>,
      },
    ],
  },
];

export const NAV_ITEMS = NAV_GROUPS.flatMap(g => g.items);

export function WSidebar({ active, onNavigate, collapsed = false, onToggleCollapse }) {
  const width = collapsed ? 64 : 240;

  return (
    <aside style={{
      width, background: WBRAND.white,
      borderRight: `1px solid ${WBRAND.line}`,
      display: 'flex', flexDirection: 'column',
      padding: collapsed ? '28px 10px 16px' : '28px 16px 20px',
      flexShrink: 0,
      transition: 'width .22s ease, padding .22s ease',
      position: 'relative',
    }}>
      <button onClick={onToggleCollapse} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} style={{
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
      </button>

      <div style={{
        padding: collapsed ? '0 0 28px' : '0 8px 30px',
        display: 'flex', justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        {collapsed ? <WMark size={32}/> : <WLogotype mark={32} type={22}/>}
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        {NAV_GROUPS.map((g, gi) => (
          <div key={g.id} style={{ marginTop: gi === 0 ? 0 : (collapsed ? 10 : 14) }}>
            {!collapsed && (
              <div style={{
                fontFamily: WFONT, fontSize: 10, fontWeight: 700,
                color: WBRAND.muted2, letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: gi === 0 ? '0 12px 6px' : '8px 12px 6px',
              }}>{g.label}</div>
            )}
            {collapsed && gi > 0 && (
              <div style={{ width: 20, height: 1, background: WBRAND.line, margin: '4px auto 8px' }}/>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {g.items.map(it => {
                const on = it.id === active;
                return (
                  <button key={it.id} onClick={() => onNavigate(it.id)}
                    title={collapsed ? it.label : undefined}
                    style={{
                      display: 'flex', alignItems: 'center',
                      gap: collapsed ? 0 : 12,
                      padding: collapsed ? '10px 0' : '9px 12px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      borderRadius: 8,
                      background: on ? WBRAND.ink : 'transparent',
                      color: on ? '#fff' : WBRAND.ink,
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      fontFamily: WFONT, fontWeight: on ? 700 : 500, fontSize: 13,
                      letterSpacing: '-0.005em',
                      position: 'relative',
                    }}>
                    {it.icon(on ? '#fff' : WBRAND.muted)}
                    {!collapsed && <span style={{ flex: 1 }}>{it.label}</span>}
                    {!collapsed && it.badge && !on && (
                      <span style={{
                        fontFamily: WFONT, fontSize: 9, fontWeight: 800,
                        color: WBRAND.red, background: WBRAND.redSoft,
                        padding: '2px 6px', borderRadius: 4, letterSpacing: '0.04em',
                      }}>{it.badge}</span>
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
        {!collapsed ? (
          <>
            <div style={{
              background: WBRAND.ink, color: '#fff', borderRadius: 12,
              padding: 14, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: -30, right: -30,
                width: 100, height: 100, borderRadius: 50,
                background: WBRAND.red, opacity: 0.22, filter: 'blur(14px)',
              }}/>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
                <WMark size={14}/>
                <span style={{ fontFamily: WFONT, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>AHLG · USDT</span>
              </div>
              <div style={{
                fontFamily: WFONT, fontSize: 22, fontWeight: 800,
                color: '#fff', marginTop: 6, letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums', position: 'relative',
              }}>$151.56</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6, marginTop: 2,
                fontFamily: WFONT, fontSize: 11, color: '#7DD3A2', fontWeight: 600,
                fontVariantNumeric: 'tabular-nums', position: 'relative',
              }}>
                <span>▲ 0.24%</span>
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>· 24h</span>
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px', borderRadius: 8, background: WBRAND.surface,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: WBRAND.positive, boxShadow: `0 0 0 3px rgba(15,122,71,0.16)` }}/>
              <span style={{ fontFamily: WFONT, fontSize: 11, fontWeight: 600, color: WBRAND.ink, letterSpacing: '-0.005em' }}>All systems operational</span>
            </div>
          </>
        ) : (
          <>
            <div title="AHLG · $151.56 (+0.24%)" style={{
              background: WBRAND.ink, color: '#fff', borderRadius: 10,
              padding: '10px 6px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 2,
            }}>
              <WMark size={14}/>
              <span style={{ fontFamily: WMONO, fontSize: 10, fontWeight: 700, marginTop: 2 }}>$151</span>
              <span style={{ fontFamily: WFONT, fontSize: 9, color: '#7DD3A2', fontWeight: 700 }}>+0.24%</span>
            </div>
            <div title="All systems operational" style={{ display: 'grid', placeItems: 'center', padding: '8px 0' }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: WBRAND.positive, boxShadow: `0 0 0 3px rgba(15,122,71,0.16)` }}/>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
