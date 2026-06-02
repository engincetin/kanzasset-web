import { useState, useEffect } from 'react';
import { WBRAND, WFONT, wfmt, wparse, wdecimals, WBALANCES, WMETA } from '../lib/index.js';
import { WIcon } from '../components/icons.jsx';
import { WCard, WPrimary, WSecondary, WEyebrow, WMonoNum, WPill } from '../components/primitives.jsx';
import { WAssetSelector } from '../components/shared.jsx';

export function WebWithdraw({ navigate, initialAsset }) {
  const cryptoAssets = ['USDT', 'USDC'].map(s => ({ symbol: s, name: WMETA[s].name, balance: WBALANCES[s] }));
  const fiatAssets   = ['AED', 'USD', 'EUR', 'GBP'].map(s => ({ symbol: s, name: WMETA[s].name, balance: WBALANCES[s] }));
  const initialKind  = initialAsset && WMETA[initialAsset]?.kind === 'fiat' ? 'fiat' : 'crypto';

  const [kind, setKind] = useState(initialKind);
  const [cryptoAsset, setCryptoAsset] = useState(cryptoAssets.find(a => a.symbol === initialAsset) ?? cryptoAssets[0]);
  const [fiatAsset, setFiatAsset] = useState(fiatAssets.find(a => a.symbol === initialAsset) ?? fiatAssets[0]);
  const asset = kind === 'crypto' ? cryptoAsset : fiatAsset;
  const [amount, setAmount] = useState('');

  const cryptoWhitelist = [
    { id: 'cw-usdt', title: 'Cold wallet · USDT', sub: 'Ethereum · 0xC4e1A3…8fB9hPq', net: 'ERC-20', verified: true },
    { id: 'cw-usdc', title: 'Cold wallet · USDC', sub: 'Ethereum · 0xA1b2C3…4D5e6F7', net: 'ERC-20', verified: true },
    { id: 'hw-usdt', title: 'Ledger · USDT',       sub: 'Ethereum · 0x88aF12…e8WzX2k', net: 'ERC-20', verified: true },
  ];
  const fiatWhitelist = [
    { id: 'aed-enbd',    title: 'Emirates NBD',    sub: 'AED · IBAN AE07 0331…1198', net: 'AED', verified: true },
    { id: 'usd-jpm',     title: 'JP Morgan Chase', sub: 'USD · ACH 802135…2249',     net: 'USD', verified: true },
    { id: 'eur-garanti', title: 'Garanti BBVA',    sub: 'EUR · IBAN TR33 0006…0001', net: 'EUR', verified: true },
  ];
  const whitelist = kind === 'crypto' ? cryptoWhitelist : fiatWhitelist;
  const [destId, setDestId] = useState(whitelist[0].id);
  useEffect(() => { setDestId((kind === 'crypto' ? cryptoWhitelist : fiatWhitelist)[0].id); }, [kind]);

  const amt = wparse(amount);
  const receive = Math.max(0, amt);

  return (
    <div style={{ padding: '28px 32px 48px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 20 }}>
        <WEyebrow>Withdraw</WEyebrow>
        <h1 style={{ margin: '6px 0 0', fontFamily: WFONT, fontSize: 28, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.025em' }}>Send funds to a whitelisted destination</h1>
        <div style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, marginTop: 6 }}>
          Withdrawals can only go to pre-approved addresses or bank accounts. New destinations require a 24h security review.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '560px 1fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Kind toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, padding: 4, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, borderRadius: 12 }}>
            {[
              { id: 'crypto', label: 'Crypto', sub: 'USDT / USDC · Ethereum' },
              { id: 'fiat',   label: 'Fiat',   sub: 'Bank wire · 1–2 days' },
            ].map(t => {
              const on = kind === t.id;
              return (
                <button key={t.id} onClick={() => setKind(t.id)} style={{ padding: '10px 16px', border: 'none', cursor: 'pointer', background: on ? WBRAND.ink : 'transparent', color: on ? '#fff' : WBRAND.ink, borderRadius: 8, textAlign: 'left' }}>
                  <div style={{ fontFamily: WFONT, fontWeight: 700, fontSize: 13, letterSpacing: '-0.005em' }}>{t.label}</div>
                  <div style={{ fontFamily: WFONT, fontSize: 11, color: on ? 'rgba(255,255,255,0.65)' : WBRAND.muted, marginTop: 2, fontWeight: 500 }}>{t.sub}</div>
                </button>
              );
            })}
          </div>

          {/* Amount */}
          <WCard padding={0}>
            <div style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <WEyebrow>From</WEyebrow>
                <button onClick={() => setAmount(String(asset.balance))} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.red, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Use max</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: WFONT, fontWeight: 800, fontSize: 30, color: WBRAND.ink, letterSpacing: '-0.03em', width: 0, minWidth: 0, fontVariantNumeric: 'tabular-nums' }}/>
                <WAssetSelector
                  value={asset.symbol}
                  options={kind === 'crypto' ? cryptoAssets : fiatAssets}
                  onChange={s => {
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
                    <button key={p} onClick={() => setAmount(String(asset.balance * p / 100))} style={{ background: WBRAND.surface, border: 'none', cursor: 'pointer', padding: '2px 8px', borderRadius: 6, fontFamily: WFONT, fontSize: 11, fontWeight: 600, color: WBRAND.ink }}>{p}%</button>
                  ))}
                </span>
              </div>
            </div>
          </WCard>

          {/* Destination */}
          <WCard padding={0}>
            <div style={{ padding: '14px 22px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{kind === 'crypto' ? 'Whitelisted addresses' : 'Bank accounts'}</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2 }}>{whitelist.length} verified</div>
              </div>
              <WSecondary size="sm" icon={WIcon.plus(WBRAND.ink)}>Add new</WSecondary>
            </div>
            <div style={{ padding: '4px 0' }}>
              {whitelist.map((it, i) => {
                const on = destId === it.id;
                return (
                  <button key={it.id} onClick={() => setDestId(it.id)} style={{ width: '100%', background: 'transparent', border: 'none', padding: '12px 22px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, borderTop: i === 0 ? 'none' : `1px solid ${WBRAND.line}` }}>
                    <div style={{ width: 18, height: 18, borderRadius: 9, border: `1.5px solid ${on ? WBRAND.red : WBRAND.line2}`, background: on ? WBRAND.red : 'transparent', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      {on && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }}/>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{it.title}</span>
                        {it.verified && <WPill tone="positive">{WIcon.check(WBRAND.positive)} Verified</WPill>}
                      </div>
                      <div style={{ fontFamily: it.sub.includes('0x') ? 'monospace' : WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2 }}>{it.sub}</div>
                    </div>
                    <WPill tone="neutral">{it.net}</WPill>
                  </button>
                );
              })}
            </div>
          </WCard>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <WCard padding={0}>
            <div style={{ padding: '16px 22px 12px', borderBottom: `1px solid ${WBRAND.line}` }}>
              <div style={{ fontFamily: WFONT, fontSize: 15, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.015em' }}>Review withdrawal</div>
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 2 }}>Confirm details before submitting</div>
            </div>
            <div style={{ padding: '4px 22px 8px' }}>
              {[
                { l: 'Send',             v: `${amt > 0 ? wfmt(amt, wdecimals(asset.symbol)) : '—'} ${asset.symbol}`, accent: true },
                { l: 'Network / Rail',   v: kind === 'crypto' ? 'Ethereum · ERC-20' : asset.symbol + ' · SWIFT' },
                { l: 'Destination',      v: whitelist.find(w => w.id === destId)?.title ?? '—' },
                { l: 'Network fee',      v: kind === 'crypto' ? 'Covered by Kanzasset' : 'Bank charges may apply' },
                { l: 'Receive',          v: `${wfmt(receive, wdecimals(asset.symbol))} ${asset.symbol}` },
                { l: 'Estimated arrival', v: kind === 'crypto' ? '≈ 3 minutes' : '1–2 business days' },
              ].map((r, i, arr) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
                  <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>{r.l}</span>
                  <span style={{ fontFamily: WFONT, fontSize: r.accent ? 15 : 13, fontWeight: r.accent ? 800 : 600, color: WBRAND.ink, fontVariantNumeric: 'tabular-nums', letterSpacing: r.accent ? '-0.015em' : 0 }}>{r.v}</span>
                </div>
              ))}
            </div>
          </WCard>

          <WPrimary size="lg" style={{ width: '100%', justifyContent: 'center' }} icon={WIcon.shield('#fff')}>
            Hold to confirm withdrawal
          </WPrimary>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: WBRAND.redSoft, borderRadius: 10 }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: WBRAND.red, color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0, fontFamily: WFONT, fontSize: 11, fontWeight: 800 }}>!</div>
            <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.ink, lineHeight: 1.5 }}>
              You'll be asked to approve this withdrawal with your hardware key. {kind === 'crypto' ? 'Crypto withdrawals are irreversible — double-check the destination address.' : "Bank transfers can take 1–2 business days to settle and are subject to your bank's cut-off times."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
