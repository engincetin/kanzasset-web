import { useState } from 'react';
import { WBRAND, WFONT, WMONO, wfmt, wdecimals, WBALANCES, WMETA } from '../lib/index.js';
import { WIcon } from '../components/icons.jsx';
import { WCoinDot } from '../components/coinicons.jsx';
import { WCard, WSecondary, WEyebrow, WMonoNum, WPill, WCopyButton } from '../components/primitives.jsx';
import { WebQR } from '../components/shared.jsx';
import { t } from '../lib/i18n.js';
import { useIsMobile } from '../lib/useResponsive.js';

export function WebDeposit({ navigate, initialAsset }) {
  const mobile = useIsMobile();
  const cryptoAssets = ['AHLG', 'USDT', 'USDC'].map(s => ({ symbol: s, name: WMETA[s].name }));
  const fiatAssets   = ['AED', 'USD', 'EUR', 'GBP'].map(s => ({ symbol: s, name: WMETA[s].name }));
  const initialKind  = initialAsset && WMETA[initialAsset]?.kind === 'fiat' ? 'fiat' : 'crypto';

  const [kind, setKind] = useState(initialKind);
  const [cryptoAsset, setCryptoAsset] = useState(cryptoAssets.find(a => a.symbol === initialAsset) ?? cryptoAssets[0]);
  const [fiatAsset, setFiatAsset] = useState(fiatAssets.find(a => a.symbol === initialAsset) ?? fiatAssets[0]);

  const bankFor = {
    AED: { bank: 'Emirates NBD',    iban: 'AE07 0331 2345 6789 0001 198',  swift: 'EBILAEAD', ref: 'AHLG-7421-AED' },
    USD: { bank: 'JP Morgan Chase', iban: 'ACH 021000021 · 802135 2249',   swift: 'CHASUS33', ref: 'AHLG-7421-USD' },
    EUR: { bank: 'Garanti BBVA',    iban: 'TR33 0006 2000 4290 0000 0001', swift: 'TGBATRIS', ref: 'AHLG-7421-EUR' },
    GBP: { bank: 'Lloyds Bank',     iban: 'GB29 LOYD 3092 1031 9876 54',   swift: 'LOYDGB2L', ref: 'AHLG-7421-GBP' },
  };
  const bank = bankFor[fiatAsset.symbol];
  const depositAddress = '0x7A4f3B9c2De04A8FbE9eC1A2eE9c2A1d3b7E5C09';

  return (
    <div style={{ padding: mobile ? '18px 16px 40px' : '28px 32px 48px', overflowY: 'auto', overflowX: 'hidden', height: '100%', boxSizing: 'border-box' }}>

      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '560px 1fr', gap: mobile ? 14 : 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Kind toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, padding: 4, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, borderRadius: 12 }}>
            {[
              { id: 'crypto', label: t('Crypto'), sub: t('USDT / USDC · Ethereum') },
              { id: 'fiat',   label: t('Fiat'),   sub: t('Bank wire · 1–2 days') },
            ].map(tab => {
              const on = kind === tab.id;
              return (
                <button key={tab.id} onClick={() => setKind(tab.id)} style={{ padding: '10px 16px', border: 'none', cursor: 'pointer', background: on ? WBRAND.panel : 'transparent', color: on ? '#fff' : WBRAND.ink, borderRadius: 8, textAlign: 'left' }}>
                  <div style={{ fontFamily: WFONT, fontWeight: 700, fontSize: 13, letterSpacing: '-0.005em' }}>{tab.label}</div>
                  <div style={{ fontFamily: WFONT, fontSize: 11, color: on ? 'rgba(255,255,255,0.65)' : WBRAND.muted, marginTop: 2, fontWeight: 500 }}>{tab.sub}</div>
                </button>
              );
            })}
          </div>

          {/* Asset selector */}
          <WCard padding={0}>
            <div style={{ padding: '16px 22px 10px', borderBottom: `1px solid ${WBRAND.line}` }}><WEyebrow>{t('Select asset')}</WEyebrow></div>
            <div style={{ padding: '8px 12px' }}>
              {(kind === 'crypto' ? cryptoAssets : fiatAssets).map(a => {
                const on = (kind === 'crypto' ? cryptoAsset.symbol : fiatAsset.symbol) === a.symbol;
                return (
                  <button key={a.symbol} onClick={() => kind === 'crypto' ? setCryptoAsset(a) : setFiatAsset(a)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, border: 'none', background: on ? WBRAND.surface : 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                    <WCoinDot symbol={a.symbol} size={32}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{t(a.name)}</div>
                      <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2 }}>{a.symbol} · {t('balance')} <WMonoNum size={11} color={WBRAND.muted}>{wfmt(WBALANCES[a.symbol] ?? 0, wdecimals(a.symbol))}</WMonoNum></div>
                    </div>
                    <div style={{ width: 18, height: 18, borderRadius: 9, border: `1.5px solid ${on ? WBRAND.red : WBRAND.line2}`, background: on ? WBRAND.red : 'transparent', display: 'grid', placeItems: 'center' }}>
                      {on && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }}/>}
                    </div>
                  </button>
                );
              })}
            </div>
          </WCard>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {kind === 'crypto' ? (
            <>
              <WCard padding={0}>
                <div style={{ padding: '16px 22px 14px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: WFONT, fontSize: 15, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.015em' }}>{t('Your')} {cryptoAsset.symbol} {t('deposit address')}</div>
                    <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 2 }}>{t('Ethereum mainnet · ERC-20')}</div>
                  </div>
                  <WPill tone="positive">{WIcon.check(WBRAND.positive)} {t('Verified')}</WPill>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '180px 1fr', gap: mobile ? 16 : 24, padding: mobile ? '16px' : 24 }}>
                  <div style={{ background: WBRAND.white, border: `1px solid ${WBRAND.line}`, borderRadius: 12, padding: 12, aspectRatio: '1', maxWidth: '100%' }}>
                    <WebQR value={depositAddress}/>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <WEyebrow>{t('Address')}</WEyebrow>
                      <div style={{ marginTop: 8, padding: '12px 14px', background: WBRAND.surface, borderRadius: 10, fontFamily: WMONO, fontSize: 13, color: WBRAND.ink, wordBreak: 'break-all', lineHeight: 1.5 }}>{depositAddress}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                        <WCopyButton size="md" label={t('Copy address')} text={depositAddress} style={{ width: '100%', justifyContent: 'center' }}/>
                        <WSecondary size="md" icon={WIcon.share(WBRAND.ink)} style={{ width: '100%', justifyContent: 'center' }}>{t('Share')}</WSecondary>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: WBRAND.redSoft, borderRadius: 10, marginTop: 16 }}>
                      <div style={{ width: 18, height: 18, borderRadius: 9, background: WBRAND.red, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: WFONT, fontSize: 11, fontWeight: 800, flexShrink: 0 }}>!</div>
                      <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.ink, lineHeight: 1.5 }}>
                        {t('Send only')} <strong>{cryptoAsset.symbol}</strong> {t('on the')} <strong>{t('Ethereum (ERC-20)')}</strong> {t('network. Other tokens or networks will result in permanent loss of funds.')}
                      </div>
                    </div>
                  </div>
                </div>
              </WCard>

              <WCard padding={0}>
                <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)' }}>
                  {[
                    { l: t('Minimum deposit'), v: `10.00 ${cryptoAsset.symbol}` },
                    { l: t('Confirmations'),   v: '12 blocks · ≈ 3 min' },
                    { l: t('Network fee'),     v: t('Paid by sender') },
                  ].map((k, i) => (
                    <div key={i} style={{ padding: '16px 20px', borderRight: (!mobile && i < 2) ? `1px solid ${WBRAND.line}` : 'none', borderBottom: (mobile && i < 2) ? `1px solid ${WBRAND.line}` : 'none' }}>
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
                <div style={{ padding: '16px 22px 14px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: WFONT, fontSize: 15, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.015em' }}>{fiatAsset.name} · {t('bank transfer details')}</div>
                    <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 2 }}>{t('Send from any account registered under')} <strong>Ahmet Yılmaz</strong></div>
                  </div>
                  <WSecondary size="sm" icon={WIcon.download(WBRAND.ink)} style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>{t('Download PDF')}</WSecondary>
                </div>
                <div style={{ padding: '4px 22px 8px' }}>
                  {[
                    { l: t('Beneficiary name'),    v: 'Kanzasset DMCC' },
                    { l: t('Beneficiary address'), v: 'Almas Tower, JLT, Dubai, UAE' },
                    { l: t('Bank'),                v: bank.bank },
                    { l: fiatAsset.symbol === 'USD' ? t('Routing / Account') : t('IBAN'), v: bank.iban, mono: true },
                    { l: t('SWIFT / BIC'),         v: bank.swift, mono: true },
                    { l: t('Reference (MUST include)'), v: bank.ref, mono: true, accent: true },
                  ].map((r, i, arr) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{r.l}</div>
                        <div style={{ fontFamily: r.mono ? WMONO : WFONT, fontSize: 14, fontWeight: 700, color: r.accent ? WBRAND.red : WBRAND.ink, marginTop: 4, letterSpacing: r.mono ? 0 : '-0.005em', wordBreak: 'break-all' }}>{r.v}</div>
                      </div>
                      <WCopyButton text={r.v}/>
                    </div>
                  ))}
                </div>
              </WCard>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', background: WBRAND.redSoft, borderRadius: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: 10, background: WBRAND.red, color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0, fontFamily: WFONT, fontSize: 12, fontWeight: 800 }}>!</div>
                <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.ink, lineHeight: 1.5 }}>
                  {t('You must include the reference code')} <strong>{bank.ref}</strong> {t('exactly in your bank transfer, and send only from an account registered under your verified legal name. Funds typically arrive in')} <strong>{t('1–2 business days')}</strong>.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
