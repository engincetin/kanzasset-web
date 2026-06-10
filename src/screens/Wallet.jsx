import { useState } from 'react';
import { WBRAND, WFONT, wfmt, wdecimals, wTotalIn, WRATES, WBALANCES, WMETA } from '../lib/index.js';
import { t } from '../lib/i18n.js';
import { WIcon } from '../components/icons.jsx';
import { WCoinDot } from '../components/coinicons.jsx';
import { WCard, WSecondary, WGhost, WEyebrow, WNum, WMonoNum, WSectionTitle, useCountUp } from '../components/primitives.jsx';
import { AssetActionBtn } from '../components/shared.jsx';
import { useIsMobile } from '../lib/useResponsive.js';

export function WebWallet({ navigate }) {
  const mobile = useIsMobile();
  const [currency, setCurrency] = useState('USDT');
  const [kindFilter, setKindFilter] = useState('all');

  const allAssets = Object.keys(WMETA).map(s => {
    const bal = WBALANCES[s];
    const valUSDT = bal * WRATES[s];
    return {
      symbol: s, name: WMETA[s].name, kind: WMETA[s].kind,
      balance: bal, valUSDT,
      pct24h: s === 'AHLG' ? 0.24 : s === 'USDT' ? 0.00 : s === 'USDC' ? -0.01 : 0.08,
    };
  });
  const totalUSDT = allAssets.reduce((a, c) => a + c.valUSDT, 0);
  allAssets.forEach(a => { a.alloc = (a.valUSDT / totalUSDT) * 100; });

  const assets = allAssets
    .filter(a => {
      if (kindFilter === 'crypto') return a.kind === 'crypto';
      if (kindFilter === 'fiat')   return a.kind === 'fiat';
      return true;
    })
    .sort((a, b) => b.valUSDT - a.valUSDT);

  const total = wTotalIn(currency);
  const totalAed = wTotalIn('AED');
  const animTotal = useCountUp(total);
  const crypto = allAssets.filter(a => a.kind === 'crypto').reduce((s, a) => s + a.valUSDT, 0);
  const fiat   = allAssets.filter(a => a.kind === 'fiat').reduce((s, a) => s + a.valUSDT, 0);

  return (
    <div style={{ padding: mobile ? '18px 16px 40px' : '28px 32px 48px', overflowY: 'auto', overflowX: 'hidden', height: '100%', boxSizing: 'border-box' }}>

      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '2fr 1fr 1fr', gap: mobile ? 12 : 16, marginBottom: 20 }}>
        <WCard padding={22} style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'stretch' : 'flex-start', gap: mobile ? 16 : 0 }}>
            <div>
              <WEyebrow>{t('Total balance')}</WEyebrow>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
                <WNum size={34} weight={800} style={{ letterSpacing: '-0.03em' }}>{wfmt(animTotal, wdecimals(currency))}</WNum>
                <span style={{ fontFamily: WFONT, fontWeight: 700, fontSize: 14, color: WBRAND.muted }}>{currency}</span>
              </div>
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
                ≈ AED {wfmt(totalAed)} · <span style={{ color: WBRAND.positive, fontWeight: 700 }}>+2.81% {t('past month')}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, width: mobile ? '100%' : 'auto' }}>
              <WSecondary size="sm" onClick={() => navigate('deposit')} icon={WIcon.download(WBRAND.ink)} style={{ flex: mobile ? 1 : undefined, justifyContent: 'center' }}>{t('Deposit')}</WSecondary>
              <WSecondary size="sm" onClick={() => navigate('withdraw')} icon={WIcon.upload(WBRAND.ink)} style={{ flex: mobile ? 1 : undefined, justifyContent: 'center' }}>{t('Withdraw')}</WSecondary>
            </div>
          </div>
        </WCard>
        <WCard padding={22}>
          <WEyebrow>{t('Crypto')}</WEyebrow>
          <WNum size={22} weight={800} style={{ marginTop: 8, display: 'block', letterSpacing: '-0.025em' }}>${wfmt(crypto)}</WNum>
          <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 4, fontWeight: 500 }}>{wfmt(crypto / totalUSDT * 100, 1)}% {t('of portfolio')}</div>
        </WCard>
        <WCard padding={22}>
          <WEyebrow>{t('Fiat')}</WEyebrow>
          <WNum size={22} weight={800} style={{ marginTop: 8, display: 'block', letterSpacing: '-0.025em' }}>${wfmt(fiat)}</WNum>
          <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 4, fontWeight: 500 }}>{wfmt(fiat / totalUSDT * 100, 1)}% {t('of portfolio')}</div>
        </WCard>
      </div>

      <WCard padding={0}>
        <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'stretch' : 'center', gap: mobile ? 12 : 0 }}>
          <WSectionTitle title={t('All assets')} sub={`${assets.length} ${t('of')} ${allAssets.length} ${t('shown · sorted by value')}`} style={{ marginBottom: 0 }}/>
          <div style={{ display: 'flex', gap: 4 }}>
            <WGhost active={kindFilter === 'all'}    onClick={() => setKindFilter('all')}>{t('All')}</WGhost>
            <WGhost active={kindFilter === 'crypto'} onClick={() => setKindFilter('crypto')}>{t('Crypto')}</WGhost>
            <WGhost active={kindFilter === 'fiat'}   onClick={() => setKindFilter('fiat')}>{t('Fiat')}</WGhost>
          </div>
        </div>

        <div style={{ overflowX: mobile ? 'auto' : 'visible', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ minWidth: mobile ? 860 : 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 0.9fr 1.2fr 0.7fr 1fr 200px', gap: 12, padding: '10px 22px', borderBottom: `1px solid ${WBRAND.line}`, background: WBRAND.surface2 }}>
          {['Asset', 'Balance', 'Price', 'Value (USDT)', '24h', 'Allocation', 'Actions'].map((h, i) => (
            <div key={i} style={{ fontFamily: WFONT, fontSize: 10, fontWeight: 700, color: WBRAND.muted, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: i >= 1 && i <= 4 ? 'right' : i === 6 ? 'right' : 'left' }}>{t(h)}</div>
          ))}
        </div>

        {assets.length === 0 ? (
          <div style={{ padding: '40px 22px', textAlign: 'center', fontFamily: WFONT, fontSize: 13, color: WBRAND.muted }}>{t('No assets match this filter.')}</div>
        ) : assets.map((a, i) => {
          const zero = a.balance === 0;
          const priceStr = a.symbol === 'AHLG' ? '$151.56' : a.symbol === 'AED' ? '$0.272' : a.symbol === 'EUR' ? '$1.080' : a.symbol === 'GBP' ? '$1.270' : '$1.000';
          return (
            <div key={a.symbol} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 0.9fr 1.2fr 0.7fr 1fr 200px', gap: 12, padding: '14px 22px', alignItems: 'center', borderBottom: i === assets.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: zero ? 0.65 : 1 }}>
                <WCoinDot symbol={a.symbol} size={34}/>
                <div>
                  <div style={{ fontFamily: WFONT, fontSize: 14, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{t(a.name)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 600 }}>{a.symbol}</span>
                    <span style={{ fontFamily: WFONT, fontSize: 9, fontWeight: 700, color: WBRAND.muted, background: WBRAND.surface, padding: '1px 6px', borderRadius: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t(a.kind)}</span>
                  </div>
                </div>
              </div>
              <WMonoNum size={13} color={zero ? WBRAND.muted2 : WBRAND.ink} style={{ textAlign: 'right' }}>{wfmt(a.balance, wdecimals(a.symbol))}</WMonoNum>
              <WMonoNum size={13} color={zero ? WBRAND.muted2 : WBRAND.muted} style={{ textAlign: 'right' }}>{priceStr}</WMonoNum>
              <WMonoNum size={13} weight={600} color={zero ? WBRAND.muted2 : WBRAND.ink} style={{ textAlign: 'right' }}>${wfmt(a.valUSDT)}</WMonoNum>
              <span style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: zero ? WBRAND.muted2 : a.pct24h >= 0 ? WBRAND.positive : WBRAND.red, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{a.pct24h >= 0 ? '+' : ''}{wfmt(a.pct24h, 2)}%</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: zero ? 0.5 : 1 }}>
                <div style={{ flex: 1, height: 4, background: WBRAND.surface, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${a.alloc}%`, height: '100%', background: a.symbol === 'AHLG' ? WBRAND.red : WBRAND.ink }}/>
                </div>
                <WMonoNum size={11} color={WBRAND.muted}>{wfmt(a.alloc, 1)}%</WMonoNum>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                <AssetActionBtn label={t('Deposit')}  onClick={() => navigate('deposit')}/>
                <AssetActionBtn label={t('Withdraw')} onClick={() => navigate('withdraw')} disabled={zero}/>
              </div>
            </div>
          );
        })}
        </div>
        </div>
      </WCard>
    </div>
  );
}
