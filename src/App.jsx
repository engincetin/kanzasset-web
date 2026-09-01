import { useState, useEffect } from 'react';
import { WBRAND, subscribeNumberStyle, subscribeTheme } from './lib/index.js';
import { useIsMobile } from './lib/useResponsive.js';
import { subscribeLang } from './lib/i18n.js';
import { WSidebar } from './layout/Sidebar.jsx';
import { WNotificationsDrawer } from './layout/NotificationsDrawer.jsx';
import { WLogotype } from './components/coinicons.jsx';
import { ToastHost } from './components/Toast.jsx';
import { WebAuth } from './screens/Login.jsx';
import { WebPortfolio } from './screens/Dashboard.jsx';
import { WebWallet } from './screens/Wallet.jsx';
import { WebMint } from './screens/Mint.jsx';
import { WebRedeem, WebPhysicalRedeem } from './screens/Redeem.jsx';
import { WebTrade } from './screens/Trade.jsx';
import { WebDeposit } from './screens/Deposit.jsx';
import { WebWithdraw } from './screens/Withdraw.jsx';
import { WebActivity } from './screens/Activity.jsx';
import { WebSupport } from './screens/Support.jsx';
import { WebProfile } from './screens/Profile.jsx';
import { WTxDetailModal } from './components/TxDetailModal.jsx';

function Screen({ active, navigate, onLogout, onOpenTx, profileSection, profileKey, supportTx, supportKey, tradeSide, tradeKey, dashboardKey }) {
  switch (active) {
    case 'dashboard': return <WebPortfolio key={dashboardKey} navigate={navigate} onOpenTx={onOpenTx} />;
    case 'wallet':    return <WebWallet    navigate={navigate} />;
    case 'trade':     return <WebTrade     key={tradeKey} navigate={navigate} onOpenTx={onOpenTx} initialSide={tradeSide} />;
    case 'physical':  return <WebPhysicalRedeem navigate={navigate} onOpenTx={onOpenTx} />;
    case 'mint':      return <WebMint      navigate={navigate} onOpenTx={onOpenTx} />;
    case 'redeem':    return <WebRedeem    navigate={navigate} onOpenTx={onOpenTx} />;
    case 'deposit':   return <WebDeposit   navigate={navigate} />;
    case 'withdraw':  return <WebWithdraw  navigate={navigate} />;
    case 'activity':  return <WebActivity  navigate={navigate} onOpenTx={onOpenTx} />;
    case 'support':   return <WebSupport   key={supportKey} navigate={navigate} prefillTx={supportTx} />;
    case 'profile':   return <WebProfile   key={profileKey} navigate={navigate} onLogout={onLogout} initialSection={profileSection} />;
    default:          return <WebPortfolio key={dashboardKey} navigate={navigate} onOpenTx={onOpenTx} />;
  }
}

function AppShell({ onLogout }) {
  const isMobile = useIsMobile();
  const [active, setActive] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [profileSection, setProfileSection] = useState('account');
  const [profileKey, setProfileKey] = useState(0);
  const [detailTx, setDetailTx] = useState(null);
  const [supportTx, setSupportTx] = useState(null);
  const [supportKey, setSupportKey] = useState(0);
  const [tradeSide, setTradeSide] = useState('buy');
  const [tradeKey, setTradeKey] = useState(0);
  const [dashboardKey, setDashboardKey] = useState(0);   // bump to remount → scroll to top

  const navigate = (screen, section) => {
    setActive(screen);
    setMobileNavOpen(false);
    if (screen === 'profile') {
      setProfileSection(section || 'account');
      setProfileKey(k => k + 1);
    }
    // Opening Support from the sidebar/menu starts fresh (no linked tx)
    if (screen === 'support' && !section) {
      setSupportTx(null);
      setSupportKey(k => k + 1);
    }
    // Buy/Sell can be opened pre-set to a side via the section arg
    if (screen === 'trade') {
      setTradeSide(section === 'sell' ? 'sell' : 'buy');
      setTradeKey(k => k + 1);
    }
    // Dashboard (Al/Sat home): remount so it lands back at the top
    if (screen === 'dashboard') setDashboardKey(k => k + 1);
  };

  // "Get help" from a transaction detail → open Support with that tx pre-linked
  const openSupportFor = (tx) => {
    setDetailTx(null);
    setSupportTx(tx);
    setSupportKey(k => k + 1);
    setActive('support');
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', overflow: 'hidden', position: 'relative', background: WBRAND.surface }}>
      <WSidebar
        active={active}
        onNavigate={navigate}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(c => !c)}
        mobile={isMobile}
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onNotifs={() => setNotifsOpen(o => !o)}
        onLogout={onLogout}
      />

      {/* Full-page content — no top bar */}
      <main style={{ flex: 1, minWidth: 0, height: '100%', overflow: 'hidden', background: WBRAND.surface, paddingTop: isMobile ? 56 : 0, boxSizing: 'border-box' }}>
        <Screen
          active={active}
          navigate={navigate}
          onLogout={onLogout}
          onOpenTx={setDetailTx}
          profileSection={profileSection}
          profileKey={profileKey}
          supportTx={supportTx}
          supportKey={supportKey}
          tradeSide={tradeSide}
          tradeKey={tradeKey}
        />
      </main>

      {/* Mobile top bar: logo on the left, menu button on the right */}
      {isMobile && (
        <header style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 45,
          height: 56, boxSizing: 'border-box',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 14px',
          background: WBRAND.white, borderBottom: `1px solid ${WBRAND.line}`,
        }}>
          <button onClick={() => navigate('dashboard')} aria-label="Kanzasset — Al / Sat" style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
            <WLogotype mark={28} type={20}/>
          </button>
          <button onClick={() => setMobileNavOpen(true)} aria-label="Menu" style={{
            width: 40, height: 40, borderRadius: 10,
            background: WBRAND.white, border: `1px solid ${WBRAND.line}`,
            display: 'grid', placeItems: 'center', cursor: 'pointer',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke={WBRAND.ink} strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </header>
      )}

      <WNotificationsDrawer open={notifsOpen} onClose={() => setNotifsOpen(false)} />

      {detailTx && (
        <WTxDetailModal
          tx={detailTx}
          onClose={() => setDetailTx(null)}
          onSupport={openSupportFor}
        />
      )}
    </div>
  );
}

// Persist the signed-in flag so a page/dev-server reload doesn't bounce you
// back to the login screen mid-session.
const AUTH_KEY = 'kz-auth';
const readAuth = () => { try { return localStorage.getItem(AUTH_KEY) === '1'; } catch { return false; } };

export default function App() {
  const [authed, setAuthed] = useState(readAuth);
  const [, force] = useState(0);

  const signIn  = () => { try { localStorage.setItem(AUTH_KEY, '1'); } catch { /* noop */ } setAuthed(true); };
  const signOut = () => { try { localStorage.removeItem(AUTH_KEY); } catch { /* noop */ } setAuthed(false); };

  // Re-render the whole app when the number-format or language preference changes
  useEffect(() => subscribeNumberStyle(() => force(n => n + 1)), []);
  useEffect(() => subscribeLang(() => force(n => n + 1)), []);
  useEffect(() => subscribeTheme(() => force(n => n + 1)), []);

  return (
    <>
      {authed
        ? <AppShell onLogout={signOut} />
        : <WebAuth onAuthed={signIn} />}
      <ToastHost />
    </>
  );
}
