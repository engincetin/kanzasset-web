// ─── Sidebar + Topbar chrome ──────────────────────────────────

// Sidebar nav, grouped into sections.
const NAV_GROUPS = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="8" height="8"  rx="1.5" stroke={c} strokeWidth="1.7"/>
          <rect x="13" y="3" width="8" height="5" rx="1.5" stroke={c} strokeWidth="1.7"/>
          <rect x="13" y="10" width="8" height="11" rx="1.5" stroke={c} strokeWidth="1.7"/>
          <rect x="3" y="13" width="8" height="8" rx="1.5" stroke={c} strokeWidth="1.7"/>
        </svg>
      },
    ],
  },
  {
    id: 'funds',
    label: 'Funds',
    items: [
      { id: 'wallet', label: 'Wallet',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="18" height="14" rx="2" stroke={c} strokeWidth="1.7"/>
          <path d="M3 10h18" stroke={c} strokeWidth="1.7"/>
          <circle cx="17" cy="15" r="1.3" fill={c}/>
        </svg>
      },
      { id: 'deposit', label: 'Deposit',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 4v12m0 0l-4-4m4 4l4-4" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 20h16" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
      },
      { id: 'withdraw', label: 'Withdraw',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 20V8m0 0l-4 4m4-4l4 4" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 4h16" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
      },
    ],
  },
  {
    id: 'ahlg',
    label: 'AHL Gold',
    items: [
      { id: 'mint', label: 'Mint', badge: 'NEW',
        // Hexagonal token (minted asset) with + inside
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/>
          <path d="M12 9v6M9 12h6" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
      },
      { id: 'redeem', label: 'Redeem',
        // Gift / package with ribbon — claim something physical/digital
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="8" width="18" height="4" rx="1" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/>
          <path d="M5 12v8a1 1 0 001 1h12a1 1 0 001-1v-8" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/>
          <path d="M12 8v13" stroke={c} strokeWidth="1.7"/>
          <path d="M12 8c-1.4 0-2.5-1-2.5-2.2 0-1 .8-1.8 1.7-1.6.9.2 1.5 1.4 2.3 3.8M12 8c1.4 0 2.5-1 2.5-2.2 0-1-.8-1.8-1.7-1.6-.9.2-1.5 1.4-2.3 3.8" stroke={c} strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
      },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    items: [
      { id: 'activity', label: 'Activity',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M3 12h4l3-7 4 14 3-7h4" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      },
      { id: 'profile', label: 'Profile',
        icon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="9" r="3.5" stroke={c} strokeWidth="1.7"/>
          <path d="M5 20c1.5-3.5 4.2-5 7-5s5.5 1.5 7 5" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
      },
    ],
  },
];

// Back-compat: flat list for any other consumers.
const NAV_ITEMS = NAV_GROUPS.flatMap(g => g.items);

function WSidebar({ active, onNavigate, collapsed = false, onToggleCollapse }) {
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
      {/* Collapse toggle — half-overlaps the right border */}
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

      {/* Logo */}
      <div style={{
        padding: collapsed ? '0 0 28px' : '0 8px 30px',
        display: 'flex', justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        {collapsed ? <WMark size={32}/> : <WLogotype mark={32} type={22}/>}
      </div>

      {/* Nav — grouped */}
      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        {NAV_GROUPS.map((g, gi) => (
          <div key={g.id} style={{
            marginTop: gi === 0 ? 0 : (collapsed ? 10 : 14),
          }}>
            {!collapsed && (
              <div style={{
                fontFamily: WFONT, fontSize: 10, fontWeight: 700,
                color: WBRAND.muted2, letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: gi === 0 ? '0 12px 6px' : '8px 12px 6px',
              }}>{g.label}</div>
            )}
            {collapsed && gi > 0 && (
              <div style={{
                width: 20, height: 1, background: WBRAND.line,
                margin: '4px auto 8px',
              }}/>
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

      {/* Bottom block — markets + status */}
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
              padding: '8px 10px', borderRadius: 8,
              background: WBRAND.surface,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: 3,
                background: WBRAND.positive, boxShadow: `0 0 0 3px rgba(15,122,71,0.16)`,
              }}/>
              <span style={{ fontFamily: WFONT, fontSize: 11, fontWeight: 600, color: WBRAND.ink, letterSpacing: '-0.005em' }}>All systems operational</span>
            </div>
          </>
        ) : (
          <>
            {/* Compact price tile */}
            <div title="AHLG · $151.56 (+0.24%)" style={{
              background: WBRAND.ink, color: '#fff', borderRadius: 10,
              padding: '10px 6px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 2,
            }}>
              <WMark size={14}/>
              <span style={{ fontFamily: WMONO, fontSize: 10, fontWeight: 700, marginTop: 2 }}>$151</span>
              <span style={{ fontFamily: WFONT, fontSize: 9, color: '#7DD3A2', fontWeight: 700 }}>+0.24%</span>
            </div>
            {/* Status dot */}
            <div title="All systems operational" style={{
              display: 'grid', placeItems: 'center', padding: '8px 0',
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: 4,
                background: WBRAND.positive, boxShadow: `0 0 0 3px rgba(15,122,71,0.16)`,
              }}/>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

// ─── Topbar ───────────────────────────────────────────────────
function WTopbar({ title, sub, breadcrumbs = [], onNavigate, onOpenNotifs }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [theme, setTheme] = React.useState('Light');

  return (
    <header style={{
      height: 72, flexShrink: 0,
      background: WBRAND.white, borderBottom: `1px solid ${WBRAND.line}`,
      padding: '0 32px',
      display: 'flex', alignItems: 'center', gap: 24,
    }}>
      {/* Title block */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {breadcrumbs.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginBottom: 2,
            letterSpacing: '0.02em',
          }}>
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={i}>
                <span>{b}</span>
                {i < breadcrumbs.length - 1 && <span style={{ color: WBRAND.muted2 }}>/</span>}
              </React.Fragment>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <h1 style={{
            margin: 0, fontFamily: WFONT, fontSize: 22, fontWeight: 800,
            color: WBRAND.ink, letterSpacing: '-0.02em',
          }}>{title}</h1>
          {sub && <span style={{
            fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, fontWeight: 500,
            letterSpacing: '-0.005em',
          }}>{sub}</span>}
        </div>
      </div>

      {/* Bell */}
      <button onClick={onOpenNotifs} style={{
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

      {/* User pill + dropdown */}
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
          <div style={{ textAlign: 'left', minWidth: 0 }}>
            <div style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>Ahmet Yılmaz</div>
            <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, marginTop: 1 }}>Verified · Tier 3</div>
          </div>
          <span style={{
            transform: menuOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform .15s ease',
            display: 'inline-grid', placeItems: 'center',
          }}>{WIcon.arrowDown(WBRAND.muted)}</span>
        </button>

        {menuOpen && (
          <>
            <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }}/>
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: WBRAND.white, border: `1px solid ${WBRAND.line}`,
              borderRadius: 12, minWidth: 280, zIndex: 50,
              boxShadow: '0 12px 32px rgba(0,0,0,0.10)',
              overflow: 'hidden',
            }}>
              {/* Header card */}
              <div style={{
                padding: '16px 18px 14px', background: WBRAND.surface2,
                borderBottom: `1px solid ${WBRAND.line}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8,
                    background: 'linear-gradient(135deg, #1F1F1F, #4a4a4a)',
                    color: '#fff', display: 'grid', placeItems: 'center',
                    fontFamily: WFONT, fontWeight: 800, fontSize: 14,
                  }}>AY</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.005em' }}>Ahmet Yılmaz</div>
                    <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>ahmet@kanzasset.com</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <WPill tone="positive" style={{ fontSize: 10, padding: '3px 8px' }}>
                    {WIcon.check(WBRAND.positive)} Verified
                  </WPill>
                  <WPill tone="accent" style={{ fontSize: 10, padding: '3px 8px' }}>Tier 3</WPill>
                </div>
              </div>

              {/* Menu items */}
              <div style={{ padding: 6 }}>
                {[
                  { id: 'account',      label: 'Account settings',          icon: 'M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zM3 22c0-5 4-9 9-9s9 4 9 9' },
                  { id: 'security',     label: 'Security & 2FA',            icon: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z' },
                  { id: 'destinations', label: 'Whitelisted destinations',  icon: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4' },
                  { id: 'prefs',        label: 'Notifications',             icon: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9z' },
                ].map((it, i) => (
                  <button key={it.id} onClick={() => { setMenuOpen(false); onNavigate && onNavigate('profile'); }} style={{
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

              {/* Theme */}
              <div style={{
                padding: '4px 12px 12px',
                borderTop: `1px solid ${WBRAND.line}`,
                marginTop: 4,
              }}>
                <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '10px 0 8px' }}>Appearance</div>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4,
                  padding: 3, background: WBRAND.surface, borderRadius: 8,
                }}>
                  {['Light', 'Dark', 'System'].map(m => {
                    const on = theme === m;
                    return (
                      <button key={m} onClick={() => setTheme(m)} style={{
                        padding: '6px 0', border: 'none', cursor: 'pointer',
                        background: on ? WBRAND.white : 'transparent',
                        color: on ? WBRAND.ink : WBRAND.muted,
                        borderRadius: 6,
                        fontFamily: WFONT, fontWeight: 700, fontSize: 11,
                        boxShadow: on ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                      }}>{m}</button>
                    );
                  })}
                </div>
              </div>

              {/* Help + sign out */}
              <div style={{ padding: 6, borderTop: `1px solid ${WBRAND.line}` }}>
                <button onClick={() => { setMenuOpen(false); onNavigate && onNavigate('profile'); }} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '9px 12px', borderRadius: 6, border: 'none',
                  background: 'transparent', cursor: 'pointer', textAlign: 'left',
                  fontFamily: WFONT, fontSize: 13, fontWeight: 500, color: WBRAND.ink,
                  letterSpacing: '-0.005em',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke={WBRAND.muted} strokeWidth="1.7"/>
                    <path d="M12 17v.01M12 14a2 2 0 011-2 2 2 0 10-2-3" stroke={WBRAND.muted} strokeWidth="1.7" strokeLinecap="round"/>
                  </svg>
                  <span style={{ flex: 1 }}>Help & support</span>
                  {WIcon.external(WBRAND.muted)}
                </button>
                <button style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '9px 12px', borderRadius: 6, border: 'none',
                  background: 'transparent', cursor: 'pointer', textAlign: 'left',
                  fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.red,
                  letterSpacing: '-0.005em',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 12H4M4 12l4-4M4 12l4 4" stroke={WBRAND.red} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 4h9a2 2 0 012 2v12a2 2 0 01-2 2H9" stroke={WBRAND.red} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ flex: 1 }}>Sign out</span>
                </button>
              </div>

              {/* Footer */}
              <div style={{
                padding: '10px 14px', background: WBRAND.surface2,
                borderTop: `1px solid ${WBRAND.line}`,
                fontFamily: WFONT, fontSize: 10, color: WBRAND.muted,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
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

Object.assign(window, { WSidebar, WTopbar, NAV_ITEMS, NAV_GROUPS });
function WNotificationsDrawer({ open, onClose }) {
  const [tab, setTab] = React.useState('all');

  // Mock notifications grouped by date
  const groups = [
    {
      label: 'Today',
      items: [
        { id: 'n1', tone: 'positive', unread: true,  type: 'Mint',     title: 'Mint completed', sub: '1.2000 AHLG · paid 181.87 USDT · tx 9301', time: '12 min ago', actionLabel: 'View tx' },
        { id: 'n2', tone: 'warn',     unread: true,  type: 'Security', title: 'New whitelist pending review', sub: 'USDC address · 0xDeF456…789aBcD · 8h remaining', time: '2 hours ago', actionLabel: 'Review' },
        { id: 'n3', tone: 'neutral',  unread: true,  type: 'Price',    title: 'Price alert · AHLG crossed $150', sub: 'Spot trading at $151.56 · +0.24% past 24h', time: '4 hours ago' },
        { id: 'n4', tone: 'neutral',  unread: false, type: 'System',   title: 'Login from new device', sub: 'MacBook Pro · Chrome · Istanbul · 87.245.190.x', time: '7 hours ago' },
      ],
    },
    {
      label: 'Yesterday',
      items: [
        { id: 'n5', tone: 'positive', unread: false, type: 'Deposit',  title: 'Deposit received', sub: '5,000.00 USDT · Ethereum · 12 confirmations', time: 'Yesterday', actionLabel: 'View tx' },
        { id: 'n6', tone: 'positive', unread: false, type: 'Vault',    title: 'Vault audit published', sub: 'Bureau Veritas · April 2026 attestation', time: 'Yesterday', actionLabel: 'Open report' },
      ],
    },
    {
      label: 'Earlier this week',
      items: [
        { id: 'n7', tone: 'neutral',  unread: false, type: 'Redeem',   title: 'Redeem completed', sub: '0.8000 AHLG burned · 121.25 USDT credited', time: 'May 10' },
        { id: 'n8', tone: 'warn',     unread: false, type: 'Limit',    title: '80% of monthly withdrawal limit used', sub: '203k / 250k USDT · resets May 31', time: 'May 9' },
      ],
    },
  ];

  const allItems = groups.flatMap(g => g.items);
  const unreadCount = allItems.filter(n => n.unread).length;

  const filtered = (g) => g.items.filter(n => tab === 'unread' ? n.unread : true);
  const visibleGroups = groups.map(g => ({ ...g, items: filtered(g) })).filter(g => g.items.length > 0);

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.32)',
        zIndex: 80,
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity .2s ease',
      }}/>

      {/* Drawer */}
      <aside style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 440,
        background: WBRAND.white, borderLeft: `1px solid ${WBRAND.line}`,
        boxShadow: '0 0 32px rgba(0,0,0,0.10)',
        zIndex: 90,
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .25s cubic-bezier(.2,.7,.2,1)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 22px 14px', borderBottom: `1px solid ${WBRAND.line}`,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ margin: 0, fontFamily: WFONT, fontSize: 20, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.02em' }}>Notifications</h2>
                {unreadCount > 0 && <WPill tone="accent" style={{ fontSize: 11, padding: '4px 9px' }}>{unreadCount} new</WPill>}
              </div>
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 4 }}>
                Account events, transactions and security alerts
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8, border: 'none',
              background: WBRAND.surface, cursor: 'pointer',
              display: 'grid', placeItems: 'center', color: WBRAND.ink, flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Tabs + actions */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 14,
          }}>
            <div style={{ display: 'flex', gap: 2, padding: 3, background: WBRAND.surface, borderRadius: 8 }}>
              {[
                { id: 'all',    label: 'All',    count: allItems.length },
                { id: 'unread', label: 'Unread', count: unreadCount },
              ].map(t => {
                const on = tab === t.id;
                return (
                  <button key={t.id} onClick={() => setTab(t.id)} style={{
                    height: 28, padding: '0 12px', border: 'none', cursor: 'pointer',
                    background: on ? WBRAND.white : 'transparent',
                    color: on ? WBRAND.ink : WBRAND.muted,
                    fontFamily: WFONT, fontWeight: 700, fontSize: 12,
                    borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 6,
                    boxShadow: on ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  }}>
                    <span>{t.label}</span>
                    <span style={{
                      fontFamily: WMONO, fontSize: 10, fontWeight: 700,
                      color: on ? WBRAND.muted : WBRAND.muted2,
                    }}>{t.count}</span>
                  </button>
                );
              })}
            </div>
            <button style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.muted,
              letterSpacing: '0.02em',
            }}>Mark all read</button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {visibleGroups.length === 0 ? (
            <div style={{
              padding: '60px 22px', textAlign: 'center',
              fontFamily: WFONT, fontSize: 13, color: WBRAND.muted,
            }}>
              No {tab === 'unread' ? 'unread' : ''} notifications.
            </div>
          ) : visibleGroups.map((g, gi) => (
            <div key={g.label}>
              <div style={{
                padding: '14px 22px 8px',
                background: WBRAND.surface2,
                borderTop: gi > 0 ? `1px solid ${WBRAND.line}` : 'none',
                fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>{g.label}</div>
              {g.items.map((n, i) => <WNotifRow key={n.id} n={n} last={i === g.items.length - 1}/>)}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 22px', borderTop: `1px solid ${WBRAND.line}`,
          background: WBRAND.surface2, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke={WBRAND.ink} strokeWidth="1.7"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.01a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke={WBRAND.ink} strokeWidth="1.5"/>
            </svg>
            Notification preferences
          </button>
          <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted }}>
            Last 30 days
          </span>
        </div>
      </aside>
    </>
  );
}

function WNotifRow({ n, last }) {
  const tones = {
    positive: { bg: 'rgba(15,122,71,0.10)',  fg: WBRAND.positive },
    warn:     { bg: 'rgba(183,121,31,0.12)', fg: WBRAND.warn },
    neutral:  { bg: WBRAND.surface,           fg: WBRAND.ink },
    negative: { bg: WBRAND.redSoft,           fg: WBRAND.red },
  };
  const tone = tones[n.tone] ?? tones.neutral;

  // Per-type icon
  const typeIcon = {
    Mint:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M12 9v6M9 12h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
    Redeem:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="8" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M5 12v8a1 1 0 001 1h12a1 1 0 001-1v-8" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M12 8v13" stroke="currentColor" strokeWidth="1.7"/></svg>,
    Deposit:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Security: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>,
    Price:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 7h5v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Vault:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7"/><circle cx="15" cy="12" r="3" stroke="currentColor" strokeWidth="1.7"/></svg>,
    System:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M8 21h8M12 18v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
    Limit:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7"/><path d="M12 7v6M12 16v.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 22px',
      background: n.unread ? '#FCFCFA' : WBRAND.white,
      borderBottom: last ? 'none' : `1px solid ${WBRAND.line}`,
      position: 'relative',
    }}>
      {/* Type icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: tone.bg, color: tone.fg,
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>{typeIcon[n.type] ?? typeIcon.System}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{n.title}</span>
          {n.unread && <span style={{
            width: 6, height: 6, borderRadius: 3, background: WBRAND.red, flexShrink: 0,
          }}/>}
        </div>
        <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 3, lineHeight: 1.45 }}>{n.sub}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted2, fontWeight: 500 }}>{n.time}</span>
          {n.actionLabel && (
            <button style={{
              background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.red,
              display: 'inline-flex', alignItems: 'center', gap: 3,
            }}>
              {n.actionLabel}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WNotificationsDrawer, WNotifRow });