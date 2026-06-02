// ─── Mint screen ──────────────────────────────────────────────
// Left: conversion card (similar to mobile, scaled up). Right: chart + quote + recent.

const { useState: useWMint } = React;

function WebMint({ navigate }) {
  const sources = Object.keys(WBALANCES)
    .filter(s => s !== 'AHLG' && WBALANCES[s] > 0)
    .map(s => ({
      symbol: s, name: WMETA[s].name,
      balance: WBALANCES[s], rate: WRATES[s] / WRATES.AHLG,
    }));
  const [from, setFrom] = useWMint(sources[0]);
  const [amount, setAmount] = useWMint(String(WRATES.AHLG));
  const [range, setRange] = useWMint('3M');

  const out = wparse(amount) * from.rate;
  const priceData = wMakePriceData(90);

  return (
    <div style={{ padding: '28px 32px 48px' }}>

      {/* Top: title */}
      <div style={{ marginBottom: 20 }}>
        <WEyebrow>Mint AHLG</WEyebrow>
        <h1 style={{
          margin: '6px 0 0', fontFamily: WFONT, fontSize: 28, fontWeight: 800,
          color: WBRAND.ink, letterSpacing: '-0.025em',
        }}>Convert cash to vaulted gold</h1>
        <div style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, marginTop: 6 }}>
          Mint AHL Gold tokens backed 1:1 by physical bullion held in the Ahlatcı Metal Refinery FZCO vault.
        </div>
      </div>

      {/* Body: left (form) + right (chart, quote, recent) */}
      <div style={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: 20 }}>

        {/* Left column: Mint form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <WCard padding={0}>
            {/* You pay */}
            <div style={{ padding: '22px 24px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <WEyebrow>You pay</WEyebrow>
                <button onClick={() => setAmount(String(from.balance))} style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.red,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>Use max</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                <input value={amount} onChange={e => setAmount(e.target.value)} style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: WFONT, fontWeight: 800, fontSize: 36, color: WBRAND.ink,
                  letterSpacing: '-0.035em', width: 0, minWidth: 0,
                  fontVariantNumeric: 'tabular-nums',
                }}/>
                <WAssetSelector value={from.symbol} options={sources} onChange={(s) => setFrom(sources.find(x => x.symbol === s))}/>
              </div>
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>Balance: <WMonoNum size={12}>{wfmt(from.balance, wdecimals(from.symbol))}</WMonoNum> {from.symbol}</span>
                <span style={{ display: 'flex', gap: 6 }}>
                  {[25, 50, 75].map(p => (
                    <button key={p} onClick={() => setAmount(String(from.balance * p / 100))} style={{
                      background: WBRAND.surface, border: 'none', cursor: 'pointer',
                      padding: '2px 8px', borderRadius: 6,
                      fontFamily: WFONT, fontSize: 11, fontWeight: 600, color: WBRAND.ink,
                    }}>{p}%</button>
                  ))}
                </span>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${WBRAND.line}`, position: 'relative' }}>
              <div style={{
                position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
                width: 32, height: 32, borderRadius: 16,
                background: WBRAND.white, border: `1px solid ${WBRAND.line}`,
                display: 'grid', placeItems: 'center', zIndex: 1,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14m0 0l-5-5m5 5l5-5" stroke={WBRAND.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* You receive */}
            <div style={{ padding: '22px 24px 22px', background: WBRAND.surface2 }}>
              <WEyebrow>You receive</WEyebrow>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                <div style={{
                  flex: 1, fontFamily: WFONT, fontWeight: 800, fontSize: 36, color: WBRAND.ink,
                  letterSpacing: '-0.035em', fontVariantNumeric: 'tabular-nums',
                }}>{wfmt(out, 4)}</div>
                <div style={{
                  background: WBRAND.white, color: WBRAND.ink,
                  border: `1px solid ${WBRAND.line2}`,
                  borderRadius: 999, padding: '6px 14px 6px 6px',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 14,
                    background: WBRAND.white, border: `1.5px solid ${WBRAND.red}`,
                    display: 'grid', placeItems: 'center',
                  }}>
                    <WMark size={16}/>
                  </div>
                  <span style={{ fontFamily: WFONT, fontWeight: 700, fontSize: 14 }}>AHLG</span>
                </div>
              </div>
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 8 }}>
                Equivalent to <WMonoNum size={12}>{wfmt(out, 4)} g</WMonoNum> of physical gold
              </div>
            </div>
          </WCard>

          {/* Quote details card */}
          <WCard padding={0}>
            <div style={{ padding: '16px 22px 8px', borderBottom: `1px solid ${WBRAND.line}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>Quote details</div>
                  <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2 }}>Refreshes every 10 seconds</div>
                </div>
                <WQuoteCountdown seconds={10}/>
              </div>
            </div>
            <div style={{ padding: '4px 22px 8px' }}>
              {[
                { l: 'Spot rate',         v: `1 AHLG = ${wfmt(WRATES.AHLG)} USDT` },
                { l: 'Network',           v: 'Ethereum · ERC-20' },
                { l: 'Mint fee',          v: '0.00% — promotional' },
                { l: 'Settlement',        v: 'Instant on-chain' },
              ].map((r, i, arr) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}`,
                }}>
                  <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>{r.l}</span>
                  <span style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink, fontVariantNumeric: 'tabular-nums' }}>{r.v}</span>
                </div>
              ))}
            </div>
          </WCard>

          {/* CTA */}
          <WPrimary size="lg" style={{ width: '100%', justifyContent: 'center' }}>
            Mint {wfmt(out, 4)} AHLG
          </WPrimary>

          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '12px 14px', background: WBRAND.redSoft, borderRadius: 10,
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: 9, background: WBRAND.red,
              color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0,
              fontFamily: WFONT, fontSize: 11, fontWeight: 800,
            }}>!</div>
            <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.ink, lineHeight: 1.5 }}>
              By minting, you acknowledge AHLG tokens are backed 1:1 by physical gold custodied at the Ahlatcı Metal Refinery FZCO vault, audited monthly by Bureau Veritas. <span style={{ color: WBRAND.red, fontWeight: 700, cursor: 'pointer' }}>Read full terms</span>
            </div>
          </div>
        </div>

        {/* Right column: chart + recent */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Chart card — quote follows the selected payment asset */}
          <WCard padding={0}>
            {(() => {
              const quote = from.symbol;
              const quoteRate = WRATES[quote] || 1;
              const quotedData = priceData.map(d => ({ t: d.t, v: d.v / quoteRate }));
              const spot = WRATES.AHLG / quoteRate;
              const first = quotedData[0].v;
              const diff = spot - first;
              const pct = (diff / first) * 100;
              const vals = quotedData.map(d => d.v);
              const open = vals[0];
              const high = Math.max(...vals);
              const low = Math.min(...vals);
              const fiat = ['USDT', 'USDC', 'USD'].includes(quote);
              const px = (v, d = 2) => `${fiat ? '$' : ''}${wfmt(v, d)}${fiat ? '' : ' ' + quote}`;
              return (
                <>
                  <div style={{
                    padding: '18px 24px 14px',
                    borderBottom: `1px solid ${WBRAND.line}`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  }}>
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
                    <WPriceChart data={quotedData} width={600} height={280}/>
                  </div>
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                    borderTop: `1px solid ${WBRAND.line}`,
                  }}>
                    {[
                      { l: 'Open',  v: px(open) },
                      { l: 'High',  v: px(high) },
                      { l: 'Low',   v: px(low)  },
                      { l: 'Volume 24h', v: '$8.41M' },
                    ].map((k, i) => (
                      <div key={i} style={{
                        padding: '12px 20px',
                        borderRight: i < 3 ? `1px solid ${WBRAND.line}` : 'none',
                      }}>
                        <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{k.l}</div>
                        <WMonoNum size={14} style={{ marginTop: 4, display: 'block' }}>{k.v}</WMonoNum>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </WCard>

          {/* Recent mints */}
          <WCard padding={0}>
            <div style={{
              padding: '16px 22px 12px', borderBottom: `1px solid ${WBRAND.line}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>Your recent mints</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2 }}>Last 30 days</div>
              </div>
              <button onClick={() => navigate('activity')} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.red,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>View all {WIcon.arrowRight(WBRAND.red)}</button>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 110px',
              gap: 12, padding: '10px 22px',
              borderBottom: `1px solid ${WBRAND.line}`,
              background: WBRAND.surface2,
            }}>
              {['Date', 'Paid', 'Received', 'Rate', 'Status'].map((h, i) => (
                <div key={i} style={{
                  fontFamily: WFONT, fontSize: 10, fontWeight: 700,
                  color: WBRAND.muted, letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>{h}</div>
              ))}
            </div>
            {WTXS.filter(t => t.type === 'Mint').slice(0, 4).map((tx, i, arr) => (
              <div key={tx.id} style={{
                display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 110px',
                gap: 12, padding: '12px 22px', alignItems: 'center',
                borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}`,
              }}>
                <div>
                  <WMonoNum size={12}>{tx.ts.slice(0, 10)}</WMonoNum>
                  <div style={{ fontFamily: WMONO, fontSize: 10, color: WBRAND.muted, marginTop: 2 }}>{tx.ts.slice(11, 16)}</div>
                </div>
                <WMonoNum size={12}>{tx.paid}</WMonoNum>
                <WMonoNum size={12} color={WBRAND.positive} weight={500}>+{wfmt(tx.amount, 4)} AHLG</WMonoNum>
                <WMonoNum size={11} color={WBRAND.muted}>{wfmt(WRATES.AHLG)} USDT</WMonoNum>
                <WPill tone={tx.status === 'completed' ? 'positive' : 'warn'}>{tx.status[0].toUpperCase() + tx.status.slice(1)}</WPill>
              </div>
            ))}
          </WCard>
        </div>
      </div>
    </div>
  );
}

// ─── Asset selector pill (used in mint+redeem inputs) ─────────
function WAssetSelector({ value, options, onChange }) {
  const [open, setOpen] = React.useState(false);
  const sel = options.find(o => o.symbol === value) ?? options[0];
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        background: WBRAND.white, border: `1px solid ${WBRAND.line2}`,
        borderRadius: 999, padding: '6px 14px 6px 6px',
        display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
      }}>
        <WCoinDot symbol={sel.symbol} size={28}/>
        <span style={{ fontFamily: WFONT, fontWeight: 700, fontSize: 14, color: WBRAND.ink }}>{sel.symbol}</span>
        {WIcon.arrowDown(WBRAND.muted)}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }}/>
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            background: WBRAND.white, border: `1px solid ${WBRAND.line}`,
            borderRadius: 12, padding: 6, minWidth: 240,
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)', zIndex: 50,
          }}>
            {options.map(o => (
              <button key={o.symbol} onClick={() => { onChange(o.symbol); setOpen(false); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 8, border: 'none',
                background: o.symbol === value ? WBRAND.surface : 'transparent',
                cursor: 'pointer', textAlign: 'left',
              }}>
                <WCoinDot symbol={o.symbol} size={26}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink }}>{o.symbol}</div>
                  <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 1 }}>{o.name}</div>
                </div>
                <WMonoNum size={12} color={WBRAND.muted}>{wfmt(o.balance, wdecimals(o.symbol))}</WMonoNum>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

Object.assign(window, { WebMint, WAssetSelector });
