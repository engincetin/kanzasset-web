import { useState, useEffect } from 'react';
import { WBRAND, subscribeNumberStyle, subscribeTheme } from './lib/index.js';
import { useIsMobile } from './lib/useResponsive.js';
import { t, subscribeLang } from './lib/i18n.js';
import { WSidebar } from './layout/Sidebar.jsx';
import { WTopbar } from './layout/Topbar.jsx';
import { WNotificationsDrawer } from './layout/NotificationsDrawer.jsx';
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

const titlesFor = () => ({
  dashboard: { title: t('Welcome back'), sub: null },
  wallet:    { title: t('Wallet', 'Cüzdan'),            sub: t('Balances & holdings', 'Bakiyeler ve varlıklar') },
  mint:      { title: t('Mint AHLG', 'AHLG Üret'),      sub: t('Live rate · refreshed every 10s', 'Canlı kur · her 10 sn’de yenilenir') },
  redeem:    { title: t('Redeem AHLG', 'AHLG Boz'),     sub: t('Live rate · refreshed every 10s', 'Canlı kur · her 10 sn’de yenilenir') },
  trade:     { title: t('Buy / Sell'),                  sub: t('Live rate · refreshed every 10s', 'Canlı kur · her 10 sn’de yenilenir') },
  physical:  { title: t('Physical delivery'),           sub: t('Gold bars · 3–5 days') },
  deposit:   { title: t('Deposit', 'Para Yatır'),       sub: t('Add crypto or fiat', 'Kripto veya fiat ekle') },
  withdraw:  { title: t('Withdraw', 'Para Çek'),         sub: t('Send to whitelisted destination', 'Beyaz listedeki adrese gönder') },
  activity:  { title: t('Activity', 'İşlemler'),         sub: t('All transaction history', 'Tüm işlem geçmişi') },
  support:   { title: t('Support', 'Destek'),            sub: t('Help & tickets', 'Yardım ve talepler') },
  profile:   { title: t('Account settings', 'Hesap ayarları'), sub: t('Tier 3 · institutional', 'Kademe 3 · kurumsal') },
});

function Screen({ active, navigate, onLogout, onOpenTx, profileSection, profileKey, supportTx, supportKey, tradeSide, tradeKey }) {
  switch (active) {
    case 'dashboard': return <WebPortfolio navigate={navigate} onOpenTx={onOpenTx} />;
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
    default:          return <WebPortfolio navigate={navigate} onOpenTx={onOpenTx} />;
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

  const TITLES = titlesFor();
  const { title, sub } = TITLES[active] ?? TITLES.dashboard;

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
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', minWidth: 0 }}>
        <WTopbar
          title={title}
          sub={sub}
          mobile={isMobile}
          onMenu={isMobile ? () => setMobileNavOpen(true) : undefined}
          onNotifs={() => setNotifsOpen(o => !o)}
          onNavigate={navigate}
          onLogout={onLogout}
        />
        <main style={{ flex: 1, minHeight: 0, overflow: 'hidden', background: WBRAND.surface }}>
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
      </div>

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

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [, force] = useState(0);

  // Re-render the whole app when the number-format or language preference changes
  useEffect(() => subscribeNumberStyle(() => force(n => n + 1)), []);
  useEffect(() => subscribeLang(() => force(n => n + 1)), []);
  useEffect(() => subscribeTheme(() => force(n => n + 1)), []);

  return (
    <>
      {authed
        ? <AppShell onLogout={() => setAuthed(false)} />
        : <WebAuth onAuthed={() => setAuthed(true)} />}
      <ToastHost />
    </>
  );
}
