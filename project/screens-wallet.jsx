// AHLG / Kanzasset — Wallet, Mint, Redeem, Profile screens

const { useState } = React;

// ─────────────────────────────────────────────────────────────
// Shared sub-views
// ─────────────────────────────────────────────────────────────

// Asset selector sheet content
function AssetPicker({ assets, onPick, onAddFunds, showBalance = true }) {
  return (
    <div>
      {assets.map((a, i) => (
        <div key={a.symbol} onClick={() => onPick(a)} style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 24px', cursor: 'pointer',
          borderBottom: i === assets.length - 1 ? 'none' : `1px solid ${BRAND.line}`,
        }}>
          <CoinDot symbol={a.symbol} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: BRAND.ink }}>{T(a.name)}</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 2 }}>{a.symbol}</div>
          </div>
          {showBalance && (
            <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: BRAND.ink, fontVariantNumeric: 'tabular-nums' }}>{a.balance}</div>
          )}
        </div>
      ))}
      {onAddFunds && (
        <div style={{ padding: '14px 24px 0' }}>
          <button onClick={onAddFunds} style={{
            width: '100%', background: BRAND.surface, border: 'none',
            borderRadius: 16, padding: '14px 16px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18, background: '#fff',
              display: 'grid', placeItems: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke={BRAND.red} strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: BRAND.ink, letterSpacing: '-0.01em' }}>{T('Add funds')}</div>
              <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 2 }}>{T('Deposit crypto or fiat to mint')}</div>
            </div>
            <ChevRight color={BRAND.ink}/>
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// WALLET
// ─────────────────────────────────────────────────────────────
function WalletScreen({ state, setState }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [actionSheet, setActionSheet] = useState(state?.openDeposit ? 'deposit' : null);

  React.useEffect(() => {
    if (state?.openDeposit) setState({ openDeposit: false });
  }, []);

  const allAssets = [
    { symbol: 'USDT', name: 'Tether'     },
    { symbol: 'USDC', name: 'USD Coin'   },
    { symbol: 'AHLG', name: 'AHL GOLD'   },
    { symbol: 'AED',  name: 'UAE Dirham' },
    { symbol: 'USD',  name: 'US Dollar'  },
    { symbol: 'EUR',  name: 'Euro'       },
    { symbol: 'GBP',  name: 'Pound'      },
  ].map(a => ({
    ...a,
    balance: fmt(BALANCES[a.symbol], decimalsFor(a.symbol)),
    rate: RATES[a.symbol],
  }));
  const selected = state.walletAsset ?? allAssets[0];
  const totalSel = totalIn(selected.symbol);
  const totalAed = totalIn('AED');

  return (
    <div style={{ paddingBottom: 100 }}>
      <TopBar />
      <PageTitle>wallet</PageTitle>

      {/* Total card */}
      <div style={{ padding: '0 24px' }}>
        <div style={{
          background: BRAND.ink, color: BRAND.white,
          borderRadius: 24, padding: '22px 22px 24px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* subtle red accent */}
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 160, height: 160,
            borderRadius: 80, background: BRAND.red, opacity: 0.18, filter: 'blur(20px)',
          }}/>
          <div style={{
            fontFamily: FONT, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)',
          }}>{T('Total balance')}</div>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8,
          }}>
            <span style={{
              fontFamily: FONT, fontWeight: 800, fontSize: 36, color: '#fff',
              letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums',
            }}>{fmt(totalSel, decimalsFor(selected.symbol))}</span>
            <button onClick={() => setPickerOpen(true)} style={{
              background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
              padding: '6px 10px', borderRadius: 10,
              fontFamily: FONT, fontWeight: 700, fontSize: 16, color: '#fff',
              letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 6,
            }}>{selected.symbol} <ChevDown size={12} color="rgba(255,255,255,0.85)"/></button>
          </div>
          <div style={{
            fontFamily: FONT, fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4,
            fontVariantNumeric: 'tabular-nums',
          }}>≈ {fmt(totalAed, 2)} AED · +0.24% today</div>

          {/* Mini chart */}
          <svg viewBox="0 0 300 40" preserveAspectRatio="none" style={{
            width: '100%', height: 36, marginTop: 14, display: 'block',
          }}>
            <path d="M0 28 L20 24 L40 26 L60 18 L80 22 L100 14 L120 18 L140 10 L160 16 L180 8 L200 12 L220 6 L240 14 L260 8 L280 12 L300 4"
              stroke={BRAND.red} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Action row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
        padding: '18px 24px 4px',
      }}>
        {[
          { id: 'deposit',  label: 'Deposit',  icon: <path d="M12 5v10m0 0l-4-4m4 4l4-4M4 19h16" stroke={BRAND.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/> },
          { id: 'withdraw', label: 'Withdraw', icon: <path d="M12 19V9m0 0l-4 4m4-4l4 4M4 5h16"  stroke={BRAND.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/> },
          { id: 'transfer', label: 'Transfer', icon: <path d="M7 8h13l-3-3m3 3l-3 3M17 16H4l3 3m-3-3l3-3"  stroke={BRAND.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/> },
        ].map(b => (
          <button key={b.id} onClick={() => setActionSheet(b.id)} style={{
            background: BRAND.surface, border: 'none', borderRadius: 18,
            padding: '16px 8px 12px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18, background: '#fff',
              display: 'grid', placeItems: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24">{b.icon}</svg>
            </div>
            <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 13, color: BRAND.ink, letterSpacing: '-0.01em' }}>{T(b.label)}</span>
          </button>
        ))}
      </div>

      {/* Crypto balances */}
      <SectionHeader>Crypto</SectionHeader>
      <div style={{ padding: '0 24px' }}>
        <Card style={{ padding: '4px 16px' }}>
          {(() => {
            const items = [
              { symbol: 'AHLG', name: 'AHL GOLD',  amount: fmt(BALANCES.AHLG, 4), fiat: `${fmt(BALANCES.AHLG * RATES.AHLG)} USDT`,                  bal: BALANCES.AHLG },
              { symbol: 'USDT', name: 'Tether',    amount: fmt(BALANCES.USDT),    fiat: `${fmt(BALANCES.USDT * RATES.USDT / RATES.AED)} AED`,       bal: BALANCES.USDT },
              { symbol: 'USDC', name: 'USD Coin',  amount: fmt(BALANCES.USDC),    fiat: `${fmt(BALANCES.USDC * RATES.USDC / RATES.AED)} AED`,       bal: BALANCES.USDC },
            ].filter(i => i.bal > 0);
            return items.map((it, i) => <AssetRow key={it.symbol} {...it} last={i === items.length - 1} />);
          })()}
        </Card>
      </div>

      {/* Fiat balances */}
      <SectionHeader>Fiat</SectionHeader>
      <div style={{ padding: '0 24px' }}>
        <Card style={{ padding: '4px 16px' }}>
          {(() => {
            const items = [
              { symbol: 'AED', name: 'UAE Dirham',     amount: fmt(BALANCES.AED), fiat: `${fmt(BALANCES.AED * RATES.AED)} USDT`, bal: BALANCES.AED },
              { symbol: 'USD', name: 'US Dollar',      amount: fmt(BALANCES.USD), fiat: `${fmt(BALANCES.USD / RATES.AED)} AED`,  bal: BALANCES.USD },
              { symbol: 'EUR', name: 'Euro',           amount: fmt(BALANCES.EUR), fiat: `${fmt(BALANCES.EUR * RATES.EUR / RATES.AED)} AED`, bal: BALANCES.EUR },
              { symbol: 'GBP', name: 'Pound Sterling', amount: fmt(BALANCES.GBP), fiat: `${fmt(BALANCES.GBP * RATES.GBP / RATES.AED)} AED`, bal: BALANCES.GBP },
            ].filter(i => i.bal > 0);
            return items.map((it, i) => <AssetRow key={it.symbol} {...it} last={i === items.length - 1} />);
          })()}
        </Card>
      </div>

      {/* Recent activity */}
      <SectionHeader trailing={<span style={{ fontFamily: FONT, fontSize: 13, color: BRAND.muted, fontWeight: 500 }}>{T('View all')}</span>}>Recent activity</SectionHeader>
      <div style={{ padding: '0 24px' }}>
        <Card style={{ padding: '4px 16px' }}>
          <ActivityRow icon="mint" title="Mint AHLG" sub="May 12 · 09:42" amount="+1.2000 AHLG" pos />
          <ActivityRow icon="deposit" title="Deposit USDT" sub="May 11 · 14:08" amount="+5,000.00 USDT" pos />
          <ActivityRow icon="redeem" title="Redeem to USDT" sub="May 10 · 18:51" amount="−0.8000 AHLG" />
          <ActivityRow icon="withdraw" title="Withdraw AED" sub="May 9 · 11:30" amount="−12,000.00 AED" last />
        </Card>
      </div>

      <Sheet open={pickerOpen} onClose={() => setPickerOpen(false)} title="View balance in">
        <AssetPicker assets={allAssets} showBalance={false} onPick={(a) => { setState({ walletAsset: a }); setPickerOpen(false); }} />
      </Sheet>

      <DepositSheet  open={actionSheet === 'deposit'}  onClose={() => setActionSheet(null)} />
      <WithdrawSheet open={actionSheet === 'withdraw'} onClose={() => setActionSheet(null)} />
      <TransferSheet open={actionSheet === 'transfer'} onClose={() => setActionSheet(null)} />
    </div>
  );
}

function ActivityRow({ icon, title, sub, amount, pos, last }) {
  const iconMap = {
    mint:     <path d="M12 7v10M7 12h10" stroke={BRAND.ink} strokeWidth="1.7" strokeLinecap="round"/>,
    deposit:  <path d="M12 5v10m0 0l-4-4m4 4l4-4" stroke={BRAND.ink} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>,
    withdraw: <path d="M12 19V9m0 0l-4 4m4-4l4 4" stroke={BRAND.ink} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>,
    redeem:   <path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke={BRAND.ink} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>,
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
      borderBottom: last ? 'none' : `1px solid ${BRAND.line}`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 12, background: BRAND.surface,
        display: 'grid', placeItems: 'center',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">{iconMap[icon]}</svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: BRAND.ink, letterSpacing: '-0.01em' }}>{T(title)}</div>
        <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{
        fontFamily: FONT, fontSize: 14, fontWeight: 600,
        color: pos ? '#15803D' : BRAND.ink, fontVariantNumeric: 'tabular-nums',
      }}>{amount}</div>
    </div>
  );
}

function SectionHeader({ children, trailing }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '24px 24px 10px',
    }}>
      <h2 style={{
        fontFamily: FONT, fontSize: 13, fontWeight: 700, letterSpacing: '0.06em',
        textTransform: 'uppercase', color: BRAND.muted, margin: 0,
      }}>{typeof children === 'string' ? T(children) : children}</h2>
      {trailing}
    </div>
  );
}

function ActionSheetBody() { return null; /* deprecated — replaced by DepositSheet/WithdrawSheet/TransferSheet */ }

function SmallLabel({ children, style = {} }) {
  return (
    <div style={{
      fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: BRAND.muted, margin: '0 0 8px', ...style,
    }}>{typeof children === 'string' ? T(children) : children}</div>
  );
}

function SelectRow({ asset, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
      background: BRAND.surface, border: 'none', borderRadius: 16, padding: '12px 14px',
      cursor: 'pointer',
    }}>
      <CoinDot symbol={asset.symbol} />
      <div style={{ flex: 1, textAlign: 'start' }}>
        <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: BRAND.ink }}>{T(asset.name)}</div>
        <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted }}>{T('Available')} {asset.balance} {asset.symbol}</div>
      </div>
      <ChevDown />
    </button>
  );
}

function FieldRow({ placeholder, suffix, mono = false }) {
  return (
    <div style={{
      background: BRAND.surface, borderRadius: 16, padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <input placeholder={placeholder ? T(placeholder) : ''} style={{
        flex: 1, border: 'none', outline: 'none', background: 'transparent',
        fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : FONT,
        fontSize: 15, fontWeight: 600, color: BRAND.ink,
      }}/>
      {suffix && <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: BRAND.muted }}>{suffix}</span>}
    </div>
  );
}

function FauxQR() {
  // Decorative QR placeholder
  const cells = [];
  const r = 13;
  for (let y = 0; y < r; y++) {
    for (let x = 0; x < r; x++) {
      const on = ((x * 53 + y * 71 + x*y*3) % 7) > 3
              || (x < 3 && y < 3) || (x > r-4 && y < 3) || (x < 3 && y > r-4);
      if (on) cells.push(<rect key={x+','+y} x={x*4} y={y*4} width={3.6} height={3.6} fill={BRAND.ink}/>);
    }
  }
  return <svg viewBox={`0 0 ${r*4} ${r*4}`} width="100%" height="100%">{cells}</svg>;
}

// ─── Deposit (crypto + fiat) ──────────────────────────────────
function DepositSheet({ open, onClose }) {
  const [kind, setKind] = useState('crypto');

  const cryptoAssets = [
    { symbol: 'USDT', name: 'Tether' },
    { symbol: 'USDC', name: 'USD Coin' },
  ];
  const fiatAssets = [
    { symbol: 'AED', name: 'UAE Dirham' },
    { symbol: 'USD', name: 'US Dollar' },
    { symbol: 'EUR', name: 'Euro' },
    { symbol: 'GBP', name: 'Pound Sterling' },
  ];
  const [cryptoAsset, setCryptoAsset] = useState(cryptoAssets[0]);
  const [fiatAsset, setFiatAsset] = useState(fiatAssets[0]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const bankFor = {
    AED: { bank: 'Emirates NBD',    iban: 'AE07 0331 2345 6789 0001 198', swift: 'EBILAEAD', ref: 'AHLG-7421-AED' },
    USD: { bank: 'JP Morgan Chase', iban: 'ACH 021000021 · 802135 2249',   swift: 'CHASUS33', ref: 'AHLG-7421-USD' },
    EUR: { bank: 'Garanti BBVA',    iban: 'TR33 0006 2000 4290 0000 0001', swift: 'TGBATRIS', ref: 'AHLG-7421-EUR' },
    GBP: { bank: 'Lloyds Bank',     iban: 'GB29 LOYD 3092 1031 9876 54',   swift: 'LOYDGB2L', ref: 'AHLG-7421-GBP' },
  };
  const bank = bankFor[fiatAsset.symbol];

  const body = (
    <div style={{ padding: '8px 24px 0' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        background: BRAND.surface, padding: 4, borderRadius: 14, marginBottom: 18,
      }}>
        {[
          { id: 'crypto', label: 'Crypto' },
          { id: 'fiat', label: 'Fiat' },
        ].map(t => {
          const on = kind === t.id;
          return (
            <button key={t.id} onClick={() => setKind(t.id)} style={{
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

      <SmallLabel>Select asset</SmallLabel>
      <SelectRow
        asset={kind === 'crypto' ? cryptoAsset : fiatAsset}
        onClick={() => setPickerOpen(true)}
      />

      {kind === 'crypto' ? (
        <>
          <SmallLabel style={{ marginTop: 18 }}>Network</SmallLabel>
          <div style={{
            background: BRAND.surface, borderRadius: 16, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18, background: '#fff',
              display: 'grid', placeItems: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 256 417" fill="none">
                <path d="M127.961 0L125.157 9.531v275.685l2.804 2.798 127.962-75.638z" fill={BRAND.ink}/>
                <path d="M127.962 0L0 212.376l127.962 75.638V154.158z" fill={BRAND.ink} opacity="0.6"/>
                <path d="M127.961 312.187l-1.58 1.927v98.198l1.58 4.616 128.038-180.32z" fill={BRAND.ink}/>
                <path d="M127.962 416.928v-104.74L0 236.587z" fill={BRAND.ink} opacity="0.6"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: BRAND.ink, letterSpacing: '-0.01em' }}>Ethereum</div>
              <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 2 }}>{T('ERC-20 · only supported network')}</div>
            </div>
          </div>

          <SmallLabel style={{ marginTop: 18 }}>Your deposit address</SmallLabel>
          <div style={{
            background: BRAND.surface, borderRadius: 16, padding: 16,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ width: 64, height: 64, background: '#fff', borderRadius: 10, padding: 6 }}>
              <FauxQR/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 12, color: BRAND.ink, wordBreak: 'break-all',
              }}>0x7A4f3B9c2De04A8FbE9eC1A2eE9c2A</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <Chip onClick={() => {}}>Copy</Chip>
                <Chip onClick={() => {}}>Share</Chip>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(212,32,43,0.06)', borderRadius: 14,
            padding: '12px 14px', marginTop: 14,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: 9, background: BRAND.red,
              color: '#fff', display: 'grid', placeItems: 'center',
              fontFamily: FONT, fontSize: 12, fontWeight: 800, flexShrink: 0,
            }}>!</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.ink, lineHeight: 1.5 }}>
              {T('Send only')} {cryptoAsset.symbol} {T('on Ethereum (ERC-20) to this address. Sending any other token or network will result in permanent loss of funds.')}
            </div>
          </div>
        </>
      ) : (
        <>
          <SmallLabel style={{ marginTop: 18 }}>Bank transfer details</SmallLabel>
          <div style={{
            background: BRAND.surface, borderRadius: 16, padding: '4px 16px',
          }}>
            <BankRow label="Beneficiary" value="Kanzasset DMCC" />
            <BankRow label="Bank" value={bank.bank} />
            <BankRow label={fiatAsset.symbol === 'USD' ? 'Routing / Account' : 'IBAN'} value={bank.iban} mono />
            <BankRow label="SWIFT / BIC" value={bank.swift} mono />
            <BankRow label="Reference" value={bank.ref} mono accent last />
          </div>

          <div style={{
            background: 'rgba(212,32,43,0.06)', borderRadius: 14,
            padding: '12px 14px', marginTop: 14,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: 9, background: BRAND.red,
              color: '#fff', display: 'grid', placeItems: 'center',
              fontFamily: FONT, fontSize: 12, fontWeight: 800, flexShrink: 0,
            }}>!</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.ink, lineHeight: 1.5 }}>
              You must include the reference code <strong>{bank.ref}</strong> exactly and send from the bank account registered under your verified name (<strong>Ahmet Yılmaz</strong>). Funds arrive in 1–2 business days.
            </div>
          </div>
        </>
      )}

      <div style={{ height: 8 }}/>
    </div>
  );

  return (
    <>
      <Sheet open={open} onClose={onClose} title="Deposit"
        footer={<PrimaryButton onClick={onClose}>Done</PrimaryButton>}>
        {body}
      </Sheet>
      <Sheet open={pickerOpen} onClose={() => setPickerOpen(false)} title={kind === 'crypto' ? 'Select crypto asset' : 'Select fiat asset'}>
        <AssetPicker
          assets={(kind === 'crypto' ? cryptoAssets : fiatAssets).map(a => ({
            ...a, balance: fmt(BALANCES[a.symbol] ?? 0, decimalsFor(a.symbol)),
          }))}
          onPick={(a) => {
            if (kind === 'crypto') setCryptoAsset(cryptoAssets.find(x => x.symbol === a.symbol));
            else setFiatAsset(fiatAssets.find(x => x.symbol === a.symbol));
            setPickerOpen(false);
          }}
        />
      </Sheet>
    </>
  );
}

function WithdrawSheet({ open, onClose }) {
  const [kind, setKind] = useState('crypto');
  const cryptoAssets = [
    { symbol: 'USDT', name: 'Tether',   balance: BALANCES.USDT },
    { symbol: 'USDC', name: 'USD Coin', balance: BALANCES.USDC },
  ];
  const fiatAssets = [
    { symbol: 'AED', name: 'UAE Dirham',     balance: BALANCES.AED },
    { symbol: 'USD', name: 'US Dollar',      balance: BALANCES.USD },
    { symbol: 'EUR', name: 'Euro',           balance: BALANCES.EUR },
    { symbol: 'GBP', name: 'Pound Sterling', balance: BALANCES.GBP },
  ];
  const [cryptoAsset, setCryptoAsset] = useState(cryptoAssets[0]);
  const [fiatAsset, setFiatAsset]     = useState(fiatAssets[0]);
  const [pickerOpen, setPickerOpen]   = useState(false);

  // Whitelisted destinations per kind
  const cryptoWhitelist = [
    { id: 'cw-usdt', title: 'Cold wallet · USDT', sub: 'Ethereum · 0xC4e1…9hPq' },
    { id: 'cw-usdc', title: 'Cold wallet · USDC', sub: 'Ethereum · 0xA1b2…3F4d' },
    { id: 'hw-usdt', title: 'Ledger · USDT',     sub: 'Ethereum · 0x88aF…8WzX' },
  ];
  const fiatWhitelist = [
    { id: 'aed-enbd',     title: 'Emirates NBD', sub: 'AED · IBAN AE07 0331…1198' },
    { id: 'usd-wise',     title: 'Wise',         sub: 'USD · ACH 802135…2249' },
    { id: 'eur-garanti',  title: 'Garanti BBVA', sub: 'EUR · IBAN TR33 0006…0001' },
  ];
  const whitelist = kind === 'crypto' ? cryptoWhitelist : fiatWhitelist;
  const [destId, setDestId] = useState(whitelist[0].id);
  // Re-pick first address whenever kind changes
  React.useEffect(() => { setDestId((kind === 'crypto' ? cryptoWhitelist : fiatWhitelist)[0].id); }, [kind]);

  const asset = kind === 'crypto' ? cryptoAsset : fiatAsset;

  return (
    <>
      <Sheet open={open} onClose={onClose} title="Withdraw"
        footer={<PrimaryButton onClick={onClose}>Review withdrawal</PrimaryButton>}>
        <div style={{ padding: '8px 24px 0' }}>
          {/* Kind toggle */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            background: BRAND.surface, padding: 4, borderRadius: 14, marginBottom: 18,
          }}>
            {[
              { id: 'crypto', label: 'Crypto' },
              { id: 'fiat',   label: 'Fiat' },
            ].map(t => {
              const on = kind === t.id;
              return (
                <button key={t.id} onClick={() => setKind(t.id)} style={{
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

          <SmallLabel>From</SmallLabel>
          <SelectRow
            asset={{
              ...asset,
              balance: fmt(asset.balance, decimalsFor(asset.symbol)),
            }}
            onClick={() => setPickerOpen(true)}
          />

          <SmallLabel style={{ marginTop: 18 }}>Amount</SmallLabel>
          <FieldRow placeholder="0.00" suffix={asset.symbol}/>

          <SmallLabel style={{ marginTop: 18 }}>
            {kind === 'crypto' ? 'Whitelisted addresses' : 'Bank accounts'}
          </SmallLabel>

          <div style={{
            background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 16,
            overflow: 'hidden',
          }}>
            {whitelist.map((it, i) => {
              const on = destId === it.id;
              return (
                <button key={it.id} onClick={() => setDestId(it.id)} style={{
                  width: '100%', background: 'transparent', border: 'none',
                  padding: '12px 14px', cursor: 'pointer', textAlign: 'start',
                  display: 'flex', alignItems: 'center', gap: 12,
                  borderBottom: i === whitelist.length - 1 ? 'none' : `1px solid ${BRAND.line}`,
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 9,
                    border: `1.5px solid ${on ? BRAND.red : BRAND.line}`,
                    background: on ? BRAND.red : 'transparent',
                    display: 'grid', placeItems: 'center', flexShrink: 0,
                  }}>
                    {on && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }}/>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: BRAND.ink, letterSpacing: '-0.01em' }}>{T(it.title)}</div>
                    <div style={{
                      fontFamily: it.sub.match(/0x/) ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : FONT,
                      fontSize: 12, color: BRAND.muted, marginTop: 2,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{T(it.sub)}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <button style={{
            width: '100%', background: 'transparent', border: `1.5px dashed ${BRAND.line}`,
            borderRadius: 14, padding: '12px', cursor: 'pointer', marginTop: 10,
            fontFamily: FONT, fontWeight: 600, fontSize: 13, color: BRAND.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke={BRAND.ink} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {T(kind === 'crypto' ? 'Add new crypto address' : 'Add new bank account')}
          </button>

          <div style={{
            background: 'rgba(212,32,43,0.06)', borderRadius: 14,
            padding: '12px 14px', marginTop: 14,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: 9, background: BRAND.red,
              color: '#fff', display: 'grid', placeItems: 'center',
              fontFamily: FONT, fontSize: 12, fontWeight: 800, flexShrink: 0,
            }}>!</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.ink, lineHeight: 1.5 }}>
              {kind === 'crypto'
                ? 'Withdrawals are only sent to whitelisted addresses. New addresses require a 24h security review.'
                : 'Withdrawals are only sent to accounts registered under your verified name. New accounts require a 24h security review.'}
            </div>
          </div>

          <div style={{ height: 8 }}/>
        </div>
      </Sheet>

      <Sheet open={pickerOpen} onClose={() => setPickerOpen(false)} title={kind === 'crypto' ? 'Select crypto asset' : 'Select fiat asset'}>
        <AssetPicker
          assets={(kind === 'crypto' ? cryptoAssets : fiatAssets)
            .filter(a => a.balance > 0)
            .map(a => ({ ...a, balance: fmt(a.balance, decimalsFor(a.symbol)) }))}
          onPick={(a) => {
            const list = kind === 'crypto' ? cryptoAssets : fiatAssets;
            const found = list.find(x => x.symbol === a.symbol);
            if (kind === 'crypto') setCryptoAsset(found);
            else setFiatAsset(found);
            setPickerOpen(false);
          }}
        />
      </Sheet>
    </>
  );
}

function TransferSheet({ open, onClose }) {
  const cryptoAssets = [
    { symbol: 'USDT', name: 'Tether',   balance: BALANCES.USDT },
    { symbol: 'USDC', name: 'USD Coin', balance: BALANCES.USDC },
    { symbol: 'AHLG', name: 'AHL GOLD', balance: BALANCES.AHLG },
  ].filter(a => a.balance > 0);
  const [asset, setAsset] = useState(cryptoAssets[0]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const recipients = [
    { id: 'r-selin',  name: '@selin',     sub: 'Verified · Kanzasset', avatar: 'S' },
    { id: 'r-mehmet', name: '@mehmet.k',  sub: 'Verified · Kanzasset', avatar: 'M' },
    { id: 'r-ali',    name: 'ali@iqd.ae', sub: 'Kanzasset email',      avatar: 'A' },
  ];
  const [recId, setRecId] = useState(recipients[0].id);

  return (
    <>
      <Sheet open={open} onClose={onClose} title="Transfer"
        footer={<PrimaryButton onClick={onClose}>Send</PrimaryButton>}>
        <div style={{ padding: '8px 24px 0' }}>
          <SmallLabel>From</SmallLabel>
          <SelectRow
            asset={{ ...asset, balance: fmt(asset.balance, decimalsFor(asset.symbol)) }}
            onClick={() => setPickerOpen(true)}
          />

          <SmallLabel style={{ marginTop: 18 }}>Amount</SmallLabel>
          <FieldRow placeholder="0.00" suffix={asset.symbol}/>

          <SmallLabel style={{ marginTop: 18 }}>Saved recipients</SmallLabel>
          <div style={{
            background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 16,
            overflow: 'hidden',
          }}>
            {recipients.map((r, i) => {
              const on = recId === r.id;
              return (
                <button key={r.id} onClick={() => setRecId(r.id)} style={{
                  width: '100%', background: 'transparent', border: 'none',
                  padding: '12px 14px', cursor: 'pointer', textAlign: 'start',
                  display: 'flex', alignItems: 'center', gap: 12,
                  borderBottom: i === recipients.length - 1 ? 'none' : `1px solid ${BRAND.line}`,
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 9,
                    border: `1.5px solid ${on ? BRAND.red : BRAND.line}`,
                    background: on ? BRAND.red : 'transparent',
                    display: 'grid', placeItems: 'center', flexShrink: 0,
                  }}>
                    {on && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }}/>}
                  </div>
                  <div style={{
                    width: 36, height: 36, borderRadius: 18, background: BRAND.surface,
                    display: 'grid', placeItems: 'center', flexShrink: 0,
                    fontFamily: FONT, fontWeight: 700, fontSize: 14, color: BRAND.ink,
                  }}>{r.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: BRAND.ink, letterSpacing: '-0.01em' }}>{r.name}</div>
                    <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.muted, marginTop: 2 }}>{T(r.sub)}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <button style={{
            width: '100%', background: 'transparent', border: `1.5px dashed ${BRAND.line}`,
            borderRadius: 14, padding: '12px', cursor: 'pointer', marginTop: 10,
            fontFamily: FONT, fontWeight: 600, fontSize: 13, color: BRAND.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke={BRAND.ink} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {T('Add new recipient')}
          </button>

          <div style={{
            background: 'rgba(212,32,43,0.06)', borderRadius: 14,
            padding: '12px 14px', marginTop: 14,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: 9, background: BRAND.red,
              color: '#fff', display: 'grid', placeItems: 'center',
              fontFamily: FONT, fontSize: 12, fontWeight: 800, flexShrink: 0,
            }}>!</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: BRAND.ink, lineHeight: 1.5 }}>
              Transfers between Kanzasset users are instant and fee-free. New recipients require a 24h security review.
            </div>
          </div>

          <div style={{ height: 8 }}/>
        </div>
      </Sheet>

      <Sheet open={pickerOpen} onClose={() => setPickerOpen(false)} title="Select asset">
        <AssetPicker
          assets={cryptoAssets.map(a => ({ ...a, balance: fmt(a.balance, decimalsFor(a.symbol)) }))}
          onPick={(a) => {
            setAsset(cryptoAssets.find(x => x.symbol === a.symbol));
            setPickerOpen(false);
          }}
        />
      </Sheet>
    </>
  );
}

function BankRow({ label, value, mono, accent, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 0',
      borderBottom: last ? 'none' : `1px solid ${BRAND.line}`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: BRAND.muted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{T(label)}</div>
        <div style={{
          fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : FONT,
          fontSize: 14, fontWeight: 700, color: accent ? BRAND.red : BRAND.ink,
          marginTop: 3, letterSpacing: mono ? 0 : '-0.01em',
          wordBreak: 'break-all',
        }}>{value}</div>
      </div>
      <button style={{
        background: BRAND.white, border: `1px solid ${BRAND.line}`,
        borderRadius: 10, padding: '6px 10px', cursor: 'pointer',
        fontFamily: FONT, fontWeight: 600, fontSize: 11, color: BRAND.ink,
      }}>{T('Copy')}</button>
    </div>
  );
}

Object.assign(window, {
  WalletScreen, AssetPicker, SectionHeader, SmallLabel,
  SelectRow, FieldRow, FauxQR, ActivityRow, ActionSheetBody,
  DepositSheet, WithdrawSheet, TransferSheet, BankRow,
});
