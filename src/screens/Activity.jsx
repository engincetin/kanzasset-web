import { useState, useMemo } from 'react';
import { WBRAND, WFONT, wfmt, wdecimals, WRATES, WTXS } from '../lib/index.js';
import { WIcon } from '../components/icons.jsx';
import { WCard, WSecondary, WGhost, WEyebrow, WNum } from '../components/primitives.jsx';
import { WRangeTabs } from '../components/charts.jsx';
import { WTxRow } from '../components/shared.jsx';

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
        <span style={{ color: WBRAND.muted }}>{label}:</span>
        <span>{value}</span>
        {WIcon.arrowDown(WBRAND.muted)}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }}/>
          <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, borderRadius: 10, padding: 4, minWidth: 160, zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
            {options.map(o => (
              <button key={o} onClick={() => { onChange(o); setOpen(false); }} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: 'none', background: o === value ? WBRAND.surface : 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: WFONT, fontSize: 12, fontWeight: o === value ? 700 : 500, color: WBRAND.ink, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {o}
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

export function WebActivity({ navigate }) {
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
    <div style={{ padding: '28px 32px 48px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <WEyebrow>Activity</WEyebrow>
          <h1 style={{ margin: '6px 0 0', fontFamily: WFONT, fontSize: 28, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.025em' }}>All transactions</h1>
          <div style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, marginTop: 6 }}>
            Full record of mints, redeems, deposits, withdrawals and transfers. Export to CSV or PDF for accounting.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <WSecondary size="md" icon={WIcon.download(WBRAND.ink)}>Export CSV</WSecondary>
          <WSecondary size="md" icon={WIcon.download(WBRAND.ink)}>Export PDF</WSecondary>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { l: 'Total minted',   v: `${wfmt(totalMints, 4)} AHLG`,   sub: `≈ $${wfmt(totalMints * WRATES.AHLG)}` },
          { l: 'Total redeemed', v: `${wfmt(totalRedeems, 4)} AHLG`, sub: `≈ $${wfmt(totalRedeems * WRATES.AHLG)}` },
          { l: 'Deposits',       v: String(totalDeposits),            sub: 'past 30 days' },
          { l: 'Withdrawals',    v: String(totalWithdrws),            sub: 'past 30 days' },
        ].map((k, i) => (
          <WCard key={i} padding={20}>
            <WEyebrow>{k.l}</WEyebrow>
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
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID, asset, counterparty…" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: WFONT, fontSize: 13, color: WBRAND.ink }}/>
            </div>
            <FilterDropdown label="Type"   value={typeFilter}   options={['All', 'Mint', 'Redeem', 'Deposit', 'Withdraw', 'Transfer']}  onChange={setTypeFilter}/>
            <FilterDropdown label="Asset"  value={assetFilter}  options={['All', 'AHLG', 'USDT', 'USDC', 'AED', 'USD', 'EUR', 'GBP']}   onChange={setAssetFilter}/>
            <FilterDropdown label="Status" value={statusFilter} options={['All', 'Completed', 'Pending', 'Failed']}                      onChange={setStatusFilter}/>
            <div style={{ flex: 1 }}/>
            <WRangeTabs value={range} onChange={setRange} options={['7D', '30D', '90D', '1Y', 'ALL']}/>
          </div>

          {hasFilters && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Active filters</span>
              {search && <FilterChip label={`"${search}"`} onClear={() => setSearch('')}/>}
              {typeFilter !== 'All' && <FilterChip label={`Type: ${typeFilter}`} onClear={() => setTypeFilter('All')}/>}
              {assetFilter !== 'All' && <FilterChip label={`Asset: ${assetFilter}`} onClear={() => setAssetFilter('All')}/>}
              {statusFilter !== 'All' && <FilterChip label={`Status: ${statusFilter}`} onClear={() => setStatusFilter('All')}/>}
              <button onClick={() => { setSearch(''); setTypeFilter('All'); setAssetFilter('All'); setStatusFilter('All'); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.red }}>Clear all</button>
            </div>
          )}
        </div>

        <div style={{ padding: '12px 22px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: WBRAND.surface2 }}>
          <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>
            Showing <span style={{ color: WBRAND.ink, fontWeight: 700 }}>{filtered.length}</span> of {WTXS.length} transactions
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <WGhost>Newest</WGhost>
            <WGhost active>Date ↓</WGhost>
            <WGhost>Amount</WGhost>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '40px 1.2fr 1fr 1.2fr 1.2fr 1fr 110px', gap: 12, padding: '10px 22px', borderBottom: `1px solid ${WBRAND.line}`, background: WBRAND.surface2 }}>
          {['', 'Type', 'Asset', 'Amount', 'Counterparty', 'Date', 'Status'].map((h, i) => (
            <div key={i} style={{ fontFamily: WFONT, fontSize: 10, fontWeight: 700, color: WBRAND.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '60px 22px', textAlign: 'center', fontFamily: WFONT, fontSize: 14, color: WBRAND.muted }}>No transactions match the current filters.</div>
        ) : filtered.map((tx, i) => <WTxRow key={tx.id} tx={tx} last={i === filtered.length - 1}/>)}

        <div style={{ padding: '14px 22px', borderTop: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted }}>Page 1 of 8 · 120 total</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <WSecondary size="sm">← Previous</WSecondary>
            {[1, 2, 3, 4].map(p => (
              <button key={p} style={{ width: 32, height: 32, borderRadius: 8, background: p === 1 ? WBRAND.ink : WBRAND.white, color: p === 1 ? '#fff' : WBRAND.ink, border: `1px solid ${p === 1 ? WBRAND.ink : WBRAND.line}`, cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 700 }}>{p}</button>
            ))}
            <span style={{ display: 'grid', placeItems: 'center', padding: '0 4px', fontFamily: WFONT, fontSize: 12, color: WBRAND.muted }}>…</span>
            <button style={{ width: 32, height: 32, borderRadius: 8, background: WBRAND.white, color: WBRAND.ink, border: `1px solid ${WBRAND.line}`, cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 700 }}>8</button>
            <WSecondary size="sm">Next →</WSecondary>
          </div>
        </div>
      </WCard>
    </div>
  );
}
