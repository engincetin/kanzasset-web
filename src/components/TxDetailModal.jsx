import { WBRAND, WFONT, WMONO, wfmt, wdecimals, wHasTracking, wTracking, DELIVERY_STAGES } from '../lib/index.js';
import { t } from '../lib/i18n.js';
import { useIsMobile } from '../lib/useResponsive.js';
import { WIcon } from './icons.jsx';
import { WCoinDot } from './coinicons.jsx';
import { WPill, WPrimary, WSecondary, WMonoNum, WCopyButton } from './primitives.jsx';

// Per-type metadata for the detail view
export function txMeta(tx) {
  const pos = tx.amount > 0;
  const date = tx.ts.slice(0, 10);
  const time = tx.ts.slice(11, 19);
  const base = {
    Mint:     { title: 'Mint AGOLD',   network: 'Ethereum · ERC-20', counterLabel: 'Paid' },
    Redeem:   { title: 'Redeem AGOLD', network: 'Ethereum · ERC-20', counterLabel: 'Received' },
    Deposit:  { title: 'Deposit',     network: ['AED', 'USD', 'EUR', 'GBP'].includes(tx.asset) ? 'Bank wire · SWIFT' : 'Ethereum · ERC-20', counterLabel: 'Source' },
    Withdraw: { title: 'Withdraw',    network: 'Bank wire · SWIFT', counterLabel: 'Destination' },
    Transfer: { title: 'Transfer',    network: 'Kanzasset internal', counterLabel: 'Counterparty' },
    Delivery: { title: 'Physical delivery', network: "Brink's secure logistics", counterLabel: 'Destination' },
  }[tx.type] || { title: tx.type, network: '—', counterLabel: 'Detail' };
  return { ...base, pos, date, time };
}

export function WTxDetailModal({ tx, onClose, onSupport }) {
  const mobile = useIsMobile();
  if (!tx) return null;
  const m = txMeta(tx);
  const isDelivery = tx.type === 'Delivery';
  const hasTracking = isDelivery && wHasTracking(tx.stage);
  const rows = isDelivery
    ? [
        { l: 'Transaction ID', v: tx.id, mono: true },
        { l: 'Amount', v: `${wfmt(Math.abs(tx.amount), wdecimals(tx.asset))} ${tx.asset}` },
        { l: 'Destination', v: tx.paid && tx.paid !== '—' ? tx.paid : '—' },
        { l: 'Carrier', v: 'Brinks Secure Logistics' },
        { l: 'Date & time', v: `${m.date} · ${m.time}` },
      ]
    : [
        { l: 'Transaction ID', v: tx.id, mono: true },
        { l: m.counterLabel, v: tx.paid && tx.paid !== '—' ? tx.paid : m.network },
        { l: 'Network', v: m.network },
        { l: 'Date & time', v: `${m.date} · ${m.time}` },
        { l: 'Network fee', v: tx.type === 'Mint' || tx.type === 'Redeem' ? 'Covered by Kanzasset' : (tx.type === 'Transfer' ? 'Free' : '—') },
      ];

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(10,10,10,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: mobile ? 12 : 24,
    }}>
      <div onClick={e => e.stopPropagation()} className="kz-pop" style={{
        width: mobile ? '100%' : 460, maxWidth: '100%', boxSizing: 'border-box', background: WBRAND.white,
        borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
        maxHeight: '88vh', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: mobile ? '18px 16px 14px' : '22px 24px 18px', borderBottom: `1px solid ${WBRAND.line}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <WCoinDot symbol={tx.asset} size={40}/>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t(m.title)}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 3 }}>
                  <span style={{ fontFamily: WFONT, fontSize: 22, fontWeight: 800, color: m.pos ? WBRAND.positive : WBRAND.ink, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                    {m.pos ? '+' : ''}{wfmt(tx.amount, wdecimals(tx.asset))}
                  </span>
                  <span style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, fontWeight: 700 }}>{tx.asset}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 30, height: 30, borderRadius: 8, border: 'none', flexShrink: 0,
              background: WBRAND.surface, cursor: 'pointer', color: WBRAND.ink, display: 'grid', placeItems: 'center',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div style={{ marginTop: 14 }}>
            {isDelivery
              ? (() => { const st = DELIVERY_STAGES[tx.stage] || DELIVERY_STAGES.processing; return (
                  <WPill tone={st.tone}>{st.tone === 'positive' && WIcon.check(WBRAND.positive)}{t(st.en, st.tr)}</WPill>
                ); })()
              : (
                <WPill tone={tx.status === 'completed' ? 'positive' : tx.status === 'pending' ? 'warn' : 'negative'}>
                  {tx.status === 'completed' && WIcon.check(WBRAND.positive)}
                  {t(tx.status[0].toUpperCase() + tx.status.slice(1))}
                </WPill>
              )}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <div style={{ padding: mobile ? '4px 16px 8px' : '4px 24px 8px' }}>
            {rows.map((r, i, arr) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
                padding: '13px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}`,
              }}>
                <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500, flexShrink: 0 }}>{t(r.l)}</span>
                <span style={{ fontFamily: r.mono ? WMONO : WFONT, fontSize: r.mono ? 12 : 13, fontWeight: 600, color: WBRAND.ink, textAlign: 'right', wordBreak: 'break-all' }}>{t(r.v)}</span>
              </div>
            ))}
          </div>

          {isDelivery && (
            <div style={{ padding: mobile ? '4px 16px 16px' : '4px 24px 18px' }}>
              <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{t('Tracking number')}</div>
              {hasTracking ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: WBRAND.surface, borderRadius: 10 }}>
                  <WMonoNum size={13} weight={500} style={{ flex: 1, minWidth: 0, wordBreak: 'break-all' }}>{wTracking(tx.id)}</WMonoNum>
                  <WCopyButton text={wTracking(tx.id)}/>
                </div>
              ) : (
                <div style={{ padding: '10px 12px', background: WBRAND.surface, borderRadius: 10, fontFamily: WFONT, fontSize: 12.5, color: WBRAND.muted }}>{t('Created once shipped', 'Kargoya verilince oluşur')}</div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: mobile ? '14px 16px 16px' : '16px 24px 20px', borderTop: `1px solid ${WBRAND.line}`, flexShrink: 0, display: 'flex', gap: 8 }}>
          <WSecondary size="lg" onClick={onClose} style={{ flex: 1, justifyContent: 'center', height: 50 }}>{t('Close')}</WSecondary>
          <WPrimary size="lg" onClick={() => onSupport(tx)} style={{ flex: 1, justifyContent: 'center' }}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" stroke={WBRAND.onBrand} strokeWidth="1.7" strokeLinejoin="round"/></svg>}>
            {t('Get help')}
          </WPrimary>
        </div>
      </div>
    </div>
  );
}
