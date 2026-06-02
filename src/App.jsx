import { useState } from 'react';
import { WBRAND } from './lib/index.js';
import { WSidebar } from './layout/Sidebar.jsx';
import { WTopbar } from './layout/Topbar.jsx';
import { WNotificationsDrawer } from './layout/NotificationsDrawer.jsx';
import { WebAuth } from './screens/Login.jsx';
import { WebPortfolio } from './screens/Dashboard.jsx';
import { WebWallet } from './screens/Wallet.jsx';
import { WebMint } from './screens/Mint.jsx';
import { WebRedeem } from './screens/Redeem.jsx';
import { WebDeposit } from './screens/Deposit.jsx';
import { WebWithdraw } from './screens/Withdraw.jsx';
import { WebActivity } from './screens/Activity.jsx';
import { WebProfile } from './screens/Profile.jsx';

const TITLES = {
  dashboard: { title: 'Welcome back, Ahmet', sub: null },
  wallet:    { title: 'Wallet',               sub: 'Balances & holdings' },
  mint:      { title: 'Mint AHLG',            sub: 'Live rate · refreshed every 10s' },
  redeem:    { title: 'Redeem AHLG',          sub: 'Live rate · refreshed every 10s' },
  deposit:   { title: 'Deposit',              sub: 'Add crypto or fiat' },
  withdraw:  { title: 'Withdraw',             sub: 'Send to whitelisted destination' },
  activity:  { title: 'Activity',             sub: 'All transaction history' },
  profile:   { title: 'Account settings',     sub: 'Tier 3 · institutional' },
};

function Screen({ active, navigate, onLogout }) {
  switch (active) {
    case 'dashboard': return <WebPortfolio navigate={navigate} />;
    case 'wallet':    return <WebWallet    navigate={navigate} />;
    case 'mint':      return <WebMint      navigate={navigate} />;
    case 'redeem':    return <WebRedeem    navigate={navigate} />;
    case 'deposit':   return <WebDeposit   navigate={navigate} />;
    case 'withdraw':  return <WebWithdraw  navigate={navigate} />;
    case 'activity':  return <WebActivity  navigate={navigate} />;
    case 'profile':   return <WebProfile   navigate={navigate} onLogout={onLogout} />;
    default:          return <WebPortfolio navigate={navigate} />;
  }
}

function AppShell({ onLogout }) {
  const [active, setActive] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);

  const { title, sub } = TITLES[active] ?? TITLES.dashboard;

  const navigate = (screen) => setActive(screen);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', overflow: 'hidden', position: 'relative', background: WBRAND.surface }}>
      <WSidebar
        active={active}
        onNavigate={navigate}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(c => !c)}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', minWidth: 0 }}>
        <WTopbar
          title={title}
          sub={sub}
          onNotifs={() => setNotifsOpen(o => !o)}
          onNavigate={navigate}
          onLogout={onLogout}
        />
        <main style={{ flex: 1, minHeight: 0, overflow: 'hidden', background: WBRAND.surface }}>
          <Screen active={active} navigate={navigate} onLogout={onLogout} />
        </main>
      </div>

      <WNotificationsDrawer open={notifsOpen} onClose={() => setNotifsOpen(false)} />
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(false);

  if (!authed) return <WebAuth onAuthed={() => setAuthed(true)} />;

  return <AppShell onLogout={() => setAuthed(false)} />;
}
