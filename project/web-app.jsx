// ─── Kanzasset Web — root + design canvas wrapper ─────────────

const { useState: useWApp } = React;

// Full app shell with sidebar + topbar + scrollable content.
function WebShell({ initial = 'dashboard' }) {
  const [active, setActive] = useWApp(initial);
  const [collapsed, setCollapsed] = useWApp(false);
  const [notifsOpen, setNotifsOpen] = useWApp(false);

  const titles = {
    dashboard: { title: 'Welcome back, Ahmet',  sub: null,                              crumbs: [] },
    wallet:    { title: 'Wallet',            sub: 'Balances & holdings',             crumbs: [] },
    mint:      { title: 'Mint AHLG',         sub: 'Live rate · refreshed every 10s', crumbs: [] },
    redeem:    { title: 'Redeem AHLG',       sub: 'Live rate · refreshed every 10s', crumbs: [] },
    deposit:   { title: 'Deposit',           sub: 'Add crypto or fiat',              crumbs: [] },
    withdraw:  { title: 'Withdraw',          sub: 'Send to whitelisted destination', crumbs: [] },
    activity:  { title: 'Activity',          sub: 'All transaction history',         crumbs: [] },
    profile:   { title: 'Account settings',  sub: 'Tier 3 · institutional',          crumbs: [] },
  };
  const t = titles[active];

  return (
    <div style={{
      width: '100%', height: '100%',
      background: WBRAND.surface,
      display: 'flex',
      fontFamily: WFONT,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <WSidebar active={active} onNavigate={setActive} collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)}/>
      <div style={{
        flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
        height: '100%', overflow: 'hidden',
      }}>
        <WTopbar title={t.title} sub={t.sub} breadcrumbs={t.crumbs} onNavigate={setActive} onOpenNotifs={() => setNotifsOpen(true)}/>
        <main style={{ flex: 1, minHeight: 0, overflow: 'hidden', background: WBRAND.surface }}>
          {active === 'dashboard' && <WebPortfolio navigate={setActive}/>}
          {active === 'wallet'    && <WebWallet navigate={setActive}/>}
          {active === 'mint'      && <WebMint navigate={setActive}/>}
          {active === 'redeem'    && <WebRedeem navigate={setActive}/>}
          {active === 'deposit'   && <WebDeposit navigate={setActive}/>}
          {active === 'withdraw'  && <WebWithdraw navigate={setActive}/>}
          {active === 'activity'  && <WebActivity navigate={setActive}/>}
          {active === 'profile'   && <WebProfile navigate={setActive}/>}
        </main>
      </div>
      <WNotificationsDrawer open={notifsOpen} onClose={() => setNotifsOpen(false)}/>
    </div>
  );
}

// Heights tuned to each screen's natural content.
const ART_HEIGHTS = {
  dashboard: 2050,
  wallet:    1000,
  mint:      1180,
  redeem:    1480,
  deposit:   900,
  withdraw:  960,
  activity:  1580,
  profile:   1320,
};

function WebRoot() {
  return (
    <DesignCanvas
      defaultZoom={0.5}
      title="Kanzasset · AHLG web app"
      subtitle="Desktop 1440 · sidebar nav · 8 dedicated screens"
    >
      <DCSection
        id="screens"
        title="Desktop screens"
        subtitle="Sidebar nav is interactive within each frame — click between Dashboard, Wallet, Mint, Redeem, Deposit, Withdraw, Activity, Profile."
      >
        <DCArtboard id="dashboard" label="Dashboard · overview" width={1440} height={ART_HEIGHTS.dashboard}>
          <WebShell initial="dashboard"/>
        </DCArtboard>
        <DCArtboard id="wallet" label="Wallet · all balances" width={1440} height={ART_HEIGHTS.wallet}>
          <WebShell initial="wallet"/>
        </DCArtboard>
        <DCArtboard id="mint" label="Mint · convert to AHLG" width={1440} height={ART_HEIGHTS.mint}>
          <WebShell initial="mint"/>
        </DCArtboard>
        <DCArtboard id="redeem" label="Redeem · digital + physical" width={1440} height={ART_HEIGHTS.redeem}>
          <WebShell initial="redeem"/>
        </DCArtboard>
        <DCArtboard id="deposit" label="Deposit · crypto + fiat" width={1440} height={ART_HEIGHTS.deposit}>
          <WebShell initial="deposit"/>
        </DCArtboard>
        <DCArtboard id="withdraw" label="Withdraw · crypto + fiat" width={1440} height={ART_HEIGHTS.withdraw}>
          <WebShell initial="withdraw"/>
        </DCArtboard>
        <DCArtboard id="activity" label="Activity · all transactions" width={1440} height={ART_HEIGHTS.activity}>
          <WebShell initial="activity"/>
        </DCArtboard>
        <DCArtboard id="profile" label="Profile · account settings" width={1440} height={ART_HEIGHTS.profile}>
          <WebShell initial="profile"/>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<WebRoot/>);
