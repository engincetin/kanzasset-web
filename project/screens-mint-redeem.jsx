// Mint & Redeem screens

const { useState: useStateMR } = React;

// ─────────────────────────────────────────────────────────────
// MINT
// ─────────────────────────────────────────────────────────────
function MintScreen({ state, setState, navigate }) {
  const sources = [
    { symbol: 'USDT', name: 'Tether'     },
    { symbol: 'USDC', name: 'USD Coin'   },
    { symbol: 'AED',  name: 'UAE Dirham' },
    { symbol: 'USD',  name: 'US Dollar'  },
    { symbol: 'EUR',  name: 'Euro'       },
    { symbol: 'GBP',  name: 'Pound'      },
  ].map(s => ({
    ...s,
    balance: BALANCES[s.symbol] ?? 0,
    // pay-rate = AHLG per 1 unit of this asset
    rate: (RATES[s.symbol] ?? 1) / RATES.AHLG,
  }));
  const sourcesAvailable = sources.filter(s => s.balance > 0);
  const [from, setFrom] = useStateMR(sources[0]);
  const [amount, setAmount] = useStateMR(String(RATES.AHLG)); // default = 1 AHLG worth in USDT
  const [pickerOpen, setPickerOpen] = useStateMR(false);
  const [confirmOpen, setConfirmOpen] = useStateMR(false);

  const out = parseNum(amount) * from.rate;

  return (
    <div style={{ paddingBottom: 100 }}>
      <TopBar />
      <PageTitle>mint</PageTitle>

      {/* Hero conversion */}
      <div style={{ padding: '0 24px' }}>
        <div style={{ position: 'relative' }}>
          {/* From box */}
          <div style={{
            background: BRAND.surface, borderRadius: 20, padding: '18px 20px 22px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: BRAND.muted }}>{T('You pay')}</span>
              <button onClick={() => setAmount(String(from.balance))} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: FONT, fontSize: 12, fontWeight: 600, color: BRAND.red,
              }}>{T('Max')}</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
              <input value={amount} onChange={e => setAmount(e.target.value)} style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: FONT, fontWeight: 800, fontSize: 30, color: BRAND.ink,
                letterSpacing: '-0.03em', width: 0, minWidth: 0,
                fontVariantNumeric: 'tabular-nums',
              }}/>
              <button onClick={() => setPickerOpen('from')} style={{
                background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 999,
                padding: '6px 10px 6px 6px', display: 'flex', alignItems: 'center', gap: 8,
                cursor: 'pointer',
              }}>
                <CoinDot symbol={from.symbol} />
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: BRAND.ink }}>{from.symbol}</span>
                <ChevDown size={12} />
              </button>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 6 }}>
              {T('Balance')}: {fmt(from.balance, decimalsFor(from.symbol))} {from.symbol}
            </div>
          </div>

          {/* Swap chevron */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 40, height: 40, borderRadius: 20, background: BRAND.white,
            border: `1px solid ${BRAND.line}`, display: 'grid', placeItems: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14m0 0l-5-5m5 5l5-5" stroke={BRAND.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* To box */}
          <div style={{
            background: BRAND.surface, borderRadius: 20, padding: '18px 20px 22px',
            marginTop: 6,
          }}>
            <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: BRAND.muted }}>{T('You receive')}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
              <div style={{
                flex: 1, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: BRAND.ink,
                letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums',
              }}>{fmt(out, 4)}</div>
              <div style={{
                background: BRAND.red, color: '#fff', border: 'none',
                borderRadius: 999, padding: '6px 14px 6px 6px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: '#fff', display: 'grid', placeItems: 'center' }}>
                  <KMark size={16} />
                </div>
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14 }}>AHLG</span>
              </div>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 6 }}>
              {T('Vaulted physical gold, 1g per token')}
            </div>
          </div>
        </div>
      </div>

      {/* Quote details */}
      <div style={{ padding: '18px 24px 0' }}>
        <div style={{
          background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 20,
          padding: '6px 18px',
        }}>
          <QuoteRow label="Price quote">
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>1 AHLG ≈ {fmt(RATES.AHLG)} USDT</span>
            <span style={{
              marginLeft: 8, fontFamily: FONT, fontSize: 11, fontWeight: 600,
              color: BRAND.red, background: 'rgba(212,32,43,0.08)',
              borderRadius: 8, padding: '2px 6px',
            }}>10s</span>
          </QuoteRow>
          <QuoteRow label="Mint fee">0.00%</QuoteRow>
          <QuoteRow label="Settlement" last>Instant</QuoteRow>
        </div>
      </div>

      <div style={{ padding: '20px 24px 0' }}>
        <PrimaryButton onClick={() => setConfirmOpen(true)}>Mint AHLG</PrimaryButton>
        <div style={{
          fontFamily: FONT, fontSize: 12, color: BRAND.muted, textAlign: 'center',
          marginTop: 14, lineHeight: 1.5,
        }}>
          {T('Backed 1:1 by physical gold held in DMCC-licensed vault.')}<br/>
          {T('Audited monthly by Bureau Veritas.')}
        </div>
      </div>

      <Sheet open={pickerOpen === 'from'} onClose={() => setPickerOpen(false)} title="Pay with">
        <AssetPicker
          assets={sourcesAvailable.map(s => ({ ...s, balance: fmt(s.balance, decimalsFor(s.symbol)) }))}
          onPick={(a) => { setFrom(sources.find(s => s.symbol === a.symbol)); setPickerOpen(false); }}
          onAddFunds={() => { setPickerOpen(false); navigate && navigate('wallet', { openDeposit: true }); }}
        />
      </Sheet>

      <Sheet open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm mint"
        footer={<PrimaryButton onClick={() => setConfirmOpen(false)}>Hold to confirm</PrimaryButton>}>
        <div style={{ padding: '8px 24px 0' }}>
          <ConfirmRow label="Pay" value={`${fmt(parseNum(amount), decimalsFor(from.symbol))} ${from.symbol}`} />
          <ConfirmRow label="Receive" value={`${fmt(out, 4)} AHLG`} accent />
          <ConfirmRow label="Rate" value={`1 AHLG ≈ ${fmt(RATES.AHLG)} USDT`} />
          <ConfirmRow label="Mint fee" value="0.00 USDT" last />
        </div>
      </Sheet>
    </div>
  );
}

function QuoteRow({ label, children, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 0',
      borderBottom: last ? 'none' : `1px solid ${BRAND.line}`,
    }}>
      <span style={{ fontFamily: FONT, fontSize: 13, color: BRAND.muted, fontWeight: 500 }}>{T(label)}</span>
      <span style={{ fontFamily: FONT, fontSize: 14, color: BRAND.ink, fontWeight: 600, display: 'flex', alignItems: 'center' }}>{typeof children === 'string' ? T(children) : children}</span>
    </div>
  );
}

function ConfirmRow({ label, value, accent, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 0', borderBottom: last ? 'none' : `1px solid ${BRAND.line}`,
    }}>
      <span style={{ fontFamily: FONT, fontSize: 13, color: BRAND.muted, fontWeight: 500 }}>{T(label)}</span>
      <span style={{
        fontFamily: FONT, fontSize: accent ? 16 : 14, color: accent ? BRAND.red : BRAND.ink,
        fontWeight: 700, fontVariantNumeric: 'tabular-nums',
      }}>{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// REDEEM
// ─────────────────────────────────────────────────────────────
function RedeemScreen({ state, setState }) {
  const [mode, setMode] = useStateMR('digital'); // 'digital' | 'physical'
  return (
    <div style={{ paddingBottom: 100 }}>
      <TopBar />
      <PageTitle>redeem</PageTitle>

      {/* Mode toggle */}
      <div style={{ padding: '0 24px 18px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          background: BRAND.surface, padding: 4, borderRadius: 14,
        }}>
          {[
            { id: 'digital', label: 'Digital' },
            { id: 'physical', label: 'Physical' },
          ].map(t => {
            const on = mode === t.id;
            return (
              <button key={t.id} onClick={() => setMode(t.id)} style={{
                height: 40, border: 'none', cursor: 'pointer',
                background: on ? BRAND.white : 'transparent',
                color: on ? BRAND.ink : BRAND.muted,
                borderRadius: 11,
                fontFamily: FONT, fontWeight: 700, fontSize: 14,
                letterSpacing: '-0.01em',
                boxShadow: on ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}>{T(t.label)}</button>
            );
          })}
        </div>
      </div>

      {mode === 'digital' ? <RedeemDigital /> : <RedeemPhysical />}
    </div>
  );
}

function RedeemDigital() {
  const targets = [
    { symbol: 'USDT', name: 'Tether'     },
    { symbol: 'USDC', name: 'USD Coin'   },
    { symbol: 'AED',  name: 'UAE Dirham' },
    { symbol: 'USD',  name: 'US Dollar'  },
    { symbol: 'EUR',  name: 'Euro'       },
    { symbol: 'GBP',  name: 'Pound'      },
  ].map(t => ({
    ...t,
    balance: BALANCES[t.symbol] ?? 0,
    // 1 AHLG = N target units
    rate: RATES.AHLG / (RATES[t.symbol] ?? 1),
  }));
  const [to, setTo] = useStateMR(targets[0]);
  const [amount, setAmount] = useStateMR('1');
  const [pickerOpen, setPickerOpen] = useStateMR(false);
  const [confirmOpen, setConfirmOpen] = useStateMR(false);

  const out = parseNum(amount) * to.rate;

  return (
    <>
      <div style={{ padding: '0 24px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            background: BRAND.surface, borderRadius: 20, padding: '18px 20px 22px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: BRAND.muted }}>{T('You burn')}</span>
              <button onClick={() => setAmount(String(BALANCES.AHLG))} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: FONT, fontSize: 12, fontWeight: 600, color: BRAND.red,
              }}>{T('Max')}</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
              <input value={amount} onChange={e => setAmount(e.target.value)} style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: FONT, fontWeight: 800, fontSize: 30, color: BRAND.ink,
                letterSpacing: '-0.03em', width: 0, minWidth: 0,
                fontVariantNumeric: 'tabular-nums',
              }}/>
              <div style={{
                background: BRAND.red, color: '#fff',
                borderRadius: 999, padding: '6px 14px 6px 6px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: '#fff', display: 'grid', placeItems: 'center' }}>
                  <KMark size={16} />
                </div>
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14 }}>AHLG</span>
              </div>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 6 }}>
              {T('Balance')}: {fmt(BALANCES.AHLG, 4)} AHLG
            </div>
          </div>

          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 40, height: 40, borderRadius: 20, background: BRAND.white,
            border: `1px solid ${BRAND.line}`, display: 'grid', placeItems: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14m0 0l-5-5m5 5l5-5" stroke={BRAND.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div style={{
            background: BRAND.surface, borderRadius: 20, padding: '18px 20px 22px',
            marginTop: 6,
          }}>
            <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: BRAND.muted }}>{T('You receive')}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
              <div style={{
                flex: 1, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: BRAND.ink,
                letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums',
              }}>{fmt(out, decimalsFor(to.symbol))}</div>
              <button onClick={() => setPickerOpen(true)} style={{
                background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 999,
                padding: '6px 10px 6px 6px', display: 'flex', alignItems: 'center', gap: 8,
                cursor: 'pointer',
              }}>
                <CoinDot symbol={to.symbol} />
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: BRAND.ink }}>{to.symbol}</span>
                <ChevDown size={12} />
              </button>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 6 }}>
              {T('Settles to your Kanzasset balance')}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '18px 24px 0' }}>
        <div style={{
          background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 20,
          padding: '6px 18px',
        }}>
          <QuoteRow label="Price quote">
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>1 AHLG ≈ {fmt(RATES.AHLG)} USDT</span>
            <span style={{
              marginLeft: 8, fontFamily: FONT, fontSize: 11, fontWeight: 600,
              color: BRAND.red, background: 'rgba(212,32,43,0.08)',
              borderRadius: 8, padding: '2px 6px',
            }}>10s</span>
          </QuoteRow>
          <QuoteRow label="Redeem fee" last>0.00%</QuoteRow>
        </div>
      </div>

      <div style={{ padding: '20px 24px 0' }}>
        <PrimaryButton onClick={() => setConfirmOpen(true)}>Redeem</PrimaryButton>
      </div>

      <Sheet open={pickerOpen} onClose={() => setPickerOpen(false)} title="Receive in">
        <AssetPicker
          assets={targets.map(t => ({ ...t, balance: fmt(t.balance, decimalsFor(t.symbol)) }))}
          onPick={(a) => { setTo(targets.find(t => t.symbol === a.symbol)); setPickerOpen(false); }}
        />
      </Sheet>

      <Sheet open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm redeem"
        footer={<PrimaryButton onClick={() => setConfirmOpen(false)}>Hold to confirm</PrimaryButton>}>
        <div style={{ padding: '8px 24px 0' }}>
          <ConfirmRow label="Burn" value={`${fmt(parseNum(amount), 4)} AHLG`} />
          <ConfirmRow label="Receive" value={`${fmt(out, decimalsFor(to.symbol))} ${to.symbol}`} accent />
          <ConfirmRow label="Rate" value={`1 AHLG ≈ ${fmt(to.rate, decimalsFor(to.symbol))} ${to.symbol}`} last />
        </div>
      </Sheet>
    </>
  );
}

function RedeemPhysical() {
  const products = [
    { id: '1kg',  weight: '1 kg',  need: 1000 },
    { id: '2kg',  weight: '2 kg',  need: 2000 },
    { id: '3kg',  weight: '3 kg',  need: 3000 },
    { id: '5kg',  weight: '5 kg',  need: 5000 },
    { id: '10kg', weight: '10 kg', need: 10000 },
  ];
  const balance = BALANCES.AHLG;
  const affordable = products.filter(p => p.need <= balance);

  const [addrSheet, setAddrSheet] = useStateMR(false);
  const [addr, setAddr] = useStateMR(null); // user must pick first
  const [picked, setPicked] = useStateMR(affordable[0]?.id ?? null);

  const product = affordable.find(p => p.id === picked) ?? affordable[0];

  return (
    <>
      <div style={{ padding: '0 24px' }}>
        {/* Step 1: Shipping address (gating) */}
        <SmallLabel>Shipping address</SmallLabel>
        <button onClick={() => setAddrSheet(true)} style={{
          width: '100%',
          background: addr ? BRAND.surface : BRAND.white,
          border: addr ? '1.5px solid transparent' : `1.5px dashed ${BRAND.line}`,
          borderRadius: 16,
          padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14,
          cursor: 'pointer', textAlign: 'start',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 18,
            background: addr ? '#fff' : BRAND.surface,
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 21s-6-5.5-6-11a6 6 0 1 1 12 0c0 5.5-6 11-6 11z" stroke={addr ? BRAND.ink : BRAND.muted} strokeWidth="1.7" strokeLinejoin="round"/>
              <circle cx="12" cy="10" r="2.2" stroke={addr ? BRAND.ink : BRAND.muted} strokeWidth="1.7"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {addr ? (
              <>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: BRAND.ink }}>{T(addr.label)} · {addr.city}</div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{addr.line}, {addr.country}</div>
              </>
            ) : (
              <>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: BRAND.ink }}>{T('Choose delivery address')}</div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 2 }}>{T('We ship to UAE, Türkiye, Saudi Arabia, Kuwait')}</div>
              </>
            )}
          </div>
          <ChevRight />
        </button>

        {/* Step 2: Products (disabled until address chosen) */}
        <SmallLabel style={{ marginTop: 22, opacity: addr ? 1 : 0.4 }}>Select bar</SmallLabel>
        {!addr && (
          <div style={{
            background: BRAND.surface, borderRadius: 16,
            padding: '18px 16px', textAlign: 'center',
            fontFamily: FONT, fontSize: 13, color: BRAND.muted,
          }}>
            {T('Pick a shipping address to see available bars')}
          </div>
        )}
        {addr && affordable.length === 0 && (
          <div style={{
            background: BRAND.surface, borderRadius: 16,
            padding: '18px 16px', textAlign: 'center',
            fontFamily: FONT, fontSize: 13, color: BRAND.muted,
          }}>
            {T('Your AHLG balance is below 1 kg. Mint more to redeem a bar.')}
          </div>
        )}
        {addr && affordable.length > 0 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {affordable.map(p => {
                const on = p.id === picked;
                return (
                  <button key={p.id} onClick={() => setPicked(p.id)} style={{
                    background: on ? BRAND.white : BRAND.surface,
                    border: on ? `1.5px solid ${BRAND.red}` : `1.5px solid transparent`,
                    borderRadius: 18, padding: '16px 16px 14px', cursor: 'pointer',
                    textAlign: 'start',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: BRAND.ink, letterSpacing: '-0.02em' }}>{p.weight}</div>
                        <div style={{ fontFamily: FONT, fontSize: 11, color: BRAND.muted, marginTop: 2 }}>{T('Pure gold')} · 999.5</div>
                      </div>
                      <div style={{
                        width: 18, height: 18, borderRadius: 9,
                        border: `1.5px solid ${on ? BRAND.red : BRAND.line}`,
                        background: on ? BRAND.red : 'transparent',
                        display: 'grid', placeItems: 'center', flexShrink: 0,
                      }}>
                        {on && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }}/>}
                      </div>
                    </div>
                    <div style={{ fontFamily: FONT, fontSize: 11, color: BRAND.muted, marginTop: 10, fontVariantNumeric: 'tabular-nums' }}>{fmt(p.need, 0)} AHLG</div>
                  </button>
                );
              })}
            </div>
            <div style={{
              fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 10,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {T('Available')}: {fmt(balance, 4)} AHLG · {T('max')} {Math.floor(balance / 1000)} {Math.floor(balance/1000) === 1 ? T('bar') : T('bars')}
            </div>
          </>
        )}
      </div>

      {addr && product && (
        <>
          <div style={{ padding: '18px 24px 0' }}>
            <div style={{
              background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 20,
              padding: '6px 18px',
            }}>
              <QuoteRow label="Burned">{fmt(product.need, 4)} AHLG</QuoteRow>
              <QuoteRow label="Shipping">AED 120 · Brinks</QuoteRow>
              <QuoteRow label="Insurance">Included</QuoteRow>
              <QuoteRow label="Estimated arrival" last>3–5 business days</QuoteRow>
            </div>
          </div>

          <div style={{ padding: '20px 24px 0' }}>
            <PrimaryButton>Request physical delivery</PrimaryButton>
            <div style={{
              fontFamily: FONT, fontSize: 12, color: BRAND.muted, textAlign: 'center',
              marginTop: 14, lineHeight: 1.5,
            }}>
              {T('Bars cast by Ahlatci Gold Refinery, sealed with tamper-evident packaging and serial certificate.')}
            </div>
          </div>
        </>
      )}

      <Sheet open={addrSheet} onClose={() => setAddrSheet(false)} title="Shipping addresses">
        <div>
          {[
            { label: 'Home',     city: 'Dubai',    line: 'Marina Plaza, Tower 1, Apt 2208', country: 'UAE' },
            { label: 'Office',   city: 'Dubai',    line: 'DMCC Almas Tower, Floor 38',      country: 'UAE' },
            { label: 'Istanbul', city: 'Istanbul', line: 'Levent Mah. Büyükdere Cad. No:185', country: 'Türkiye' },
          ].map((a, i, arr) => (
            <button key={i} onClick={() => { setAddr(a); setAddrSheet(false); }} style={{
              width: '100%', background: 'transparent', border: 'none',
              padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 14,
              cursor: 'pointer', textAlign: 'start',
              borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${BRAND.line}`,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: BRAND.ink }}>{T(a.label)} · {a.city}</div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 2 }}>{a.line}, {a.country}</div>
              </div>
              {addr && addr.label === a.label && <div style={{ width: 8, height: 8, borderRadius: 4, background: BRAND.red }}/>}
            </button>
          ))}
          <div style={{ padding: '14px 24px 0' }}>
            <button style={{
              width: '100%', background: 'transparent', border: `1.5px dashed ${BRAND.line}`,
              borderRadius: 14, padding: '14px', cursor: 'pointer',
              fontFamily: FONT, fontWeight: 600, fontSize: 14, color: BRAND.ink,
            }}>{T('+ Add new address')}</button>
          </div>
        </div>
      </Sheet>
    </>
  );
}

const iconBtn = {
  width: 40, height: 40, borderRadius: 12, background: BRAND.white,
  border: `1px solid ${BRAND.line}`, cursor: 'pointer',
  fontFamily: FONT, fontWeight: 700, fontSize: 20, color: BRAND.ink,
};

Object.assign(window, {
  MintScreen, RedeemScreen, QuoteRow, ConfirmRow, iconBtn,
});
