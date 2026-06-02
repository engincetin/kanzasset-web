// ─── Redeem screen ────────────────────────────────────────────
// Toggle digital / physical. Left: form. Right: chart + recent redeems.

const { useState: useWRedeem } = React;

function WebRedeem({ navigate }) {
  const [mode, setMode] = useWRedeem('digital');
  const [range, setRange] = useWRedeem('3M');
  const priceData = wMakePriceData(90);

  // Targets (digital redeem assets) — lifted up so the chart can react to selection
  const targets = Object.keys(WBALANCES)
    .filter(s => s !== 'AHLG')
    .map(s => ({
      symbol: s, name: WMETA[s].name,
      balance: WBALANCES[s], rate: WRATES.AHLG / WRATES[s],
    }));
  const [to, setTo] = useWRedeem(targets[0]);

  // Quote: in digital mode follows `to`, in physical mode locked to USDT
  const quote = mode === 'digital' ? to.symbol : 'USDT';
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
    <div style={{ padding: '28px 32px 48px' }}>

      {/* Header */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <WEyebrow>Redeem AHLG</WEyebrow>
          <h1 style={{
            margin: '6px 0 0', fontFamily: WFONT, fontSize: 28, fontWeight: 800,
            color: WBRAND.ink, letterSpacing: '-0.025em',
          }}>Convert gold back to cash or claim physical bars</h1>
          <div style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, marginTop: 6 }}>
            Burn AHLG tokens to receive instant settlement in your Kanzasset balance, or request physical delivery to your address.
          </div>
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          display: 'inline-grid', gridTemplateColumns: '1fr 1fr', gap: 2,
          padding: 4, background: WBRAND.white, border: `1px solid ${WBRAND.line}`,
          borderRadius: 12, width: 480,
        }}>
          {[
            { id: 'digital',  label: 'Digital',  sub: 'Crypto or fiat · instant' },
            { id: 'physical', label: 'Physical', sub: 'Gold bars · 3–5 days' },
          ].map(t => {
            const on = mode === t.id;
            return (
              <button key={t.id} onClick={() => setMode(t.id)} style={{
                padding: '10px 16px', border: 'none', cursor: 'pointer',
                background: on ? WBRAND.ink : 'transparent',
                color: on ? '#fff' : WBRAND.ink,
                borderRadius: 8, textAlign: 'left',
              }}>
                <div style={{ fontFamily: WFONT, fontWeight: 700, fontSize: 13, letterSpacing: '-0.005em' }}>{t.label}</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: on ? 'rgba(255,255,255,0.65)' : WBRAND.muted, marginTop: 2, fontWeight: 500 }}>{t.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: 20 }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'digital' ? <RedeemDigital targets={targets} to={to} setTo={setTo}/> : <RedeemPhysicalWeb/>}
        </div>

        {/* Right column: chart + recent redeems */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Chart */}
          <WCard padding={0}>
            <div style={{
              padding: '18px 24px 14px', borderBottom: `1px solid ${WBRAND.line}`,
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
          </WCard>

          {/* Recent redeems */}
          <WCard padding={0}>
            <div style={{
              padding: '16px 22px 12px', borderBottom: `1px solid ${WBRAND.line}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>Your recent redeems</div>
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
              borderBottom: `1px solid ${WBRAND.line}`, background: WBRAND.surface2,
            }}>
              {['Date', 'Burned', 'Received', 'Rate', 'Status'].map((h, i) => (
                <div key={i} style={{
                  fontFamily: WFONT, fontSize: 10, fontWeight: 700,
                  color: WBRAND.muted, letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>{h}</div>
              ))}
            </div>
            {WTXS.filter(t => t.type === 'Redeem').slice(0, 4).map((tx, i, arr) => (
              <div key={tx.id} style={{
                display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 110px',
                gap: 12, padding: '12px 22px', alignItems: 'center',
                borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}`,
              }}>
                <div>
                  <WMonoNum size={12}>{tx.ts.slice(0, 10)}</WMonoNum>
                  <div style={{ fontFamily: WMONO, fontSize: 10, color: WBRAND.muted, marginTop: 2 }}>{tx.ts.slice(11, 16)}</div>
                </div>
                <WMonoNum size={12} color={WBRAND.ink}>{wfmt(Math.abs(tx.amount), 4)} AHLG</WMonoNum>
                <WMonoNum size={12} color={WBRAND.ink}>{tx.paid}</WMonoNum>
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

// ─── Redeem Digital ───────────────────────────────────────────
function RedeemDigital({ targets, to, setTo }) {
  const [amount, setAmount] = useWRedeem('1');
  const out = wparse(amount) * to.rate;

  return (
    <>
      <WCard padding={0}>
        {/* You burn */}
        <div style={{ padding: '22px 24px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <WEyebrow>You burn</WEyebrow>
            <button onClick={() => setAmount(String(WBALANCES.AHLG))} style={{
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
            Balance: <WMonoNum size={12}>{wfmt(WBALANCES.AHLG, 4)}</WMonoNum> AHLG
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
            }}>{wfmt(out, wdecimals(to.symbol))}</div>
            <WAssetSelector value={to.symbol} options={targets} onChange={(s) => setTo(targets.find(x => x.symbol === s))}/>
          </div>
          <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 8 }}>
            Settles to your Kanzasset {to.symbol} balance instantly
          </div>
        </div>
      </WCard>

      {/* Quote details */}
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
            { l: 'Spot rate',     v: `1 AHLG = ${wfmt(to.rate, wdecimals(to.symbol))} ${to.symbol}` },
            { l: 'Redeem fee',    v: '0.00% — promotional' },
            { l: 'Settlement',    v: 'Instant to balance' },
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

      <WPrimary size="lg" style={{ width: '100%', justifyContent: 'center' }}>
        Redeem {wfmt(out, wdecimals(to.symbol))} {to.symbol}
      </WPrimary>
    </>
  );
}

// ─── Redeem Physical ──────────────────────────────────────────
function RedeemPhysicalWeb() {
  const products = [
    { id: '1kg',  weight: '1 kg',  need: 1000  },
    { id: '2kg',  weight: '2 kg',  need: 2000  },
    { id: '3kg',  weight: '3 kg',  need: 3000  },
    { id: '5kg',  weight: '5 kg',  need: 5000  },
  ];
  const addresses = [
    { id: 'h', label: 'Home',     city: 'Dubai',    line: 'Marina Plaza, Tower 1, Apt 2208',     country: 'UAE'      },
    { id: 'o', label: 'Office',   city: 'Dubai',    line: 'DMCC Almas Tower, Floor 38',          country: 'UAE'      },
    { id: 'i', label: 'Istanbul', city: 'Istanbul', line: 'Levent Mah. Büyükdere Cad. No:185',   country: 'Türkiye'  },
  ];
  const maxKg = Math.max(1, Math.floor(WBALANCES.AHLG / 1000));
  const [kgPicked, setKgPicked] = useWRedeem(1);
  const [addrId, setAddrId] = useWRedeem('h');
  const addr = addresses.find(a => a.id === addrId);

  return (
    <>
        {/* Your AHLG holdings — what they have available to redeem */}
        <div style={{
          padding: '20px 22px',
          background: WBRAND.ink, color: '#fff',
          borderRadius: 16,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -80, right: -80,
            width: 240, height: 240, borderRadius: 120,
            background: WBRAND.red, opacity: 0.18, filter: 'blur(50px)',
          }}/>
          <div style={{ position: 'relative' }}>
            <div style={{
              fontFamily: WFONT, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
            }}>Available to redeem</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 12 }}>
              <span style={{
                fontFamily: WFONT, fontWeight: 800, fontSize: 38, color: '#fff',
                letterSpacing: '-0.035em', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
              }}>{wfmt(WBALANCES.AHLG, 0)}</span>
              <span style={{
                fontFamily: WFONT, fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.55)',
                letterSpacing: '-0.01em',
              }}>AHLG</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
              <WPill tone="inkInv" style={{ fontSize: 11, padding: '4px 9px', background: 'rgba(255,255,255,0.14)', color: '#fff' }}>
                {(WBALANCES.AHLG / 1000).toFixed(2)} kg total
              </WPill>
              <span style={{
                fontFamily: WFONT, fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
              }}>≈ ${wfmt(WBALANCES.AHLG * WRATES.AHLG)}</span>
            </div>
          </div>
        </div>

        <WCard padding={0}>
          <div style={{ padding: '20px 22px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <WEyebrow>How much gold</WEyebrow>
              <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 600 }}>
                Min 1 kg · Max <WMonoNum size={11} color={WBRAND.ink}>{maxKg}</WMonoNum> kg available
              </span>
            </div>

            {/* Stepper */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18,
              marginTop: 18, padding: '14px 0',
            }}>
              <button
                onClick={() => setKgPicked(Math.max(1, kgPicked - 1))}
                disabled={kgPicked <= 1}
                style={{
                  width: 44, height: 44, borderRadius: 22,
                  background: WBRAND.white,
                  border: `1px solid ${kgPicked <= 1 ? WBRAND.line : WBRAND.line2}`,
                  cursor: kgPicked <= 1 ? 'not-allowed' : 'pointer',
                  color: kgPicked <= 1 ? WBRAND.muted2 : WBRAND.ink,
                  display: 'grid', placeItems: 'center',
                  opacity: kgPicked <= 1 ? 0.5 : 1,
                }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </button>
              <div style={{ textAlign: 'center', minWidth: 120 }}>
                <div style={{
                  fontFamily: WFONT, fontSize: 44, fontWeight: 800,
                  color: WBRAND.ink, letterSpacing: '-0.035em', lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}>{kgPicked} <span style={{ fontSize: 22, color: WBRAND.muted, fontWeight: 700 }}>kg</span></div>
                <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
                  Burns {wfmt(kgPicked * 1000, 0)} AHLG · ≈ ${wfmt(kgPicked * 1000 * WRATES.AHLG, 0)}
                </div>
              </div>
              <button
                onClick={() => setKgPicked(Math.min(maxKg, kgPicked + 1))}
                disabled={kgPicked >= maxKg}
                style={{
                  width: 44, height: 44, borderRadius: 22,
                  background: WBRAND.white,
                  border: `1px solid ${kgPicked >= maxKg ? WBRAND.line : WBRAND.line2}`,
                  cursor: kgPicked >= maxKg ? 'not-allowed' : 'pointer',
                  color: kgPicked >= maxKg ? WBRAND.muted2 : WBRAND.ink,
                  display: 'grid', placeItems: 'center',
                  opacity: kgPicked >= maxKg ? 0.5 : 1,
                }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Bar split helper */}
            <div style={{
              padding: '10px 14px', background: WBRAND.surface2, borderRadius: 8,
              fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, lineHeight: 1.5,
            }}>
              Cast as <strong style={{ color: WBRAND.ink, fontWeight: 700 }}>{kgPicked} × 1 kg bars</strong> · 999.5 fine · Ahlatci Gold Refinery mint
            </div>
          </div>
        </WCard>

        {/* Shipping */}
        <WCard padding={0}>
          <div style={{ padding: '18px 22px' }}>
          <WEyebrow>Ship to</WEyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
            {addresses.map(a => {
              const on = a.id === addrId;
              return (
                <button key={a.id} onClick={() => setAddrId(a.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', cursor: 'pointer',
                  background: on ? WBRAND.surface : 'transparent',
                  border: `1px solid ${on ? WBRAND.red : 'transparent'}`,
                  borderRadius: 10, textAlign: 'left',
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 9,
                    border: `1.5px solid ${on ? WBRAND.red : WBRAND.line2}`,
                    background: on ? WBRAND.red : 'transparent',
                    display: 'grid', placeItems: 'center', flexShrink: 0,
                  }}>
                    {on && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }}/>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{a.label} · {a.city}</div>
                    <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.line}, {a.country}</div>
                  </div>
                </button>
              );
            })}
            <button style={{
              padding: '10px 12px', border: `1px dashed ${WBRAND.line2}`,
              borderRadius: 10, background: 'transparent', cursor: 'pointer',
              fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              {WIcon.plus()} Add new address
            </button>
          </div>
        </div>
      </WCard>

      {/* Order summary */}
      <WCard padding={0}>
        <div style={{ padding: '16px 22px 8px', borderBottom: `1px solid ${WBRAND.line}` }}>
          <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>Order summary</div>
        </div>
        <div style={{ padding: '4px 22px 8px' }}>
          {[
            { l: 'Bar', v: `${kgPicked} × 1 kg · 999.5 fine` },
            { l: 'Burned', v: `${wfmt(kgPicked * 1000, 4)} AHLG` },
            { l: 'Casting', v: 'Ahlatci Gold Refinery' },
            { l: 'Shipping', v: 'Brinks · AED 120' },
            { l: 'Insurance', v: 'Included' },
            { l: 'Estimated arrival', v: '3–5 business days' },
          ].map((r, i, arr) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '11px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}`,
            }}>
              <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>{r.l}</span>
              <span style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink, fontVariantNumeric: 'tabular-nums' }}>{r.v}</span>
            </div>
          ))}
        </div>
      </WCard>

      <WPrimary size="lg" style={{ width: '100%', justifyContent: 'center' }}>
        Request {kgPicked} kg delivery
      </WPrimary>

      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '12px 14px', background: WBRAND.surface, borderRadius: 10,
      }}>
        {WIcon.shield(WBRAND.ink)}
        <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.ink, lineHeight: 1.5 }}>
          Bars are cast by Ahlatci Gold Refinery, sealed with tamper-evident packaging, and shipped with a serialised assay certificate. Delivery requires ID verification at the door.
        </div>
      </div>
    </>
  );
}

Object.assign(window, { WebRedeem, RedeemDigital, RedeemPhysicalWeb });
