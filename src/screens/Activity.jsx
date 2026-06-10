import { useState, useMemo } from 'react';
import { WBRAND, WFONT, wfmt, wdecimals, WRATES, WTXS } from '../lib/index.js';
import { WIcon } from '../components/icons.jsx';
import { WCard, WSecondary, WGhost, WEyebrow, WNum } from '../components/primitives.jsx';
import { WRangeTabs } from '../components/charts.jsx';
import { WTxRow } from '../components/shared.jsx';
import { t } from '../lib/i18n.js';
import { useIsMobile } from '../lib/useResponsive.js';

function FilterDropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        height: 36, padding: '0 12px', borderRadius: 8,
        background: value === 'All' ? WBRAND.white : WBRAND.surface,
        border: `1px solid ${value === 'All' ? WBRAND.line2 : WBRAND.ink}`,
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink,
      }}>
        <span style={{ color: WBRAND.muted }}>{t(label)}:</span>
        <span>{t(value)}</span>
        {WIcon.arrowDown(WBRAND.muted)}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }}/>
          <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, borderRadius: 10, padding: 4, minWidth: 160, zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
            {options.map(o => (
              <button key={o} onClick={() => { onChange(o); setOpen(false); }} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: 'none', background: o === value ? WBRAND.surface : 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: WFONT, fontSize: 12, fontWeight: o === value ? 700 : 500, color: WBRAND.ink, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {t(o)}
                {o === value && WIcon.check(WBRAND.ink)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FilterChip({ label, onClear }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: WBRAND.surface, padding: '4px 4px 4px 10px', borderRadius: 6, fontFamily: WFONT, fontSize: 11, fontWeight: 600, color: WBRAND.ink }}>
      {label}
      <button onClick={onClear} style={{ width: 18, height: 18, borderRadius: 4, border: 'none', background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center', color: WBRAND.muted }}>
        <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
      </button>
    </span>
  );
}

export function WebActivity({ navigate, onOpenTx }) {
  const mobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [assetFilter, setAssetFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [range, setRange] = useState('30D');

  const filtered = useMemo(() => {
    return WTXS.filter(tx => {
      if (typeFilter !== 'All' && tx.type !== typeFilter) return false;
      if (assetFilter !== 'All' && tx.asset !== assetFilter) return false;
      if (statusFilter !== 'All' && tx.status !== statusFilter.toLowerCase()) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!tx.id.toLowerCase().includes(q) && !tx.type.toLowerCase().includes(q) && !tx.asset.toLowerCase().includes(q) && !String(tx.paid).toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, typeFilter, assetFilter, statusFilter]);

  const totalMints    = WTXS.filter(t => t.type === 'Mint').reduce((s, t) => s + t.amount, 0);
  const totalRedeems  = Math.abs(WTXS.filter(t => t.type === 'Redeem').reduce((s, t) => s + t.amount, 0));
  const totalDeposits = WTXS.filter(t => t.type === 'Deposit').length;
  const totalWithdrws = WTXS.filter(t => t.type === 'Withdraw').length;

  const hasFilters = typeFilter !== 'All' || assetFilter !== 'All' || statusFilter !== 'All' || search;

  return (
    <div style={{ padding: mobile ? '18px 16px 40px' : '28px 32px 48px', overflowY: 'auto', overflowX: 'hidden', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: mobile ? 12 : 16, marginBottom: 20 }}>
        {[
          { l: 'Total minted',   v: `${wfmt(totalMints, 4)} AHLG`,   sub: `≈ $${wfmt(totalMints * WRATES.AHLG)}` },
          { l: 'Total redeemed', v: `${wfmt(totalRedeems, 4)} AHLG`, sub: `≈ $${wfmt(totalRedeems * WRATES.AHLG)}` },
          { l: 'Deposits',       v: String(totalDeposits),            sub: t('past 30 days') },
          { l: 'Withdrawals',    v: String(totalWithdrws),            sub: t('past 30 days') },
        ].map((k, i) => (
          <WCard key={i} padding={20} style={{ minWidth: 0 }}>
            <WEyebrow>{t(k.l)}</WEyebrow>
            <WNum size={26} weight={800} style={{ marginTop: 6, display: 'block', letterSpacing: '-0.025em' }}>{k.v}</WNum>
            <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 4, fontWeight: 500 }}>{k.sub}</div>
          </WCard>
        ))}
      </div>

      <WCard padding={0}>
        <div style={{ padding: '14px 22px', borderBottom: `1px solid ${WBRAND.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ height: 36, flex: '1 1 260px', minWidth: 240, maxWidth: 320, background: WBRAND.surface, borderRadius: 8, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              {WIcon.search()}
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('Search by ID, asset, counterparty…')} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: WFONT, fontSize: 13, color: WBRAND.ink }}/>
            </div>
            <FilterDropdown label="Type"   value={typeFilter}   options={['All', 'Mint', 'Redeem', 'Deposit', 'Withdraw', 'Delivery']}  onChange={setTypeFilter}/>
            <FilterDropdown label="Asset"  value={assetFilter}  options={['All', 'AHLG', 'USDT', 'USDC', 'AED', 'USD', 'EUR', 'GBP']}   onChange={setAssetFilter}/>
            <FilterDropdown label="Status" value={statusFilter} options={['All', 'Completed', 'Pending', 'Failed']}                      onChange={setStatusFilter}/>
            <div style={{ flex: 1 }}/>
            <WRangeTabs value={range} onChange={setRange} options={['7D', '30D', '90D', '1Y', 'ALL']}/>
          </div>

          {hasFilters && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{t('Active filters')}</span>
              {search && <FilterChip label={`"${search}"`} onClear={() => setSearch('')}/>}
              {typeFilter !== 'All' && <FilterChip label={`${t('Type')}: ${t(typeFilter)}`} onClear={() => setTypeFilter('All')}/>}
              {assetFilter !== 'All' && <FilterChip label={`${t('Asset')}: ${assetFilter}`} onClear={() => setAssetFilter('All')}/>}
              {statusFilter !== 'All' && <FilterChip label={`${t('Status')}: ${t(statusFilter)}`} onClear={() => setStatusFilter('All')}/>}
              <button onClick={() => { setSearch(''); setTypeFilter('All'); setAssetFilter('All'); setStatusFilter('All'); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.red }}>{t('Clear all')}</button>
            </div>
          )}
        </div>

        <div style={{ padding: '12px 22px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: WBRAND.surface2, flexWrap: mobile ? 'wrap' : 'nowrap', gap: mobile ? 8 : 0 }}>
          <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>
            {t('Showing')} <span style={{ color: WBRAND.ink, fontWeight: 700 }}>{filtered.length}</span> {t('of')} {WTXS.length} {t('transactions')}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              <WGhost>{t('Newest')}</WGhost>
              <WGhost active>{t('Date')} ↓</WGhost>
              <WGhost>{t('Amount')}</WGhost>
            </div>
            <span style={{ width: 1, height: 18, background: WBRAND.line }}/>
            <WSecondary size="sm" icon={WIcon.download(WBRAND.ink)}>{t('Export CSV')}</WSecondary>
            <WSecondary size="sm" icon={WIcon.download(WBRAND.ink)}>{t('Export PDF')}</WSecondary>
          </div>
        </div>

        <div style={{ overflowX: mobile ? 'auto' : 'visible', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ minWidth: mobile ? 720 : 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1.2fr 1fr 1.2fr 1.2fr 1fr 110px', gap: 12, padding: '10px 22px', borderBottom: `1px solid ${WBRAND.line}`, background: WBRAND.surface2 }}>
          {['', 'Type', 'Asset', 'Amount', 'Counterparty', 'Date', 'Status'].map((h, i) => (
            <div key={i} style={{ fontFamily: WFONT, fontSize: 10, fontWeight: 700, color: WBRAND.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h ? t(h) : h}</div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '52px 22px 56px', textAlign: 'center' }}>
            {/* Magnifier over a gold coin */}
            <svg width="84" height="84" viewBox="0 0 84 84" fill="none" style={{ display: 'block', margin: '0 auto' }}>
              <circle cx="38" cy="36" r="13" fill="#F6D77B"/>
              <circle cx="38" cy="36" r="13" stroke="#C9962F" strokeWidth="2"/>
              <circle cx="38" cy="36" r="8.5" stroke="#C9962F" strokeWidth="1.4" strokeDasharray="2.5 2.5"/>
              <text x="38" y="40.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="#A8761B" fontFamily="sans-serif">₺</text>
              <circle cx="42" cy="40" r="22" stroke={WBRAND.muted2} strokeWidth="3.2"/>
              <path d="M58 56l12 12" stroke={WBRAND.muted2} strokeWidth="5" strokeLinecap="round"/>
              <path d="M30 30c2-4 6-6.5 10.5-6.5" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div style={{ fontFamily: WFONT, fontSize: 15, fontWeight: 800, color: WBRAND.ink, marginTop: 14, letterSpacing: '-0.01em' }}>{t('No transactions match the current filters.')}</div>
            <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 6 }}>{t('Try widening the date range or clearing a filter.')}</div>
            <button onClick={() => { setSearch(''); setTypeFilter('All'); setAssetFilter('All'); setStatusFilter('All'); }} style={{ marginTop: 16, height: 36, padding: '0 16px', borderRadius: 8, background: WBRAND.redSoft, color: WBRAND.red, border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 700 }}>
              {t('Clear all')}
            </button>
          </div>
        ) : filtered.map((tx, i) => <WTxRow key={tx.id} tx={tx} last={i === filtered.length - 1} onOpen={onOpenTx}/>)}
        </div>
        </div>

        <div style={{ padding: '14px 22px', borderTop: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: mobile ? 'wrap' : 'nowrap', gap: mobile ? 12 : 0 }}>
          <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted }}>{t('Page')} 1 {t('of')} 8 · 120 {t('total')}</span>
          <div style={{ display: 'flex', gap: 6, flexWrap: mobile ? 'wrap' : 'nowrap', justifyContent: mobile ? 'center' : 'flex-start', width: mobile ? '100%' : 'auto' }}>
            <WSecondary size="sm">← {t('Previous')}</WSecondary>
            {[1, 2, 3, 4].map(p => (
              <button key={p} style={{ width: 32, height: 32, borderRadius: 8, background: p === 1 ? WBRAND.panel : WBRAND.white, color: p === 1 ? '#fff' : WBRAND.ink, border: `1px solid ${p === 1 ? WBRAND.panel : WBRAND.line}`, cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 700 }}>{p}</button>
            ))}
            <span style={{ display: 'grid', placeItems: 'center', padding: '0 4px', fontFamily: WFONT, fontSize: 12, color: WBRAND.muted }}>…</span>
            <button style={{ width: 32, height: 32, borderRadius: 8, background: WBRAND.white, color: WBRAND.ink, border: `1px solid ${WBRAND.line}`, cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 700 }}>8</button>
            <WSecondary size="sm">{t('Next')} →</WSecondary>
          </div>
        </div>
      </WCard>
    </div>
  );
}
