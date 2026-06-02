import { useState, useEffect, useRef } from 'react';
import { WBRAND, WFONT, WMONO } from '../lib/index.js';
import { WIcon } from '../components/icons.jsx';
import { WCoinDot } from '../components/coinicons.jsx';
import { WCard, WPrimary, WSecondary, WEyebrow, WNum, WMonoNum, WPill } from '../components/primitives.jsx';
import { SelectField } from '../components/shared.jsx';
import { txMeta } from '../components/TxDetailModal.jsx';

// ─── Seed tickets ─────────────────────────────────────────────
const WTICKETS = [
  {
    id: 'TKT-4821', subject: 'Withdrawal not received', category: 'Withdrawals',
    status: 'open', priority: 'high', tx: 'tx-9251', updated: '2026-05-12 10:15',
    messages: [
      { from: 'user', name: 'You', ts: '2026-05-11 16:40', body: 'My AED 12,000 withdrawal (tx-9251) was marked complete but hasn\'t arrived in my Emirates NBD account.' },
      { from: 'agent', name: 'Selin · Support', ts: '2026-05-11 17:05', body: 'Thanks for reaching out. I can see the transfer left our account on May 9. Bank settlement can take 1–2 business days — I\'m chasing the correspondent bank now.' },
      { from: 'agent', name: 'Selin · Support', ts: '2026-05-12 10:15', body: 'Update: the funds cleared the intermediary this morning and should land in your account within a few hours. I\'ll keep this open until you confirm.' },
    ],
  },
  {
    id: 'TKT-4790', subject: 'Question about mint fees', category: 'Minting',
    status: 'pending', priority: 'normal', tx: 'tx-9301', updated: '2026-05-12 09:50',
    messages: [
      { from: 'user', name: 'You', ts: '2026-05-12 09:42', body: 'Is the 0.00% mint fee promotional? When does it end?' },
      { from: 'agent', name: 'Mehmet · Support', ts: '2026-05-12 09:50', body: 'Good question — the 0% mint fee is active through Q3 2026. We\'ll notify all users 30 days before any change.' },
    ],
  },
  {
    id: 'TKT-4612', subject: 'Add new bank account verification', category: 'Account',
    status: 'resolved', priority: 'normal', tx: null, updated: '2026-05-05 14:20',
    messages: [
      { from: 'user', name: 'You', ts: '2026-05-04 11:00', body: 'How long does it take to verify a new bank account for withdrawals?' },
      { from: 'agent', name: 'Selin · Support', ts: '2026-05-04 11:20', body: 'New accounts go through a 24-hour security review. You\'ll get an email once it\'s approved.' },
      { from: 'user', name: 'You', ts: '2026-05-05 14:18', body: 'Approved now, thanks!' },
      { from: 'agent', name: 'Selin · Support', ts: '2026-05-05 14:20', body: 'Glad to hear it. Closing this ticket — reach out any time.' },
    ],
  },
];

function ticketTone(status) {
  return status === 'open' ? 'accent' : status === 'pending' ? 'warn' : 'positive';
}

export function WebSupport({ navigate, prefillTx }) {
  const [tickets, setTickets] = useState(WTICKETS);
  const [openId, setOpenId] = useState(null);
  const [composing, setComposing] = useState(!!prefillTx);
  const [activePrefill, setActivePrefill] = useState(prefillTx || null);
  const [filter, setFilter] = useState('all');

  // When arriving from a transaction's "Get help", open the composer pre-linked
  useEffect(() => { if (prefillTx) { setActivePrefill(prefillTx); setComposing(true); setOpenId(null); } }, [prefillTx]);

  const open = tickets.find(t => t.id === openId);
  const filtered = tickets.filter(t => filter === 'all' ? true : t.status === filter);

  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    pending: tickets.filter(t => t.status === 'pending').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  return (
    <div style={{ padding: '28px 32px 48px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <WEyebrow>Support</WEyebrow>
          <h1 style={{ margin: '6px 0 0', fontFamily: WFONT, fontSize: 28, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.025em' }}>Support center</h1>
          <div style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, marginTop: 6 }}>
            Open a ticket about a transaction or account issue. Our desk replies within 2 hours, 24/7.
          </div>
        </div>
        <WPrimary size="md" onClick={() => { setActivePrefill(null); setComposing(true); setOpenId(null); }} icon={WIcon.plus('#fff')}>New ticket</WPrimary>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { l: 'Open', v: stats.open, tone: WBRAND.red },
          { l: 'Pending', v: stats.pending, tone: WBRAND.warn },
          { l: 'Resolved', v: stats.resolved, tone: WBRAND.positive },
        ].map((k, i) => (
          <WCard key={i} padding={18}>
            <WEyebrow>{k.l}</WEyebrow>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: k.tone, display: 'inline-block' }}/>
              <WNum size={26} weight={800} style={{ letterSpacing: '-0.025em' }}>{k.v}</WNum>
            </div>
          </WCard>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 20, alignItems: 'start' }}>
        {/* Ticket list */}
        <WCard padding={0}>
          <div style={{ padding: '16px 20px 14px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: WFONT, fontSize: 15, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.015em' }}>Your tickets</div>
            <div style={{ display: 'flex', gap: 2, padding: 3, background: WBRAND.surface, borderRadius: 8 }}>
              {['all', 'open', 'resolved'].map(f => {
                const on = filter === f;
                return (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    height: 26, padding: '0 10px', border: 'none', cursor: 'pointer',
                    background: on ? WBRAND.white : 'transparent', color: on ? WBRAND.ink : WBRAND.muted,
                    borderRadius: 6, fontFamily: WFONT, fontWeight: 700, fontSize: 11, textTransform: 'capitalize',
                    boxShadow: on ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  }}>{f}</button>
                );
              })}
            </div>
          </div>
          <div style={{ maxHeight: 520, overflowY: 'auto' }}>
            {filtered.map((t, i, arr) => {
              const on = openId === t.id;
              return (
                <button key={t.id} onClick={() => { setOpenId(t.id); setComposing(false); }} style={{
                  width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none',
                  background: on ? WBRAND.surface2 : 'transparent',
                  borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}`,
                  borderLeft: `3px solid ${on ? WBRAND.red : 'transparent'}`,
                  padding: '14px 18px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{t.subject}</span>
                    <WPill tone={ticketTone(t.status)}>{t.status[0].toUpperCase() + t.status.slice(1)}</WPill>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                    <WMonoNum size={10} color={WBRAND.muted}>{t.id}</WMonoNum>
                    <span style={{ width: 1, height: 9, background: WBRAND.line }}/>
                    <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted }}>{t.category}</span>
                    {t.tx && <><span style={{ width: 1, height: 9, background: WBRAND.line }}/><WMonoNum size={10} color={WBRAND.muted}>{t.tx}</WMonoNum></>}
                  </div>
                </button>
              );
            })}
          </div>
        </WCard>

        {/* Right: thread OR composer OR empty */}
        {composing
          ? <TicketComposer key={activePrefill ? activePrefill.id : 'blank'} prefillTx={activePrefill} onCancel={() => setComposing(false)} onSubmit={(t) => { setTickets([t, ...tickets]); setComposing(false); setActivePrefill(null); setOpenId(t.id); }}/>
          : open
            ? <TicketThread ticket={open} onReply={(body) => {
                setTickets(tickets.map(t => t.id === open.id ? { ...t, status: 'pending', messages: [...t.messages, { from: 'user', name: 'You', ts: 'Just now', body }] } : t));
              }}/>
            : <WCard padding={0}>
                <div style={{ padding: '60px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 28, background: WBRAND.surface, display: 'grid', placeItems: 'center', marginBottom: 16 }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" stroke={WBRAND.muted} strokeWidth="1.7" strokeLinejoin="round"/></svg>
                  </div>
                  <div style={{ fontFamily: WFONT, fontSize: 15, fontWeight: 700, color: WBRAND.ink }}>Select a ticket</div>
                  <div style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, marginTop: 6, maxWidth: 280, lineHeight: 1.5 }}>
                    Choose a ticket from the list to view the conversation, or open a new ticket.
                  </div>
                </div>
              </WCard>}
      </div>
    </div>
  );
}

// ─── Ticket thread ────────────────────────────────────────────
function TicketThread({ ticket, onReply }) {
  const [draft, setDraft] = useState('');
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [ticket.messages.length, ticket.id]);
  return (
    <WCard padding={0} style={{ display: 'flex', flexDirection: 'column', maxHeight: 600 }}>
      <div style={{ padding: '16px 22px 14px', borderBottom: `1px solid ${WBRAND.line}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ fontFamily: WFONT, fontSize: 16, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.015em' }}>{ticket.subject}</div>
          <WPill tone={ticketTone(ticket.status)}>{ticket.status[0].toUpperCase() + ticket.status.slice(1)}</WPill>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <WMonoNum size={11} color={WBRAND.muted}>{ticket.id}</WMonoNum>
          <span style={{ width: 1, height: 10, background: WBRAND.line }}/>
          <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted }}>{ticket.category}</span>
          {ticket.tx && <><span style={{ width: 1, height: 10, background: WBRAND.line }}/><span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted }}>Linked: <WMonoNum size={11} color={WBRAND.ink}>{ticket.tx}</WMonoNum></span></>}
        </div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {ticket.messages.map((msg, i) => {
          const mine = msg.from === 'user';
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <span style={{ fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.ink }}>{msg.name}</span>
                <span style={{ fontFamily: WMONO, fontSize: 10, color: WBRAND.muted2 }}>{msg.ts}</span>
              </div>
              <div style={{
                maxWidth: '85%', padding: '10px 14px', borderRadius: 12,
                background: mine ? WBRAND.ink : WBRAND.surface,
                color: mine ? '#fff' : WBRAND.ink,
                fontFamily: WFONT, fontSize: 13, lineHeight: 1.5,
                borderBottomRightRadius: mine ? 3 : 12, borderBottomLeftRadius: mine ? 12 : 3,
              }}>{msg.body}</div>
            </div>
          );
        })}
      </div>

      {ticket.status !== 'resolved' ? (
        <div style={{ padding: '14px 22px 18px', borderTop: `1px solid ${WBRAND.line}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea value={draft} onChange={e => setDraft(e.target.value)} placeholder="Type your reply…" rows={2} style={{
              flex: 1, resize: 'none', border: `1px solid ${WBRAND.line2}`, borderRadius: 10,
              padding: '10px 12px', outline: 'none', fontFamily: WFONT, fontSize: 13, color: WBRAND.ink,
            }}/>
            <WPrimary onClick={() => { if (draft.trim()) { onReply(draft.trim()); setDraft(''); } }}
              style={{ opacity: draft.trim() ? 1 : 0.5, pointerEvents: draft.trim() ? 'auto' : 'none' }}>Send</WPrimary>
          </div>
        </div>
      ) : (
        <div style={{ padding: '14px 22px 18px', borderTop: `1px solid ${WBRAND.line}`, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          {WIcon.check(WBRAND.positive)}
          <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>This ticket is resolved. Reopen by starting a new ticket.</span>
        </div>
      )}
    </WCard>
  );
}

// ─── New ticket composer ──────────────────────────────────────
function TicketComposer({ prefillTx, onCancel, onSubmit }) {
  const cats = ['Minting', 'Redemptions', 'Withdrawals', 'Deposits', 'Account', 'Other'];
  const prefCat = prefillTx ? (() => {
    const title = txMeta(prefillTx).title;
    if (title.includes('Mint')) return 'Minting';
    if (title.includes('Redeem')) return 'Redemptions';
    if (title.includes('Withdraw')) return 'Withdrawals';
    if (title.includes('Deposit')) return 'Deposits';
    return 'Other';
  })() : 'Minting';
  const [cat, setCat] = useState(prefCat);
  const [subject, setSubject] = useState(prefillTx ? `Help with ${txMeta(prefillTx).title} (${prefillTx.id})` : '');
  const [body, setBody] = useState('');
  const ok = subject.trim() && body.trim();

  const submit = () => {
    if (!ok) return;
    onSubmit({
      id: 'TKT-' + Math.floor(4000 + Math.random() * 900),
      subject: subject.trim(), category: cat, status: 'open', priority: 'normal',
      tx: prefillTx ? prefillTx.id : null, updated: 'Just now',
      messages: [{ from: 'user', name: 'You', ts: 'Just now', body: body.trim() }],
    });
  };

  return (
    <WCard padding={0}>
      <div style={{ padding: '16px 22px 14px', borderBottom: `1px solid ${WBRAND.line}` }}>
        <div style={{ fontFamily: WFONT, fontSize: 16, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.015em' }}>New support ticket</div>
        <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 3 }}>Our desk typically replies within 2 hours.</div>
      </div>
      <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {prefillTx && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: WBRAND.surface2, border: `1px solid ${WBRAND.line}`, borderRadius: 10 }}>
            <WCoinDot symbol={prefillTx.asset} size={32}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.ink }}>{txMeta(prefillTx).title} · {prefillTx.asset}</div>
              <WMonoNum size={11} color={WBRAND.muted} style={{ marginTop: 1, display: 'block' }}>{prefillTx.id} · {prefillTx.ts.slice(0, 10)}</WMonoNum>
            </div>
            <WPill tone="neutral">Linked</WPill>
          </div>
        )}
        <div>
          <div style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.ink, marginBottom: 7 }}>Category</div>
          <SelectField value={cat} options={cats} onChange={setCat}/>
        </div>
        <div>
          <div style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.ink, marginBottom: 7 }}>Subject</div>
          <div style={{ display: 'flex', alignItems: 'center', height: 44, padding: '0 14px', borderRadius: 10, border: `1px solid ${WBRAND.line2}`, background: WBRAND.white }}>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief summary of your issue" style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: WFONT, fontSize: 13, color: WBRAND.ink, fontWeight: 500,
            }}/>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.ink, marginBottom: 7 }}>Message</div>
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Describe what happened and what you'd like us to do…" rows={5} style={{
            width: '100%', resize: 'vertical', border: `1px solid ${WBRAND.line2}`, borderRadius: 10,
            padding: '12px 14px', outline: 'none', fontFamily: WFONT, fontSize: 13, color: WBRAND.ink, lineHeight: 1.5,
          }}/>
        </div>
      </div>
      <div style={{ padding: '0 22px 20px', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <WSecondary size="lg" onClick={onCancel} style={{ height: 50 }}>Cancel</WSecondary>
        <WPrimary size="lg" onClick={submit} style={{ opacity: ok ? 1 : 0.5, pointerEvents: ok ? 'auto' : 'none' }}>Submit ticket</WPrimary>
      </div>
    </WCard>
  );
}
