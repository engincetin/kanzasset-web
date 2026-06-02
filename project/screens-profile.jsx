// Profile screen + nested views

const { useState: useStateP } = React;

function ProfileScreen({ state, setState }) {
  const [view, setView] = useStateP('home'); // home | personal | history | addresses | security | notifications | language | support | fees | legal
  if (view === 'home') return <ProfileHome onOpen={setView} />;
  return <ProfileSubview view={view} onBack={() => setView('home')} />;
}

function ProfileHome({ onOpen }) {
  const items = [
    { id: 'personal',      label: 'Personal information', sub: 'Name, email, phone, KYC',          icon: 'user' },
    { id: 'history',       label: 'Transaction history',  sub: 'Mints, redeems, transfers',         icon: 'list' },
    { id: 'addresses',     label: 'Address book',         sub: 'Crypto, fiat, physical addresses', icon: 'book' },
    { id: 'security',      label: 'Security',             sub: '2FA, sessions, device management', icon: 'shield' },
    { id: 'notifications', label: 'Notifications',        sub: 'Email, push, in-app',              icon: 'bell' },
    { id: 'language',      label: 'Language',             sub: 'English',                          icon: 'globe' },
    { id: 'fees',          label: 'Fees & limits',        sub: 'Schedule and tier perks',          icon: 'percent' },
    { id: 'support',       label: 'Help & support',       sub: 'Chat, FAQ, contact',               icon: 'help' },
    { id: 'legal',         label: 'Legal',                sub: 'Terms, privacy, disclosures',      icon: 'doc' },
  ];

  return (
    <div style={{ paddingBottom: 100 }}>
      <TopBar />
      <PageTitle>profile</PageTitle>

      {/* Identity card */}
      <div style={{ padding: '0 24px 18px' }}>
        <div style={{
          background: BRAND.ink, borderRadius: 24, padding: '20px 22px',
          display: 'flex', alignItems: 'center', gap: 16, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', bottom: -30, right: -30, width: 120, height: 120,
            borderRadius: 60, background: BRAND.red, opacity: 0.16, filter: 'blur(15px)',
          }}/>
          <div style={{
            width: 56, height: 56, borderRadius: 28,
            background: BRAND.red, display: 'grid', placeItems: 'center',
            color: '#fff', fontFamily: FONT, fontWeight: 800, fontSize: 22,
          }}>AY</div>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 17, color: '#fff', letterSpacing: '-0.01em' }}>Ahmet Yılmaz</div>
            <div style={{ fontFamily: FONT, fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>ahmet@kanzasset.com</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <Tag bg="rgba(255,255,255,0.12)" color="#fff">KYC Verified</Tag>
              <Tag bg="rgba(212,32,43,0.85)" color="#fff">Tier 2</Tag>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ padding: '0 24px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <Stat label="AHLG held" value={fmt(BALANCES.AHLG, 4)} />
        <Stat label="Lifetime mint" value="42.4000" />
        <Stat label="Redeemed" value="22.4000" />
      </div>

      {/* Menu */}
      <div style={{ padding: '0 24px' }}>
        <div style={{
          background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 22,
          overflow: 'hidden',
        }}>
          {items.map((it, i) => (
            <button key={it.id} onClick={() => onOpen(it.id)} style={{
              width: '100%', background: 'transparent', border: 'none',
              padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
              borderBottom: i === items.length - 1 ? 'none' : `1px solid ${BRAND.line}`,
              textAlign: 'left',
            }}>
              <MenuIcon kind={it.icon} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, color: BRAND.ink, letterSpacing: '-0.01em' }}>{T(it.label)}</div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 2 }}>{T(it.sub)}</div>
              </div>
              <ChevRight />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div style={{ padding: '18px 24px 0' }}>
        <button style={{
          width: '100%', height: 52, borderRadius: 16,
          background: BRAND.surface, border: 'none', cursor: 'pointer',
          fontFamily: FONT, fontWeight: 600, fontSize: 14, color: BRAND.red,
        }}>{T('Sign out')}</button>
        <div style={{
          fontFamily: FONT, fontSize: 11, color: BRAND.muted,
          textAlign: 'center', marginTop: 18,
        }}>
          Kanzasset v1.0.0 · DMCC license #1928374
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{
      background: BRAND.surface, borderRadius: 16, padding: '12px 14px',
    }}>
      <div style={{ fontFamily: FONT, fontSize: 11, color: BRAND.muted, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{T(label)}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, color: BRAND.ink, letterSpacing: '-0.02em', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

function Tag({ children, bg, color }) {
  return (
    <span style={{
      background: bg, color, fontFamily: FONT, fontWeight: 600, fontSize: 11,
      padding: '4px 8px', borderRadius: 10, letterSpacing: '-0.01em',
    }}>{typeof children === 'string' ? T(children) : children}</span>
  );
}

function MenuIcon({ kind }) {
  const c = BRAND.ink;
  const inner = {
    user: <><circle cx="12" cy="9" r="3.5" stroke={c} strokeWidth="1.7"/><path d="M5 20c1.5-3.5 4.2-5 7-5s5.5 1.5 7 5" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></>,
    list: <><path d="M8 7h11M8 12h11M8 17h11" stroke={c} strokeWidth="1.7" strokeLinecap="round"/><circle cx="5" cy="7" r="1" fill={c}/><circle cx="5" cy="12" r="1" fill={c}/><circle cx="5" cy="17" r="1" fill={c}/></>,
    book: <><path d="M5 5a2 2 0 0 1 2-2h11v18H7a2 2 0 0 1-2-2V5z" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/><path d="M5 19a2 2 0 0 1 2-2h11" stroke={c} strokeWidth="1.7"/></>,
    shield: <path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6l8-3z" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/>,
    bell: <><path d="M6 9a6 6 0 0 1 12 0c0 6 3 8 3 8H3s3-2 3-8z" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/><path d="M10 20a2 2 0 0 0 4 0" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></>,
    globe: <><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.7"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" stroke={c} strokeWidth="1.7"/></>,
    percent: <><path d="M6 18L18 6" stroke={c} strokeWidth="1.7" strokeLinecap="round"/><circle cx="8" cy="8" r="2.2" stroke={c} strokeWidth="1.7"/><circle cx="16" cy="16" r="2.2" stroke={c} strokeWidth="1.7"/></>,
    help: <><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.7"/><path d="M9.5 9.5a2.5 2.5 0 1 1 4 2c-1 .7-1.5 1.2-1.5 2.5" stroke={c} strokeWidth="1.7" strokeLinecap="round"/><circle cx="12" cy="17" r="1" fill={c}/></>,
    doc: <><path d="M7 3h7l4 4v14H7V3z" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/><path d="M14 3v4h4M9 12h6M9 16h6" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></>,
  };
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 12,
      background: BRAND.surface,
      display: 'grid', placeItems: 'center',
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">{inner[kind]}</svg>
    </div>
  );
}

// ──────────────────────────────────────────
// Profile sub-views (history, addresses, security, etc.)
// ──────────────────────────────────────────
function SubHeader({ title, onBack, trailing }) {
  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 16px 0',
      }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 18, background: BRAND.surface,
          border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke={BRAND.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {trailing ?? <div style={{ width: 36 }}/>}
      </div>
      <h1 style={{
        fontFamily: FONT, fontWeight: BRAND.titleWeight ?? 800, fontSize: 32, lineHeight: '36px',
        letterSpacing: BRAND.titleCase === 'uppercase' ? '0.01em' : '-0.04em',
        textTransform: BRAND.titleCase ?? 'lowercase',
        color: BRAND.ink, margin: '14px 24px 24px',
      }}>{T(title)}</h1>
    </div>
  );
}

function ProfileSubview({ view, onBack }) {
  const titles = {
    personal: 'personal',
    history: 'history',
    addresses: 'address book',
    security: 'security',
    notifications: 'notifications',
    language: 'language',
    support: 'support',
    fees: 'fees & limits',
    legal: 'legal',
  };
  return (
    <div style={{ paddingBottom: 100 }}>
      <SubHeader title={titles[view]} onBack={onBack} />
      <div style={{ padding: '0 24px' }}>
        {view === 'personal' && <PersonalView />}
        {view === 'history' && <HistoryView />}
        {view === 'addresses' && <AddressesView />}
        {view === 'security' && <SecurityView />}
        {view === 'notifications' && <NotificationsView />}
        {view === 'language' && <LanguageView />}
        {view === 'support' && <SupportView />}
        {view === 'fees' && <FeesView />}
        {view === 'legal' && <LegalView />}
      </div>
    </div>
  );
}

function ListCard({ rows }) {
  return (
    <div style={{
      background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 20,
      overflow: 'hidden',
    }}>
      {rows.map((r, i) => (
        <div key={i} style={{
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${BRAND.line}`,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, fontWeight: 500 }}>{T(r.label)}</div>
            <div style={{ fontFamily: FONT, fontSize: 14, color: BRAND.ink, fontWeight: 600, marginTop: 2, letterSpacing: '-0.01em' }}>{T(r.value)}</div>
          </div>
          {r.right ?? (r.editable && <span style={{ fontFamily: FONT, fontSize: 13, color: BRAND.red, fontWeight: 600 }}>{T('Edit')}</span>)}
        </div>
      ))}
    </div>
  );
}

function PersonalView() {
  return (
    <>
      <SmallLabel>Identity</SmallLabel>
      <ListCard rows={[
        { label: 'Full name',  value: 'Ahmet Yılmaz', editable: true },
        { label: 'Date of birth', value: '14 March 1989' },
        { label: 'Nationality', value: 'Turkish' },
        { label: 'KYC status', value: 'Verified · Tier 2', right: <span style={{ width: 8, height: 8, borderRadius: 4, background: '#15803D' }}/> },
      ]}/>
      <SmallLabel style={{ marginTop: 22 }}>Contact</SmallLabel>
      <ListCard rows={[
        { label: 'Email', value: 'ahmet@kanzasset.com', editable: true },
        { label: 'Phone', value: '+971 50 *** 4421', editable: true },
        { label: 'Country of residence', value: 'United Arab Emirates' },
      ]}/>
      <div style={{ height: 18 }}/>
      <SecondaryButton style={{ width: '100%' }}>Upgrade to Tier 3</SecondaryButton>
    </>
  );
}

function HistoryView() {
  const [filter, setFilter] = useStateP('all');
  const rows = [
    { type: 'mint', title: 'Mint AHLG', date: 'May 12 · 09:42', amount: '+1.2000 AHLG', counter: '151.56 USDT', status: 'Completed' },
    { type: 'deposit', title: 'Deposit USDT', date: 'May 11 · 14:08', amount: '+5,000.00 USDT', counter: 'Ethereum · 0x7A4f…E9c2A', status: 'Completed' },
    { type: 'redeem', title: 'Redeem digital', date: 'May 10 · 18:51', amount: '−0.8000 AHLG', counter: '121.25 USDT', status: 'Completed' },
    { type: 'physical', title: 'Physical redeem 10g', date: 'May 8 · 11:22', amount: '−10.0000 AHLG', counter: 'DHL · in transit', status: 'In transit' },
    { type: 'withdraw', title: 'Withdraw AED', date: 'May 4 · 16:01', amount: '−12,000.00 AED', counter: 'Emirates NBD ****1198', status: 'Completed' },
    { type: 'transfer', title: 'Transfer to @selin', date: 'May 1 · 22:10', amount: '−250.00 USDT', counter: 'Internal', status: 'Completed' },
  ];
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'mint', label: 'Mint' },
    { id: 'redeem', label: 'Redeem' },
    { id: 'deposit', label: 'Deposit' },
    { id: 'withdraw', label: 'Withdraw' },
    { id: 'transfer', label: 'Transfer' },
  ];
  const filtered = filter === 'all' ? rows : rows.filter(r => r.type === filter || (filter === 'redeem' && r.type === 'physical'));

  return (
    <>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto' }}>
        {filters.map(f => <Chip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</Chip>)}
      </div>
      <div style={{
        background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 20,
        padding: '4px 16px',
      }}>
        {filtered.map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
            borderBottom: i === filtered.length - 1 ? 'none' : `1px solid ${BRAND.line}`,
          }}>
            <HistoryIcon type={r.type} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, color: BRAND.ink, letterSpacing: '-0.01em' }}>{T(r.title)}</div>
              <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.date} · {r.counter}</div>
            </div>
            <div style={{ textAlign: 'end' }}>
              <div style={{
                fontFamily: FONT, fontSize: 14, fontWeight: 600,
                color: r.amount.startsWith('+') ? '#15803D' : BRAND.ink,
                fontVariantNumeric: 'tabular-nums',
              }}>{r.amount}</div>
              <div style={{
                fontFamily: FONT, fontSize: 11, fontWeight: 500,
                color: r.status === 'Completed' ? BRAND.muted : BRAND.red,
                marginTop: 2,
              }}>{T(r.status)}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function HistoryIcon({ type }) {
  const c = BRAND.ink;
  const map = {
    mint: <path d="M12 7v10M7 12h10" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>,
    redeem: <path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>,
    deposit: <path d="M12 5v10m0 0l-4-4m4 4l4-4" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>,
    withdraw: <path d="M12 19V9m0 0l-4 4m4-4l4 4" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>,
    transfer: <path d="M7 8h13l-3-3m3 3l-3 3M17 16H4l3 3m-3-3l3-3" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>,
    physical: <path d="M4 8l8-4 8 4v8l-8 4-8-4V8zm8-4v18M4 8l8 4 8-4" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/>,
  };
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 12, background: BRAND.surface,
      display: 'grid', placeItems: 'center',
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">{map[type]}</svg>
    </div>
  );
}

function AddressesView() {
  const [tab, setTab] = useStateP('crypto');
  return (
    <>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        <Chip active={tab === 'crypto'} onClick={() => setTab('crypto')}>Crypto</Chip>
        <Chip active={tab === 'fiat'} onClick={() => setTab('fiat')}>Bank</Chip>
        <Chip active={tab === 'physical'} onClick={() => setTab('physical')}>Physical</Chip>
      </div>
      {tab === 'crypto' && (
        <AddressList items={[
          { title: 'Cold wallet · USDT', sub: 'Ethereum · 0xC4e1…9hPq', tag: 'Withdraw' },
          { title: 'Cold wallet · USDC', sub: 'Ethereum · 0xA1b2…3F4d', tag: 'Withdraw' },
          { title: 'Hot wallet · USDT', sub: 'Ethereum · 0x88aF…8WzX', tag: 'Deposit' },
        ]}/>
      )}
      {tab === 'fiat' && (
        <AddressList items={[
          { title: 'Emirates NBD', sub: 'AED · IBAN AE07 0331…1198', tag: 'Withdraw' },
          { title: 'Wise', sub: 'USD · ACH 802135…2249', tag: 'Withdraw' },
          { title: 'Garanti BBVA', sub: 'EUR · TR33 0006 …0001', tag: 'Withdraw' },
        ]}/>
      )}
      {tab === 'physical' && (
        <AddressList items={[
          { title: 'Home · Dubai', sub: 'Marina Plaza, Tower 1, Apt 2208' },
          { title: 'Office · Dubai', sub: 'DMCC Almas Tower, Floor 38' },
          { title: 'Istanbul', sub: 'Levent Mah. Büyükdere Cad. No:185' },
        ]}/>
      )}
      <div style={{ height: 14 }}/>
      <button style={{
        width: '100%', background: 'transparent', border: `1.5px dashed ${BRAND.line}`,
        borderRadius: 16, padding: '14px', cursor: 'pointer',
        fontFamily: FONT, fontWeight: 600, fontSize: 14, color: BRAND.ink,
      }}>{T(tab === 'crypto' ? '+ Add new crypto address' : tab === 'fiat' ? '+ Add new bank account' : '+ Add new shipping address')}</button>
    </>
  );
}

function AddressList({ items }) {
  return (
    <div style={{
      background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 20,
      overflow: 'hidden',
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: i === items.length - 1 ? 'none' : `1px solid ${BRAND.line}`,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: BRAND.ink, letterSpacing: '-0.01em' }}>{T(it.title)}</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{T(it.sub)}</div>
          </div>
          {it.tag && (
            <span style={{
              fontFamily: FONT, fontSize: 10, fontWeight: 700, color: BRAND.muted,
              background: BRAND.surface, borderRadius: 8, padding: '4px 8px',
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>{it.tag}</span>
          )}
          <ChevRight />
        </div>
      ))}
    </div>
  );
}

function SecurityView() {
  return (
    <>
      <SmallLabel>Authentication</SmallLabel>
      <ToggleList rows={[
        { label: 'Biometric login', sub: 'Face ID', on: true },
        { label: 'Two-factor (authenticator app)', sub: 'Active · Google Authenticator', on: true },
        { label: 'SMS backup codes', sub: '+971 50 *** 4421', on: false },
        { label: 'Withdrawal whitelist', sub: 'Only whitelisted addresses', on: true },
      ]}/>
      <SmallLabel style={{ marginTop: 22 }}>Sessions</SmallLabel>
      <ListCard rows={[
        { label: 'This device', value: 'iPhone 16 Pro · Dubai', right: <span style={{ width: 8, height: 8, borderRadius: 4, background: '#15803D' }}/> },
        { label: 'MacBook · Safari', value: '2 days ago · Dubai' },
        { label: 'iPad', value: '1 week ago · Istanbul' },
      ]}/>
      <div style={{ height: 16 }}/>
      <button style={{
        width: '100%', background: BRAND.surface, border: 'none', borderRadius: 16,
        padding: '14px', cursor: 'pointer',
        fontFamily: FONT, fontWeight: 600, fontSize: 14, color: BRAND.red,
      }}>{T('Sign out other devices')}</button>
    </>
  );
}

function ToggleList({ rows }) {
  const [state, setS] = useStateP(rows.map(r => r.on));
  return (
    <div style={{
      background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 20,
      overflow: 'hidden',
    }}>
      {rows.map((r, i) => (
        <div key={i} style={{
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${BRAND.line}`,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, color: BRAND.ink, letterSpacing: '-0.01em' }}>{T(r.label)}</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 2 }}>{T(r.sub)}</div>
          </div>
          <Switch on={state[i]} onChange={() => setS(state.map((s, j) => j === i ? !s : s))}/>
        </div>
      ))}
    </div>
  );
}

function Switch({ on, onChange }) {
  return (
    <button onClick={onChange} style={{
      width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
      background: on ? BRAND.red : '#E0E0E0', position: 'relative',
      transition: 'background .2s ease',
    }}>
      <div style={{
        position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20,
        borderRadius: 10, background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
        transition: 'left .2s ease',
      }}/>
    </button>
  );
}

function NotificationsView() {
  return (
    <>
      <SmallLabel>Push notifications</SmallLabel>
      <ToggleList rows={[
        { label: 'Mint & redeem confirmations', sub: 'Status updates per transaction', on: true },
        { label: 'Price alerts', sub: 'AHLG gold spot moves >2%', on: true },
        { label: 'Marketing & product updates', sub: 'New features and offers', on: false },
      ]}/>
      <SmallLabel style={{ marginTop: 22 }}>Email</SmallLabel>
      <ToggleList rows={[
        { label: 'Weekly statements', sub: 'PDF every Monday 09:00', on: true },
        { label: 'Security alerts', sub: 'Logins, new devices', on: true },
      ]}/>
    </>
  );
}

function LanguageView() {
  const langs = [
    { code: 'en', label: 'English',  native: 'English' },
    { code: 'tr', label: 'Turkish',  native: 'Türkçe' },
    { code: 'ar', label: 'Arabic',   native: 'العربية' },
    { code: 'fr', label: 'French',   native: 'Français' },
    { code: 'de', label: 'German',   native: 'Deutsch' },
    { code: 'zh', label: 'Chinese',  native: '中文' },
  ];
  const [pick, setPick] = useStateP(window.LANG || 'en');
  const pickLang = (code) => {
    setPick(code);
    if (window.setLang) window.setLang(code);
  };
  return (
    <div style={{
      background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 20,
      overflow: 'hidden',
    }}>
      {langs.map((l, i) => (
        <button key={l.code} onClick={() => pickLang(l.code)} style={{
          width: '100%', background: 'transparent', border: 'none',
          padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer', textAlign: 'start',
          borderBottom: i === langs.length - 1 ? 'none' : `1px solid ${BRAND.line}`,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, color: BRAND.ink }}>{T(l.label)}</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 2 }}>{l.native}</div>
          </div>
          {pick === l.code && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5 9-10" stroke={BRAND.red} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      ))}
    </div>
  );
}

function SupportView() {
  return (
    <>
      <SmallLabel>Help center</SmallLabel>
      <ListCard rows={[
        { label: 'Live chat', value: 'Average reply 2 min', right: <ChevRight/> },
        { label: 'FAQ', value: 'Mint, redeem, custody', right: <ChevRight/> },
        { label: 'Email us', value: 'support@kanzasset.com', right: <ChevRight/> },
        { label: 'WhatsApp', value: '+971 4 *** 8800', right: <ChevRight/> },
      ]}/>
      <SmallLabel style={{ marginTop: 22 }}>Submit a request</SmallLabel>
      <div style={{
        background: BRAND.surface, borderRadius: 16, padding: '14px 16px',
      }}>
        <textarea placeholder={T('Describe your issue…')} style={{
          width: '100%', minHeight: 84, border: 'none', outline: 'none',
          background: 'transparent', resize: 'none',
          fontFamily: FONT, fontSize: 14, color: BRAND.ink,
        }}/>
      </div>
      <div style={{ height: 14 }}/>
      <PrimaryButton>Send</PrimaryButton>
    </>
  );
}

function FeesView() {
  return (
    <>
      <SmallLabel>Mint & redeem</SmallLabel>
      <ListCard rows={[
        { label: 'Mint fee', value: '0.00% · waived until launch' },
        { label: 'Digital redeem', value: '0.00%' },
        { label: 'Physical redeem (per shipment)', value: 'AED 120 + 1% insurance' },
        { label: 'Gas estimate', value: '≈ 1.00 USDT per tx' },
      ]}/>
      <SmallLabel style={{ marginTop: 22 }}>Custody</SmallLabel>
      <ListCard rows={[
        { label: 'Storage', value: 'Free up to 1 kg' },
        { label: 'Vault audit', value: 'Bureau Veritas · monthly' },
        { label: 'Insurance', value: 'Lloyd\u2019s of London' },
      ]}/>
      <SmallLabel style={{ marginTop: 22 }}>Tier limits (Tier 2)</SmallLabel>
      <ListCard rows={[
        { label: 'Daily mint', value: 'Up to 250,000 AED' },
        { label: 'Daily redeem', value: 'Up to 250,000 AED' },
        { label: 'Monthly physical', value: 'Up to 5 kg' },
      ]}/>
    </>
  );
}

function LegalView() {
  return (
    <ListCard rows={[
      { label: 'Terms of service', value: 'Last updated May 1, 2026', right: <ChevRight/> },
      { label: 'Privacy policy', value: 'GDPR & UAE PDPL', right: <ChevRight/> },
      { label: 'Token white paper', value: 'AHLG v1.2 · PDF', right: <ChevRight/> },
      { label: 'Custody disclosure', value: 'DMCC vault agreement', right: <ChevRight/> },
      { label: 'Risk disclosure', value: 'Volatility & operational risk', right: <ChevRight/> },
      { label: 'AML / KYC policy', value: 'Compliance framework', right: <ChevRight/> },
      { label: 'Licenses', value: 'VARA & DMCC', right: <ChevRight/> },
    ]}/>
  );
}

Object.assign(window, {
  ProfileScreen, ProfileHome, ProfileSubview, SubHeader, ListCard, ToggleList, Switch,
  Stat, Tag, MenuIcon, HistoryIcon, HistoryView, AddressesView, AddressList,
  SecurityView, NotificationsView, LanguageView, SupportView, FeesView, LegalView, PersonalView,
});
