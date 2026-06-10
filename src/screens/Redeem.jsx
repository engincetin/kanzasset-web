import { useState, useEffect } from 'react';
import { WBRAND, WFONT, WMONO, wfmt, wparse, wdecimals, wgroup, wregroup, WRATES, WBALANCES, WMETA, WTXS, wMakePriceData } from '../lib/index.js';
import { WIcon } from '../components/icons.jsx';
import { AHLGMark } from '../components/coinicons.jsx';
import { WCard, WPrimary, WSecondary, WEyebrow, WNum, WMonoNum, WPill, WCopyButton } from '../components/primitives.jsx';
import { WPriceChart, WRangeTabs, WQuoteCountdown } from '../components/charts.jsx';
import { WAssetSelector, WTimeline, SelectField } from '../components/shared.jsx';
import { AddDestinationModal } from './Profile.jsx';
import { t } from '../lib/i18n.js';
import { useIsMobile } from '../lib/useResponsive.js';

function RedeemDigital({ targets, to, setTo, navigate }) {
  const mobile = useIsMobile();
  const [amount, setAmount] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const out = wparse(amount) * to.rate;

  return (
    <>
      <WCard padding={0}>
        <div style={{ padding: '22px 24px 20px', minHeight: 140, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <WEyebrow>{t('You redeem')}</WEyebrow>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 600 }}>{t('Minimum redeem')} · <WMonoNum size={11} color={WBRAND.ink}>1</WMonoNum> AHLG</span>
              <button onClick={() => setInfoOpen(true)} title={t('Redeem rules')} style={{ width: 20, height: 20, borderRadius: 10, border: `1px solid ${WBRAND.line2}`, background: WBRAND.white, cursor: 'pointer', display: 'grid', placeItems: 'center', color: WBRAND.muted, padding: 0, flexShrink: 0 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 11v6M12 7.5v.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/><circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.5"/></svg>
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
            <input value={amount} onChange={e => setAmount(wregroup(e.target.value))} inputMode="decimal" placeholder="0" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: WFONT, fontWeight: 800, fontSize: 36, color: WBRAND.ink, letterSpacing: '-0.035em', width: 0, minWidth: 0, fontVariantNumeric: 'tabular-nums' }}/>
            <div style={{ background: WBRAND.white, color: WBRAND.ink, border: `1px solid ${WBRAND.line2}`, borderRadius: 999, padding: '6px 14px 6px 6px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <AHLGMark size={28}/>
              <span style={{ fontFamily: WFONT, fontWeight: 700, fontSize: 14 }}>AHLG</span>
            </div>
          </div>
          <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>{t('Balance')}: <WMonoNum size={12}>{wfmt(WBALANCES.AHLG, 4)}</WMonoNum> AHLG</span>
            <span style={{ display: 'flex', gap: 6 }}>
              {[25, 50, 75].map(p => (
                <button key={p} onClick={() => setAmount(wgroup(String(WBALANCES.AHLG * p / 100)))} style={{ background: WBRAND.surface, border: 'none', cursor: 'pointer', padding: '2px 8px', borderRadius: 6, fontFamily: WFONT, fontSize: 11, fontWeight: 600, color: WBRAND.ink }}>{p}%</button>
              ))}
              <button onClick={() => setAmount(wgroup(String(WBALANCES.AHLG)))} style={{ background: WBRAND.redSoft, border: 'none', cursor: 'pointer', padding: '2px 8px', borderRadius: 6, fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.red }}>{t('MAX')}</button>
            </span>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${WBRAND.line}`, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', width: 32, height: 32, borderRadius: 16, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, display: 'grid', placeItems: 'center', zIndex: 1 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14m0 0l-5-5m5 5l5-5" stroke={WBRAND.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>

        <div style={{ padding: '22px 24px 22px', background: WBRAND.surface2, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
          <WEyebrow>{t('You receive')}</WEyebrow>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
            <div style={{ flex: 1, fontFamily: WFONT, fontWeight: 800, fontSize: 36, color: WBRAND.ink, letterSpacing: '-0.035em', fontVariantNumeric: 'tabular-nums' }}>{wfmt(out, wdecimals(to.symbol))}</div>
            <WAssetSelector value={to.symbol} options={targets} onChange={s => setTo(targets.find(x => x.symbol === s))}/>
          </div>
          <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 8 }}>
            {t('Settles to your Kanzasset {sym} balance instantly').replace('{sym}', to.symbol)}
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
            { l: 'Spot rate',  v: `1 AHLG = ${wfmt(to.rate, wdecimals(to.symbol))} ${to.symbol}` },
            { l: 'Redeem fee', v: t('0.00% — promotional') },
            { l: 'Settlement', v: t('Instant to balance') },
          ].map((r, i, arr) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
              <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>{t(r.l)}</span>
              <span style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink, fontVariantNumeric: 'tabular-nums' }}>{r.v}</span>
            </div>
          ))}
        </div>
      </WCard>

      <WPrimary size="lg" onClick={() => out > 0 && setRedeeming(true)} disabled={out <= 0} style={{ width: '100%', justifyContent: 'center' }}>
        {t('Redeem')} {wfmt(out, wdecimals(to.symbol))} {to.symbol}
      </WPrimary>

      {redeeming && (
        <RedeemDigitalModal
          burn={wparse(amount)}
          out={out}
          to={to}
          onClose={() => setRedeeming(false)}
          onTrack={() => { setRedeeming(false); navigate && navigate('activity'); }}
        />
      )}
      {infoOpen && (
        <div onClick={() => setInfoOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(10,10,10,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: mobile ? 12 : 24 }}>
          <div onClick={e => e.stopPropagation()} className="kz-pop" style={{ width: mobile ? '100%' : 420, maxWidth: '100%', background: WBRAND.white, borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.22)' }}>
            <div style={{ padding: '22px 24px 16px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: WBRAND.surface, display: 'grid', placeItems: 'center' }}>
                  <AHLGMark size={24}/>
                </div>
                <h2 style={{ margin: 0, fontFamily: WFONT, fontSize: 18, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.02em' }}>{t('Digital redeem rules')}</h2>
              </div>
              <button onClick={() => setInfoOpen(false)} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', flexShrink: 0, background: WBRAND.surface, cursor: 'pointer', color: WBRAND.ink, display: 'grid', placeItems: 'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div style={{ padding: '18px 24px 8px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { t: t('Minimum 1 AHLG'), d: t('Digital redemption starts at 1 AHLG — equal to 1 gram of vaulted gold.') },
                { t: t('Fractional amounts allowed'), d: t('Unlike physical delivery, you can redeem any amount from 1 AHLG upward, including fractions (e.g. 1.5, 12.25).') },
                { t: t('Instant settlement'), d: t('Funds are credited to your Kanzasset {sym} balance immediately at the live rate.').replace('{sym}', to.symbol) },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 11, background: WBRAND.redSoft, color: WBRAND.red, display: 'grid', placeItems: 'center', flexShrink: 0, fontFamily: WFONT, fontSize: 11, fontWeight: 800 }}>{i + 1}</div>
                  <div>
                    <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{r.t}</div>
                    <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 3, lineHeight: 1.5 }}>{r.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '16px 24px 20px' }}>
              <WPrimary size="lg" onClick={() => setInfoOpen(false)} style={{ width: '100%', justifyContent: 'center' }}>{t('Got it')}</WPrimary>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function RedeemDigitalModal({ burn, out, to, onClose, onTrack }) {
  const mobile = useIsMobile();
  const STEPS = [
    { id: 'submitted', title: t('Redeem request received'), sub: t('Order accepted and queued') },
    { id: 'settling',  title: t('Settling to balance'),     sub: () => `${t('Converting at')} 1 AHLG = ${wfmt(to.rate, wdecimals(to.symbol))} ${to.symbol}` },
    { id: 'credited',  title: t('Funds credited'),          sub: () => `${wfmt(out, wdecimals(to.symbol))} ${to.symbol} ${t('added to your wallet')}` },
    { id: 'burning',   title: t('Burning AHLG'),            sub: () => `${wfmt(burn, 4)} ${t('AHLG removed from circulation')}` },
  ];
  const [active, setActive] = useState(0);
  const [stamps, setStamps] = useState({});
  const ref = 'RD-' + Math.floor(100000 + Math.random() * 899999);

  useEffect(() => {
    const now = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setStamps(s => ({ ...s, 0: now() }));
    const delays = [900, 1900, 3000];
    const timers = delays.map((d, i) =>
      setTimeout(() => { setActive(i + 1); setStamps(s => ({ ...s, [i + 1]: now() })); }, d)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const done = active >= STEPS.length - 1;

  return (
    <div onClick={done ? onClose : undefined} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(10,10,10,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: mobile ? 12 : 24,
    }}>
      <div onClick={e => e.stopPropagation()} className="kz-pop" style={{
        width: mobile ? '100%' : 440, maxWidth: '100%', background: WBRAND.white,
        borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.22)', overflow: 'hidden',
      }}>
        <div style={{ padding: '22px 24px 18px', borderBottom: `1px solid ${WBRAND.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AHLGMark size={40}/>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{done ? t('Redeem complete') : t('Redeeming')}</div>
                <div style={{ fontFamily: WFONT, fontSize: 18, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.02em', marginTop: 2 }}>{wfmt(out, wdecimals(to.symbol))} {to.symbol}</div>
              </div>
            </div>
            <WMonoNum size={11} color={WBRAND.muted2}>{ref}</WMonoNum>
          </div>
        </div>

        <div style={{ padding: '20px 24px 8px' }}>
          <WTimeline steps={STEPS} active={active} stamps={stamps} done={done}/>
        </div>

        <div style={{ padding: '8px 24px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {done ? (
            <>
              <WPrimary size="lg" onClick={onTrack} style={{ width: '100%', justifyContent: 'center' }}>{t('Track in Activity')}</WPrimary>
              <WSecondary size="lg" onClick={onClose} style={{ width: '100%', justifyContent: 'center', height: 52 }}>{t('Done')}</WSecondary>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 0', fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 600 }}>
              {t('You can safely close this — settlement continues in the background.')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// CSS-drawn 1kg gold ingot — trapezoid body, glint sweep, stamped label
function GoldBar({ delay = 0 }) {
  const clip = 'polygon(12% 0, 88% 0, 100% 100%, 0 100%)';
  return (
    <div className="kz-bar" style={{ animationDelay: `${delay}s`, width: 46, height: 26, position: 'relative', flexShrink: 0 }}>
      <div style={{
        position: 'absolute', inset: 0, clipPath: clip,
        background: 'linear-gradient(160deg, #F6D77B 0%, #E3B74E 40%, #C9962F 75%, #E8C766 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55)',
      }}/>
      <div style={{ position: 'absolute', inset: 0, clipPath: clip, overflow: 'hidden' }}>
        <div className="kz-sheen" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.5) 50%, transparent 65%)' }}/>
      </div>
      <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: WFONT, fontSize: 7, fontWeight: 800, letterSpacing: '0.08em', color: 'rgba(120, 84, 10, 0.75)' }}>1 KG</span>
    </div>
  );
}

function RedeemPhysicalWeb({ navigate }) {
  const mobile = useIsMobile();
  const addresses = [
    { id: 'h', label: 'Home',     city: 'Dubai',    line: 'Marina Plaza, Tower 1, Apt 2208',   country: 'UAE' },
    { id: 'o', label: 'Office',   city: 'Dubai',    line: 'DMCC Almas Tower, Floor 38',        country: 'UAE' },
    { id: 'i', label: 'Istanbul', city: 'Istanbul', line: 'Levent Mah. Büyükdere Cad. No:185', country: 'Türkiye' },
  ];
  const maxKg = Math.max(1, Math.floor(WBALANCES.AHLG / 1000));
  const [kgPicked, setKgPicked] = useState(1);
  const [addrId, setAddrId] = useState('h');
  const [shipping, setShipping] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [shipAddOpen, setShipAddOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const addr = addresses.find(a => a.id === addrId);

  return (
    <>
      <WCard padding={0}>
        {/* You redeem */}
        <div style={{ padding: '22px 24px 20px', minHeight: 140, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <WEyebrow>{t('You redeem')}</WEyebrow>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 600 }}>{t('Min 1 kg')} · {t('Max')} <WMonoNum size={11} color={WBRAND.ink}>{maxKg}</WMonoNum> kg</span>
              <button onClick={() => setInfoOpen(true)} title={t('Delivery rules')} style={{ width: 20, height: 20, borderRadius: 10, border: `1px solid ${WBRAND.line2}`, background: WBRAND.white, cursor: 'pointer', display: 'grid', placeItems: 'center', color: WBRAND.muted, padding: 0, flexShrink: 0 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 11v6M12 7.5v.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/><circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.5"/></svg>
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: WFONT, fontWeight: 800, fontSize: 36, color: WBRAND.ink, letterSpacing: '-0.035em', fontVariantNumeric: 'tabular-nums' }}>{kgPicked}</span>
              <span style={{ fontFamily: WFONT, fontWeight: 700, fontSize: 18, color: WBRAND.muted }}>kg</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => setKgPicked(Math.max(1, kgPicked - 1))} disabled={kgPicked <= 1} style={{ width: 38, height: 38, borderRadius: 19, background: WBRAND.white, border: `1px solid ${kgPicked <= 1 ? WBRAND.line : WBRAND.line2}`, cursor: kgPicked <= 1 ? 'not-allowed' : 'pointer', color: kgPicked <= 1 ? WBRAND.muted2 : WBRAND.ink, display: 'grid', placeItems: 'center', opacity: kgPicked <= 1 ? 0.5 : 1 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
              </button>
              <button onClick={() => setKgPicked(Math.min(maxKg, kgPicked + 1))} disabled={kgPicked >= maxKg} style={{ width: 38, height: 38, borderRadius: 19, background: WBRAND.white, border: `1px solid ${kgPicked >= maxKg ? WBRAND.line : WBRAND.line2}`, cursor: kgPicked >= maxKg ? 'not-allowed' : 'pointer', color: kgPicked >= maxKg ? WBRAND.muted2 : WBRAND.ink, display: 'grid', placeItems: 'center', opacity: kgPicked >= maxKg ? 0.5 : 1 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>
          <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 8, fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span>{t('Balance')}: <WMonoNum size={12}>{wfmt(WBALANCES.AHLG, 4)}</WMonoNum> AHLG</span>
            <button onClick={() => setKgPicked(maxKg)} style={{ background: WBRAND.redSoft, border: 'none', cursor: 'pointer', padding: '2px 8px', borderRadius: 6, fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.red, flexShrink: 0 }}>{t('MAX')}</button>
          </div>

          {/* Your bars, stacking up as you pick */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
            {Array.from({ length: Math.min(kgPicked, 6) }, (_, i) => <GoldBar key={`${kgPicked}-${i}`} delay={i * 0.06}/>)}
            {kgPicked > 6 && <span style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.muted }}>+{kgPicked - 6} kg</span>}
          </div>
        </div>

        {/* Divider with parcel chevron */}
        <div style={{ borderTop: `1px solid ${WBRAND.line}`, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', width: 32, height: 32, borderRadius: 16, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, display: 'grid', placeItems: 'center', zIndex: 1, color: WBRAND.ink }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="8" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
              <path d="M5 12v8a1 1 0 001 1h12a1 1 0 001-1v-8" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
              <path d="M12 8v13" stroke="currentColor" strokeWidth="1.7"/>
            </svg>
          </div>
        </div>

        {/* Ship to */}
        <div style={{ padding: '22px 24px 22px', background: WBRAND.surface2, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
          <WEyebrow>{t('Ship to')}</WEyebrow>
          <div style={{ marginTop: 10 }}>
            <SelectField
              value={(() => { const a = addresses.find(x => x.id === addrId) || addresses[0]; return `${a.label} · ${a.city} — ${a.line}, ${a.country}`; })()}
              options={addresses.map(a => `${a.label} · ${a.city} — ${a.line}, ${a.country}`)}
              onChange={(v) => { const a = addresses.find(x => `${x.label} · ${x.city} — ${x.line}, ${x.country}` === v); if (a) setAddrId(a.id); }}
            />
            <button onClick={() => setShipAddOpen(true)} style={{ width: '100%', marginTop: 8, padding: '10px 12px', border: `1px dashed ${WBRAND.line2}`, borderRadius: 10, background: 'transparent', cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {WIcon.plus()} {t('Add new address')}
            </button>
          </div>
        </div>
      </WCard>

      <WCard padding={0}>
        <div style={{ padding: '16px 22px 8px', borderBottom: `1px solid ${WBRAND.line}` }}>
          <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{t('Order summary')}</div>
        </div>
        <div style={{ padding: '4px 22px 8px' }}>
          {[
            { l: 'Bar',               v: `${kgPicked} × 1 kg · 999.5 ${t('fine')} · Ahlatci Gold Refinery` },
            { l: 'Burned',            v: `${wfmt(kgPicked * 1000, 0)} AHLG · ≈ $${wfmt(kgPicked * 1000 * WRATES.AHLG, 0)}` },
            { l: 'Shipping',          v: `Brinks · AED 120 · ${t('fully insured')}` },
            { l: 'Estimated arrival', v: t('3–5 business days') },
          ].map((r, i, arr) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
              <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>{t(r.l)}</span>
              <span style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink, fontVariantNumeric: 'tabular-nums' }}>{r.v}</span>
            </div>
          ))}
        </div>
      </WCard>

      <WPrimary size="lg" onClick={() => setConfirmOpen(true)} style={{ width: '100%', justifyContent: 'center' }}>
        {t('Request')} {kgPicked} {t('kg delivery')}
      </WPrimary>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: WBRAND.surface, borderRadius: 10 }}>
        {WIcon.shield(WBRAND.ink)}
        <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.ink, lineHeight: 1.5 }}>
          {t('Bars are cast by Ahlatci Gold Refinery, sealed with tamper-evident packaging, and shipped with a serialised assay certificate. Delivery requires ID verification at the door.')}
        </div>
      </div>

      {confirmOpen && (
        <div onClick={() => setConfirmOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(10,10,10,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: mobile ? 12 : 24 }}>
          <div onClick={e => e.stopPropagation()} className="kz-pop" style={{ width: mobile ? '100%' : 440, maxWidth: '100%', background: WBRAND.white, borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.22)', overflow: 'hidden' }}>
            <div style={{ padding: '22px 24px 16px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: WBRAND.surface, display: 'grid', placeItems: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="8" width="18" height="4" rx="1" stroke={WBRAND.ink} strokeWidth="1.7" strokeLinejoin="round"/>
                    <path d="M5 12v8a1 1 0 001 1h12a1 1 0 001-1v-8" stroke={WBRAND.ink} strokeWidth="1.7" strokeLinejoin="round"/>
                    <path d="M12 8v13" stroke={WBRAND.ink} strokeWidth="1.7"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t('Confirm delivery')}</div>
                  <div style={{ fontFamily: WFONT, fontSize: 18, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.02em', marginTop: 2 }}>{kgPicked} {t('kg physical gold')}</div>
                </div>
              </div>
              <button onClick={() => setConfirmOpen(false)} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', flexShrink: 0, background: WBRAND.surface, cursor: 'pointer', color: WBRAND.ink, display: 'grid', placeItems: 'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
            </div>

            <div style={{ padding: '6px 24px 4px' }}>
              {[
                { l: 'Bar',               v: `${kgPicked} × 1 kg · 999.5 ${t('fine')} · Ahlatci Gold Refinery` },
                { l: 'Burned',            v: `${wfmt(kgPicked * 1000, 0)} AHLG · ≈ $${wfmt(kgPicked * 1000 * WRATES.AHLG, 0)}` },
                { l: 'Ship to',           v: addr ? `${addr.label} · ${addr.city} — ${addr.line}, ${addr.country}` : '—' },
                { l: 'Shipping',          v: `Brinks · AED 120 · ${t('fully insured')}` },
                { l: 'Estimated arrival', v: t('3–5 business days') },
              ].map((r, i, arr) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, padding: '13px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
                  <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500, flexShrink: 0 }}>{t(r.l)}</span>
                  <span style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink, textAlign: 'right' }}>{r.v}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: '12px 24px 0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: WBRAND.surface, borderRadius: 10 }}>
                {WIcon.shield(WBRAND.ink)}
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.ink, lineHeight: 1.5 }}>
                  {t('Burning AHLG for physical delivery is irreversible. Please confirm the bar count and shipping address are correct.')}
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 24px 20px', display: 'flex', gap: 8 }}>
              <WSecondary size="lg" onClick={() => setConfirmOpen(false)} style={{ flex: 1, justifyContent: 'center', height: 52 }}>{t('Cancel')}</WSecondary>
              <WPrimary size="lg" onClick={() => { setConfirmOpen(false); setShipping(true); }} style={{ flex: 1, justifyContent: 'center' }}>
                {t('Confirm & request')}
              </WPrimary>
            </div>
          </div>
        </div>
      )}

      {shipping && (
        <RedeemPhysicalModal
          kg={kgPicked}
          addr={addr}
          onClose={() => setShipping(false)}
          onTrack={() => { setShipping(false); navigate && navigate('activity'); }}
        />
      )}

      {shipAddOpen && <AddDestinationModal tab="shipping" onClose={() => setShipAddOpen(false)}/>}

      {infoOpen && (
        <div onClick={() => setInfoOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(10,10,10,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: mobile ? 12 : 24 }}>
          <div onClick={e => e.stopPropagation()} className="kz-pop" style={{ width: mobile ? '100%' : 420, maxWidth: '100%', background: WBRAND.white, borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.22)' }}>
            <div style={{ padding: '22px 24px 16px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: WBRAND.surface, display: 'grid', placeItems: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="8" width="18" height="4" rx="1" stroke={WBRAND.ink} strokeWidth="1.7" strokeLinejoin="round"/>
                    <path d="M5 12v8a1 1 0 001 1h12a1 1 0 001-1v-8" stroke={WBRAND.ink} strokeWidth="1.7" strokeLinejoin="round"/>
                    <path d="M12 8v13" stroke={WBRAND.ink} strokeWidth="1.7"/>
                  </svg>
                </div>
                <h2 style={{ margin: 0, fontFamily: WFONT, fontSize: 18, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.02em' }}>{t('Physical delivery rules')}</h2>
              </div>
              <button onClick={() => setInfoOpen(false)} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', flexShrink: 0, background: WBRAND.surface, cursor: 'pointer', color: WBRAND.ink, display: 'grid', placeItems: 'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div style={{ padding: '18px 24px 8px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { t: t('Minimum 1 kg'), d: t('Physical redemption starts at one 1 kg bar — equal to 1,000 AHLG.') },
                { t: t('Whole-kilogram multiples'), d: t('Bars are cast in 1 kg units, so you can only redeem whole kilograms (1, 2, 3 …). Fractional amounts stay in your digital balance.') },
                { t: t('Up to your balance'), d: t('With {bal} AHLG you can take delivery of up to {kg} kg right now.').replace('{bal}', wfmt(WBALANCES.AHLG, 0)).replace('{kg}', maxKg) },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 11, background: WBRAND.redSoft, color: WBRAND.red, display: 'grid', placeItems: 'center', flexShrink: 0, fontFamily: WFONT, fontSize: 11, fontWeight: 800 }}>{i + 1}</div>
                  <div>
                    <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{r.t}</div>
                    <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 3, lineHeight: 1.5 }}>{r.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '16px 24px 20px' }}>
              <WPrimary size="lg" onClick={() => setInfoOpen(false)} style={{ width: '100%', justifyContent: 'center' }}>{t('Got it')}</WPrimary>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function RedeemPhysicalModal({ kg, addr, onClose, onTrack }) {
  const mobile = useIsMobile();
  const STEPS = [
    { id: 'submitted', title: t('Delivery request received'), sub: () => `${kg} × 1 kg ${t('bar')}${kg > 1 ? t('s') : ''} · ${t('ship to')} ${addr ? addr.label + ', ' + addr.city : t('your address')}` },
    { id: 'handover',  title: t('Handed to carrier'),         sub: `Brinks Secure Logistics · ${t('insured in transit')}` },
    { id: 'burning',   title: t('Burning AHLG'),              sub: () => `${wfmt(kg * 1000, 4)} ${t('AHLG removed from circulation')}` },
    { id: 'done',      title: t('Shipped — tracking ready'),  sub: t('Your bars are on the way') },
  ];
  const [active, setActive] = useState(0);
  const [stamps, setStamps] = useState({});
  const orderRef = 'PD-' + Math.floor(100000 + Math.random() * 899999);
  const tracking = 'BRX' + Math.floor(100000000 + Math.random() * 899999999) + 'AE';
  const trackUrl = 'brinks.com/track/' + tracking;

  useEffect(() => {
    const now = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setStamps(s => ({ ...s, 0: now() }));
    const delays = [900, 4500, 5800];
    const timers = delays.map((d, i) =>
      setTimeout(() => { setActive(i + 1); setStamps(s => ({ ...s, [i + 1]: now() })); }, d)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const done = active >= STEPS.length - 1;

  return (
    <div onClick={done ? onClose : undefined} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(10,10,10,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: mobile ? 12 : 24,
    }}>
      <div onClick={e => e.stopPropagation()} className="kz-pop" style={{
        width: mobile ? '100%' : 460, maxWidth: '100%', background: WBRAND.white,
        borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.22)', overflow: 'hidden',
        maxHeight: '88vh', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '22px 24px 18px', borderBottom: `1px solid ${WBRAND.line}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: WBRAND.surface, display: 'grid', placeItems: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="2.5" y="7" width="13" height="11" rx="1.5" stroke={WBRAND.ink} strokeWidth="1.7"/>
                  <path d="M15.5 10h3.2c.5 0 .96.27 1.2.7l1.3 2.3c.13.23.2.5.2.76V17a1 1 0 0 1-1 1h-5.9" stroke={WBRAND.ink} strokeWidth="1.7" strokeLinejoin="round"/>
                  <circle cx="6.5" cy="18.5" r="1.8" stroke={WBRAND.ink} strokeWidth="1.7"/>
                  <circle cx="17.5" cy="18.5" r="1.8" stroke={WBRAND.ink} strokeWidth="1.7"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{done ? t('Order shipped') : t('Processing delivery')}</div>
                <div style={{ fontFamily: WFONT, fontSize: 18, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.02em', marginTop: 2 }}>{kg} {t('kg physical gold')}</div>
              </div>
            </div>
            <WMonoNum size={11} color={WBRAND.muted2}>{orderRef}</WMonoNum>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <div style={{ padding: '20px 24px 8px' }}>
            <WTimeline steps={STEPS} active={active} stamps={stamps} done={done}/>
          </div>

          {done && (
            <div style={{ padding: '4px 24px 20px' }}>
              <div style={{ border: `1px solid ${WBRAND.line}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', background: WBRAND.surface2, borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: WBRAND.panel, display: 'grid', placeItems: 'center', fontFamily: WFONT, fontWeight: 800, fontSize: 10, color: '#fff', letterSpacing: '0.04em' }}>BRX</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>Brinks Secure Logistics</div>
                    <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 1 }}>{t('Fully insured · signature on delivery')}</div>
                  </div>
                  <WPill tone="warn">{t('In transit')}</WPill>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t('Tracking number')}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <WMonoNum size={15} weight={500} style={{ flex: 1 }}>{tracking}</WMonoNum>
                    <WCopyButton text={tracking}/>
                  </div>
                  <a href={`https://${trackUrl}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, height: 42, borderRadius: 10, background: WBRAND.white, border: `1px solid ${WBRAND.line2}`, textDecoration: 'none', fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink }}>
                    {t('Track shipment on Brinks')}
                    {WIcon.external(WBRAND.muted)}
                  </a>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: `1px dashed ${WBRAND.line}` }}>
                    <div>
                      <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t('Ships to')}</div>
                      <div style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink, marginTop: 3 }}>{addr ? `${addr.label} · ${addr.city}` : '—'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t('Est. arrival')}</div>
                      <div style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink, marginTop: 3 }}>{t('3–5 business days')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '14px 24px 20px', flexShrink: 0, borderTop: done ? `1px solid ${WBRAND.line}` : 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {done ? (
            <>
              <WPrimary size="lg" onClick={onTrack} style={{ width: '100%', justifyContent: 'center' }}>{t('Track in Activity')}</WPrimary>
              <WSecondary size="lg" onClick={onClose} style={{ width: '100%', justifyContent: 'center', height: 52 }}>{t('Done')}</WSecondary>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '8px 0', fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 600 }}>
              {t('Preparing your shipment — a tracking number will appear here shortly.')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function WebRedeem({ navigate, onOpenTx }) {
  const mobile = useIsMobile();
  const [mode, setMode] = useState('digital');
  const [range, setRange] = useState('3M');
  const priceData = wMakePriceData(90);

  const targets = Object.keys(WBALANCES)
    .filter(s => s !== 'AHLG')
    .map(s => ({ symbol: s, name: WMETA[s].name, balance: WBALANCES[s], rate: WRATES.AHLG / WRATES[s] }));
  const [to, setTo] = useState(targets[0]);

  const quote = mode === 'digital' ? to.symbol : 'USDT';
  const quoteRate = WRATES[quote] || 1;
  const quotedData = priceData.map(d => ({ t: d.t, v: d.v / quoteRate }));
  const spot = WRATES.AHLG / quoteRate;
  const first = quotedData[0].v;
  const diff = spot - first;
  const pct = (diff / first) * 100;
  const isFiat = ['USDT', 'USDC', 'USD'].includes(quote);
  const px = (v, d = 2) => `${isFiat ? '$' : ''}${wfmt(v, d)}${isFiat ? '' : ' ' + quote}`;

  return (
    <div style={{ padding: mobile ? '18px 16px 40px' : '28px 32px 48px', overflowY: 'auto', overflowX: 'hidden', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <WEyebrow>{t('Redeem AHLG')}</WEyebrow>
          <h1 style={{ margin: '6px 0 0', fontFamily: WFONT, fontSize: 28, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.025em' }}>{t('Convert gold back to cash or claim physical bars')}</h1>
          <div style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, marginTop: 6 }}>
            {t('Burn AHLG tokens to receive instant settlement in your Kanzasset balance, or request physical delivery to your address.')}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '480px 1fr', gap: mobile ? 14 : 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          {/* Mode toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, padding: 4, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, borderRadius: 12 }}>
            {[
              { id: 'digital',  label: t('Digital'),  sub: t('Crypto or fiat · instant') },
              { id: 'physical', label: t('Physical'), sub: t('Gold bars · 3–5 days') },
            ].map(opt => {
              const on = mode === opt.id;
              return (
                <button key={opt.id} onClick={() => setMode(opt.id)} style={{ padding: '10px 16px', border: 'none', cursor: 'pointer', background: on ? WBRAND.panel : 'transparent', color: on ? '#fff' : WBRAND.ink, borderRadius: 8, textAlign: 'left' }}>
                  <div style={{ fontFamily: WFONT, fontWeight: 700, fontSize: 13, letterSpacing: '-0.005em' }}>{opt.label}</div>
                  <div style={{ fontFamily: WFONT, fontSize: 11, color: on ? 'rgba(255,255,255,0.65)' : WBRAND.muted, marginTop: 2, fontWeight: 500 }}>{opt.sub}</div>
                </button>
              );
            })}
          </div>

          {mode === 'digital'
            ? <RedeemDigital targets={targets} to={to} setTo={setTo} navigate={navigate}/>
            : <RedeemPhysicalWeb navigate={navigate}/>
          }
        </div>

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
          </WCard>

          <WCard padding={0}>
            <div style={{ padding: '16px 22px 12px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{t('Your recent redeems')}</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2 }}>{t('Last 30 days')}</div>
              </div>
              <button onClick={() => navigate('activity')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.red, display: 'flex', alignItems: 'center', gap: 4 }}>{t('View all')} {WIcon.arrowRight(WBRAND.red)}</button>
            </div>
            <div style={{ overflowX: mobile ? 'auto' : 'visible', WebkitOverflowScrolling: 'touch' }}>
            <div style={{ minWidth: mobile ? 520 : 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 110px', gap: 12, padding: '10px 22px', borderBottom: `1px solid ${WBRAND.line}`, background: WBRAND.surface2 }}>
              {['Date', 'Burned', 'Received', 'Rate', 'Status'].map((h, i) => (
                <div key={i} style={{ fontFamily: WFONT, fontSize: 10, fontWeight: 700, color: WBRAND.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t(h)}</div>
              ))}
            </div>
            {WTXS.filter(t => t.type === 'Redeem').slice(0, 4).map((tx, i, arr) => (
              <div key={tx.id}
                onClick={() => onOpenTx && onOpenTx(tx)}
                onMouseEnter={onOpenTx ? (e => e.currentTarget.style.background = WBRAND.surface2) : undefined}
                onMouseLeave={onOpenTx ? (e => e.currentTarget.style.background = 'transparent') : undefined}
                style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 110px', gap: 12, padding: '12px 22px', alignItems: 'center', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}`, cursor: onOpenTx ? 'pointer' : 'default', transition: 'background .12s' }}>
                <div>
                  <WMonoNum size={12}>{tx.ts.slice(0, 10)}</WMonoNum>
                  <div style={{ fontFamily: WMONO, fontSize: 10, color: WBRAND.muted, marginTop: 2 }}>{tx.ts.slice(11, 16)}</div>
                </div>
                <WMonoNum size={12} color={WBRAND.ink}>{wfmt(Math.abs(tx.amount), 4)} AHLG</WMonoNum>
                <WMonoNum size={12} color={WBRAND.ink}>{tx.paid}</WMonoNum>
                <WMonoNum size={11} color={WBRAND.muted}>{wfmt(WRATES.AHLG)} USDT</WMonoNum>
                <WPill tone={tx.status === 'completed' ? 'positive' : 'warn'}>{t(tx.status[0].toUpperCase() + tx.status.slice(1))}</WPill>
              </div>
            ))}
            </div>
            </div>
          </WCard>
        </div>
      </div>
    </div>
  );
}

// ─── Physical-only redeem screen (no digital/physical toggle) ──
// Reuses the existing physical flow; digital redeem now lives in Buy/Sell.
export function WebPhysicalRedeem({ navigate, onOpenTx }) {
  const mobile = useIsMobile();
  const [range, setRange] = useState('3M');
  const priceData = wMakePriceData(90);
  const quote = 'USDT';
  const quoteRate = WRATES[quote] || 1;
  const quotedData = priceData.map(d => ({ t: d.t, v: d.v / quoteRate }));
  const spot = WRATES.AHLG / quoteRate;
  const first = quotedData[0].v;
  const diff = spot - first;
  const pct = (diff / first) * 100;
  const px = (v, d = 2) => `$${wfmt(v, d)}`;

  return (
    <div style={{ padding: mobile ? '18px 16px 40px' : '28px 32px 48px', overflowY: 'auto', overflowX: 'hidden', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 20 }}>
        <WEyebrow>{t('Physical delivery')}</WEyebrow>
        <h1 style={{ margin: '6px 0 0', fontFamily: WFONT, fontSize: 28, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.025em' }}>{t('Claim physical gold bars')}</h1>
        <div style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, marginTop: 6 }}>
          {t('Burn AHLG and have investment-grade gold bars delivered to your address.')}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '480px 1fr', gap: mobile ? 14 : 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <RedeemPhysicalWeb navigate={navigate}/>
        </div>

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
          </WCard>

          <WCard padding={0}>
            <div style={{ padding: '16px 22px 12px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{t('Your recent redeems')}</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2 }}>{t('Last 30 days')}</div>
              </div>
              <button onClick={() => navigate('activity')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.red, display: 'flex', alignItems: 'center', gap: 4 }}>{t('View all')} {WIcon.arrowRight(WBRAND.red)}</button>
            </div>
            <div style={{ overflowX: mobile ? 'auto' : 'visible', WebkitOverflowScrolling: 'touch' }}>
            <div style={{ minWidth: mobile ? 520 : 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 110px', gap: 12, padding: '10px 22px', borderBottom: `1px solid ${WBRAND.line}`, background: WBRAND.surface2 }}>
              {['Date', 'Burned', 'Received', 'Rate', 'Status'].map((h, i) => (
                <div key={i} style={{ fontFamily: WFONT, fontSize: 10, fontWeight: 700, color: WBRAND.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t(h)}</div>
              ))}
            </div>
            {WTXS.filter(tx => tx.type === 'Redeem').slice(0, 4).map((tx, i, arr) => (
              <div key={tx.id}
                onClick={() => onOpenTx && onOpenTx(tx)}
                onMouseEnter={onOpenTx ? (e => e.currentTarget.style.background = WBRAND.surface2) : undefined}
                onMouseLeave={onOpenTx ? (e => e.currentTarget.style.background = 'transparent') : undefined}
                style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 110px', gap: 12, padding: '12px 22px', alignItems: 'center', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}`, cursor: onOpenTx ? 'pointer' : 'default', transition: 'background .12s' }}>
                <div>
                  <WMonoNum size={12}>{tx.ts.slice(0, 10)}</WMonoNum>
                  <div style={{ fontFamily: WMONO, fontSize: 10, color: WBRAND.muted, marginTop: 2 }}>{tx.ts.slice(11, 16)}</div>
                </div>
                <WMonoNum size={12} color={WBRAND.ink}>{wfmt(Math.abs(tx.amount), 4)} AHLG</WMonoNum>
                <WMonoNum size={12} color={WBRAND.ink}>{tx.paid}</WMonoNum>
                <WMonoNum size={11} color={WBRAND.muted}>{wfmt(WRATES.AHLG)} USDT</WMonoNum>
                <WPill tone={tx.status === 'completed' ? 'positive' : 'warn'}>{t(tx.status[0].toUpperCase() + tx.status.slice(1))}</WPill>
              </div>
            ))}
            </div>
            </div>
          </WCard>
        </div>
      </div>
    </div>
  );
}
