import { useState, useEffect } from 'react';
import { WBRAND, WFONT, WMONO, wfmt, wparse, wdecimals, wgroup, wregroup, WRATES, WBALANCES, WMETA, WTXS, wMakePriceData } from '../lib/index.js';
import { WIcon } from '../components/icons.jsx';
import { AHLGMark } from '../components/coinicons.jsx';
import { WCard, WPrimary, WSecondary, WEyebrow, WNum, WMonoNum, WPill } from '../components/primitives.jsx';
import { WPriceChart, WRangeTabs, WQuoteCountdown } from '../components/charts.jsx';
import { WAssetSelector } from '../components/shared.jsx';
import { useIsMobile } from '../lib/useResponsive.js';
import { t } from '../lib/i18n.js';

export function WebMint({ navigate, onOpenTx }) {
  const mobile = useIsMobile();
  const sources = Object.keys(WBALANCES)
    .filter(s => s !== 'AHLG' && WBALANCES[s] > 0)
    .map(s => ({ symbol: s, name: WMETA[s].name, balance: WBALANCES[s], rate: WRATES[s] / WRATES.AHLG }));

  const [from, setFrom] = useState(sources[0]);
  const [amount, setAmount] = useState('');
  const [range, setRange] = useState('3M');
  const [minting, setMinting] = useState(false);

  const out = wparse(amount) * from.rate;
  const priceData = wMakePriceData(90);

  const quote = from.symbol;
  const quoteRate = WRATES[quote] || 1;
  const quotedData = priceData.map(d => ({ t: d.t, v: d.v / quoteRate }));
  const spot = WRATES.AHLG / quoteRate;
  const first = quotedData[0].v;
  const diff = spot - first;
  const pct = (diff / first) * 100;
  const vals = quotedData.map(d => d.v);
  const openV = vals[0];
  const high = Math.max(...vals);
  const low = Math.min(...vals);
  const isFiat = ['USDT', 'USDC', 'USD'].includes(quote);
  const px = (v, d = 2) => `${isFiat ? '$' : ''}${wfmt(v, d)}${isFiat ? '' : ' ' + quote}`;

  return (
    <div style={{ padding: mobile ? '18px 16px 40px' : '28px 32px 48px', overflowY: 'auto', overflowX: 'hidden', height: '100%', boxSizing: 'border-box', position: 'relative' }}>
      <div style={{ marginBottom: 20 }}>
        <WEyebrow>{t('Mint AHLG')}</WEyebrow>
        <h1 style={{ margin: '6px 0 0', fontFamily: WFONT, fontSize: 28, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.025em' }}>{t('Convert cash to vaulted gold')}</h1>
        <div style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, marginTop: 6 }}>
          {t('Mint AHL Gold tokens backed 1:1 by physical bullion held in the Ahlatcı Metal Refinery FZCO vault.')}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '480px 1fr', gap: mobile ? 16 : 20 }}>

        {/* Left: form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <WCard padding={0}>
            <div style={{ padding: mobile ? '18px 16px 16px' : '22px 24px 20px' }}>
              <WEyebrow>{t('You pay')}</WEyebrow>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                <input value={amount} onChange={e => setAmount(wregroup(e.target.value))} inputMode="decimal" placeholder="0" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: WFONT, fontWeight: 800, fontSize: 36, color: WBRAND.ink, letterSpacing: '-0.035em', width: 0, minWidth: 0, fontVariantNumeric: 'tabular-nums' }}/>
                <WAssetSelector value={from.symbol} options={sources} onChange={s => setFrom(sources.find(x => x.symbol === s))}/>
              </div>
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>{t('Balance:')} <WMonoNum size={12}>{wfmt(from.balance, wdecimals(from.symbol))}</WMonoNum> {from.symbol}</span>
                <span style={{ display: 'flex', gap: 6 }}>
                  {[25, 50, 75].map(p => (
                    <button key={p} onClick={() => setAmount(wgroup(String(from.balance * p / 100)))} style={{ background: WBRAND.surface, border: 'none', cursor: 'pointer', padding: '2px 8px', borderRadius: 6, fontFamily: WFONT, fontSize: 11, fontWeight: 600, color: WBRAND.ink }}>{p}%</button>
                  ))}
                  <button onClick={() => setAmount(wgroup(String(from.balance)))} style={{ background: WBRAND.surface, border: 'none', cursor: 'pointer', padding: '2px 8px', borderRadius: 6, fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.ink }}>{t('MAX')}</button>
                </span>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${WBRAND.line}`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', width: 32, height: 32, borderRadius: 16, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, display: 'grid', placeItems: 'center', zIndex: 1 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14m0 0l-5-5m5 5l5-5" stroke={WBRAND.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>

            <div style={{ padding: mobile ? '18px 16px 18px' : '22px 24px 22px', background: WBRAND.surface2, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
              <WEyebrow>{t('You receive')}</WEyebrow>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                <div style={{ flex: 1, fontFamily: WFONT, fontWeight: 800, fontSize: 36, color: WBRAND.ink, letterSpacing: '-0.035em', fontVariantNumeric: 'tabular-nums' }}>{wfmt(out, 4)}</div>
                <div style={{ background: WBRAND.white, color: WBRAND.ink, border: `1px solid ${WBRAND.line2}`, borderRadius: 999, padding: '6px 14px 6px 6px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <AHLGMark size={28}/>
                  <span style={{ fontFamily: WFONT, fontWeight: 700, fontSize: 14 }}>AHLG</span>
                </div>
              </div>
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 8 }}>
                {t('Equivalent to')} <WMonoNum size={12}>{wfmt(out, 4)} g</WMonoNum> {t('of physical gold')}
              </div>
            </div>
          </WCard>

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
                { l: t('Spot rate'),  v: `1 AHLG = ${wfmt(WRATES.AHLG)} USDT` },
                { l: t('Network'),    v: 'Ethereum · ERC-20' },
                { l: t('Mint fee'),   v: `0.00% — ${t('promotional')}` },
                { l: t('Settlement'), v: t('Instant on-chain') },
              ].map((r, i, arr) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
                  <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>{r.l}</span>
                  <span style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink, fontVariantNumeric: 'tabular-nums' }}>{r.v}</span>
                </div>
              ))}
            </div>
          </WCard>

          <WPrimary size="lg" onClick={() => out > 0 && setMinting(true)} disabled={out <= 0} style={{ width: '100%', justifyContent: 'center' }}>
            {t('Mint')} {wfmt(out, 4)} AHLG
          </WPrimary>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: WBRAND.redSoft, borderRadius: 10 }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: WBRAND.red, color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0, fontFamily: WFONT, fontSize: 11, fontWeight: 800 }}>!</div>
            <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.ink, lineHeight: 1.5 }}>
              {t('By minting, you acknowledge AHLG tokens are backed 1:1 by physical gold custodied at the Ahlatcı Metal Refinery FZCO vault, audited monthly by Bureau Veritas.')} <span style={{ color: WBRAND.ink, fontWeight: 700, cursor: 'pointer' }}>{t('Read full terms')}</span>
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
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{t('Your recent mints')}</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2 }}>{t('Last 30 days')}</div>
              </div>
              <button onClick={() => navigate('activity')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.ink, display: 'flex', alignItems: 'center', gap: 4 }}>
                {t('View all')} {WIcon.arrowRight(WBRAND.ink)}
              </button>
            </div>
            <div style={{ overflowX: mobile ? 'auto' : 'visible', WebkitOverflowScrolling: 'touch' }}>
            <div style={{ minWidth: mobile ? 520 : 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 110px', gap: 12, padding: '10px 22px', borderBottom: `1px solid ${WBRAND.line}`, background: WBRAND.surface2 }}>
              {['Date', 'Paid', 'Received', 'Rate', 'Status'].map(h => t(h)).map((h, i) => (
                <div key={i} style={{ fontFamily: WFONT, fontSize: 10, fontWeight: 700, color: WBRAND.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {WTXS.filter(t => t.type === 'Mint').slice(0, 4).map((tx, i, arr) => (
              <div key={tx.id}
                onClick={() => onOpenTx && onOpenTx(tx)}
                onMouseEnter={onOpenTx ? (e => e.currentTarget.style.background = WBRAND.surface2) : undefined}
                onMouseLeave={onOpenTx ? (e => e.currentTarget.style.background = 'transparent') : undefined}
                style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 110px', gap: 12, padding: '12px 22px', alignItems: 'center', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}`, cursor: onOpenTx ? 'pointer' : 'default', transition: 'background .12s' }}>
                <div>
                  <WMonoNum size={12}>{tx.ts.slice(0, 10)}</WMonoNum>
                  <div style={{ fontFamily: WMONO, fontSize: 10, color: WBRAND.muted, marginTop: 2 }}>{tx.ts.slice(11, 16)}</div>
                </div>
                <WMonoNum size={12}>{tx.paid}</WMonoNum>
                <WMonoNum size={12} color={WBRAND.positive} weight={500}>+{wfmt(tx.amount, 4)} AHLG</WMonoNum>
                <WMonoNum size={11} color={WBRAND.muted}>{wfmt(WRATES.AHLG)} USDT</WMonoNum>
                <WPill tone={tx.status === 'completed' ? 'positive' : 'warn'}>{t(tx.status[0].toUpperCase() + tx.status.slice(1))}</WPill>
              </div>
            ))}
            </div>
            </div>
          </WCard>
        </div>
      </div>

      {minting && (
        <MintProgressModal
          amount={out}
          from={from}
          paid={wparse(amount)}
          onClose={() => setMinting(false)}
          onTrack={() => { setMinting(false); navigate('activity'); }}
        />
      )}
    </div>
  );
}

function WSpinner() {
  return (
    <>
      <style>{`@keyframes wspin{to{transform:rotate(360deg)}}`}</style>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'wspin .8s linear infinite' }}>
        <circle cx="12" cy="12" r="9" stroke={WBRAND.redSoft} strokeWidth="3"/>
        <path d="M12 3a9 9 0 0 1 9 9" stroke={WBRAND.red} strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </>
  );
}

function MintProgressModal({ amount, from, paid, onClose, onTrack }) {
  const mobile = useIsMobile();
  const STEPS = [
    { id: 'submitted', title: t('Mint request received'), sub: t('Order accepted and queued') },
    { id: 'locked',    title: t('Payment locked'),         sub: () => `${wfmt(paid, wdecimals(from.symbol))} ${from.symbol} ${t('reserved from balance')}` },
    { id: 'minting',   title: t('Minting on-chain'),       sub: t('Issuing tokens against vaulted gold') },
    { id: 'done',      title: t('AHLG minted'),            sub: () => `${wfmt(amount, 4)} AHLG ${t('credited to your wallet')}` },
  ];
  const [active, setActive] = useState(0);
  const [stamps, setStamps] = useState({});
  const ref = 'MT-' + Math.floor(100000 + Math.random() * 899999);

  useEffect(() => {
    const now = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setStamps(s => ({ ...s, 0: now() }));
    const delays = [900, 1700, 6700];
    const timers = delays.map((d, i) =>
      setTimeout(() => { setActive(i + 1); setStamps(s => ({ ...s, [i + 1]: now() })); }, d)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const done = active >= STEPS.length - 1;

  return (
    <div onClick={done ? onClose : undefined} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(10,10,10,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: mobile ? 12 : 24,
    }}>
      <div onClick={e => e.stopPropagation()} className="kz-pop" style={{
        width: mobile ? '100%' : 440, maxWidth: '100%', background: WBRAND.white,
        borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.22)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: mobile ? '16px 16px 14px' : '22px 24px 18px', borderBottom: `1px solid ${WBRAND.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AHLGMark size={44}/>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{done ? t('Mint complete') : t('Minting')}</div>
                <div style={{ fontFamily: WFONT, fontSize: 18, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.02em', marginTop: 2 }}>{wfmt(amount, 4)} AHLG</div>
              </div>
            </div>
            <WMonoNum size={11} color={WBRAND.muted}>{ref}</WMonoNum>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ padding: mobile ? '16px 16px 8px' : '20px 24px 8px' }}>
          {STEPS.map((s, i) => {
            const isDone = i < active || (i === STEPS.length - 1 && done);
            const isCurrent = i === active && !isDone;
            const reached = i <= active;
            const stamp = stamps[i];
            const sub = typeof s.sub === 'function' ? s.sub() : s.sub;
            return (
              <div key={s.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch' }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 13, flexShrink: 0,
                    display: 'grid', placeItems: 'center',
                    background: isDone ? WBRAND.positive : isCurrent ? WBRAND.redSoft : WBRAND.surface,
                    border: isCurrent ? `1.5px solid ${WBRAND.red}` : 'none',
                    transition: 'all .3s ease',
                  }}>
                    {isDone
                      ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      : isCurrent
                        ? <WSpinner/>
                        : <span style={{ width: 6, height: 6, borderRadius: 3, background: WBRAND.muted }}/>}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ width: 2, flex: 1, minHeight: 26, background: i < active ? WBRAND.positive : WBRAND.line, transition: 'background .3s ease' }}/>
                  )}
                </div>
                <div style={{ flex: 1, paddingBottom: i < STEPS.length - 1 ? 18 : 8, opacity: reached ? 1 : 0.45 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
                    <span style={{ fontFamily: WFONT, fontSize: 14, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{s.title}</span>
                    {stamp && <WMonoNum size={11} color={WBRAND.muted}>{stamp}</WMonoNum>}
                  </div>
                  <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 3, lineHeight: 1.45 }}>{sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: mobile ? '8px 16px 16px' : '8px 24px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {done ? (
            <>
              <WPrimary size="lg" onClick={onTrack} style={{ width: '100%', justifyContent: 'center' }}>
                {t('Track in Activity')}
              </WPrimary>
              <WSecondary size="lg" onClick={onClose} style={{ width: '100%', justifyContent: 'center', height: 52 }}>
                {t('Done')}
              </WSecondary>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 0', fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 600 }}>
              {t('You can safely close this — minting continues in the background.')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
