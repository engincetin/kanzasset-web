import { useState } from 'react';
import { WBRAND, WFONT, WMONO, wfmt, wparse, wdecimals, wTotalIn, WRATES, WBALANCES, WMETA, WTXS, isDark } from '../lib/index.js';
import { WIcon } from '../components/icons.jsx';
import { WCoinDot } from '../components/coinicons.jsx';
import { WCard, WPrimary, WSecondary, WEyebrow, WNum, WMonoNum, WPill, WSectionTitle, useCountUp } from '../components/primitives.jsx';
import { WExchangePanel } from '../components/ExchangePanel.jsx';
import { WTxRow, AssetActionBtn } from '../components/shared.jsx';
import { useIsMobile, useElementWidth } from '../lib/useResponsive.js';
import { t } from '../lib/i18n.js';

function AllocBar({ label, value, total, color }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: color }}/>
          <span style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <WMonoNum size={13} weight={700}>{wfmt(pct, 1)}%</WMonoNum>
          <WMonoNum size={10} color={WBRAND.muted}>${wfmt(value, 0)}</WMonoNum>
        </div>
      </div>
      <div style={{ height: 6, background: WBRAND.surface, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3 }}/>
      </div>
    </div>
  );
}

// Sort direction indicator for the balances table headers.
function SortCaret({ active, dir }) {
  return (
    <span style={{ display: 'inline-grid', placeItems: 'center', width: 9, height: 9, opacity: active ? 1 : 0.3 }}>
      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" style={{ transform: active && dir === 'asc' ? 'rotate(180deg)' : 'none' }}>
        <path d="M3 4.5L6 7.5L9 4.5" stroke={active ? WBRAND.red : WBRAND.muted2} strokeWidth={active ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

export function WebPortfolio({ navigate, onOpenTx }) {
  const mobile = useIsMobile();
  // The wallet/balances card now spans the full width; measure it so the table
  // degrades gracefully: drop the Allocation column first, then compact the
  // action buttons to icons before anything overflows.
  const [rowRef, gw] = useElementWidth();
  const tableW = gw === 0 ? 9999 : gw;
  // Proof-of-reserve strip: horizontal when wide, stacked rows + full-width
  // button when narrow.
  const [resRef, resW] = useElementWidth();
  const resNarrow = mobile || (resW > 0 && resW < 760);
  const hideAlloc  = !mobile && tableW < 800;
  const compactBtn = !mobile && tableW < 640;
  // Fixed Actions width (not `auto`) so the header grid and each row grid agree
  // on the column — otherwise they size independently and misalign.
  const actW = compactBtn ? '72px' : '180px';
  const balCols = hideAlloc ? `2.4fr 1.3fr 1.3fr ${actW}` : `2.2fr 1.3fr 1.3fr 1.3fr ${actW}`;
  const total = wTotalIn('USDT');
  const totalAed = wTotalIn('AED');
  const animTotal = useCountUp(total);

  // Sortable balances table.
  const [sortKey, setSortKey] = useState('value');   // name | balance | value | alloc
  const [sortDir, setSortDir] = useState('desc');
  const toggleSort = (key) => {
    if (key === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir(key === 'name' ? 'asc' : 'desc'); }
  };

  const assets = Object.keys(WBALANCES).map(s => {
    const bal = WBALANCES[s];
    const valUSDT = bal * WRATES[s];
    return {
      symbol: s, name: WMETA[s].name, kind: WMETA[s].kind,
      balance: bal, valUSDT,
      pct24h: s === 'AGOLD' ? 0.24 : s === 'USDT' ? 0.00 : s === 'USDC' ? -0.01 : 0.08,
      alloc: 0,
    };
  });
  const sumUSDT = assets.reduce((a, c) => a + c.valUSDT, 0);
  assets.forEach(a => { a.alloc = sumUSDT ? (a.valUSDT / sumUSDT) * 100 : 0; });
  const sortedAssets = [...assets].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    if (sortKey === 'name') return dir * t(a.name).localeCompare(t(b.name), 'tr');
    const av = sortKey === 'balance' ? a.balance : sortKey === 'alloc' ? a.alloc : a.valUSDT;
    const bv = sortKey === 'balance' ? b.balance : sortKey === 'alloc' ? b.alloc : b.valUSDT;
    return dir * (av - bv);
  });

  return (
    <div style={{ padding: mobile ? '18px 16px 40px' : '28px 32px 48px', minHeight: '100%', overflowY: 'auto', overflowX: 'hidden', height: '100%', boxSizing: 'border-box' }}>

      {/* Exchange — swap-first hero */}
      <WExchangePanel/>

      {/* Wallet — portfolio summary + balances in one block */}
      <WCard padding={0} style={{ minWidth: 0, marginBottom: mobile ? 14 : 20 }}>
        <div ref={rowRef}>
        {/* Account summary — one calm headline */}
        <div style={{ background: WBRAND.surface2, borderBottom: `1px solid ${WBRAND.line}`, padding: mobile ? '18px 18px' : '22px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t('Total portfolio value')}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: WFONT, fontWeight: 800, fontSize: mobile ? 28 : 34, color: WBRAND.ink, letterSpacing: '-0.035em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{wfmt(animTotal, 2)}</span>
              <span style={{ fontFamily: WFONT, fontWeight: 700, fontSize: 14, color: WBRAND.muted }}>USDT</span>
              <WPill tone="positive" style={{ fontSize: 11 }}>▲ +2.81%</WPill>
            </div>
            <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 8 }}>≈ AED {wfmt(totalAed)}</div>
          </div>
          <button onClick={() => navigate('wallet')} style={{ alignSelf: 'center', background: WBRAND.white, border: `1px solid ${WBRAND.line}`, cursor: 'pointer', fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 9 }}>
            {t('Wallet', 'Cüzdan')} {WIcon.arrowRight(WBRAND.ink)}
          </button>
        </div>

        {/* Balances — slim label */}
        <div style={{ padding: mobile ? '14px 18px 10px' : '16px 24px 10px' }}>
          <span style={{ fontFamily: WFONT, fontSize: 14, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{t('Balances')}</span>
          <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginLeft: 8 }}>{assets.length} {t('assets', 'varlık')}</span>
        </div>

          <div style={{ overflowX: (mobile || tableW < 520) ? 'auto' : 'visible', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ minWidth: mobile ? 820 : (tableW < 520 ? 520 : 'auto') }}>
          <div style={{ display: 'grid', gridTemplateColumns: balCols, gap: 16, padding: '10px 22px', borderBottom: `1px solid ${WBRAND.line}`, background: WBRAND.surface2 }}>
            {(hideAlloc
              ? [['Asset', 'name'], ['Balance', 'balance'], ['Value', 'value'], ['Actions', null]]
              : [['Asset', 'name'], ['Balance', 'balance'], ['Value', 'value'], ['Allocation', 'alloc'], ['Actions', null]]
            ).map(([h, k], i) => {
              const active = k && sortKey === k;
              const base = { fontFamily: WFONT, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: active ? WBRAND.ink : WBRAND.muted, display: 'flex', alignItems: 'center', gap: 4, justifyContent: i === 0 ? 'flex-start' : 'flex-end' };
              if (!k) return <div key={i} style={base}>{t(h)}</div>;
              return (
                <button key={i} onClick={() => toggleSort(k)} style={{ ...base, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {i !== 0 && <SortCaret active={active} dir={sortDir}/>}
                  {t(h)}
                  {i === 0 && <SortCaret active={active} dir={sortDir}/>}
                </button>
              );
            })}
          </div>

          {sortedAssets.map((a, i, arr) => {
            const zero = a.balance === 0;
            return (
              <div key={a.symbol} style={{ display: 'grid', gridTemplateColumns: balCols, gap: 16, padding: '14px 22px', alignItems: 'center', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: zero ? 0.65 : 1 }}>
                  <WCoinDot symbol={a.symbol} size={32}/>
                  <div>
                    <div style={{ fontFamily: WFONT, fontSize: 14, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{t(a.name)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 600 }}>{a.symbol}</span>
                      <span style={{ fontFamily: WFONT, fontSize: 9, fontWeight: 700, color: WBRAND.muted, background: WBRAND.surface, padding: '1px 6px', borderRadius: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t(a.kind)}</span>
                    </div>
                  </div>
                </div>
                <WMonoNum size={13} color={zero ? WBRAND.muted2 : WBRAND.ink} style={{ textAlign: 'right' }}>{wfmt(a.balance, wdecimals(a.symbol))}</WMonoNum>
                <WMonoNum size={13} weight={600} color={zero ? WBRAND.muted2 : WBRAND.ink} style={{ textAlign: 'right' }}>${wfmt(a.valUSDT)}</WMonoNum>
                {!hideAlloc && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, opacity: zero ? 0.5 : 1 }}>
                    <div style={{ width: 72, height: 4, background: WBRAND.surface, borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${a.alloc}%`, height: '100%', background: a.symbol === 'AGOLD' ? WBRAND.red : WBRAND.ink }}/>
                    </div>
                    <WMonoNum size={11} color={WBRAND.muted} style={{ minWidth: 38, textAlign: 'right' }}>{wfmt(a.alloc, 1)}%</WMonoNum>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                  <AssetActionBtn label={t('Deposit')} compact={compactBtn} icon={compactBtn ? WIcon.download(WBRAND.ink) : undefined} onClick={() => navigate('deposit')}/>
                  <AssetActionBtn label={t('Withdraw')} compact={compactBtn} icon={compactBtn ? WIcon.upload(WBRAND.ink) : undefined} onClick={() => navigate('withdraw')} disabled={zero}/>
                </div>
              </div>
            );
          })}
          </div>
          </div>
        </div>
      </WCard>

      {/* Proof of Reserve — full-width strip */}
      <WCard padding={0} style={{ marginBottom: mobile ? 14 : 20 }}>
        {(() => {
          const rows = [
            { k: t('Tokens in circulation'), v: '142,718.4203 AGOLD' },
            { k: t('Physical gold reserve'), v: '142.72 kg' },
            { k: t('Last audit'), v: t('May 28, 2026', '28 May 2026') },
            { k: t('Reserve ratio'), v: '100.00%' },
          ];
          const header = (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 260px', minWidth: 0 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: WBRAND.surface, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{WIcon.vault()}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: WFONT, fontSize: 14, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{t('Proof of Reserve')}</span>
                  <WPill tone="positive">{WIcon.check(WBRAND.positive)} {t('Verified')}</WPill>
                </div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2 }}>Ahlatcı Metal Refinery FZCO · {t('audited by Bureau Veritas')}</div>
              </div>
            </div>
          );
          const reportBtn = (full) => (
            <button style={{ width: full ? '100%' : 'auto', marginLeft: full ? 0 : 'auto', padding: '11px 14px', borderRadius: 8, background: WBRAND.surface, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: full ? 'center' : 'flex-start', gap: 8, fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink, flexShrink: 0 }}>
              <span>{t('View proof-of-reserves report')}</span>
              {WIcon.external(WBRAND.muted)}
            </button>
          );

          if (resNarrow) {
            // Stacked: header, then label/value rows, then full-width button.
            return (
              <div ref={resRef} style={{ padding: mobile ? '16px 18px' : '18px 22px' }}>
                {header}
                <div style={{ marginTop: 14, borderTop: `1px solid ${WBRAND.line}` }}>
                  {rows.map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i === rows.length - 1 ? 'none' : `1px dashed ${WBRAND.line}` }}>
                      <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>{r.k}</span>
                      <WMonoNum size={12.5}>{r.v}</WMonoNum>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12 }}>{reportBtn(true)}</div>
              </div>
            );
          }
          // Wide: horizontal strip.
          return (
            <div ref={resRef} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20, padding: '18px 22px' }}>
              {header}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
                {rows.map((r, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{r.k}</div>
                    <WMonoNum size={13} style={{ marginTop: 3, display: 'block' }}>{r.v}</WMonoNum>
                  </div>
                ))}
              </div>
              {reportBtn(false)}
            </div>
          );
        })()}
      </WCard>


      {/* Recent activity */}
      <div style={{ marginTop: 20 }}>
        <WCard padding={0}>
          <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <WSectionTitle title={t('Recent activity')} sub={t('Last 7 days')} style={{ marginBottom: 0 }}/>
            <button onClick={() => navigate('activity')} style={{ background: WBRAND.white, border: `1px solid ${WBRAND.line}`, cursor: 'pointer', fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 9 }}>
              {t('Activity', 'Tüm işlemler')} {WIcon.arrowRight(WBRAND.ink)}
            </button>
          </div>

          <div style={{ overflowX: mobile ? 'auto' : 'visible', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ minWidth: mobile ? 720 : 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '40px 1.2fr 1fr 1.2fr 1fr 1fr 110px', gap: 12, padding: '10px 22px', borderBottom: `1px solid ${WBRAND.line}`, background: WBRAND.surface2 }}>
            {['', 'Type', 'Asset', 'Amount', 'Counterparty', 'Date', 'Status'].map((h, i) => (
              <div key={i} style={{ fontFamily: WFONT, fontSize: 10, fontWeight: 700, color: WBRAND.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h ? t(h) : h}</div>
            ))}
          </div>

          {WTXS.slice(0, 6).map((tx, i, arr) => <WTxRow key={tx.id} tx={tx} last={i === arr.length - 1} onOpen={onOpenTx}/>)}
          </div>
          </div>
        </WCard>
      </div>
    </div>
  );
}
