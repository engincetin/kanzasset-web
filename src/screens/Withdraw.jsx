import { useState, useEffect, useRef } from 'react';
import { WBRAND, WFONT, WMONO, wfmt, wparse, wdecimals, wgroup, wregroup, WBALANCES, WMETA } from '../lib/index.js';
import { getAuthChannel } from '../lib/authChannel.js';
import { t } from '../lib/i18n.js';
import { WIcon } from '../components/icons.jsx';
import { WCard, WPrimary, WSecondary, WEyebrow, WMonoNum, WPill } from '../components/primitives.jsx';
import { WAssetSelector, WCountdown } from '../components/shared.jsx';
import { useIsMobile } from '../lib/useResponsive.js';

function WithdrawVerifyModal({ step, setStep, code, setCode, channel, codeFull, amount, asset, kind, destination, onClose, onTrack }) {
  const mobile = useIsMobile();
  const refs = useRef([]);
  const masked = channel === 'email' ? 'a••••t@kanzasset.com' : '+90 532 ••• 7890';

  const setDigit = (i, v) => {
    const d = v.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[i] = d;
    setCode(next);
    if (d && i < 5 && refs.current[i + 1]) refs.current[i + 1].focus();
  };
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0 && refs.current[i - 1]) refs.current[i - 1].focus();
  };

  return (
    <div onClick={step === 'submitted' ? onClose : undefined} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(10,10,10,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: mobile ? 12 : 24,
    }}>
      <div onClick={e => e.stopPropagation()} className="kz-pop" style={{
        width: mobile ? '100%' : 440, maxWidth: '100%', background: WBRAND.white,
        borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
        overflow: 'hidden',
      }}>
        {step === 'code' ? (
          <>
            <div style={{ padding: mobile ? '18px 16px 14px' : '22px 24px 18px', borderBottom: `1px solid ${WBRAND.line}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: WBRAND.redSoft, display: 'grid', placeItems: 'center' }}>{WIcon.shield(WBRAND.red)}</div>
                <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: WBRAND.surface, cursor: 'pointer', color: WBRAND.ink, display: 'grid', placeItems: 'center' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </button>
              </div>
              <h2 style={{ margin: '16px 0 0', fontFamily: WFONT, fontSize: 19, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.02em' }}>{t("Verify it's you")}</h2>
              <div style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, marginTop: 6, lineHeight: 1.5 }}>
                {t('Enter the 6-digit code we sent to')} <strong style={{ color: WBRAND.ink }}>{masked}</strong> {t('to authorise this withdrawal.')}
              </div>
            </div>

            {/* Selected channel (fixed from Security settings) */}
            <div style={{ padding: mobile ? '16px 16px 0' : '16px 24px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: WBRAND.surface, borderRadius: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, display: 'grid', placeItems: 'center', color: WBRAND.ink, flexShrink: 0 }}>
                  {channel === 'email'
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="6" y="2.5" width="12" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.7"/><path d="M10.5 18.5h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.ink }}>{t('Code sent via')} {channel === 'email' ? t('email') : t('SMS')}</div>
                  <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 1 }}>{masked}</div>
                </div>
                <WPill tone="neutral">2FA</WPill>
              </div>
            </div>

            <div style={{ padding: mobile ? '18px 16px 6px' : '18px 24px 6px', display: 'flex', gap: mobile ? 7 : 8, justifyContent: 'space-between' }}>
              {code.map((d, i) => (
                <input
                  key={i}
                  ref={el => refs.current[i] = el}
                  value={d}
                  inputMode="numeric"
                  maxLength={1}
                  onChange={e => setDigit(i, e.target.value)}
                  onKeyDown={e => onKey(i, e)}
                  autoFocus={i === 0}
                  style={{ ...(mobile ? { flex: 1, minWidth: 0, width: 'auto' } : { width: 56 }), height: 60, borderRadius: 10, textAlign: 'center', border: `1.5px solid ${d ? WBRAND.ink : WBRAND.line2}`, background: WBRAND.white, outline: 'none', fontFamily: WMONO, fontSize: mobile ? 20 : 24, fontWeight: 600, color: WBRAND.ink, boxSizing: 'border-box' }}
                />
              ))}
            </div>

            <div style={{ padding: mobile ? '8px 16px 0' : '6px 24px 0', display: 'flex', alignItems: 'center', gap: 6, flexWrap: mobile ? 'wrap' : 'nowrap' }}>
              <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted }}>{t("Didn't get it?")}</span>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.red }}>{t('Resend code')}</button>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: WBRAND.muted2 }}><WCountdown seconds={299} prefix={t('expires in ')}/></span>
            </div>

            <div style={{ padding: mobile ? '16px 16px 18px' : '18px 24px 22px' }}>
              <WPrimary
                size="lg"
                onClick={() => codeFull && setStep('submitted')}
                style={{ width: '100%', justifyContent: 'center', opacity: codeFull ? 1 : 0.45, pointerEvents: codeFull ? 'auto' : 'none' }}
              >
                {t('Authorise withdrawal')}
              </WPrimary>
            </div>
          </>
        ) : (
          <>
            <div style={{ padding: '36px 28px 8px', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 32, margin: '0 auto', background: 'rgba(15,122,71,0.10)', display: 'grid', placeItems: 'center' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke={WBRAND.positive} strokeWidth="1.8"/>
                  <path d="M7.5 12.5l3 3 6-6.5" stroke={WBRAND.positive} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ margin: '20px 0 0', fontFamily: WFONT, fontSize: 20, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.02em' }}>{t('Withdrawal submitted')}</h2>
              <div style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, marginTop: 8, lineHeight: 1.55, padding: '0 8px' }}>
                {t('Your request to send')} <strong style={{ color: WBRAND.ink }}>{amount > 0 ? wfmt(amount, wdecimals(asset.symbol)) : '0.00'} {asset.symbol}</strong> {t('to')} <strong style={{ color: WBRAND.ink }}>{destination?.title}</strong> {t('has been verified and is now processing.')}
              </div>
            </div>

            <div style={{ padding: '18px 24px 0' }}>
              <div style={{ background: WBRAND.surface2, border: `1px solid ${WBRAND.line}`, borderRadius: 12, padding: '4px 16px' }}>
                {[
                  { l: 'Reference',         v: 'WD-' + Math.floor(100000 + Math.random() * 899999) },
                  { l: 'Status',            v: t('Processing'), pill: true },
                  { l: 'Estimated arrival', v: kind === 'crypto' ? t('≈ 3 minutes') : t('1–2 business days') },
                ].map((r, i, arr) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
                    <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>{t(r.l)}</span>
                    {r.pill ? <WPill tone="warn">{r.v}</WPill> : <WMonoNum size={12}>{r.v}</WMonoNum>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '18px 24px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <WPrimary size="lg" onClick={onTrack} style={{ width: '100%', justifyContent: 'center' }}>{t('Track in Activity')}</WPrimary>
              <WSecondary size="lg" onClick={onClose} style={{ width: '100%', justifyContent: 'center', height: 52 }}>{t('Done')}</WSecondary>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function WebWithdraw({ navigate, initialAsset }) {
  const mobile = useIsMobile();
  const cryptoAssets = ['AHLG', 'USDT', 'USDC'].map(s => ({ symbol: s, name: WMETA[s].name, balance: WBALANCES[s] }));
  const fiatAssets   = ['AED', 'USD', 'EUR', 'GBP'].map(s => ({ symbol: s, name: WMETA[s].name, balance: WBALANCES[s] }));
  const initialKind  = initialAsset && WMETA[initialAsset]?.kind === 'fiat' ? 'fiat' : 'crypto';

  const [kind, setKind] = useState(initialKind);
  const [cryptoAsset, setCryptoAsset] = useState(cryptoAssets.find(a => a.symbol === initialAsset) ?? cryptoAssets[0]);
  const [fiatAsset, setFiatAsset] = useState(fiatAssets.find(a => a.symbol === initialAsset) ?? fiatAssets[0]);
  const asset = kind === 'crypto' ? cryptoAsset : fiatAsset;
  const [amount, setAmount] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState('code');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const channel = getAuthChannel();

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
  const codeFull = code.every(d => d !== '');
  const destination = whitelist.find(w => w.id === destId);

  return (
    <div style={{ padding: mobile ? '18px 16px 40px' : '28px 32px 48px', overflowY: 'auto', overflowX: 'hidden', height: '100%', boxSizing: 'border-box' }}>

      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '560px 1fr', gap: mobile ? 14 : 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          {/* Kind toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, padding: 4, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, borderRadius: 12 }}>
            {[
              { id: 'crypto', label: 'Crypto', sub: 'USDT / USDC · Ethereum' },
              { id: 'fiat',   label: 'Fiat',   sub: 'Bank wire · 1–2 days' },
            ].map(tk => {
              const on = kind === tk.id;
              return (
                <button key={tk.id} onClick={() => setKind(tk.id)} style={{ padding: '10px 16px', border: 'none', cursor: 'pointer', background: on ? WBRAND.panel : 'transparent', color: on ? '#fff' : WBRAND.ink, borderRadius: 8, textAlign: 'left' }}>
                  <div style={{ fontFamily: WFONT, fontWeight: 700, fontSize: 13, letterSpacing: '-0.005em' }}>{t(tk.label)}</div>
                  <div style={{ fontFamily: WFONT, fontSize: 11, color: on ? 'rgba(255,255,255,0.65)' : WBRAND.muted, marginTop: 2, fontWeight: 500 }}>{t(tk.sub)}</div>
                </button>
              );
            })}
          </div>

          {/* Amount */}
          <WCard padding={0}>
            <div style={{ padding: '20px 22px' }}>
              <WEyebrow>{t('From')}</WEyebrow>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                <input value={amount} onChange={e => setAmount(wregroup(e.target.value))} inputMode="decimal" placeholder="0.00" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: WFONT, fontWeight: 800, fontSize: 30, color: WBRAND.ink, letterSpacing: '-0.03em', width: 0, minWidth: 0, fontVariantNumeric: 'tabular-nums' }}/>
                <WAssetSelector
                  value={asset.symbol}
                  options={kind === 'crypto' ? cryptoAssets : fiatAssets}
                  onChange={s => {
                    const found = (kind === 'crypto' ? cryptoAssets : fiatAssets).find(x => x.symbol === s);
                    if (kind === 'crypto') setCryptoAsset(found); else setFiatAsset(found);
                  }}
                />
              </div>
              {/* Balance + quick-percent chips on separate rows so long
                  balances never collide with the chips (matches Buy/Sell) */}
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 12 }}>
                {t('Balance:')} <WMonoNum size={12}>{wfmt(asset.balance, wdecimals(asset.symbol))}</WMonoNum> {asset.symbol}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {[25, 50, 75].map(p => (
                  <button key={p} onClick={() => setAmount(wgroup(String(asset.balance * p / 100)))} style={{ background: WBRAND.surface, border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 7, fontFamily: WFONT, fontSize: 11, fontWeight: 600, color: WBRAND.ink }}>{p}%</button>
                ))}
                <button onClick={() => setAmount(wgroup(String(asset.balance)))} style={{ background: WBRAND.surface, border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 7, fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.ink }}>{t('MAX')}</button>
              </div>
            </div>
          </WCard>

          {/* Destination */}
          <WCard padding={0}>
            <div style={{ padding: '14px 22px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{kind === 'crypto' ? t('Whitelisted addresses') : t('Bank accounts')}</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2 }}>{whitelist.length} {t('verified')}</div>
              </div>
              <WSecondary size="sm" icon={WIcon.plus(WBRAND.ink)}>{t('Add new')}</WSecondary>
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
                        {it.verified && <WPill tone="positive">{WIcon.check(WBRAND.positive)} {t('Verified')}</WPill>}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <WCard padding={0}>
            <div style={{ padding: '16px 22px 12px', borderBottom: `1px solid ${WBRAND.line}` }}>
              <div style={{ fontFamily: WFONT, fontSize: 15, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.015em' }}>{t('Review withdrawal')}</div>
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 2 }}>{t('Confirm details before submitting')}</div>
            </div>
            <div style={{ padding: '4px 22px 8px' }}>
              {[
                { l: 'Send',             v: `${amt > 0 ? wfmt(amt, wdecimals(asset.symbol)) : '—'} ${asset.symbol}`, accent: true },
                { l: 'Network / Rail',   v: kind === 'crypto' ? 'Ethereum · ERC-20' : asset.symbol + ' · SWIFT' },
                { l: 'Destination',      v: whitelist.find(w => w.id === destId)?.title ?? '—' },
                { l: 'Network fee',      v: kind === 'crypto' ? t('Covered by Kanzasset') : t('Bank charges may apply') },
                { l: 'Receive',          v: `${wfmt(receive, wdecimals(asset.symbol))} ${asset.symbol}` },
                { l: 'Estimated arrival', v: kind === 'crypto' ? t('≈ 3 minutes') : t('1–2 business days') },
              ].map((r, i, arr) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
                  <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>{t(r.l)}</span>
                  <span style={{ fontFamily: WFONT, fontSize: r.accent ? 15 : 13, fontWeight: r.accent ? 800 : 600, color: WBRAND.ink, fontVariantNumeric: 'tabular-nums', letterSpacing: r.accent ? '-0.015em' : 0 }}>{r.v}</span>
                </div>
              ))}
            </div>
          </WCard>

          <WPrimary size="lg" onClick={() => amt > 0 && setVerifying(true)} disabled={amt <= 0} style={{ width: '100%', justifyContent: 'center' }} icon={WIcon.shield('#fff')}>
            {t('Confirm withdrawal')}
          </WPrimary>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: WBRAND.redSoft, borderRadius: 10 }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: WBRAND.red, color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0, fontFamily: WFONT, fontSize: 11, fontWeight: 800 }}>!</div>
            <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.ink, lineHeight: 1.5 }}>
              {t("You'll be asked to approve this withdrawal with your hardware key.")} {kind === 'crypto' ? t('Crypto withdrawals are irreversible — double-check the destination address.') : t("Bank transfers can take 1–2 business days to settle and are subject to your bank's cut-off times.")}
            </div>
          </div>
        </div>
      </div>

      {verifying && (
        <WithdrawVerifyModal
          step={verifyStep}
          setStep={setVerifyStep}
          code={code}
          setCode={setCode}
          channel={channel}
          codeFull={codeFull}
          amount={amt}
          asset={asset}
          kind={kind}
          destination={destination}
          onClose={() => { setVerifying(false); setVerifyStep('code'); setCode(['', '', '', '', '', '']); }}
          onTrack={() => { setVerifying(false); setVerifyStep('code'); setCode(['', '', '', '', '', '']); navigate('activity'); }}
        />
      )}
    </div>
  );
}
