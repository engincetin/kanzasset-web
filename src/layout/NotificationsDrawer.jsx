import { useState } from 'react';
import { WBRAND, WFONT, WMONO } from '../lib/index.js';
import { WPill } from '../components/primitives.jsx';
import { t } from '../lib/i18n.js';
import { useIsMobile } from '../lib/useResponsive.js';

const NOTIF_GROUPS = [
  {
    label: 'Today',
    items: [
      { id: 'n1', tone: 'positive', unread: true,  type: 'Mint',     title: 'Mint completed',                   sub: '1.2000 AHLG · paid 181.87 USDT · tx 9301',              time: '12 min ago',   actionLabel: 'View tx' },
      { id: 'n2', tone: 'warn',     unread: true,  type: 'Security', title: 'New whitelist pending review',      sub: 'USDC address · 0xDeF456…789aBcD · 8h remaining',        time: '2 hours ago',  actionLabel: 'Review' },
      { id: 'n3', tone: 'neutral',  unread: true,  type: 'Price',    title: 'Price alert · AHLG crossed $150',   sub: 'Spot trading at $151.56 · +0.24% past 24h',             time: '4 hours ago' },
      { id: 'n4', tone: 'neutral',  unread: false, type: 'System',   title: 'Login from new device',             sub: 'MacBook Pro · Chrome · Istanbul · 87.245.190.x',        time: '7 hours ago' },
    ],
  },
  {
    label: 'Yesterday',
    items: [
      { id: 'n5', tone: 'positive', unread: false, type: 'Deposit',  title: 'Deposit received',                  sub: '5,000.00 USDT · Ethereum · 12 confirmations',           time: 'Yesterday',    actionLabel: 'View tx' },
      { id: 'n6', tone: 'positive', unread: false, type: 'Vault',    title: 'Vault audit published',             sub: 'Bureau Veritas · April 2026 attestation',               time: 'Yesterday',    actionLabel: 'Open report' },
    ],
  },
  {
    label: 'Earlier this week',
    items: [
      { id: 'n7', tone: 'neutral',  unread: false, type: 'Redeem',   title: 'Redeem completed',                  sub: '0.8000 AHLG burned · 121.25 USDT credited',             time: 'May 10' },
      { id: 'n8', tone: 'warn',     unread: false, type: 'Limit',    title: '80% of monthly withdrawal limit used', sub: '203k / 250k USDT · resets May 31',                   time: 'May 9' },
    ],
  },
];

const TYPE_ICONS = {
  Mint:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M12 9v6M9 12h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  Redeem:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="8" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M5 12v8a1 1 0 001 1h12a1 1 0 001-1v-8" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M12 8v13" stroke="currentColor" strokeWidth="1.7"/></svg>,
  Deposit:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Security: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>,
  Price:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 7h5v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Vault:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7"/><circle cx="15" cy="12" r="3" stroke="currentColor" strokeWidth="1.7"/></svg>,
  System:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M8 21h8M12 18v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  Limit:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7"/><path d="M12 7v6M12 16v.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
};

function WNotifRow({ n, last }) {
  const tones = {
    positive: { bg: 'rgba(15,122,71,0.10)',  fg: WBRAND.positive },
    warn:     { bg: 'rgba(183,121,31,0.12)', fg: WBRAND.warn },
    neutral:  { bg: WBRAND.surface,           fg: WBRAND.ink },
    negative: { bg: WBRAND.redSoft,           fg: WBRAND.red },
  };
  const tone = tones[n.tone] ?? tones.neutral;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 22px',
      background: n.unread ? WBRAND.surface2 : WBRAND.white,
      borderBottom: last ? 'none' : `1px solid ${WBRAND.line}`,
      position: 'relative',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: tone.bg, color: tone.fg,
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>{TYPE_ICONS[n.type] ?? TYPE_ICONS.System}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{n.title}</span>
          {n.unread && <span style={{ width: 6, height: 6, borderRadius: 3, background: WBRAND.red, flexShrink: 0 }}/>}
        </div>
        <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 3, lineHeight: 1.45 }}>{n.sub}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted2, fontWeight: 500 }}>{n.time}</span>
          {n.actionLabel && (
            <button style={{
              background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.red,
              display: 'inline-flex', alignItems: 'center', gap: 3,
            }}>
              {t(n.actionLabel)}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function WNotificationsDrawer({ open, onClose }) {
  const mobile = useIsMobile();
  const [tab, setTab] = useState('all');

  const allItems = NOTIF_GROUPS.flatMap(g => g.items);
  const unreadCount = allItems.filter(n => n.unread).length;

  const visibleGroups = NOTIF_GROUPS
    .map(g => ({ ...g, items: tab === 'unread' ? g.items.filter(n => n.unread) : g.items }))
    .filter(g => g.items.length > 0);

  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.32)',
        zIndex: 80,
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity .2s ease',
      }}/>

      <aside style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: mobile ? '100%' : 440, maxWidth: '100%',
        background: WBRAND.white, borderLeft: `1px solid ${WBRAND.line}`,
        boxShadow: '0 0 32px rgba(0,0,0,0.10)',
        zIndex: 90,
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .25s cubic-bezier(.2,.7,.2,1)',
      }}>
        <div style={{ padding: '20px 22px 14px', borderBottom: `1px solid ${WBRAND.line}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ margin: 0, fontFamily: WFONT, fontSize: 20, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.02em' }}>{t('Notifications')}</h2>
                {unreadCount > 0 && <WPill tone="accent" style={{ fontSize: 11, padding: '4px 9px' }}>{unreadCount} {t('new')}</WPill>}
              </div>
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 4 }}>
                {t('Account events, transactions and security alerts')}
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8, border: 'none',
              background: WBRAND.surface, cursor: 'pointer',
              display: 'grid', placeItems: 'center', color: WBRAND.ink, flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
            <div style={{ display: 'flex', gap: 2, padding: 3, background: WBRAND.surface, borderRadius: 8 }}>
              {[
                { id: 'all',    label: t('All'),    count: allItems.length },
                { id: 'unread', label: t('Unread'), count: unreadCount },
              ].map(t => {
                const on = tab === t.id;
                return (
                  <button key={t.id} onClick={() => setTab(t.id)} style={{
                    height: 28, padding: '0 12px', border: 'none', cursor: 'pointer',
                    background: on ? WBRAND.white : 'transparent',
                    color: on ? WBRAND.ink : WBRAND.muted,
                    fontFamily: WFONT, fontWeight: 700, fontSize: 12,
                    borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 6,
                    boxShadow: on ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  }}>
                    <span>{t.label}</span>
                    <span style={{ fontFamily: WMONO, fontSize: 10, fontWeight: 700, color: on ? WBRAND.muted : WBRAND.muted2 }}>{t.count}</span>
                  </button>
                );
              })}
            </div>
            <button style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.muted,
              letterSpacing: '0.02em',
            }}>{t('Mark all read')}</button>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {visibleGroups.length === 0 ? (
            <div style={{ padding: '60px 22px', textAlign: 'center', fontFamily: WFONT, fontSize: 13, color: WBRAND.muted }}>
              {tab === 'unread' ? t('No unread notifications.') : t('No notifications.')}
            </div>
          ) : visibleGroups.map((g, gi) => (
            <div key={g.label}>
              <div style={{
                padding: '14px 22px 8px',
                background: WBRAND.surface2,
                borderTop: gi > 0 ? `1px solid ${WBRAND.line}` : 'none',
                fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>{t(g.label)}</div>
              {g.items.map((n, i) => <WNotifRow key={n.id} n={n} last={i === g.items.length - 1}/>)}
            </div>
          ))}
        </div>

        <div style={{
          padding: '12px 22px', borderTop: `1px solid ${WBRAND.line}`,
          background: WBRAND.surface2, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.ink,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke={WBRAND.ink} strokeWidth="1.7"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.01a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke={WBRAND.ink} strokeWidth="1.5"/>
            </svg>
            {t('Notification preferences')}
          </button>
          <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted }}>{t('Last 30 days')}</span>
        </div>
      </aside>
    </>
  );
}
