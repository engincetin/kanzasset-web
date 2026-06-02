import { useState, useEffect } from 'react';
import { WBRAND, WFONT, WMONO, wfmt, wparse, wdecimals, WRATES, WBALANCES, WMETA, WTXS, wMakePriceData } from '../lib/index.js';
import { WIcon } from '../components/icons.jsx';
import { AHLGMark } from '../components/coinicons.jsx';
import { WCard, WPrimary, WSecondary, WEyebrow, WNum, WMonoNum, WPill } from '../components/primitives.jsx';
import { WPriceChart, WRangeTabs, WQuoteCountdown } from '../components/charts.jsx';
import { WAssetSelector, WTimeline } from '../components/shared.jsx';

function RedeemDigital({ targets, to, setTo }) {
  const [amount, setAmount] = useState('1');
  const [redeeming, setRedeeming] = useState(false);
  const out = wparse(amount) * to.rate;

  return (
    <>
      <WCard padding={0}>
        <div style={{ padding: '22px 24px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <WEyebrow>You burn</WEyebrow>
            <button onClick={() => setAmount(String(WBALANCES.AHLG))} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.red, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Use max</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
            <input value={amount} onChange={e => setAmount(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: WFONT, fontWeight: 800, fontSize: 36, color: WBRAND.ink, letterSpacing: '-0.035em', width: 0, minWidth: 0, fontVariantNumeric: 'tabular-nums' }}/>
            <div style={{ background: WBRAND.white, color: WBRAND.ink, border: `1px solid ${WBRAND.line2}`, borderRadius: 999, padding: '6px 14px 6px 6px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <AHLGMark size={28}/>
              <span style={{ fontFamily: WFONT, fontWeight: 700, fontSize: 14 }}>AHLG</span>
            </div>
          </div>
          <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 8 }}>
            Balance: <WMonoNum size={12}>{wfmt(WBALANCES.AHLG, 4)}</WMonoNum> AHLG
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${WBRAND.line}`, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', width: 32, height: 32, borderRadius: 16, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, display: 'grid', placeItems: 'center', zIndex: 1 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14m0 0l-5-5m5 5l5-5" stroke={WBRAND.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>

        <div style={{ padding: '22px 24px 22px', background: WBRAND.surface2 }}>
          <WEyebrow>You receive</WEyebrow>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
            <div style={{ flex: 1, fontFamily: WFONT, fontWeight: 800, fontSize: 36, color: WBRAND.ink, letterSpacing: '-0.035em', fontVariantNumeric: 'tabular-nums' }}>{wfmt(out, wdecimals(to.symbol))}</div>
            <WAssetSelector value={to.symbol} options={targets} onChange={s => setTo(targets.find(x => x.symbol === s))}/>
          </div>
          <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 8 }}>
            Settles to your Kanzasset {to.symbol} balance instantly
          </div>
        </div>
      </WCard>

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
            { l: 'Spot rate',  v: `1 AHLG = ${wfmt(to.rate, wdecimals(to.symbol))} ${to.symbol}` },
            { l: 'Redeem fee', v: '0.00% — promotional' },
            { l: 'Settlement', v: 'Instant to balance' },
          ].map((r, i, arr) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
              <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>{r.l}</span>
              <span style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink, fontVariantNumeric: 'tabular-nums' }}>{r.v}</span>
            </div>
          ))}
        </div>
      </WCard>

      <WPrimary size="lg" onClick={() => setRedeeming(true)} style={{ width: '100%', justifyContent: 'center' }}>
        Redeem {wfmt(out, wdecimals(to.symbol))} {to.symbol}
      </WPrimary>

      {redeeming && (
        <RedeemDigitalModal
          burn={wparse(amount)}
          out={out}
          to={to}
          onClose={() => setRedeeming(false)}
          onTrack={() => setRedeeming(false)}
        />
      )}
    </>
  );
}

function RedeemDigitalModal({ burn, out, to, onClose, onTrack }) {
  const STEPS = [
    { id: 'submitted', title: 'Redeem request received', sub: 'Order accepted and queued' },
    { id: 'settling',  title: 'Settling to balance',     sub: () => `Converting at 1 AHLG = ${wfmt(to.rate, wdecimals(to.symbol))} ${to.symbol}` },
    { id: 'credited',  title: 'Funds credited',          sub: () => `${wfmt(out, wdecimals(to.symbol))} ${to.symbol} added to your wallet` },
    { id: 'burning',   title: 'Burning AHLG',            sub: () => `${wfmt(burn, 4)} AHLG removed from circulation` },
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
      background: 'rgba(10,10,10,0.42)', display: 'grid', placeItems: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 440, maxWidth: '100%', background: WBRAND.white,
        borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.22)', overflow: 'hidden',
      }}>
        <div style={{ padding: '22px 24px 18px', borderBottom: `1px solid ${WBRAND.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AHLGMark size={40}/>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{done ? 'Redeem complete' : 'Redeeming'}</div>
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
              <WPrimary size="lg" onClick={onTrack} style={{ width: '100%', justifyContent: 'center' }}>Track in Activity</WPrimary>
              <WSecondary size="lg" onClick={onClose} style={{ width: '100%', justifyContent: 'center', height: 52 }}>Done</WSecondary>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 0', fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 600 }}>
              You can safely close this — settlement continues in the background.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RedeemPhysicalWeb() {
  const addresses = [
    { id: 'h', label: 'Home',     city: 'Dubai',    line: 'Marina Plaza, Tower 1, Apt 2208',   country: 'UAE' },
    { id: 'o', label: 'Office',   city: 'Dubai',    line: 'DMCC Almas Tower, Floor 38',        country: 'UAE' },
    { id: 'i', label: 'Istanbul', city: 'Istanbul', line: 'Levent Mah. Büyükdere Cad. No:185', country: 'Türkiye' },
  ];
  const maxKg = Math.max(1, Math.floor(WBALANCES.AHLG / 1000));
  const [kgPicked, setKgPicked] = useState(1);
  const [addrId, setAddrId] = useState('h');
  const [shipping, setShipping] = useState(false);
  const addr = addresses.find(a => a.id === addrId);

  return (
    <>
      <WCard padding={0}>
        <div style={{ padding: '20px 22px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <WEyebrow>How much gold</WEyebrow>
            <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 600 }}>Min 1 kg · Max <WMonoNum size={11} color={WBRAND.ink}>{maxKg}</WMonoNum> kg available</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginTop: 18, padding: '14px 0' }}>
            <button onClick={() => setKgPicked(Math.max(1, kgPicked - 1))} disabled={kgPicked <= 1} style={{ width: 44, height: 44, borderRadius: 22, background: WBRAND.white, border: `1px solid ${kgPicked <= 1 ? WBRAND.line : WBRAND.line2}`, cursor: kgPicked <= 1 ? 'not-allowed' : 'pointer', color: kgPicked <= 1 ? WBRAND.muted2 : WBRAND.ink, display: 'grid', placeItems: 'center', opacity: kgPicked <= 1 ? 0.5 : 1 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
            </button>
            <div style={{ textAlign: 'center', minWidth: 120 }}>
              <div style={{ fontFamily: WFONT, fontSize: 44, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.035em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {kgPicked} <span style={{ fontSize: 22, color: WBRAND.muted, fontWeight: 700 }}>kg</span>
              </div>
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
                Burns {wfmt(kgPicked * 1000, 0)} AHLG · ≈ ${wfmt(kgPicked * 1000 * WRATES.AHLG, 0)}
              </div>
            </div>
            <button onClick={() => setKgPicked(Math.min(maxKg, kgPicked + 1))} disabled={kgPicked >= maxKg} style={{ width: 44, height: 44, borderRadius: 22, background: WBRAND.white, border: `1px solid ${kgPicked >= maxKg ? WBRAND.line : WBRAND.line2}`, cursor: kgPicked >= maxKg ? 'not-allowed' : 'pointer', color: kgPicked >= maxKg ? WBRAND.muted2 : WBRAND.ink, display: 'grid', placeItems: 'center', opacity: kgPicked >= maxKg ? 0.5 : 1 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
            </button>
          </div>

          <div style={{ padding: '10px 14px', background: WBRAND.surface2, borderRadius: 8, fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, lineHeight: 1.5 }}>
            Cast as <strong style={{ color: WBRAND.ink, fontWeight: 700 }}>{kgPicked} × 1 kg bars</strong> · 999.5 fine · Ahlatci Gold Refinery mint
          </div>
        </div>
      </WCard>

      <WCard padding={0}>
        <div style={{ padding: '18px 22px' }}>
          <WEyebrow>Ship to</WEyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
            {addresses.map(a => {
              const on = a.id === addrId;
              return (
                <button key={a.id} onClick={() => setAddrId(a.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', cursor: 'pointer', background: on ? WBRAND.surface : 'transparent', border: `1px solid ${on ? WBRAND.red : 'transparent'}`, borderRadius: 10, textAlign: 'left' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 9, border: `1.5px solid ${on ? WBRAND.red : WBRAND.line2}`, background: on ? WBRAND.red : 'transparent', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    {on && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }}/>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{a.label} · {a.city}</div>
                    <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.line}, {a.country}</div>
                  </div>
                </button>
              );
            })}
            <button style={{ padding: '10px 12px', border: `1px dashed ${WBRAND.line2}`, borderRadius: 10, background: 'transparent', cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {WIcon.plus()} Add new address
            </button>
          </div>
        </div>
      </WCard>

      <WCard padding={0}>
        <div style={{ padding: '16px 22px 8px', borderBottom: `1px solid ${WBRAND.line}` }}>
          <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>Order summary</div>
        </div>
        <div style={{ padding: '4px 22px 8px' }}>
          {[
            { l: 'Bar',               v: `${kgPicked} × 1 kg · 999.5 fine` },
            { l: 'Burned',            v: `${wfmt(kgPicked * 1000, 4)} AHLG` },
            { l: 'Casting',           v: 'Ahlatci Gold Refinery' },
            { l: 'Shipping',          v: 'Brinks · AED 120' },
            { l: 'Insurance',         v: 'Included' },
            { l: 'Estimated arrival', v: '3–5 business days' },
          ].map((r, i, arr) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
              <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>{r.l}</span>
              <span style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink, fontVariantNumeric: 'tabular-nums' }}>{r.v}</span>
            </div>
          ))}
        </div>
      </WCard>

      <WPrimary size="lg" onClick={() => setShipping(true)} style={{ width: '100%', justifyContent: 'center' }}>
        Request {kgPicked} kg delivery
      </WPrimary>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: WBRAND.surface, borderRadius: 10 }}>
        {WIcon.shield(WBRAND.ink)}
        <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.ink, lineHeight: 1.5 }}>
          Bars are cast by Ahlatci Gold Refinery, sealed with tamper-evident packaging, and shipped with a serialised assay certificate. Delivery requires ID verification at the door.
        </div>
      </div>

      {shipping && (
        <RedeemPhysicalModal
          kg={kgPicked}
          addr={addr}
          onClose={() => setShipping(false)}
          onTrack={() => setShipping(false)}
        />
      )}
    </>
  );
}

function RedeemPhysicalModal({ kg, addr, onClose, onTrack }) {
  const STEPS = [
    { id: 'submitted', title: 'Delivery request received', sub: () => `${kg} × 1 kg bar${kg > 1 ? 's' : ''} · ship to ${addr ? addr.label + ', ' + addr.city : 'your address'}` },
    { id: 'handover',  title: 'Handed to carrier',         sub: 'Brinks Secure Logistics · insured in transit' },
    { id: 'burning',   title: 'Burning AHLG',              sub: () => `${wfmt(kg * 1000, 4)} AHLG removed from circulation` },
    { id: 'done',      title: 'Shipped — tracking ready',  sub: 'Your bars are on the way' },
  ];
  const [active, setActive] = useState(0);
  const [stamps, setStamps] = useState({});
  const orderRef = 'PD-' + Math.floor(100000 + Math.random() * 899999);
  const tracking = 'BRX' + Math.floor(100000000 + Math.random() * 899999999) + 'AE';

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
      background: 'rgba(10,10,10,0.42)', display: 'grid', placeItems: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 460, maxWidth: '100%', background: WBRAND.white,
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
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{done ? 'Order shipped' : 'Processing delivery'}</div>
                <div style={{ fontFamily: WFONT, fontSize: 18, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.02em', marginTop: 2 }}>{kg} kg physical gold</div>
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
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: WBRAND.ink, display: 'grid', placeItems: 'center', fontFamily: WFONT, fontWeight: 800, fontSize: 10, color: '#fff', letterSpacing: '0.04em' }}>BRX</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>Brinks Secure Logistics</div>
                    <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 1 }}>Fully insured · signature on delivery</div>
                  </div>
                  <WPill tone="warn">In transit</WPill>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Tracking number</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <WMonoNum size={15} weight={500} style={{ flex: 1 }}>{tracking}</WMonoNum>
                    <WSecondary size="sm" icon={WIcon.copy(WBRAND.ink)}>Copy</WSecondary>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: `1px dashed ${WBRAND.line}` }}>
                    <div>
                      <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Ships to</div>
                      <div style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink, marginTop: 3 }}>{addr ? `${addr.label} · ${addr.city}` : '—'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Est. arrival</div>
                      <div style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink, marginTop: 3 }}>3–5 business days</div>
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
              <WPrimary size="lg" onClick={onTrack} style={{ width: '100%', justifyContent: 'center' }}>Track in Activity</WPrimary>
              <WSecondary size="lg" onClick={onClose} style={{ width: '100%', justifyContent: 'center', height: 52 }}>Done</WSecondary>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '8px 0', fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 600 }}>
              Preparing your shipment — a tracking number will appear here shortly.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function WebRedeem({ navigate, onOpenTx }) {
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
    <div style={{ padding: '28px 32px 48px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <WEyebrow>Redeem AHLG</WEyebrow>
          <h1 style={{ margin: '6px 0 0', fontFamily: WFONT, fontSize: 28, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.025em' }}>Convert gold back to cash or claim physical bars</h1>
          <div style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, marginTop: 6 }}>
            Burn AHLG tokens to receive instant settlement in your Kanzasset balance, or request physical delivery to your address.
          </div>
        </div>
      </div>

      {/* Available to redeem — shared across digital + physical */}
      <div style={{ padding: '20px 24px', marginBottom: 16, background: WBRAND.ink, color: '#fff', borderRadius: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: 120, background: WBRAND.red, opacity: 0.18, filter: 'blur(50px)' }}/>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: WFONT, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>Available to redeem</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 12 }}>
              <span style={{ fontFamily: WFONT, fontWeight: 800, fontSize: 38, color: '#fff', letterSpacing: '-0.035em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{wfmt(WBALANCES.AHLG, 0)}</span>
              <span style={{ fontFamily: WFONT, fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.55)', letterSpacing: '-0.01em' }}>AHLG</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
              <WPill tone="inkInv" style={{ fontSize: 11, padding: '4px 9px', background: 'rgba(255,255,255,0.14)', color: '#fff' }}>{(WBALANCES.AHLG / 1000).toFixed(2)} kg total</WPill>
              <span style={{ fontFamily: WFONT, fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>≈ ${wfmt(WBALANCES.AHLG * WRATES.AHLG)}</span>
            </div>
          </div>
          <AHLGMark size={48}/>
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'inline-grid', gridTemplateColumns: '1fr 1fr', gap: 2, padding: 4, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, borderRadius: 12, width: 480 }}>
          {[
            { id: 'digital',  label: 'Digital',  sub: 'Crypto or fiat · instant' },
            { id: 'physical', label: 'Physical', sub: 'Gold bars · 3–5 days' },
          ].map(t => {
            const on = mode === t.id;
            return (
              <button key={t.id} onClick={() => setMode(t.id)} style={{ padding: '10px 16px', border: 'none', cursor: 'pointer', background: on ? WBRAND.ink : 'transparent', color: on ? '#fff' : WBRAND.ink, borderRadius: 8, textAlign: 'left' }}>
                <div style={{ fontFamily: WFONT, fontWeight: 700, fontSize: 13, letterSpacing: '-0.005em' }}>{t.label}</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: on ? 'rgba(255,255,255,0.65)' : WBRAND.muted, marginTop: 2, fontWeight: 500 }}>{t.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'digital'
            ? <RedeemDigital targets={targets} to={to} setTo={setTo}/>
            : <RedeemPhysicalWeb/>
          }
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <WCard padding={0}>
            <div style={{ padding: '18px 24px 14px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>Your recent redeems</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2 }}>Last 30 days</div>
              </div>
              <button onClick={() => navigate('activity')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.red, display: 'flex', alignItems: 'center', gap: 4 }}>View all {WIcon.arrowRight(WBRAND.red)}</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 110px', gap: 12, padding: '10px 22px', borderBottom: `1px solid ${WBRAND.line}`, background: WBRAND.surface2 }}>
              {['Date', 'Burned', 'Received', 'Rate', 'Status'].map((h, i) => (
                <div key={i} style={{ fontFamily: WFONT, fontSize: 10, fontWeight: 700, color: WBRAND.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
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
                <WPill tone={tx.status === 'completed' ? 'positive' : 'warn'}>{tx.status[0].toUpperCase() + tx.status.slice(1)}</WPill>
              </div>
            ))}
          </WCard>
        </div>
      </div>
    </div>
  );
}
