// ─── Wallet + Deposit + Withdraw screens ──────────────────────

const { useState: useWFlow } = React;

// ═════════════════════════════════════════════════════════════
// WALLET — detailed asset table with per-row actions
// ═════════════════════════════════════════════════════════════
function WebWallet({ navigate }) {
  const [currency, setCurrency] = useWFlow('USDT');
  const [kindFilter, setKindFilter] = useWFlow('all'); // all | crypto | fiat

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
  const crypto = allAssets.filter(a => a.kind === 'crypto').reduce((s, a) => s + a.valUSDT, 0);
  const fiat   = allAssets.filter(a => a.kind === 'fiat').reduce((s, a) => s + a.valUSDT, 0);

  return (
    <div style={{ padding: '28px 32px 48px' }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <WEyebrow>Wallet</WEyebrow>
        <h1 style={{
          margin: '6px 0 0', fontFamily: WFONT, fontSize: 28, fontWeight: 800,
          color: WBRAND.ink, letterSpacing: '-0.025em',
        }}>Balances & holdings</h1>
        <div style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, marginTop: 6 }}>
          All assets across crypto and fiat. Deposit, withdraw, or move between currencies directly from each row.
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
        <WCard padding={22}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <WEyebrow>Total balance</WEyebrow>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
                <WNum size={34} weight={800} style={{ letterSpacing: '-0.03em' }}>{wfmt(total, wdecimals(currency))}</WNum>
                <span style={{ fontFamily: WFONT, fontWeight: 700, fontSize: 14, color: WBRAND.muted }}>{currency}</span>
              </div>
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
                ≈ AED {wfmt(totalAed)} · <span style={{ color: WBRAND.positive, fontWeight: 700 }}>+2.81% past month</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <WSecondary size="sm" onClick={() => navigate('deposit')} icon={WIcon.download(WBRAND.ink)}>Deposit</WSecondary>
              <WSecondary size="sm" onClick={() => navigate('withdraw')} icon={WIcon.upload(WBRAND.ink)}>Withdraw</WSecondary>
            </div>
          </div>
        </WCard>
        <WCard padding={22}>
          <WEyebrow>Crypto</WEyebrow>
          <WNum size={22} weight={800} style={{ marginTop: 8, display: 'block', letterSpacing: '-0.025em' }}>${wfmt(crypto)}</WNum>
          <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 4, fontWeight: 500 }}>
            {wfmt(crypto / totalUSDT * 100, 1)}% of portfolio
          </div>
        </WCard>
        <WCard padding={22}>
          <WEyebrow>Fiat</WEyebrow>
          <WNum size={22} weight={800} style={{ marginTop: 8, display: 'block', letterSpacing: '-0.025em' }}>${wfmt(fiat)}</WNum>
          <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 4, fontWeight: 500 }}>
            {wfmt(fiat / totalUSDT * 100, 1)}% of portfolio
          </div>
        </WCard>
      </div>

      {/* Asset table */}
      <WCard padding={0}>
        <div style={{
          padding: '18px 22px 14px', borderBottom: `1px solid ${WBRAND.line}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <WSectionTitle title="All assets" sub={`${assets.length} of ${allAssets.length} shown · sorted by value`} style={{ marginBottom: 0 }}/>
          <div style={{ display: 'flex', gap: 4 }}>
            <WGhost active={kindFilter === 'all'} onClick={() => setKindFilter('all')}>All</WGhost>
            <WGhost active={kindFilter === 'crypto'} onClick={() => setKindFilter('crypto')}>Crypto</WGhost>
            <WGhost active={kindFilter === 'fiat'} onClick={() => setKindFilter('fiat')}>Fiat</WGhost>
          </div>
        </div>

        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.2fr 0.9fr 1.2fr 0.7fr 1fr 200px',
          gap: 12, padding: '10px 22px',
          borderBottom: `1px solid ${WBRAND.line}`,
          background: WBRAND.surface2,
        }}>
          {['Asset', 'Balance', 'Price', 'Value (USDT)', '24h', 'Allocation', 'Actions'].map((h, i) => (
            <div key={i} style={{
              fontFamily: WFONT, fontSize: 10, fontWeight: 700,
              color: WBRAND.muted, letterSpacing: '0.08em', textTransform: 'uppercase',
              textAlign: i >= 1 && i <= 4 ? 'right' : i === 6 ? 'right' : 'left',
            }}>{h}</div>
          ))}
        </div>

        {assets.length === 0 ? (
          <div style={{ padding: '40px 22px', textAlign: 'center', fontFamily: WFONT, fontSize: 13, color: WBRAND.muted }}>
            No assets match this filter.
          </div>
        ) : assets.map((a, i) => {
          const isAhlg = a.symbol === 'AHLG';
          const zero = a.balance === 0;
          return (
            <div key={a.symbol} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.2fr 0.9fr 1.2fr 0.7fr 1fr 200px',
              gap: 12, padding: '14px 22px', alignItems: 'center',
              borderBottom: i === assets.length - 1 ? 'none' : `1px solid ${WBRAND.line}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: zero ? 0.65 : 1 }}>
                <WCoinDot symbol={a.symbol} size={34}/>
                <div>
                  <div style={{ fontFamily: WFONT, fontSize: 14, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{a.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 600 }}>{a.symbol}</span>
                    <span style={{
                      fontFamily: WFONT, fontSize: 9, fontWeight: 700, color: WBRAND.muted,
                      background: WBRAND.surface, padding: '1px 6px', borderRadius: 4,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>{a.kind}</span>
                  </div>
                </div>
              </div>
              <WMonoNum size={13} color={zero ? WBRAND.muted2 : WBRAND.ink} style={{ textAlign: 'right' }}>{wfmt(a.balance, wdecimals(a.symbol))}</WMonoNum>
              <WMonoNum size={13} color={zero ? WBRAND.muted2 : WBRAND.muted} style={{ textAlign: 'right' }}>
                {a.symbol === 'AHLG' ? '$151.56' : (a.symbol === 'AED' ? '$0.272' : a.symbol === 'EUR' ? '$1.080' : a.symbol === 'GBP' ? '$1.270' : '$1.000')}
              </WMonoNum>
              <WMonoNum size={13} weight={600} color={zero ? WBRAND.muted2 : WBRAND.ink} style={{ textAlign: 'right' }}>${wfmt(a.valUSDT)}</WMonoNum>
              <span style={{
                fontFamily: WFONT, fontSize: 12, fontWeight: 700,
                color: zero ? WBRAND.muted2 : (a.pct24h >= 0 ? WBRAND.positive : WBRAND.red),
                textAlign: 'right', fontVariantNumeric: 'tabular-nums',
              }}>{a.pct24h >= 0 ? '+' : ''}{wfmt(a.pct24h, 2)}%</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: zero ? 0.5 : 1 }}>
                <div style={{ flex: 1, height: 4, background: WBRAND.surface, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    width: `${a.alloc}%`, height: '100%',
                    background: a.symbol === 'AHLG' ? WBRAND.red : WBRAND.ink,
                  }}/>
                </div>
                <WMonoNum size={11} color={WBRAND.muted}>{wfmt(a.alloc, 1)}%</WMonoNum>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                {isAhlg ? (
                  <>
                    <AssetActionBtn label="Mint"   onClick={() => navigate('mint')} accent/>
                    <AssetActionBtn label="Redeem" onClick={() => navigate('redeem')} disabled={zero}/>
                  </>
                ) : (
                  <>
                    <AssetActionBtn label="Deposit"  onClick={() => navigate('deposit')}/>
                    <AssetActionBtn label="Withdraw" onClick={() => navigate('withdraw')} disabled={zero}/>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </WCard>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// DEPOSIT — crypto + fiat
// ═════════════════════════════════════════════════════════════
function WebDeposit({ navigate, initialAsset }) {
  const cryptoAssets = ['USDT', 'USDC'].map(s => ({ symbol: s, name: WMETA[s].name }));
  const fiatAssets   = ['AED', 'USD', 'EUR', 'GBP'].map(s => ({ symbol: s, name: WMETA[s].name }));
  const initialKind = initialAsset && WMETA[initialAsset]?.kind === 'fiat' ? 'fiat' : 'crypto';

  const [kind, setKind] = useWFlow(initialKind);
  const [cryptoAsset, setCryptoAsset] = useWFlow(
    cryptoAssets.find(a => a.symbol === initialAsset) ?? cryptoAssets[0]
  );
  const [fiatAsset, setFiatAsset] = useWFlow(
    fiatAssets.find(a => a.symbol === initialAsset) ?? fiatAssets[0]
  );

  const bankFor = {
    AED: { bank: 'Emirates NBD',    iban: 'AE07 0331 2345 6789 0001 198', swift: 'EBILAEAD', ref: 'AHLG-7421-AED' },
    USD: { bank: 'JP Morgan Chase', iban: 'ACH 021000021 · 802135 2249',  swift: 'CHASUS33', ref: 'AHLG-7421-USD' },
    EUR: { bank: 'Garanti BBVA',    iban: 'TR33 0006 2000 4290 0000 0001', swift: 'TGBATRIS', ref: 'AHLG-7421-EUR' },
    GBP: { bank: 'Lloyds Bank',     iban: 'GB29 LOYD 3092 1031 9876 54',   swift: 'LOYDGB2L', ref: 'AHLG-7421-GBP' },
  };
  const bank = bankFor[fiatAsset.symbol];

  return (
    <div style={{ padding: '28px 32px 48px' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <WEyebrow>Deposit</WEyebrow>
        <h1 style={{
          margin: '6px 0 0', fontFamily: WFONT, fontSize: 28, fontWeight: 800,
          color: WBRAND.ink, letterSpacing: '-0.025em',
        }}>Add funds to your wallet</h1>
        <div style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, marginTop: 6 }}>
          Deposit crypto by sending to your unique address, or wire fiat from your registered bank account.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '560px 1fr', gap: 20 }}>
        {/* Left: kind toggle + asset + body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Kind toggle */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2,
            padding: 4, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, borderRadius: 12,
          }}>
            {[
              { id: 'crypto', label: 'Crypto', sub: 'USDT / USDC · Ethereum' },
              { id: 'fiat',   label: 'Fiat',   sub: 'Bank wire · 1–2 days' },
            ].map(t => {
              const on = kind === t.id;
              return (
                <button key={t.id} onClick={() => setKind(t.id)} style={{
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

          {/* Asset selector */}
          <WCard padding={0}>
            <div style={{ padding: '16px 22px 10px', borderBottom: `1px solid ${WBRAND.line}` }}>
              <WEyebrow>Select asset</WEyebrow>
            </div>
            <div style={{ padding: '8px 12px' }}>
              {(kind === 'crypto' ? cryptoAssets : fiatAssets).map(a => {
                const on = (kind === 'crypto' ? cryptoAsset.symbol : fiatAsset.symbol) === a.symbol;
                return (
                  <button key={a.symbol} onClick={() => kind === 'crypto' ? setCryptoAsset(a) : setFiatAsset(a)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 8, border: 'none',
                    background: on ? WBRAND.surface : 'transparent', cursor: 'pointer', textAlign: 'left',
                  }}>
                    <WCoinDot symbol={a.symbol} size={32}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{a.name}</div>
                      <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2 }}>{a.symbol} · balance <WMonoNum size={11} color={WBRAND.muted}>{wfmt(WBALANCES[a.symbol] ?? 0, wdecimals(a.symbol))}</WMonoNum></div>
                    </div>
                    <div style={{
                      width: 18, height: 18, borderRadius: 9,
                      border: `1.5px solid ${on ? WBRAND.red : WBRAND.line2}`,
                      background: on ? WBRAND.red : 'transparent',
                      display: 'grid', placeItems: 'center',
                    }}>{on && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }}/>}</div>
                  </button>
                );
              })}
            </div>
          </WCard>
        </div>

        {/* Right: Deposit details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {kind === 'crypto' ? (
            <>
              <WCard padding={0}>
                <div style={{
                  padding: '16px 22px 14px', borderBottom: `1px solid ${WBRAND.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontFamily: WFONT, fontSize: 15, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.015em' }}>Your {cryptoAsset.symbol} deposit address</div>
                    <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 2 }}>Ethereum mainnet · ERC-20</div>
                  </div>
                  <WPill tone="positive">{WIcon.check(WBRAND.positive)} Verified</WPill>
                </div>

                <div style={{
                  display: 'grid', gridTemplateColumns: '180px 1fr', gap: 24,
                  padding: '24px',
                }}>
                  {/* QR */}
                  <div style={{
                    background: WBRAND.white, border: `1px solid ${WBRAND.line}`,
                    borderRadius: 12, padding: 12, aspectRatio: '1',
                  }}>
                    <FauxWebQR/>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <WEyebrow>Address</WEyebrow>
                      <div style={{
                        marginTop: 8, padding: '12px 14px', background: WBRAND.surface,
                        borderRadius: 10, fontFamily: WMONO, fontSize: 13, color: WBRAND.ink,
                        wordBreak: 'break-all', lineHeight: 1.5,
                      }}>0x7A4f3B9c2De04A8FbE9eC1A2eE9c2A1d3b7E5C09</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                        <WSecondary size="md" icon={WIcon.copy(WBRAND.ink)} style={{ width: '100%', justifyContent: 'center' }}>Copy address</WSecondary>
                        <WSecondary size="md" icon={WIcon.share(WBRAND.ink)} style={{ width: '100%', justifyContent: 'center' }}>Share</WSecondary>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px',
                      background: WBRAND.redSoft, borderRadius: 10, marginTop: 16,
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: 9, background: WBRAND.red,
                        color: '#fff', display: 'grid', placeItems: 'center',
                        fontFamily: WFONT, fontSize: 11, fontWeight: 800, flexShrink: 0,
                      }}>!</div>
                      <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.ink, lineHeight: 1.5 }}>
                        Send only <strong>{cryptoAsset.symbol}</strong> on the <strong>Ethereum (ERC-20)</strong> network. Other tokens or networks will result in permanent loss of funds.
                      </div>
                    </div>
                  </div>
                </div>
              </WCard>

              {/* Stats */}
              <WCard padding={0}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {[
                    { l: 'Minimum deposit',  v: `10.00 ${cryptoAsset.symbol}` },
                    { l: 'Confirmations',    v: '12 blocks · ≈ 3 min' },
                    { l: 'Network fee',      v: 'Paid by sender' },
                  ].map((k, i) => (
                    <div key={i} style={{
                      padding: '16px 20px',
                      borderRight: i < 2 ? `1px solid ${WBRAND.line}` : 'none',
                    }}>
                      <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{k.l}</div>
                      <WMonoNum size={14} style={{ marginTop: 4, display: 'block' }}>{k.v}</WMonoNum>
                    </div>
                  ))}
                </div>
              </WCard>
            </>
          ) : (
            <>
              <WCard padding={0}>
                <div style={{
                  padding: '16px 22px 14px', borderBottom: `1px solid ${WBRAND.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontFamily: WFONT, fontSize: 15, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.015em' }}>{fiatAsset.name} · bank transfer details</div>
                    <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 2 }}>Send from any account registered under <strong>Ahmet Yılmaz</strong></div>
                  </div>
                  <WSecondary size="sm" icon={WIcon.download(WBRAND.ink)}>Download PDF</WSecondary>
                </div>

                <div style={{ padding: '4px 22px 8px' }}>
                  {[
                    { l: 'Beneficiary name', v: 'Kanzasset DMCC' },
                    { l: 'Beneficiary address', v: 'Almas Tower, JLT, Dubai, UAE' },
                    { l: 'Bank', v: bank.bank },
                    { l: fiatAsset.symbol === 'USD' ? 'Routing / Account' : 'IBAN', v: bank.iban, mono: true },
                    { l: 'SWIFT / BIC', v: bank.swift, mono: true },
                    { l: 'Reference (MUST include)', v: bank.ref, mono: true, accent: true },
                  ].map((r, i, arr) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}`,
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{r.l}</div>
                        <div style={{
                          fontFamily: r.mono ? WMONO : WFONT,
                          fontSize: 14, fontWeight: 700,
                          color: r.accent ? WBRAND.red : WBRAND.ink, marginTop: 4,
                          letterSpacing: r.mono ? 0 : '-0.005em', wordBreak: 'break-all',
                        }}>{r.v}</div>
                      </div>
                      <WSecondary size="sm" icon={WIcon.copy(WBRAND.ink)}>Copy</WSecondary>
                    </div>
                  ))}
                </div>
              </WCard>

              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px',
                background: WBRAND.redSoft, borderRadius: 10,
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 10, background: WBRAND.red,
                  color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0,
                  fontFamily: WFONT, fontSize: 12, fontWeight: 800,
                }}>!</div>
                <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.ink, lineHeight: 1.5 }}>
                  You must include the reference code <strong>{bank.ref}</strong> exactly in your bank transfer, and send only from an account registered under your verified legal name. Funds typically arrive in <strong>1–2 business days</strong>.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// WITHDRAW — crypto + fiat
// ═════════════════════════════════════════════════════════════
function WebWithdraw({ navigate, initialAsset }) {
  const cryptoAssets = ['USDT', 'USDC'].map(s => ({ symbol: s, name: WMETA[s].name, balance: WBALANCES[s] }));
  const fiatAssets   = ['AED', 'USD', 'EUR', 'GBP'].map(s => ({ symbol: s, name: WMETA[s].name, balance: WBALANCES[s] }));
  const initialKind  = initialAsset && WMETA[initialAsset]?.kind === 'fiat' ? 'fiat' : 'crypto';

  const [kind, setKind] = useWFlow(initialKind);
  const [cryptoAsset, setCryptoAsset] = useWFlow(
    cryptoAssets.find(a => a.symbol === initialAsset) ?? cryptoAssets[0]
  );
  const [fiatAsset, setFiatAsset] = useWFlow(
    fiatAssets.find(a => a.symbol === initialAsset) ?? fiatAssets[0]
  );
  const asset = kind === 'crypto' ? cryptoAsset : fiatAsset;
  const [amount, setAmount] = useWFlow('');

  const cryptoWhitelist = [
    { id: 'cw-usdt', title: 'Cold wallet · USDT', sub: 'Ethereum · 0xC4e1A3…8fB9hPq', net: 'ERC-20', verified: true },
    { id: 'cw-usdc', title: 'Cold wallet · USDC', sub: 'Ethereum · 0xA1b2C3…4D5e6F7', net: 'ERC-20', verified: true },
    { id: 'hw-usdt', title: 'Ledger · USDT',     sub: 'Ethereum · 0x88aF12…e8WzX2k', net: 'ERC-20', verified: true },
  ];
  const fiatWhitelist = [
    { id: 'aed-enbd',    title: 'Emirates NBD',  sub: 'AED · IBAN AE07 0331…1198', net: 'AED', verified: true },
    { id: 'usd-jpm',     title: 'JP Morgan Chase', sub: 'USD · ACH 802135…2249',   net: 'USD', verified: true },
    { id: 'eur-garanti', title: 'Garanti BBVA',  sub: 'EUR · IBAN TR33 0006…0001', net: 'EUR', verified: true },
  ];
  const whitelist = kind === 'crypto' ? cryptoWhitelist : fiatWhitelist;
  const [destId, setDestId] = useWFlow(whitelist[0].id);
  React.useEffect(() => { setDestId((kind === 'crypto' ? cryptoWhitelist : fiatWhitelist)[0].id); }, [kind]);

  const amt = wparse(amount);
  const fee = 0;
  const receive = Math.max(0, amt - fee);

  return (
    <div style={{ padding: '28px 32px 48px' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <WEyebrow>Withdraw</WEyebrow>
        <h1 style={{
          margin: '6px 0 0', fontFamily: WFONT, fontSize: 28, fontWeight: 800,
          color: WBRAND.ink, letterSpacing: '-0.025em',
        }}>Send funds to a whitelisted destination</h1>
        <div style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, marginTop: 6 }}>
          Withdrawals can only go to pre-approved addresses or bank accounts. New destinations require a 24h security review.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '560px 1fr', gap: 20 }}>

        {/* Left: form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Kind toggle */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2,
            padding: 4, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, borderRadius: 12,
          }}>
            {[
              { id: 'crypto', label: 'Crypto', sub: 'USDT / USDC · Ethereum' },
              { id: 'fiat',   label: 'Fiat',   sub: 'Bank wire · 1–2 days' },
            ].map(t => {
              const on = kind === t.id;
              return (
                <button key={t.id} onClick={() => setKind(t.id)} style={{
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

          {/* From + amount */}
          <WCard padding={0}>
            <div style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <WEyebrow>From</WEyebrow>
                <button onClick={() => setAmount(String(asset.balance))} style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.red,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>Use max</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: WFONT, fontWeight: 800, fontSize: 30, color: WBRAND.ink,
                  letterSpacing: '-0.03em', width: 0, minWidth: 0,
                  fontVariantNumeric: 'tabular-nums',
                }}/>
                <WAssetSelector
                  value={asset.symbol}
                  options={kind === 'crypto' ? cryptoAssets : fiatAssets}
                  onChange={(s) => {
                    const found = (kind === 'crypto' ? cryptoAssets : fiatAssets).find(x => x.symbol === s);
                    if (kind === 'crypto') setCryptoAsset(found); else setFiatAsset(found);
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted }}>
                  Balance: <WMonoNum size={12}>{wfmt(asset.balance, wdecimals(asset.symbol))}</WMonoNum> {asset.symbol}
                </span>
                <span style={{ display: 'flex', gap: 6 }}>
                  {[25, 50, 75].map(p => (
                    <button key={p} onClick={() => setAmount(String(asset.balance * p / 100))} style={{
                      background: WBRAND.surface, border: 'none', cursor: 'pointer',
                      padding: '2px 8px', borderRadius: 6,
                      fontFamily: WFONT, fontSize: 11, fontWeight: 600, color: WBRAND.ink,
                    }}>{p}%</button>
                  ))}
                </span>
              </div>
            </div>
          </WCard>

          {/* Destination */}
          <WCard padding={0}>
            <div style={{
              padding: '14px 22px', borderBottom: `1px solid ${WBRAND.line}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.005em' }}>
                  {kind === 'crypto' ? 'Whitelisted addresses' : 'Bank accounts'}
                </div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2 }}>
                  {whitelist.length} verified
                </div>
              </div>
              <WSecondary size="sm" icon={WIcon.plus(WBRAND.ink)}>Add new</WSecondary>
            </div>
            <div style={{ padding: '4px 0' }}>
              {whitelist.map((it, i) => {
                const on = destId === it.id;
                return (
                  <button key={it.id} onClick={() => setDestId(it.id)} style={{
                    width: '100%', background: 'transparent', border: 'none',
                    padding: '12px 22px', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 12,
                    borderTop: i === 0 ? 'none' : `1px solid ${WBRAND.line}`,
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 9,
                      border: `1.5px solid ${on ? WBRAND.red : WBRAND.line2}`,
                      background: on ? WBRAND.red : 'transparent',
                      display: 'grid', placeItems: 'center', flexShrink: 0,
                    }}>{on && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }}/>}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{it.title}</span>
                        {it.verified && <WPill tone="positive">{WIcon.check(WBRAND.positive)} Verified</WPill>}
                      </div>
                      <div style={{
                        fontFamily: it.sub.includes('0x') ? WMONO : WFONT,
                        fontSize: 11, color: WBRAND.muted, marginTop: 2,
                      }}>{it.sub}</div>
                    </div>
                    <WPill tone="neutral">{it.net}</WPill>
                  </button>
                );
              })}
            </div>
          </WCard>
        </div>

        {/* Right: review + warning */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <WCard padding={0}>
            <div style={{ padding: '16px 22px 12px', borderBottom: `1px solid ${WBRAND.line}` }}>
              <div style={{ fontFamily: WFONT, fontSize: 15, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.015em' }}>Review withdrawal</div>
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 2 }}>Confirm details before submitting</div>
            </div>
            <div style={{ padding: '4px 22px 8px' }}>
              {[
                { l: 'Send',          v: `${amt > 0 ? wfmt(amt, wdecimals(asset.symbol)) : '—'} ${asset.symbol}`, accent: true },
                { l: 'Network / Rail', v: kind === 'crypto' ? 'Ethereum · ERC-20' : asset.symbol + ' · SWIFT' },
                { l: 'Destination',    v: whitelist.find(w => w.id === destId)?.title ?? '—' },
                { l: 'Network fee',    v: kind === 'crypto' ? 'Covered by Kanzasset' : 'Bank charges may apply' },
                { l: 'Receive',        v: `${wfmt(receive, wdecimals(asset.symbol))} ${asset.symbol}` },
                { l: 'Estimated arrival', v: kind === 'crypto' ? '≈ 3 minutes' : '1–2 business days' },
              ].map((r, i, arr) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '13px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}`,
                }}>
                  <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>{r.l}</span>
                  <span style={{
                    fontFamily: WFONT, fontSize: r.accent ? 15 : 13,
                    fontWeight: r.accent ? 800 : 600,
                    color: r.accent ? WBRAND.ink : WBRAND.ink,
                    fontVariantNumeric: 'tabular-nums', letterSpacing: r.accent ? '-0.015em' : 0,
                  }}>{r.v}</span>
                </div>
              ))}
            </div>
          </WCard>

          <WPrimary size="lg" style={{ width: '100%', justifyContent: 'center' }} icon={WIcon.shield('#fff')}>
            Hold to confirm withdrawal
          </WPrimary>

          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '12px 14px', background: WBRAND.redSoft, borderRadius: 10,
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: 9, background: WBRAND.red,
              color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0,
              fontFamily: WFONT, fontSize: 11, fontWeight: 800,
            }}>!</div>
            <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.ink, lineHeight: 1.5 }}>
              You'll be asked to approve this withdrawal with your hardware key. {kind === 'crypto' ? 'Crypto withdrawals are irreversible — double-check the destination address.' : 'Bank transfers can take 1–2 business days to settle and are subject to your bank\'s cut-off times.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Decorative QR (larger than mobile FauxQR) ────────────────
function FauxWebQR() {
  const cells = [];
  const r = 21;
  for (let y = 0; y < r; y++) {
    for (let x = 0; x < r; x++) {
      const on = ((x * 53 + y * 71 + x*y*3) % 7) > 3
              || (x < 3 && y < 3) || (x > r-4 && y < 3) || (x < 3 && y > r-4);
      if (on) cells.push(<rect key={x+','+y} x={x*4} y={y*4} width={3.5} height={3.5} fill={WBRAND.ink} rx="0.4"/>);
    }
  }
  return <svg viewBox={`0 0 ${r*4} ${r*4}`} width="100%" height="100%">{cells}</svg>;
}

Object.assign(window, { WebWallet, WebDeposit, WebWithdraw, FauxWebQR });
