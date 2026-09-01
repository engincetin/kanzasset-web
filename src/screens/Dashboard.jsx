import { WExchangePanel } from '../components/ExchangePanel.jsx';
import { TxHistoryCard } from '../components/shared.jsx';
import { useIsMobile } from '../lib/useResponsive.js';
import { t } from '../lib/i18n.js';

export function WebPortfolio({ navigate, onOpenTx }) {
  const mobile = useIsMobile();
  return (
    <div style={{ padding: mobile ? '18px 16px 40px' : '28px 32px 48px', minHeight: '100%', overflowY: 'auto', overflowX: 'hidden', height: '100%', boxSizing: 'border-box' }}>

      {/* Exchange — swap-first hero */}
      <WExchangePanel navigate={navigate}/>

      {/* Recent activity — unified transactions card with Buy/Sell/Deposit/Withdraw filters */}
      <div style={{ marginTop: mobile ? 14 : 20 }}>
        <TxHistoryCard
          title={t('Recent activity', 'Son işlemler')}
          subtitle={t('Last 7 days', 'Son 7 gün')}
          types={['Mint', 'Redeem', 'Deposit', 'Withdraw']}
          navigate={navigate}
          onOpenTx={onOpenTx}
          limit={6}
        />
      </div>
    </div>
  );
}
