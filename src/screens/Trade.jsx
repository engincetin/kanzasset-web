import { useState, useEffect, useMemo } from 'react';
import { WBRAND, WFONT, WMONO, wfmt, wparse, wdecimals, wgroup, wregroup, WRATES, WBALANCES, WMETA, WTXS, wMakePriceData } from '../lib/index.js';
import { WIcon } from '../components/icons.jsx';
import { AHLGMark } from '../components/coinicons.jsx';
import { WCard, WPrimary, WSecondary, WEyebrow, WNum, WMonoNum, WPill } from '../components/primitives.jsx';
import { WPriceChart, WRangeTabs, WQuoteCountdown } from '../components/charts.jsx';
import { WAssetSelector, WTimeline } from '../components/shared.jsx';
import { useIsMobile } from '../lib/useResponsive.js';
import { t } from '../lib/i18n.js';

// Fixed AHLG chip (mirrors the rounded asset chip used in the pay/receive boxes)
function AHLGChip() {
  return (
    <div style={{ background: WBRAND.white, color: WBRAND.ink, border: `1px solid ${WBRAND.line2}`, borderRadius: 999, padding: '6px 14px 6px 6px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
      <AHLGMark size={28}/>
      <span style={{ fontFamily: WFONT, fontWeight: 700, fontSize: 14 }}>AHLG</span>
    </div>
  );
}

export function WebTrade({ navigate, onOpenTx, initialSide = 'buy' }) {
  const mobile = useIsMobile();
  const [side, setSide] = useState(initialSide === 'sell' ? 'sell' : 'buy');
  const [amount, setAmount] = useState('');
  const [range, setRange] = useState('3M');
  const [confirming, setConfirming] = useState(false);

  // Buy: spend a non-AHLG asset to receive AHLG. Sell: spend AHLG to receive a non-AHLG asset.
  const buySources  = Object.keys(WBALANCES).filter(s => s !== 'AHLG' && WBALANCES[s] > 0)
    .map(s => ({ symbol: s, name: WMETA[s].name, balance: WBALANCES[s], rate: WRATES[s] / WRATES.AHLG }));
  const sellTargets = Object.keys(WBALANCES).filter(s => s !== 'AHLG')
    .map(s => ({ symbol: s, name: WMETA[s].name, balance: WBALANCES[s], rate: WRATES.AHLG / WRATES[s] }));

  const [from, setFrom] = useState(buySources[0]);   // buy: asset you pay with
  const [to, setTo]     = useState(sellTargets[0]);  // sell: asset you receive

  const switchTo = (s) => { if (s === side) return; setSide(s); setAmount(''); };
  const flip = () => switchTo(side === 'buy' ? 'sell' : 'buy');

  const amt = wparse(amount);
  const out = side === 'buy' ? amt * from.rate : amt * to.rate;

  // The non-AHLG asset drives the chart quote + fee panel
  const counter   = side === 'buy' ? from : to;
  const quote     = counter.symbol;
  const quoteRate = WRATES[quote] || 1;
  const priceData = wMakePriceData(90);
  const quotedData = priceData.map(d => ({ t: d.t, v: d.v / quoteRate }));
  const spot = WRATES.AHLG / quoteRate;
  const first = quotedData[0].v;
  const diff = spot - first;
  const pct = (diff / first) * 100;
  const vals = quotedData.map(d => d.v);
  const openV = vals[0], high = Math.max(...vals), low = Math.min(...vals);
  const isFiat = ['USDT', 'USDC', 'USD'].includes(quote);
  const px = (v, d = 2) => `${isFiat ? '$' : ''}${wfmt(v, d)}${isFiat ? '' : ' ' + quote}`;

  // Pay / receive box config
  const payBalance = side === 'sell' ? WBALANCES.AHLG : from.balance;
  const paySymbol  = side === 'sell' ? 'AHLG' : from.symbol;
  const outDecimals = side === 'buy' ? 4 : wdecimals(to.symbol);
  const insufficient = amt > payBalance + 1e-9;
  const canSubmit = out > 0 && !insufficient;

  // Recent trades = both buys (Mint) and sells (Redeem), regardless of the current side.
  const recent = WTXS.filter(x => x.type === 'Mint' || x.type === 'Redeem').slice(0, 5);

  return (
    <div style={{ padding: mobile ? '18px 16px 40px' : '28px 32px 48px', overflowY: 'auto', overflowX: 'hidden', height: '100%', boxSizing: 'border-box', position: 'relative' }}>
      <div style={{ marginBottom: 20 }}>
        <WEyebrow>{t('Buy / Sell')}</WEyebrow>
        <h1 style={{ margin: '6px 0 0', fontFamily: WFONT, fontSize: 28, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.025em' }}>{t('Buy or sell vaulted gold')}</h1>
        <div style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, marginTop: 6 }}>
          {t('Instantly swap between cash and gold at the live rate.')}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '480px 1fr', gap: mobile ? 16 : 20, alignItems: 'start' }}>

        {/* Left: form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>

          {/* Buy / Sell toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, padding: 4, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, borderRadius: 12 }}>
            {[
              { id: 'buy',  label: t('Buy'),  bg: 'linear-gradient(180deg, #18A765, #0F7A47)' },
              { id: 'sell', label: t('Sell'), bg: `linear-gradient(180deg, ${WBRAND.red}, ${WBRAND.redDeep})` },
            ].map(opt => {
              const on = side === opt.id;
              return (
                <button key={opt.id} onClick={() => switchTo(opt.id)} style={{ padding: '13px 16px', border: 'none', cursor: 'pointer', background: on ? opt.bg : 'transparent', color: on ? '#fff' : WBRAND.ink, borderRadius: 8, textAlign: 'center', boxShadow: on ? '0 1px 0 rgba(255,255,255,0.14) inset' : 'none' }}>
                  <div style={{ fontFamily: WFONT, fontWeight: 800, fontSize: 15, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{opt.label}</div>
                </button>
              );
            })}
          </div>

          {/* Swap card — remounts (and flips in) whenever the side changes */}
          <div key={side} className="kz-flip">
          <WCard padding={0}>
            <div style={{ padding: mobile ? '18px 16px 22px' : '22px 24px 26px' }}>
              <WEyebrow>{t('You pay')}</WEyebrow>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                <input value={amount} onChange={e => setAmount(wregroup(e.target.value))} inputMode="decimal" placeholder="0" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: WFONT, fontWeight: 800, fontSize: 36, color: WBRAND.ink, letterSpacing: '-0.035em', width: 0, minWidth: 0, fontVariantNumeric: 'tabular-nums' }}/>
                {side === 'buy'
                  ? <WAssetSelector value={from.symbol} options={buySources} onChange={s => setFrom(buySources.find(x => x.symbol === s))}/>
                  : <AHLGChip/>}
              </div>
              {/* Balance + quick-percent chips on their own rows so long
                  balances never collide with the chips */}
              <div style={{ fontFamily: WFONT, fontSize: 12, color: insufficient ? WBRAND.red : WBRAND.muted, marginTop: 12 }}>
                {t('Balance')}: <WMonoNum size={12} color={insufficient ? WBRAND.red : WBRAND.ink}>{wfmt(payBalance, wdecimals(paySymbol))}</WMonoNum> {paySymbol}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {[25, 50, 75].map(p => (
                  <button key={p} onClick={() => setAmount(wgroup(String(payBalance * p / 100)))} style={{ background: WBRAND.surface, border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 7, fontFamily: WFONT, fontSize: 11, fontWeight: 600, color: WBRAND.ink }}>{p}%</button>
                ))}
                <button onClick={() => setAmount(wgroup(String(payBalance)))} style={{ background: WBRAND.redSoft, border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 7, fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.red }}>{t('MAX')}</button>
              </div>
            </div>

            {/* Two-way swap button */}
            <div style={{ borderTop: `1px solid ${WBRAND.line}`, position: 'relative' }}>
              <button onClick={flip} title={t('Switch direction')} style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', width: 32, height: 32, borderRadius: 16, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, display: 'grid', placeItems: 'center', zIndex: 1, cursor: 'pointer', padding: 0, color: WBRAND.ink }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M7 4v13m0 0l-3-3m3 3l3-3M17 20V7m0 0l-3 3m3-3l3 3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            <div style={{ padding: mobile ? '24px 16px 18px' : '28px 24px 22px', background: WBRAND.surface2, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
              <WEyebrow>{t('You receive')}</WEyebrow>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                <div style={{ flex: 1, fontFamily: WFONT, fontWeight: 800, fontSize: 36, color: WBRAND.ink, letterSpacing: '-0.035em', fontVariantNumeric: 'tabular-nums', minWidth: 0, overflow: 'hidden' }}>{wfmt(out, outDecimals)}</div>
                {side === 'buy'
                  ? <AHLGChip/>
                  : <WAssetSelector value={to.symbol} options={sellTargets} onChange={s => setTo(sellTargets.find(x => x.symbol === s))}/>}
              </div>
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 8 }}>
                {side === 'buy'
                  ? <>{t('Equivalent to')} <WMonoNum size={12}>{wfmt(out, 4)} g</WMonoNum> {t('of physical gold')}</>
                  : t('Settles to your Kanzasset {sym} balance instantly').replace('{sym}', to.symbol)}
              </div>
            </div>
          </WCard>
          </div>

          {/* Quote details */}
          <WCard padding={0}>
            <div style={{ padding: '16px 22px 8px', borderBottom: `1px solid ${WBRAND.line}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{t('Quote details')}</div>
                  <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2 }}>{t('Refreshes every 10 seconds')}</div>
                </div>
                <WQuoteCountdown seconds={10}/>
              </div>
            </div>
            <div style={{ padding: '4px 22px 8px' }}>
              {[
                { l: t('Spot rate'),  v: side === 'buy' ? `1 AHLG = ${wfmt(WRATES.AHLG)} USDT` : `1 AHLG = ${wfmt(to.rate, wdecimals(to.symbol))} ${to.symbol}` },
                { l: t('Trade fee'),  v: `0.00% — ${t('promotional')}` },
                { l: t('Settlement'), v: side === 'buy' ? t('Instant on-chain') : t('Instant to balance') },
              ].map((r, i, arr) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
                  <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>{r.l}</span>
                  <span style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink, fontVariantNumeric: 'tabular-nums' }}>{r.v}</span>
                </div>
              ))}
            </div>
          </WCard>

          <WPrimary size="lg" tone={side === 'buy' ? 'green' : 'red'} onClick={() => canSubmit && setConfirming(true)} disabled={!canSubmit} style={{ width: '100%', justifyContent: 'center' }}>
            {side === 'buy'
              ? `${t('Buy')} ${wfmt(out, 4)} AHLG`
              : `${t('Sell')} ${wfmt(amt, 4)} AHLG`}
          </WPrimary>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: WBRAND.redSoft, borderRadius: 10 }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: WBRAND.red, color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0, fontFamily: WFONT, fontSize: 11, fontWeight: 800 }}>!</div>
            <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.ink, lineHeight: 1.5 }}>
              {t('AHLG is backed 1:1 by physical gold custodied at the Ahlatcı Metal Refinery FZCO vault, audited monthly by Bureau Veritas.')} <span style={{ color: WBRAND.red, fontWeight: 700, cursor: 'pointer' }}>{t('Read full terms')}</span>
            </div>
          </div>
        </div>

        {/* Right: chart + recent */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          <WCard padding={0}>
            <div style={{ padding: mobile ? '14px 16px 12px' : '18px 24px 14px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: mobile ? 'wrap' : 'nowrap', gap: mobile ? 10 : 0 }}>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>AHLG / {quote}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
                  <WNum size={26} weight={800} style={{ letterSpacing: '-0.025em' }}>{px(spot)}</WNum>
                  <span style={{ fontFamily: WFONT, fontSize: 13, color: pct >= 0 ? WBRAND.positive : WBRAND.red, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    {pct >= 0 ? '+' : ''}{wfmt(diff, 2)} ({pct >= 0 ? '+' : ''}{wfmt(pct, 2)}%)
                  </span>
                </div>
              </div>
              <WRangeTabs value={range} onChange={setRange}/>
            </div>
            <div style={{ padding: '12px 16px 18px' }}>
              <WPriceChart data={quotedData} height={280}/>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', borderTop: `1px solid ${WBRAND.line}` }}>
              {[
                { l: t('Open'),       v: px(openV) },
                { l: t('High'),       v: px(high) },
                { l: t('Low'),        v: px(low) },
                { l: t('Volume 24h'), v: '$8.41M' },
              ].map((k, i) => (
                <div key={i} style={{ padding: '12px 20px', borderRight: (mobile ? i % 2 === 0 : i < 3) ? `1px solid ${WBRAND.line}` : 'none', borderTop: mobile && i >= 2 ? `1px solid ${WBRAND.line}` : 'none' }}>
                  <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{k.l}</div>
                  <WMonoNum size={14} style={{ marginTop: 4, display: 'block' }}>{k.v}</WMonoNum>
                </div>
              ))}
            </div>
          </WCard>

          <WCard padding={0}>
            <div style={{ padding: '16px 22px 12px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{t('Your recent trades')}</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2 }}>{t('Last 30 days')}</div>
              </div>
              <button onClick={() => navigate('activity')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.red, display: 'flex', alignItems: 'center', gap: 4 }}>
                {t('View all')} {WIcon.arrowRight(WBRAND.red)}
              </button>
            </div>
            <div style={{ overflowX: mobile ? 'auto' : 'visible', WebkitOverflowScrolling: 'touch' }}>
            <div style={{ minWidth: mobile ? 520 : 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.8fr 1.1fr 1fr 110px', gap: 12, padding: '10px 22px', borderBottom: `1px solid ${WBRAND.line}`, background: WBRAND.surface2 }}>
              {['Date', 'Type', 'AHLG', 'Value', 'Status'].map((h, i) => (
                <div key={i} style={{ fontFamily: WFONT, fontSize: 10, fontWeight: 700, color: WBRAND.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t(h)}</div>
              ))}
            </div>
            {recent.map((tx, i, arr) => {
              const isBuy = tx.type === 'Mint';
              return (
              <div key={tx.id}
                onClick={() => onOpenTx && onOpenTx(tx)}
                onMouseEnter={onOpenTx ? (e => e.currentTarget.style.background = WBRAND.surface2) : undefined}
                onMouseLeave={onOpenTx ? (e => e.currentTarget.style.background = 'transparent') : undefined}
                style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.8fr 1.1fr 1fr 110px', gap: 12, padding: '12px 22px', alignItems: 'center', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}`, cursor: onOpenTx ? 'pointer' : 'default', transition: 'background .12s' }}>
                <div>
                  <WMonoNum size={12}>{tx.ts.slice(0, 10)}</WMonoNum>
                  <div style={{ fontFamily: WMONO, fontSize: 10, color: WBRAND.muted, marginTop: 2 }}>{tx.ts.slice(11, 16)}</div>
                </div>
                <span style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: isBuy ? WBRAND.positive : WBRAND.ink }}>{isBuy ? t('Buy') : t('Sell')}</span>
                <WMonoNum size={12} color={isBuy ? WBRAND.positive : WBRAND.ink} weight={500}>{isBuy ? '+' : '−'}{wfmt(Math.abs(tx.amount), 4)} AHLG</WMonoNum>
                <WMonoNum size={12} color={WBRAND.muted}>{tx.paid}</WMonoNum>
                <WPill tone={tx.status === 'completed' ? 'positive' : 'warn'}>{t(tx.status[0].toUpperCase() + tx.status.slice(1))}</WPill>
              </div>
              );
            })}
            </div>
            </div>
          </WCard>
        </div>
      </div>

      {confirming && (
        <TradeProgressModal
          side={side}
          amt={amt}
          out={out}
          asset={side === 'buy' ? from : to}
          onClose={() => setConfirming(false)}
          onTrack={() => { setConfirming(false); navigate('activity'); }}
        />
      )}
    </div>
  );
}

// Lightweight CSS confetti burst — celebrates a completed trade.
function KzConfetti() {
  const pieces = useMemo(() => {
    const colors = ['#D4202B', '#E8C97B', '#0F7A47', '#D9A441', '#24252C', '#F6D77B'];
    return Array.from({ length: 28 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      dur: 1.1 + Math.random() * 0.9,
      w: 5 + Math.random() * 5,
      c: colors[i % colors.length],
      drift: (Math.random() - 0.5) * 140,
      rot: 140 + Math.random() * 360,
    }));
  }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', borderRadius: 16 }}>
      {pieces.map((p, i) => (
        <span key={i} style={{
          position: 'absolute', top: -12, left: `${p.left}%`,
          width: p.w, height: p.w * 0.62, background: p.c, borderRadius: 1.5,
          '--kz-drift': `${p.drift}px`, '--kz-rot': `${p.rot}deg`,
          animation: `kzConfetti ${p.dur}s ease-in ${p.delay}s forwards`,
        }}/>
      ))}
    </div>
  );
}

function TradeProgressModal({ side, amt, out, asset, onClose, onTrack }) {
  const mobile = useIsMobile();
  const STEPS = side === 'buy'
    ? [
        { id: 'submitted',  title: t('Order received'),       sub: t('Order accepted and queued') },
        { id: 'locked',     title: t('Payment locked'),       sub: () => `${wfmt(amt, wdecimals(asset.symbol))} ${asset.symbol} ${t('reserved from balance')}` },
        { id: 'processing', title: t('Processing on-chain'),  sub: t('Issuing your gold tokens') },
        { id: 'done',       title: t('AHLG credited'),        sub: () => `${wfmt(out, 4)} AHLG ${t('credited to your wallet')}` },
      ]
    : [
        { id: 'submitted', title: t('Order received'),     sub: t('Order accepted and queued') },
        { id: 'settling',  title: t('Settling to balance'), sub: () => `${t('Converting at')} 1 AHLG = ${wfmt(asset.rate, wdecimals(asset.symbol))} ${asset.symbol}` },
        { id: 'credited',  title: t('Funds credited'),      sub: () => `${wfmt(out, wdecimals(asset.symbol))} ${asset.symbol} ${t('added to your wallet')}` },
        { id: 'done',      title: t('Finalising sale'),     sub: () => `${wfmt(amt, 4)} ${t('AHLG removed from circulation')}` },
      ];
  const [active, setActive] = useState(0);
  const [stamps, setStamps] = useState({});
  const ref = (side === 'buy' ? 'BY-' : 'SL-') + Math.floor(100000 + Math.random() * 899999);

  useEffect(() => {
    const now = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setStamps(s => ({ ...s, 0: now() }));
    const delays = side === 'buy' ? [900, 1700, 6700] : [900, 1900, 3000];
    const timers = delays.map((d, i) => setTimeout(() => { setActive(i + 1); setStamps(s => ({ ...s, [i + 1]: now() })); }, d));
    return () => timers.forEach(clearTimeout);
  }, []);

  const done = active >= STEPS.length - 1;
  const headAmount = side === 'buy' ? `${wfmt(out, 4)} AHLG` : `${wfmt(out, wdecimals(asset.symbol))} ${asset.symbol}`;
  const headLabel = done
    ? (side === 'buy' ? t('Buy complete') : t('Sell complete'))
    : (side === 'buy' ? t('Buying') : t('Selling'));

  return (
    <div onClick={done ? onClose : undefined} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(10,10,10,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: mobile ? 12 : 24,
    }}>
      <div onClick={e => e.stopPropagation()} className="kz-pop" style={{
        width: mobile ? '100%' : 440, maxWidth: '100%', background: WBRAND.white,
        borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.22)', overflow: 'hidden',
        position: 'relative',
      }}>
        {done && <KzConfetti/>}
        <div style={{ padding: mobile ? '16px 16px 14px' : '22px 24px 18px', borderBottom: `1px solid ${WBRAND.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AHLGMark size={40}/>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{headLabel}</div>
                <div style={{ fontFamily: WFONT, fontSize: 18, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.02em', marginTop: 2 }}>{headAmount}</div>
              </div>
            </div>
            <WMonoNum size={11} color={WBRAND.muted2}>{ref}</WMonoNum>
          </div>
        </div>

        <div style={{ padding: mobile ? '16px 16px 8px' : '20px 24px 8px' }}>
          <WTimeline steps={STEPS} active={active} stamps={stamps} done={done}/>
        </div>

        <div style={{ padding: mobile ? '8px 16px 16px' : '8px 24px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {done ? (
            <>
              <WPrimary size="lg" onClick={onTrack} style={{ width: '100%', justifyContent: 'center' }}>{t('Track in Activity')}</WPrimary>
              <WSecondary size="lg" onClick={onClose} style={{ width: '100%', justifyContent: 'center', height: 52 }}>{t('Done')}</WSecondary>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 0', fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 600 }}>
              {t('You can safely close this — settlement continues in the background.')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
