import { useState, useMemo } from 'react';
import {
  WBRAND, WFONT, wfmt, wparse, wdecimals, wgroup, wregroup,
  WRATES, WBALANCES, WMETA, wMakePriceData,
} from '../lib/index.js';
import { WCoinDot } from './coinicons.jsx';
import { WCard, WNum, WMonoNum, WPrimary, WSecondary } from './primitives.jsx';
import { WPriceChart, WRangeTabs } from './charts.jsx';
import { toast } from './Toast.jsx';
import { useIsMobile, useElementWidth, useElementHeight } from '../lib/useResponsive.js';
import { t } from '../lib/i18n.js';

const STABLE = ['USDT', 'USDC', 'USD'];
// Assets you can swap between — crypto AND fiat (buy gold with AED/USD, etc.).
const swapAssets = () => Object.keys(WRATES);
// Quote-style currencies (fiat + USD stablecoins) sit on the right of a pair.
const isQuoteCcy = (s) => STABLE.includes(s) || WMETA[s]?.kind === 'fiat';

const WMONO_SAFE = `'JetBrains Mono', ui-monospace, monospace`;

// One selectable asset row in the token picker.
function TokenRow({ s, on, onSelect }) {
  const bal = WBALANCES[s] ?? 0;
  return (
    <button onClick={() => onSelect(s)} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 12px', borderRadius: 12, border: 'none',
      background: on ? WBRAND.surface : 'transparent', cursor: 'pointer', textAlign: 'left',
    }}>
      <WCoinDot symbol={s} size={36}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: WFONT, fontSize: 15, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{s}</div>
        <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 1 }}>{t(WMETA[s].name)}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <WMonoNum size={13} color={bal > 0 ? WBRAND.ink : WBRAND.muted2}>{wfmt(bal, wdecimals(s))}</WMonoNum>
        <div style={{ fontFamily: WMONO_SAFE, fontSize: 11, color: WBRAND.muted2, marginTop: 1 }}>${wfmt(bal * WRATES[s], 0)}</div>
      </div>
    </button>
  );
}

// ── Token pill + picker modal (DEX-style, opened from beside the amount) ──
function WTokenSelect({ value, exclude, onChange }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');   // all | crypto | fiat
  const ql = q.toLowerCase();
  const match = (s) => s.toLowerCase().includes(ql) || t(WMETA[s].name).toLowerCase().includes(ql) || WMETA[s].name.toLowerCase().includes(ql);
  const base = swapAssets().filter(s => s !== exclude && match(s));
  const cryptos = base.filter(s => WMETA[s].kind === 'crypto');
  const fiats   = base.filter(s => WMETA[s].kind === 'fiat');
  const cats = [
    { id: 'all',    label: t('All', 'Tümü') },
    { id: 'crypto', label: t('Crypto', 'Kripto') },
    { id: 'fiat',   label: t('Fiat', 'İtibari Para') },
  ];
  const pick = (s) => { onChange(s); setOpen(false); };
  const showCrypto = (cat === 'all' || cat === 'crypto') && cryptos.length > 0;
  const showFiat   = (cat === 'all' || cat === 'fiat')   && fiats.length > 0;

  return (
    <>
      <button onClick={() => { setOpen(true); setQ(''); }} style={{
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
        background: WBRAND.white, border: `1px solid ${WBRAND.line2}`,
        borderRadius: 999, padding: '6px 12px 6px 6px', cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}>
        <WCoinDot symbol={value} size={28}/>
        <span style={{ fontFamily: WFONT, fontWeight: 800, fontSize: 16, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{value}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginLeft: -2 }}><path d="M6 9l6 6 6-6" stroke={WBRAND.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      {open && (
        <div onClick={() => setOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 120, background: 'rgba(10,10,10,0.45)',
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div onClick={e => e.stopPropagation()} className="kz-pop" style={{
            width: 420, maxWidth: '100%', maxHeight: '78vh', background: WBRAND.white,
            borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 64px rgba(0,0,0,0.24)', border: `1px solid ${WBRAND.line}`,
          }}>
            <div style={{ padding: '16px 18px 12px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: WFONT, fontWeight: 800, fontSize: 16, color: WBRAND.ink, letterSpacing: '-0.02em' }}>{t('Select a token', 'Varlık seç')}</span>
              <button onClick={() => setOpen(false)} style={{ background: WBRAND.surface, border: 'none', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', display: 'grid', placeItems: 'center', color: WBRAND.muted }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div style={{ padding: '12px 16px 10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: WBRAND.surface, border: `1px solid ${WBRAND.line}`, borderRadius: 12, padding: '10px 14px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={WBRAND.muted} strokeWidth="1.8"/><path d="M20 20l-3-3" stroke={WBRAND.muted} strokeWidth="1.8" strokeLinecap="round"/></svg>
                <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder={t('Search name or symbol', 'İsim veya sembol ara')} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: WFONT, fontSize: 14, color: WBRAND.ink }}/>
              </div>
              {/* Category tabs */}
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                {cats.map(c => {
                  const on = cat === c.id;
                  return (
                    <button key={c.id} onClick={() => setCat(c.id)} style={{
                      padding: '7px 14px', borderRadius: 999, cursor: 'pointer',
                      border: `1px solid ${on ? WBRAND.ink : WBRAND.line}`,
                      background: on ? WBRAND.ink : WBRAND.white, color: on ? WBRAND.white : WBRAND.muted,
                      fontFamily: WFONT, fontSize: 12.5, fontWeight: 700,
                    }}>{c.label}</button>
                  );
                })}
              </div>
            </div>
            <div style={{ overflowY: 'auto', padding: '0 8px 10px' }}>
              {showCrypto && (
                <>
                  <div style={{ fontFamily: WFONT, fontSize: 10.5, fontWeight: 700, color: WBRAND.muted2, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 12px 4px' }}>{t('Crypto', 'Kripto Para')}</div>
                  {cryptos.map(s => <TokenRow key={s} s={s} on={s === value} onSelect={pick}/>)}
                </>
              )}
              {showFiat && (
                <>
                  <div style={{ fontFamily: WFONT, fontSize: 10.5, fontWeight: 700, color: WBRAND.muted2, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 12px 4px' }}>{t('Fiat', 'İtibari Para')}</div>
                  {fiats.map(s => <TokenRow key={s} s={s} on={s === value} onSelect={pick}/>)}
                </>
              )}
              {!showCrypto && !showFiat && (
                <div style={{ padding: '24px 12px', textAlign: 'center', fontFamily: WFONT, fontSize: 13, color: WBRAND.muted }}>{t('No tokens found', 'Varlık bulunamadı')}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Swap box (Sell / Buy) ──
function SwapBox({ label, symbol, exclude, onPick, amount, onAmount, readOnly, usd, balance, showPct }) {
  return (
    <div style={{ background: WBRAND.surface2, border: `1px solid ${WBRAND.line}`, borderRadius: 16, padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 600, color: WBRAND.muted }}>{label}</span>
        {balance != null && (
          <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted }}>
            {t('Balance', 'Bakiye')}: <WMonoNum size={12} color={WBRAND.ink}>{wfmt(balance, wdecimals(symbol))}</WMonoNum>
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
        {readOnly
          ? <div style={{ flex: 1, fontFamily: WFONT, fontWeight: 700, fontSize: 34, color: amount > 0 ? WBRAND.ink : WBRAND.muted2, letterSpacing: '-0.035em', fontVariantNumeric: 'tabular-nums', minWidth: 0, overflow: 'hidden' }}>{wfmt(amount, wdecimals(symbol))}</div>
          : <input value={amount} onChange={e => onAmount(wregroup(e.target.value))} inputMode="decimal" placeholder="0" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: WFONT, fontWeight: 700, fontSize: 34, color: WBRAND.ink, letterSpacing: '-0.035em', width: 0, minWidth: 0, fontVariantNumeric: 'tabular-nums' }}/>}
        <WTokenSelect value={symbol} exclude={exclude} onChange={onPick}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, minHeight: 24 }}>
        <span style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted2, fontVariantNumeric: 'tabular-nums' }}>${wfmt(usd, 2)}</span>
        {showPct && (
          <div style={{ display: 'flex', gap: 6 }}>
            {[25, 50, 75].map(p => (
              <button key={p} onClick={() => onAmount(wgroup(String((balance || 0) * p / 100)))} style={{ background: WBRAND.white, border: `1px solid ${WBRAND.line}`, cursor: 'pointer', padding: '4px 10px', borderRadius: 7, fontFamily: WFONT, fontSize: 11, fontWeight: 600, color: WBRAND.ink }}>{p}%</button>
            ))}
            <button onClick={() => onAmount(wgroup(String(balance || 0)))} style={{ background: WBRAND.redSoft, border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: 7, fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.red }}>{t('MAX', 'MAKS')}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Small ⓘ that reveals an explanatory tooltip on hover / tap.
function InfoDot({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button onClick={() => setOpen(o => !o)} aria-label="info" style={{ width: 15, height: 15, borderRadius: 8, border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', color: WBRAND.muted2, display: 'grid', placeItems: 'center' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7"/><path d="M12 11v5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/><circle cx="12" cy="7.6" r="1.1" fill="currentColor"/></svg>
      </button>
      {open && (
        <span style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: -8, width: 232, zIndex: 60, background: WBRAND.panel, color: '#fff', padding: '10px 12px', borderRadius: 10, fontFamily: WFONT, fontSize: 11.5, lineHeight: 1.55, fontWeight: 500, boxShadow: '0 10px 30px rgba(0,0,0,0.24)', pointerEvents: 'none' }}>
          {text}
          <span style={{ position: 'absolute', top: '100%', left: 12, marginTop: -4, width: 8, height: 8, background: WBRAND.panel, transform: 'rotate(45deg)' }}/>
        </span>
      )}
    </span>
  );
}

// One label/value row inside the order-details panel.
function DRow({ label, info, hint, children, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: last ? 'none' : `1px dashed ${WBRAND.line}` }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>{label}</span>
          {info && <InfoDot text={info}/>}
        </div>
        {hint && <div style={{ fontFamily: WFONT, fontSize: 10.5, color: WBRAND.muted2, marginTop: 1 }}>{hint}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>{children}</div>
    </div>
  );
}

// Max-slippage picker modal (preset cards + custom value).
function SlippageModal({ value, onClose, onSave }) {
  const presets = ['0.5', '1.0', '2.0'];
  const known = presets.includes(String(value));
  const [sel, setSel] = useState(known ? String(value) : null);
  const [custom, setCustom] = useState(known ? '' : String(value));
  const effective = custom.trim() !== '' ? custom.trim() : sel;
  const num = parseFloat(effective);
  const valid = !isNaN(num) && num >= 0.2 && num <= 5.0;

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 130, background: 'rgba(10,10,10,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} className="kz-pop" style={{ width: 440, maxWidth: '100%', background: WBRAND.white, borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.24)', border: `1px solid ${WBRAND.line}` }}>
        <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: WFONT, fontWeight: 800, fontSize: 17, color: WBRAND.ink, letterSpacing: '-0.02em' }}>{t('Max slippage', 'Maks. kayma')}</span>
          <button onClick={onClose} style={{ background: WBRAND.surface, border: 'none', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', display: 'grid', placeItems: 'center', color: WBRAND.muted }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div style={{ padding: '18px 20px 8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {presets.map(p => {
              const on = sel === p && custom.trim() === '';
              return (
                <button key={p} onClick={() => { setSel(p); setCustom(''); }} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '13px 14px', cursor: 'pointer',
                  border: `1.5px solid ${on ? WBRAND.red : WBRAND.line2}`, borderRadius: 12,
                  background: on ? WBRAND.redSoft : WBRAND.white,
                }}>
                  <span style={{ width: 16, height: 16, borderRadius: 8, border: `2px solid ${on ? WBRAND.red : WBRAND.muted2}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    {on && <span style={{ width: 8, height: 8, borderRadius: 4, background: WBRAND.red }}/>}
                  </span>
                  <span style={{ fontFamily: WFONT, fontSize: 14, fontWeight: 700, color: WBRAND.ink }}>{parseFloat(p)}%</span>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, border: `1.5px solid ${custom.trim() !== '' ? (valid ? WBRAND.red : WBRAND.red) : WBRAND.line}`, borderRadius: 12, padding: '12px 16px', background: WBRAND.surface2 }}>
            <input value={custom} onChange={e => { setCustom(e.target.value.replace(/[^0-9.]/g, '')); setSel(null); }} inputMode="decimal" placeholder="0.2 - 5.0" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: WFONT, fontSize: 16, fontWeight: 600, color: WBRAND.ink }}/>
            <span style={{ fontFamily: WFONT, fontSize: 15, fontWeight: 700, color: WBRAND.muted }}>%</span>
          </div>
          {custom.trim() !== '' && !valid && (
            <div style={{ fontFamily: WFONT, fontSize: 11.5, color: WBRAND.red, marginTop: 6 }}>{t('Enter a value between 0.2 and 5.0', '0.2 ile 5.0 arasında bir değer gir')}</div>
          )}

          <p style={{ fontFamily: WFONT, fontSize: 12.5, lineHeight: 1.6, color: WBRAND.muted, marginTop: 14 }}>
            {t('Max slippage is the largest difference you will accept between the execution price and the current estimated price. A higher slippage makes it more likely your order fills.',
               'Maks. kayma, işlem fiyatı ile mevcut tahmini fiyat arasında kabul edeceğin en yüksek farktır. Kayma ne kadar yüksekse, emrinin gerçekleşme olasılığı o kadar artar.')}
          </p>
        </div>

        <div style={{ padding: '8px 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <WSecondary size="lg" onClick={onClose} style={{ justifyContent: 'center', height: 50 }}>{t('Cancel', 'Vazgeç')}</WSecondary>
          <WPrimary size="lg" onClick={() => { if (valid) { onSave(String(num)); onClose(); } }} disabled={!valid} style={{ justifyContent: 'center' }}>{t('OK', 'Tamam')}</WPrimary>
        </div>
      </div>
    </div>
  );
}

// Generalised DEX-style swap: pick any token on either side, amount beside each.
export function WExchangePanel() {
  const mobile = useIsMobile();
  const [gridRef, gw] = useElementWidth();
  // Side-by-side only when the chart would still get a usable width; otherwise
  // stack and cap the swap card so it never stretches across a wide row.
  const twoCol = !mobile && (gw === 0 || gw >= 900);
  const paneW = twoCol ? Math.max(0, gw - 500) : Math.min(gw || 9999, 520);
  const ohlc2 = paneW > 0 && paneW < 430;

  const [from, setFrom] = useState('USDT');   // you sell / pay
  const [to, setTo]     = useState('AGOLD');  // you buy / receive
  const [amount, setAmount] = useState('');
  const [range, setRange] = useState('3M');
  const [slippage, setSlippage] = useState('0.5');   // % max slippage
  const [slipOpen, setSlipOpen] = useState(false);

  const pickFrom = (s) => { if (s === to) setTo(from); setFrom(s); };
  const pickTo   = (s) => { if (s === from) setFrom(to); setTo(s); };
  const flip = () => { setFrom(to); setTo(from); setAmount(''); };

  const amt = wparse(amount);
  const out = (WRATES[from] && WRATES[to]) ? amt * WRATES[from] / WRATES[to] : 0;
  const payBalance = WBALANCES[from] ?? 0;
  const insufficient = amt > payBalance + 1e-9;
  const canSubmit = out > 0 && !insufficient;

  // Currency fee: charged only when paying with a non-base currency (base = USD stablecoins).
  const currencyFeePct = STABLE.includes(from) ? 0 : 0.10;
  const slip = parseFloat(slippage) || 0;
  const minReceived = out * (1 - slip / 100);

  // Chart: put the crypto asset on top and the fiat/stable quote below, so a
  // pair like AGOLD/AED reads as a market even when you pay with the fiat side.
  let cBase = from, cQuote = to;
  if (isQuoteCcy(from) && !isQuoteCcy(to)) { cBase = to; cQuote = from; }
  const rate = WRATES[cBase] / WRATES[cQuote];
  const isFiatQuote = STABLE.includes(cQuote);
  const px = (v, d = 2) => `${isFiatQuote ? '$' : ''}${wfmt(v, d)}${isFiatQuote ? '' : ' ' + cQuote}`;

  const chartData = useMemo(() => {
    const shape = wMakePriceData(90);
    const k = rate / 135.82;
    return shape.map(d => ({ t: d.t, v: d.v * k }));
  }, [rate]);
  const spot = rate;
  const first = chartData[0].v;
  const diff = spot - first;
  const pct = first ? (diff / first) * 100 : 0;
  const vals = chartData.map(d => d.v);
  const openV = vals[0], high = Math.max(...vals), low = Math.min(...vals);

  // Side-by-side: the chart plot is absolutely positioned inside a flex:1 area,
  // so its size never feeds back into layout — the SWAP card alone drives the
  // shared height and the chart just fills it (header top, OHLC bottom). The
  // -30 accounts for the plot inset. Stacked/mobile: fixed, comfortable height.
  const [chartRef, chartH] = useElementHeight();
  const chartHeight = twoCol ? Math.max(180, (chartH || 0) - 30) : (mobile ? 220 : 300);

  const submit = () => {
    if (!canSubmit) return;
    toast(`${wfmt(out, wdecimals(to))} ${to}`, { title: `${t('Buy', 'Al')} · ${from} → ${to}`, tone: 'success' });
    setAmount('');
  };

  return (
    <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: twoCol ? '480px minmax(0, 1fr)' : '1fr', gap: mobile ? 14 : 20, alignItems: twoCol ? 'stretch' : 'start', marginBottom: mobile ? 14 : 20 }}>

      {/* ── Left: swap card ─────────────────────────────── */}
      <WCard padding={0} style={{ minWidth: 0, width: '100%', maxWidth: twoCol ? 'none' : 520, justifySelf: twoCol ? 'stretch' : 'center', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: mobile ? '16px 16px 18px' : '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', flex: 1 }}>

          {/* Sell / Buy boxes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <SwapBox
            label={t('Sell', 'Satıyorsun')} symbol={from} exclude={to} onPick={pickFrom}
            amount={amount} onAmount={setAmount} balance={payBalance}
            usd={amt * WRATES[from]} showPct
          />

          {/* Flip */}
          <div style={{ position: 'relative', height: 0, display: 'flex', justifyContent: 'center', zIndex: 2 }}>
            <button onClick={flip} title={t('Switch direction', 'Yönü değiştir')} style={{ position: 'absolute', top: -20, width: 40, height: 40, borderRadius: 12, background: WBRAND.white, border: `4px solid ${WBRAND.white}`, outline: `1px solid ${WBRAND.line}`, display: 'grid', placeItems: 'center', cursor: 'pointer', padding: 0, color: WBRAND.ink, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4v16m0 0l-5-5m5 5l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          <SwapBox
            label={t('Buy', 'Alıyorsun')} symbol={to} exclude={from} onPick={pickTo}
            amount={out} readOnly usd={out * WRATES[to]} balance={WBALANCES[to] ?? 0}
          />
          </div>

          {/* Order details — natural height with consistent row spacing */}
          <div style={{ marginTop: 8, background: WBRAND.surface2, border: `1px solid ${WBRAND.line}`, borderRadius: 14, padding: '4px 16px 6px' }}>
            <DRow label={t('Estimated price', 'Tahmini fiyat')}
              info={t('The current estimated market price. Your order is calculated from this and may move slightly at the moment of execution.',
                      'Şu anki tahmini piyasa fiyatı. Emrin bu fiyat baz alınarak hesaplanır ve gerçekleşme anında hafifçe değişebilir.')}>
              <span style={{ fontFamily: WFONT, fontSize: 12.5, fontWeight: 600, color: WBRAND.ink, fontVariantNumeric: 'tabular-nums' }}>1 {cBase} = {wfmt(rate, wdecimals(cQuote))} {cQuote}</span>
            </DRow>
            <DRow label={t('Max slippage', 'Maks. kayma')}
              info={t('The largest difference you will accept between the execution price and the estimated price. If the price moves more than this, your order will not go through.',
                      'İşlem fiyatı ile tahmini fiyat arasında kabul edeceğin en yüksek fark. Fiyat bundan fazla oynarsa emrin gerçekleşmez.')}>
              <span style={{ fontFamily: WFONT, fontSize: 12.5, fontWeight: 700, color: WBRAND.ink, fontVariantNumeric: 'tabular-nums' }}>{parseFloat(slippage)}%</span>
              <button onClick={() => setSlipOpen(true)} style={{ border: 'none', background: WBRAND.redSoft, color: WBRAND.red, cursor: 'pointer', padding: '3px 10px', borderRadius: 7, fontFamily: WFONT, fontSize: 11, fontWeight: 700 }}>{t('Edit', 'Düzenle')}</button>
            </DRow>
            <DRow label={t('Minimum received', 'En az alınacak')}
              info={t('The least you are guaranteed to receive after your slippage tolerance is applied.',
                      'Kayma toleransın uygulandıktan sonra eline geçmesi garanti edilen en düşük miktar.')}>
              <span style={{ fontFamily: WFONT, fontSize: 12.5, fontWeight: 600, color: WBRAND.ink, fontVariantNumeric: 'tabular-nums' }}>{wfmt(minReceived, wdecimals(to))} {to}</span>
            </DRow>
            <DRow label={t('Trade fee', 'İşlem ücreti')} last={currencyFeePct === 0}
              info={t('The fee Kanzasset charges per trade. Currently waived as a promotion.',
                      'Kanzasset’in işlem başına aldığı ücret. Şu an promosyonel olarak ücretsiz.')}>
              <span style={{ fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.positive, background: 'rgba(15,122,71,0.10)', padding: '2px 8px', borderRadius: 6 }}>{t('Free', 'Ücretsiz')}</span>
            </DRow>
            {currencyFeePct > 0 && (
              <DRow label={t('Currency fee', 'Kur ücreti')} hint={t('Non-base currency', 'Baz dışı para birimi')} last
                info={t('A conversion fee applied when you pay with an asset other than a base currency (USD stablecoins).',
                        'Baz para birimi (USD stablecoin) dışında bir varlıkla ödeme yaptığında uygulanan dönüşüm ücreti.')}>
                <span style={{ fontFamily: WFONT, fontSize: 12.5, fontWeight: 600, color: WBRAND.ink, fontVariantNumeric: 'tabular-nums' }}>%{wfmt(currencyFeePct, 2)}</span>
              </DRow>
            )}
          </div>

          <WPrimary size="lg" tone="green" onClick={submit} disabled={!canSubmit} style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>
            {insufficient ? `${t('Insufficient balance', 'Yetersiz bakiye')}` : (amt > 0 ? `${to} ${t('Buy', 'Al')}` : t('Enter an amount', 'Tutar gir'))}
          </WPrimary>
        </div>
      </WCard>

      {/* ── Right: chart ───────────────────────────────── */}
      <WCard padding={0} style={{ minWidth: 0, ...(twoCol ? { display: 'flex', flexDirection: 'column' } : {}) }}>
        <div style={{ flexShrink: 0, padding: mobile ? '14px 16px 12px' : '18px 24px 14px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <WCoinDot symbol={cBase} size={22}/>
              <div style={{ fontFamily: WFONT, fontSize: 14, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{cBase} / {cQuote}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
              <WNum size={26} weight={800} style={{ letterSpacing: '-0.025em' }}>{px(spot)}</WNum>
              <span style={{ fontFamily: WFONT, fontSize: 13, color: pct >= 0 ? WBRAND.positive : WBRAND.red, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                {pct >= 0 ? '+' : ''}{wfmt(diff, 2)} ({pct >= 0 ? '+' : ''}{wfmt(pct, 2)}%)
              </span>
            </div>
          </div>
          <WRangeTabs value={range} onChange={setRange}/>
        </div>
        <div ref={chartRef} style={{ position: 'relative', ...(twoCol ? { flex: 1, minHeight: 0 } : { padding: '12px 16px 18px' }) }}>
          <div style={twoCol ? { position: 'absolute', top: 12, left: 16, right: 16, bottom: 18 } : undefined}>
            <WPriceChart data={chartData} height={chartHeight} color={WBRAND.red}/>
          </div>
        </div>
        <div style={{ flexShrink: 0, display: 'grid', gridTemplateColumns: ohlc2 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', borderTop: `1px solid ${WBRAND.line}` }}>
          {[
            { l: t('Open', 'Açılış'), v: px(openV) },
            { l: t('High', 'En yüksek'), v: px(high) },
            { l: t('Low', 'En düşük'),  v: px(low) },
            { l: t('Volume 24h', '24s hacim'), v: '$8.41M' },
          ].map((k, i) => (
            <div key={i} style={{ padding: '12px 20px', borderRight: (ohlc2 ? i % 2 === 0 : i < 3) ? `1px solid ${WBRAND.line}` : 'none', borderTop: ohlc2 && i >= 2 ? `1px solid ${WBRAND.line}` : 'none' }}>
              <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{k.l}</div>
              <WMonoNum size={14} style={{ marginTop: 4, display: 'block' }}>{k.v}</WMonoNum>
            </div>
          ))}
        </div>
      </WCard>

      {slipOpen && <SlippageModal value={slippage} onClose={() => setSlipOpen(false)} onSave={setSlippage}/>}
    </div>
  );
}
