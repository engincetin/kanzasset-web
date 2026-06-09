import { useState } from 'react';
import { WBRAND, WFONT, WMONO, wfmt, wparse, wdecimals, wTotalIn, WRATES, WBALANCES, WMETA, WTXS, wMakePriceData, isDark } from '../lib/index.js';
import { WIcon } from '../components/icons.jsx';
import { WCoinDot } from '../components/coinicons.jsx';
import { WCard, WPrimary, WSecondary, WEyebrow, WNum, WMonoNum, WPill, WSectionTitle } from '../components/primitives.jsx';
import { WPriceChart, WRangeTabs } from '../components/charts.jsx';
import { WTxRow, AssetActionBtn } from '../components/shared.jsx';
import { useIsMobile, useIsTablet } from '../lib/useResponsive.js';
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

export function WebPortfolio({ navigate, onOpenTx }) {
  const mobile = useIsMobile();
  const tablet = useIsTablet();
  const [currency, setCurrency] = useState('USDT');
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [range, setRange] = useState('3M');
  const [quote, setQuote] = useState('USDT');
  const [quoteOpen, setQuoteOpen] = useState(false);

  const total = wTotalIn(currency);
  const totalAed = wTotalIn('AED');

  const assets = Object.keys(WBALANCES).map(s => {
    const bal = WBALANCES[s];
    const valUSDT = bal * WRATES[s];
    return {
      symbol: s, name: WMETA[s].name, kind: WMETA[s].kind,
      balance: bal, valUSDT,
      pct24h: s === 'AHLG' ? 0.24 : s === 'USDT' ? 0.00 : s === 'USDC' ? -0.01 : 0.08,
      alloc: 0,
    };
  }).sort((a, b) => b.valUSDT - a.valUSDT);
  const sumUSDT = assets.reduce((a, c) => a + c.valUSDT, 0);
  assets.forEach(a => { a.alloc = (a.valUSDT / sumUSDT) * 100; });

  const priceData = wMakePriceData(90);
  const quoteRate = WRATES[quote] || 1;
  const quotedPriceData = priceData.map(d => ({ t: d.t, v: d.v / quoteRate }));
  const quotedSpot = WRATES.AHLG / quoteRate;
  const quotedFirst = quotedPriceData[0].v;
  const quotedDiff = quotedSpot - quotedFirst;
  const quotedPct = (quotedDiff / quotedFirst) * 100;

  return (
    <div style={{ padding: mobile ? '18px 16px 40px' : '28px 32px 48px', minHeight: '100%', overflowY: 'auto', overflowX: 'hidden', height: '100%', boxSizing: 'border-box' }}>

      {/* Hero row */}
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1.4fr 1fr', gap: mobile ? 14 : 20, marginBottom: mobile ? 14 : 20 }}>

        {/* Total portfolio */}
        <WCard padding={0} style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: mobile ? '18px 16px' : '24px 28px 24px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <WEyebrow>{t('Total portfolio value')}</WEyebrow>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setCurrencyOpen(!currencyOpen)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: WBRAND.surface, border: 'none', padding: '4px 10px', borderRadius: 6,
                  fontFamily: WFONT, fontWeight: 700, fontSize: 12, color: WBRAND.ink,
                  cursor: 'pointer', letterSpacing: '0.02em',
                }}>
                  {currency}
                  {WIcon.arrowDown(WBRAND.muted)}
                </button>
                {currencyOpen && (
                  <>
                    <div onClick={() => setCurrencyOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }}/>
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                      background: WBRAND.white, border: `1px solid ${WBRAND.line}`,
                      borderRadius: 10, padding: 6, minWidth: 220, zIndex: 50,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    }}>
                      {[
                        { label: 'Crypto', items: ['USDT', 'USDC', 'AHLG'] },
                        { label: 'Fiat', items: ['USD', 'AED', 'EUR', 'GBP'] },
                      ].map((grp, gi) => (
                        <div key={grp.label} style={{ marginTop: gi > 0 ? 4 : 0, paddingTop: gi > 0 ? 4 : 0, borderTop: gi > 0 ? `1px solid ${WBRAND.line}` : 'none' }}>
                          <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 10px 4px' }}>{t(grp.label)}</div>
                          {grp.items.map(c => {
                            const on = c === currency;
                            const v = wTotalIn(c);
                            return (
                              <button key={c} onClick={() => { setCurrency(c); setCurrencyOpen(false); }} style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                                padding: '8px 10px', borderRadius: 6, border: 'none',
                                background: on ? WBRAND.surface : 'transparent', cursor: 'pointer', textAlign: 'left',
                              }}>
                                <span style={{ flex: 1, fontFamily: WFONT, fontSize: 12, fontWeight: on ? 700 : 600, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{c}</span>
                                <WMonoNum size={11} color={on ? WBRAND.ink : WBRAND.muted}>{wfmt(v, wdecimals(c))}</WMonoNum>
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 14 }}>
              <span style={{ fontFamily: WFONT, fontWeight: 800, fontSize: mobile ? 34 : 52, color: WBRAND.ink, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{wfmt(total, wdecimals(currency))}</span>
              <span style={{ fontFamily: WFONT, fontWeight: 700, fontSize: mobile ? 14 : 18, color: WBRAND.muted, letterSpacing: '-0.01em' }}>{currency}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, flexWrap: mobile ? 'wrap' : 'nowrap' }}>
              <WPill tone="positive" style={{ fontSize: 12, padding: '5px 10px' }}>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>▲ +2.81%</span>
              </WPill>
              <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.positive, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                +{wfmt(total * 0.0281, wdecimals(currency))} {currency}
              </span>
              {currency !== 'AED' && (
                <>
                  <span style={{ width: 1, height: 12, background: WBRAND.line }}/>
                  <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontVariantNumeric: 'tabular-nums' }}>≈ AED {wfmt(totalAed)}</span>
                </>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', borderTop: `1px solid ${WBRAND.line}`, height: mobile ? 'auto' : 80, flexShrink: 0 }}>
            {[
              { l: t('24 hours'), v: '+0.24%', abs: '+1,130 USDT' },
              { l: t('7 days'),   v: '+1.92%', abs: '+8,856 USDT' },
              { l: t('30 days'),  v: '+4.41%', abs: '+19,892 USDT' },
              { l: t('All-time'), v: '+18.32%', abs: '+72,948 USDT' },
            ].map((k, i) => (
              <div key={i} style={{ padding: '12px 18px', borderRight: (mobile ? i % 2 === 0 : i < 3) ? `1px solid ${WBRAND.line}` : 'none', borderTop: mobile && i >= 2 ? `1px solid ${WBRAND.line}` : 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{k.l}</div>
                <div style={{ fontFamily: WFONT, fontSize: 16, fontWeight: 800, color: WBRAND.positive, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.015em', marginTop: 4 }}>{k.v}</div>
                <div style={{ fontFamily: WMONO, fontSize: 10, color: WBRAND.muted, fontWeight: 500, marginTop: 2 }}>{k.abs}</div>
              </div>
            ))}
          </div>
        </WCard>

        {/* AHLG holdings */}
        <WCard padding={0} style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {(() => {
            const dark = isDark();
            const heroBg    = dark ? WBRAND.heroBg : WBRAND.white;
            const heroText  = dark ? '#fff' : WBRAND.ink;
            const heroLabel = dark ? 'rgba(255,255,255,0.55)' : WBRAND.muted;
            const heroPillBg   = dark ? 'rgba(255,255,255,0.14)' : WBRAND.surface;
            const heroPillText = dark ? '#fff' : WBRAND.ink;
            const dotColor  = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.05)';
            return (
              <div style={{ padding: mobile ? '18px 16px' : '24px 28px 24px', flex: 1, background: heroBg, color: heroText, borderTopLeftRadius: 16, borderTopRightRadius: 16, borderBottom: `1px solid ${WBRAND.line}`, position: 'relative', overflow: 'hidden' }}>
                <style>{`@keyframes kzDotDrift{from{background-position:0 0}to{background-position:40px 40px}}`}</style>
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1.5px)`,
                  backgroundSize: '20px 20px',
                  animation: 'kzDotDrift 16s linear infinite',
                  WebkitMaskImage: 'radial-gradient(130% 110% at 100% 0%, #000 25%, transparent 72%)',
                  maskImage: 'radial-gradient(130% 110% at 100% 0%, #000 25%, transparent 72%)',
                }}/>
                <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: 120, background: WBRAND.red, opacity: dark ? 0.18 : 0.16, filter: 'blur(50px)' }}/>
                <div style={{ position: 'relative' }}>
                  <div style={{ fontFamily: WFONT, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: heroLabel }}>{t('AHL Gold holdings')}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 14, position: 'relative' }}>
                  <span style={{ fontFamily: WFONT, fontWeight: 800, fontSize: mobile ? 34 : 52, color: heroText, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{wfmt(WBALANCES.AHLG, 0)}</span>
                  <span style={{ fontFamily: WFONT, fontWeight: 700, fontSize: mobile ? 14 : 18, color: heroLabel, letterSpacing: '-0.01em' }}>AHLG</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, position: 'relative', flexWrap: mobile ? 'wrap' : 'nowrap' }}>
                  <span style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, padding: '5px 10px', borderRadius: 6, background: heroPillBg, color: heroPillText, fontVariantNumeric: 'tabular-nums' }}>{(WBALANCES.AHLG / 1000).toFixed(1)} {t('kg in vault')}</span>
                  <span style={{ fontFamily: WFONT, fontSize: 12, color: heroLabel, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>≈ ${wfmt(WBALANCES.AHLG * WRATES.AHLG)}</span>
                </div>
              </div>
            );
          })()}

          <div style={{ height: 80, flexShrink: 0, padding: mobile ? '0 16px' : '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t('AHLG price')}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <WNum size={18} weight={800} style={{ letterSpacing: '-0.02em' }}>$151.56</WNum>
                <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.positive, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>+0.24%</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <WPrimary size="md" onClick={() => navigate('mint')} style={{ width: '100%', justifyContent: 'center' }}
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 9v6M9 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}>
                {t('Mint')}
              </WPrimary>
              <WSecondary size="md" onClick={() => navigate('redeem')} style={{ width: '100%', justifyContent: 'center', height: 44 }}
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="8" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M5 12v8a1 1 0 001 1h12a1 1 0 001-1v-8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 8v13" stroke="currentColor" strokeWidth="1.8"/></svg>}>
                {t('Redeem')}
              </WSecondary>
            </div>
          </div>
        </WCard>
      </div>

      {/* Price chart */}
      <WCard padding={0} style={{ marginBottom: 20 }}>
        <div style={{ padding: mobile ? '14px 16px 12px' : '18px 24px 14px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: mobile ? 'wrap' : 'nowrap', gap: mobile ? 10 : 0 }}>
          <div>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button onClick={() => setQuoteOpen(!quoteOpen)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: WBRAND.surface, border: 'none', padding: '6px 12px', borderRadius: 6,
                cursor: 'pointer', fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em',
              }}>
                <span>AHLG / {quote}</span>
                {WIcon.arrowDown(WBRAND.muted)}
              </button>
              {quoteOpen && (
                <>
                  <div onClick={() => setQuoteOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }}/>
                  <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, borderRadius: 10, padding: 6, minWidth: 220, zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                    {[
                      { label: 'Crypto', items: ['USDT', 'USDC'] },
                      { label: 'Fiat', items: ['USD', 'AED', 'EUR', 'GBP'] },
                    ].map((grp, gi) => (
                      <div key={grp.label} style={{ marginTop: gi > 0 ? 4 : 0, paddingTop: gi > 0 ? 4 : 0, borderTop: gi > 0 ? `1px solid ${WBRAND.line}` : 'none' }}>
                        <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 10px 4px' }}>{t(grp.label)}</div>
                        {grp.items.map(q => {
                          const on = q === quote;
                          const r = WRATES.AHLG / (WRATES[q] || 1);
                          return (
                            <button key={q} onClick={() => { setQuote(q); setQuoteOpen(false); }} style={{
                              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                              padding: '8px 10px', borderRadius: 6, border: 'none',
                              background: on ? WBRAND.surface : 'transparent', cursor: 'pointer', textAlign: 'left',
                            }}>
                              <span style={{ flex: 1, fontFamily: WFONT, fontSize: 12, fontWeight: on ? 700 : 600, color: WBRAND.ink, letterSpacing: '-0.005em' }}>AHLG / {q}</span>
                              <WMonoNum size={11} color={on ? WBRAND.ink : WBRAND.muted}>{wfmt(r, 2)}</WMonoNum>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
              <WNum size={26} weight={800} style={{ letterSpacing: '-0.025em' }}>
                {['USDT', 'USDC', 'USD'].includes(quote) ? '$' : ''}{wfmt(quotedSpot, 2)}
              </WNum>
              <span style={{ fontFamily: WFONT, fontSize: 13, color: quotedPct >= 0 ? WBRAND.positive : WBRAND.red, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                {quotedPct >= 0 ? '+' : ''}{wfmt(quotedDiff, 2)} ({quotedPct >= 0 ? '+' : ''}{wfmt(quotedPct, 2)}%)
              </span>
            </div>
          </div>
          <WRangeTabs value={range} onChange={setRange}/>
        </div>
        <div style={{ padding: '12px 16px 18px' }}>
          <WPriceChart data={quotedPriceData} height={280} color={WBRAND.red}/>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', borderTop: `1px solid ${WBRAND.line}` }}>
          {(() => {
            const vals = quotedPriceData.map(d => d.v);
            const open = vals[0];
            const high = Math.max(...vals);
            const low = Math.min(...vals);
            const prefix = ['USDT', 'USDC', 'USD'].includes(quote) ? '$' : '';
            return [
              { l: t('Open'), v: `${prefix}${wfmt(open, 2)}` },
              { l: t('High'), v: `${prefix}${wfmt(high, 2)}` },
              { l: t('Low'),  v: `${prefix}${wfmt(low, 2)}` },
              { l: t('Volume 24h'), v: '$8.41M' },
              { l: t('Market cap'), v: '$21.6M' },
            ];
          })().map((k, i) => (
            <div key={i} style={{ padding: '14px 20px', borderRight: (mobile ? i % 2 === 0 : i < 4) ? `1px solid ${WBRAND.line}` : 'none', borderTop: mobile && i >= 2 ? `1px solid ${WBRAND.line}` : 'none' }}>
              <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{k.l}</div>
              <WMonoNum size={14} style={{ marginTop: 4, display: 'block' }}>{k.v}</WMonoNum>
            </div>
          ))}
        </div>
      </WCard>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 380px', gap: mobile ? 14 : 20 }}>

        {/* Balances table */}
        <WCard padding={0} style={{ minWidth: 0 }}>
          <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <WSectionTitle title={t('Balances')} sub={`${assets.length} ${t('assets · sorted by value')}`} style={{ marginBottom: 0 }}/>
            <button onClick={() => navigate('wallet')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.red, display: 'flex', alignItems: 'center', gap: 4 }}>
              {t('View full wallet')} {WIcon.arrowRight(WBRAND.red)}
            </button>
          </div>

          <div style={{ overflowX: mobile ? 'auto' : 'visible', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ minWidth: mobile ? 640 : 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.3fr 1.3fr 1.3fr 188px', gap: 20, padding: '10px 22px', borderBottom: `1px solid ${WBRAND.line}`, background: WBRAND.surface2 }}>
            {['Asset', 'Balance', 'Value', 'Allocation', 'Actions'].map((h, i) => (
              <div key={i} style={{ fontFamily: WFONT, fontSize: 10, fontWeight: 700, color: WBRAND.muted, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: i === 0 ? 'left' : 'right' }}>{t(h)}</div>
            ))}
          </div>

          {assets.map((a, i, arr) => {
            const zero = a.balance === 0;
            return (
              <div key={a.symbol} style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.3fr 1.3fr 1.3fr 188px', gap: 20, padding: '14px 22px', alignItems: 'center', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, opacity: zero ? 0.5 : 1 }}>
                  <div style={{ width: 72, height: 4, background: WBRAND.surface, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${a.alloc}%`, height: '100%', background: a.symbol === 'AHLG' ? WBRAND.red : WBRAND.ink }}/>
                  </div>
                  <WMonoNum size={11} color={WBRAND.muted} style={{ minWidth: 38, textAlign: 'right' }}>{wfmt(a.alloc, 1)}%</WMonoNum>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                  <AssetActionBtn label={t('Deposit')} onClick={() => navigate('deposit')}/>
                  <AssetActionBtn label={t('Withdraw')} onClick={() => navigate('withdraw')} disabled={zero}/>
                </div>
              </div>
            );
          })}
          </div>
          </div>
        </WCard>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>

          {/* Vault attestation */}
          <WCard padding={20}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: WBRAND.surface, display: 'grid', placeItems: 'center' }}>{WIcon.vault()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{t('Vault attestation')}</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 1 }}>Ahlatcı Metal Refinery FZCO<br/>{t('audited by Bureau Veritas')}</div>
              </div>
              <WPill tone="positive">{WIcon.check(WBRAND.positive)} {t('Verified')}</WPill>
            </div>
            <div style={{ borderTop: `1px solid ${WBRAND.line}`, paddingTop: 12 }}>
              {[
                { k: t('Tokens in circulation'), v: '142,718.4203 AHLG' },
                { k: t('Physical gold reserve'), v: '142.72 kg' },
                { k: t('Last audit'),            v: 'Apr 30, 2026' },
                { k: t('Reserve ratio'),         v: '100.00%' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i === 3 ? 'none' : `1px dashed ${WBRAND.line}` }}>
                  <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>{r.k}</span>
                  <WMonoNum size={12}>{r.v}</WMonoNum>
                </div>
              ))}
            </div>
            <button style={{ width: '100%', marginTop: 12, padding: '10px 12px', borderRadius: 8, background: WBRAND.surface, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink }}>
              <span>{t('View proof-of-reserves report')}</span>
              {WIcon.external(WBRAND.muted)}
            </button>
          </WCard>

          {/* Notifications preview */}
          <WCard padding={0}>
            <div style={{ padding: '14px 18px 12px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{t('Notifications')}</span>
                <WPill tone="accent">{t('3 new')}</WPill>
              </div>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 11, fontWeight: 600, color: WBRAND.muted }}>{t('Mark all read')}</button>
            </div>
            {[
              { tone: 'pos',  title: t('Mint completed'),        sub: `1.2000 AHLG · ${t('12 min ago')}`,               unread: true  },
              { tone: 'warn', title: t('New whitelist pending'),  sub: `USDC ${t('address · 24h review · 8h left')}`,    unread: true  },
              { tone: 'neu',  title: t('Vault audit published'),  sub: t('April attestation available'),            unread: true  },
              { tone: 'neu',  title: t('Price alert'),            sub: t('AHLG crossed $150 threshold'),            unread: false },
            ].map((n, i, arr) => {
              const dotColor = n.tone === 'pos' ? WBRAND.positive : n.tone === 'warn' ? WBRAND.warn : WBRAND.muted;
              return (
                <div key={i} style={{ padding: '12px 18px', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}`, display: 'flex', alignItems: 'flex-start', gap: 10, background: n.unread ? WBRAND.surface2 : 'transparent' }}>
                  <span style={{ width: 6, height: 6, borderRadius: 3, background: dotColor, marginTop: 6, flexShrink: 0 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{n.title}</div>
                    <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2 }}>{n.sub}</div>
                  </div>
                </div>
              );
            })}
          </WCard>
        </div>
      </div>

      {/* Recent activity */}
      <div style={{ marginTop: 20 }}>
        <WCard padding={0}>
          <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <WSectionTitle title={t('Recent activity')} sub={t('Last 7 days')} style={{ marginBottom: 0 }}/>
            <button onClick={() => navigate('activity')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.red, display: 'flex', alignItems: 'center', gap: 4 }}>
              {t('View all activity')} {WIcon.arrowRight(WBRAND.red)}
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
