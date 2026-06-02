import { useState } from 'react';
import { WBRAND, WFONT, WMONO, wfmt } from '../lib/index.js';
import { WIcon } from '../components/icons.jsx';
import { WCard, WPrimary, WSecondary, WEyebrow, WNum, WMonoNum, WPill } from '../components/primitives.jsx';

function FormRow({ label, hint, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, padding: '18px 22px', borderBottom: `1px solid ${WBRAND.line}`, alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{label}</div>
        {hint && <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 4, lineHeight: 1.5 }}>{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function TextField({ value, placeholder, disabled = false, suffix }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', borderRadius: 8, background: disabled ? WBRAND.surface : WBRAND.white, border: `1px solid ${WBRAND.line2}` }}>
      <input defaultValue={value} placeholder={placeholder} disabled={disabled} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: WFONT, fontSize: 13, color: WBRAND.ink, fontWeight: 500 }}/>
      {suffix && <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>{suffix}</span>}
    </div>
  );
}

function SectionCard({ title, sub, children, footer }) {
  return (
    <WCard padding={0}>
      <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid ${WBRAND.line}` }}>
        <div style={{ fontFamily: WFONT, fontSize: 15, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.015em' }}>{title}</div>
        {sub && <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 4 }}>{sub}</div>}
      </div>
      {children}
      {footer && (
        <div style={{ padding: '14px 22px', borderTop: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'flex-end', gap: 8, background: WBRAND.surface2, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
          {footer}
        </div>
      )}
    </WCard>
  );
}

function SelectField({ value, options, groups, onChange }) {
  const [open, setOpen] = useState(false);
  const renderGroups = groups ?? [{ label: null, options: options ?? [] }];
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', height: 40, padding: '0 14px', borderRadius: 8, background: WBRAND.white, border: `1px solid ${open ? WBRAND.ink : WBRAND.line2}`, cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ flex: 1, fontFamily: WFONT, fontSize: 13, color: WBRAND.ink, fontWeight: 500, letterSpacing: '-0.005em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
        <span style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .15s ease', display: 'inline-grid', placeItems: 'center' }}>{WIcon.arrowDown(WBRAND.muted)}</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }}/>
          <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, borderRadius: 10, padding: 6, zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', maxHeight: 280, overflowY: 'auto' }}>
            {renderGroups.map((grp, gi) => (
              <div key={gi} style={{ marginTop: gi > 0 ? 4 : 0, paddingTop: gi > 0 ? 4 : 0, borderTop: gi > 0 ? `1px solid ${WBRAND.line}` : 'none' }}>
                {grp.label && <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 10px 4px' }}>{grp.label}</div>}
                {grp.options.map(o => {
                  const on = o === value;
                  return (
                    <button key={o} onClick={() => { onChange(o); setOpen(false); }} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: 'none', background: on ? WBRAND.surface : 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: WFONT, fontSize: 12, fontWeight: on ? 700 : 500, color: WBRAND.ink, display: 'flex', alignItems: 'center', justifyContent: 'space-between', letterSpacing: '-0.005em' }}>
                      {o}
                      {on && WIcon.check(WBRAND.ink)}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Toggle({ on }) {
  return (
    <span style={{ width: 34, height: 20, borderRadius: 10, background: on ? WBRAND.red : WBRAND.line2, position: 'relative', flexShrink: 0, transition: 'background .15s', display: 'inline-block' }}>
      <span style={{ position: 'absolute', top: 2, left: on ? 16 : 2, width: 16, height: 16, borderRadius: 8, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)', transition: 'left .15s' }}/>
    </span>
  );
}

function ProfAccount() {
  return (
    <SectionCard title="Personal details" sub="Information shown on your profile and used for verification." footer={<><WSecondary>Cancel</WSecondary><WPrimary>Save changes</WPrimary></>}>
      <FormRow label="Full legal name" hint="Must match your government-issued ID exactly.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <TextField value="Ahmet"/>
          <TextField value="Yılmaz"/>
        </div>
      </FormRow>
      <FormRow label="Email" hint="Used for sign-in and important account notifications.">
        <div style={{ display: 'flex', gap: 8 }}>
          <TextField value="ahmet@kanzasset.com"/>
          <WPill tone="positive" style={{ alignSelf: 'center' }}>{WIcon.check(WBRAND.positive)} Verified</WPill>
        </div>
      </FormRow>
      <FormRow label="Phone number" hint="Used for SMS 2FA and large-withdrawal confirmation.">
        <div style={{ display: 'flex', gap: 8 }}>
          <TextField value="+90 532 444 7890"/>
          <WPill tone="positive" style={{ alignSelf: 'center' }}>{WIcon.check(WBRAND.positive)} Verified</WPill>
        </div>
      </FormRow>
      <FormRow label="Country of residence" hint="Determines available payment rails and shipping zones.">
        <TextField value="🇹🇷 Türkiye"/>
      </FormRow>
      <FormRow label="Date of birth" hint="Used to verify legal age and identity.">
        <TextField value="14 March 1986" disabled/>
      </FormRow>
      <FormRow label="Tax residency" hint="Required for reporting jurisdictions where applicable.">
        <TextField value="Türkiye · TR-VKN 9043221854"/>
      </FormRow>
    </SectionCard>
  );
}

function ProfSecurity() {
  return (
    <>
      <SectionCard title="Sign-in & 2FA" sub="Protect your account with hardware-grade authentication.">
        <div style={{ padding: '4px 22px 0' }}>
          {[
            { l: 'Password',          v: 'Last changed Mar 12, 2026',  pill: <WPill tone="neutral">Strong</WPill>,                                 cta: 'Change' },
            { l: 'Authenticator app', v: '1Password · iPhone 15',      pill: <WPill tone="positive">{WIcon.check(WBRAND.positive)} Active</WPill>, cta: 'Reset' },
            { l: 'Hardware key',      v: 'YubiKey 5C NFC · primary',   pill: <WPill tone="positive">{WIcon.check(WBRAND.positive)} Active</WPill>, cta: 'Manage' },
            { l: 'SMS fallback',      v: '+90 532 *** 7890',            pill: <WPill tone="warn">Discouraged</WPill>,                               cta: 'Disable' },
            { l: 'Passkeys',          v: 'iCloud Keychain · Touch ID', pill: <WPill tone="positive">{WIcon.check(WBRAND.positive)} 2 devices</WPill>, cta: 'Manage' },
          ].map((r, i, arr) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{r.l}</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 3 }}>{r.v}</div>
              </div>
              {r.pill}
              <WSecondary size="sm">{r.cta}</WSecondary>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Active sessions" sub="Devices currently signed in to your Kanzasset account.">
        <div style={{ padding: '4px 22px 18px' }}>
          {[
            { dev: 'MacBook Pro · Chrome',  loc: 'Istanbul · 87.245.190.x', ts: 'Right now',      curr: true  },
            { dev: 'iPhone 15 · Kanzasset', loc: 'Istanbul · 87.245.190.x', ts: '12 minutes ago', curr: false },
            { dev: 'iPad Pro · Safari',     loc: 'Dubai · 94.200.4.x',      ts: '2 days ago',     curr: false },
          ].map((s, i, arr) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{s.dev}</span>
                  {s.curr && <WPill tone="positive">This device</WPill>}
                </div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 3 }}>{s.loc} · {s.ts}</div>
              </div>
              {!s.curr && <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.red }}>Revoke</button>}
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}

function ProfKYC() {
  return (
    <>
      <SectionCard title="Verification status" sub="Your verification tier unlocks higher daily limits and physical delivery.">
        <div style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 12, background: WBRAND.redSoft, display: 'grid', placeItems: 'center', color: WBRAND.red, fontFamily: WFONT, fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>T3</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: WFONT, fontSize: 18, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.015em' }}>Tier 3 · Institutional</div>
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 4 }}>Verified May 2, 2024 · Renewal Apr 2027</div>
            </div>
            <WPill tone="positive" style={{ fontSize: 12, padding: '6px 12px' }}>{WIcon.check(WBRAND.positive)} Verified</WPill>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 4 }}>
            {['Tier 1 · Identity', 'Tier 2 · Address', 'Tier 3 · Institutional'].map((l, i) => (
              <div key={i} style={{ height: 4, borderRadius: 2, background: WBRAND.red }}/>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
            {['Tier 1 · Identity', 'Tier 2 · Address', 'Tier 3 · Institutional'].map((l, i) => (
              <div key={i} style={{ fontFamily: WFONT, fontSize: 11, fontWeight: 600, color: WBRAND.ink }}>✓ {l}</div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Submitted documents">
        <div style={{ padding: '4px 22px 18px' }}>
          {[
            { l: 'Passport',                     v: 'TR-U12345678 · uploaded Apr 30, 2024' },
            { l: 'Address proof',                v: 'Utility bill · uploaded May 1, 2024' },
            { l: 'Source of funds',              v: 'Bank statement · uploaded May 2, 2024' },
            { l: 'Beneficial owner declaration', v: 'Notarised · uploaded May 2, 2024' },
            { l: 'Tax residency form (CRS)',      v: 'TR · uploaded May 2, 2024' },
          ].map((d, i, arr) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: WBRAND.surface, display: 'grid', placeItems: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z" stroke={WBRAND.ink} strokeWidth="1.7"/><path d="M14 3v6h6" stroke={WBRAND.ink} strokeWidth="1.7"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{d.l}</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 3 }}>{d.v}</div>
              </div>
              <WPill tone="positive">{WIcon.check(WBRAND.positive)} Approved</WPill>
              <WSecondary size="sm">View</WSecondary>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Account limits">
        <div style={{ padding: '4px 22px 22px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {[
              { l: 'Daily mint limit',          used: '24.5k', total: '500k USDT', pct: 4.9 },
              { l: 'Daily redeem limit',         used: '11.2k', total: '500k USDT', pct: 2.2 },
              { l: 'Daily withdrawal',           used: '12k',   total: '250k USDT', pct: 4.8 },
              { l: 'Physical delivery / month',  used: '0',     total: '20 kg',     pct: 0   },
            ].map((k, i) => (
              <div key={i} style={{ padding: 16, border: `1px solid ${WBRAND.line}`, borderRadius: 12 }}>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{k.l}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
                  <WNum size={20} weight={800} style={{ letterSpacing: '-0.02em' }}>{k.used}</WNum>
                  <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted }}>/ {k.total}</span>
                </div>
                <div style={{ height: 4, background: WBRAND.surface, borderRadius: 2, marginTop: 10, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.max(k.pct, 1)}%`, height: '100%', background: WBRAND.red }}/>
                </div>
                <div style={{ fontFamily: WMONO, fontSize: 11, color: WBRAND.muted, marginTop: 6 }}>{wfmt(k.pct, 1)}% used</div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </>
  );
}

function ProfDestinations() {
  const [tab, setTab] = useState('crypto');

  const cryptoAddrs = [
    { l: 'Cold wallet · USDT', ch: 'Ethereum · ERC-20', a: '0xC4e1A3...8fB9hPq', added: 'Mar 20, 2026', verified: true  },
    { l: 'Cold wallet · USDC', ch: 'Ethereum · ERC-20', a: '0xA1b2C3...4D5e6F7', added: 'Mar 22, 2026', verified: true  },
    { l: 'Ledger · USDT',      ch: 'Ethereum · ERC-20', a: '0x88aF12...e8WzX2k', added: 'Apr 11, 2026', verified: true  },
    { l: 'Hot wallet · USDT',  ch: 'Ethereum · ERC-20', a: '0xDeF456...789aBcD', added: 'May 13, 2026', verified: false },
  ];
  const banks = [
    { bank: 'Emirates NBD',    ccy: 'AED', iban: 'AE07 0331 2345 6789 0001 198',  def: true  },
    { bank: 'JP Morgan Chase', ccy: 'USD', iban: '021000021 · 802135 2249',        def: false },
    { bank: 'Garanti BBVA',    ccy: 'EUR', iban: 'TR33 0006 2000 4290 0000 0001',  def: false },
    { bank: 'Lloyds Bank',     ccy: 'GBP', iban: 'GB29 LOYD 3092 1031 9876 54',    def: false },
  ];
  const shipAddrs = [
    { label: 'Home',     city: 'Dubai',    line: 'Marina Plaza, Tower 1, Apt 2208',   country: 'UAE',     def: true  },
    { label: 'Office',   city: 'Dubai',    line: 'DMCC Almas Tower, Floor 38',        country: 'UAE',     def: false },
    { label: 'Istanbul', city: 'Istanbul', line: 'Levent Mah. Büyükdere Cad. No:185', country: 'Türkiye', def: false },
  ];

  const tabs = [
    { id: 'crypto',   label: 'Crypto addresses', count: cryptoAddrs.length },
    { id: 'bank',     label: 'Bank accounts',    count: banks.length       },
    { id: 'shipping', label: 'Shipping',         count: shipAddrs.length   },
  ];

  return (
    <SectionCard
      title="Whitelisted destinations"
      sub="Pre-approved crypto addresses, bank accounts and shipping addresses. Withdrawals and physical delivery can only be sent to verified destinations."
      footer={<WPrimary>{WIcon.plus('#fff')} {tab === 'crypto' ? 'Add new address' : tab === 'bank' ? 'Add bank account' : 'Add shipping address'}</WPrimary>}
    >
      <div style={{ padding: '0 22px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', gap: 4 }}>
        {tabs.map(t => {
          const on = t.id === tab;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '12px 14px 14px', border: 'none', background: 'transparent', cursor: 'pointer', position: 'relative', fontFamily: WFONT, fontSize: 13, fontWeight: on ? 700 : 500, color: on ? WBRAND.ink : WBRAND.muted, letterSpacing: '-0.005em', display: 'flex', alignItems: 'center', gap: 8, marginBottom: -1 }}>
              <span>{t.label}</span>
              <span style={{ fontFamily: WFONT, fontSize: 10, fontWeight: 700, background: on ? WBRAND.ink : WBRAND.surface, color: on ? '#fff' : WBRAND.muted, padding: '2px 7px', borderRadius: 10, fontVariantNumeric: 'tabular-nums' }}>{t.count}</span>
              {on && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, background: WBRAND.red }}/>}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '4px 22px 18px' }}>
        {tab === 'crypto' && cryptoAddrs.map((r, i, arr) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: WBRAND.surface, display: 'grid', placeItems: 'center' }}>{WIcon.shield(WBRAND.ink)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{r.l}</span>
                {!r.verified && <WPill tone="warn">24h review · 8h left</WPill>}
                {r.verified && <WPill tone="positive">{WIcon.check(WBRAND.positive)} Verified</WPill>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                <WMonoNum size={11} color={WBRAND.muted}>{r.a}</WMonoNum>
                <span style={{ width: 1, height: 10, background: WBRAND.line }}/>
                <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted }}>{r.ch} · added {r.added}</span>
              </div>
            </div>
            <WSecondary size="sm" icon={WIcon.copy(WBRAND.ink)}>Copy</WSecondary>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.red }}>Remove</button>
          </div>
        ))}

        {tab === 'bank' && banks.map((b, i, arr) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: WBRAND.surface, display: 'grid', placeItems: 'center', fontFamily: WFONT, fontWeight: 800, fontSize: 11, color: WBRAND.ink, letterSpacing: '0.02em' }}>{b.ccy}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{b.bank}</span>
                {b.def && <WPill tone="accent">Default {b.ccy}</WPill>}
                <WPill tone="positive">{WIcon.check(WBRAND.positive)} Verified</WPill>
              </div>
              <WMonoNum size={11} color={WBRAND.muted} style={{ marginTop: 3, display: 'block' }}>{b.iban}</WMonoNum>
            </div>
            <WSecondary size="sm">Edit</WSecondary>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.red }}>Remove</button>
          </div>
        ))}

        {tab === 'shipping' && shipAddrs.map((a, i, arr) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: WBRAND.surface, display: 'grid', placeItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s-6-5.5-6-11a6 6 0 1 1 12 0c0 5.5-6 11-6 11z" stroke={WBRAND.ink} strokeWidth="1.7" strokeLinejoin="round"/><circle cx="12" cy="10" r="2.2" stroke={WBRAND.ink} strokeWidth="1.7"/></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{a.label} · {a.city}</span>
                {a.def && <WPill tone="accent">Default shipping</WPill>}
                <WPill tone="positive">{WIcon.check(WBRAND.positive)} Verified</WPill>
              </div>
              <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 3 }}>{a.line}, {a.country}</div>
            </div>
            <WSecondary size="sm">Edit</WSecondary>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.red }}>Remove</button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function ProfPrefs() {
  const [lang, setLang] = useState('English · United Kingdom');
  const [ccy, setCcy]   = useState('USDT — US dollar tether');
  const [tz, setTz]     = useState('Europe/Istanbul (UTC+03:00)');

  return (
    <SectionCard title="Preferences" sub="Language, currency, and notification settings." footer={<WPrimary>Save preferences</WPrimary>}>
      <FormRow label="Display language" hint="Used across the web and mobile apps.">
        <SelectField value={lang} onChange={setLang} options={['English · United Kingdom', 'English · United States', 'Türkçe · Türkiye', 'العربية · الإمارات', 'Français · France', 'Deutsch · Deutschland', '中文 · 简体']}/>
      </FormRow>
      <FormRow label="Display currency" hint="Default currency for portfolio totals and quotes.">
        <SelectField value={ccy} onChange={setCcy} groups={[
          { label: 'Crypto', options: ['USDT — US dollar tether', 'USDC — USD Coin', 'AHLG — AHL Gold'] },
          { label: 'Fiat',   options: ['USD — US Dollar', 'AED — UAE Dirham', 'EUR — Euro', 'GBP — Pound Sterling'] },
        ]}/>
      </FormRow>
      <FormRow label="Time zone" hint="Used for timestamps and limit reset windows.">
        <SelectField value={tz} onChange={setTz} options={['Europe/Istanbul (UTC+03:00)', 'Asia/Dubai (UTC+04:00)', 'Europe/London (UTC+00:00)', 'Europe/Paris (UTC+01:00)', 'America/New_York (UTC-05:00)', 'Asia/Singapore (UTC+08:00)']}/>
      </FormRow>
      <FormRow label="Email notifications" hint="Choose which events trigger an email.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { l: 'Mint & redeem confirmations',  on: true  },
            { l: 'Deposit & withdrawal updates', on: true  },
            { l: 'Vault audit reports',          on: true  },
            { l: 'Price alerts',                 on: false },
            { l: 'Marketing & product updates',  on: false },
          ].map((r, i) => (
            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <Toggle on={r.on}/>
              <span style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.ink, fontWeight: 500 }}>{r.l}</span>
            </label>
          ))}
        </div>
      </FormRow>
      <FormRow label="Appearance" hint="Switch between light, dark, or follow system.">
        <div style={{ display: 'inline-flex', gap: 6 }}>
          {['Light', 'Dark', 'System'].map((m, i) => (
            <button key={m} style={{ padding: '8px 16px', borderRadius: 8, background: i === 0 ? WBRAND.ink : WBRAND.white, color: i === 0 ? '#fff' : WBRAND.ink, border: `1px solid ${i === 0 ? WBRAND.ink : WBRAND.line2}`, cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 700 }}>{m}</button>
          ))}
        </div>
      </FormRow>
    </SectionCard>
  );
}

function ProfHelp() {
  return (
    <>
      <SectionCard title="Get help">
        <div style={{ padding: '4px 22px 18px' }}>
          {[
            { l: 'Contact support',         sub: 'Average response · 2 hours · 24/7' },
            { l: 'Schedule a private call', sub: 'Tier 3 desk · Mon–Fri · 09:00–18:00 GST' },
            { l: 'Help center',             sub: 'Articles, guides and FAQs' },
            { l: 'Report a security issue', sub: 'security@kanzasset.com · PGP encrypted' },
          ].map((r, i, arr) => (
            <button key={i} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{r.l}</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 3 }}>{r.sub}</div>
              </div>
              {WIcon.arrowRight(WBRAND.muted)}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Legal">
        <div style={{ padding: '4px 22px 18px' }}>
          {[
            { l: 'Terms of service',       v: 'v4.2 · effective Apr 1, 2026' },
            { l: 'Privacy policy',         v: 'v3.1 · effective Mar 15, 2026' },
            { l: 'Custody agreement',      v: 'Ahlatcı Metal Refinery FZCO · v2.0' },
            { l: 'Regulatory disclosures', v: 'DMCC, ADGM' },
          ].map((r, i, arr) => (
            <button key={i} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{r.l}</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 3 }}>{r.v}</div>
              </div>
              {WIcon.external(WBRAND.muted)}
            </button>
          ))}
        </div>
      </SectionCard>
    </>
  );
}

export function WebProfile({ navigate, onLogout }) {
  const [section, setSection] = useState('account');

  const sections = [
    { id: 'account',      label: 'Account',                  icon: 'M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zM3 22c0-5 4-9 9-9s9 4 9 9' },
    { id: 'security',     label: 'Security',                 icon: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z' },
    { id: 'kyc',          label: 'Identity & KYC',           icon: 'M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM8 11a2 2 0 100-4 2 2 0 000 4zm-3 5c1-2 2-3 3-3s2 1 3 3M13 9h5M13 13h5M13 17h3' },
    { id: 'destinations', label: 'Whitelisted destinations', icon: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4' },
    { id: 'prefs',        label: 'Preferences',              icon: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.01a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' },
    { id: 'help',         label: 'Help & legal',             icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 17v.01M12 14a2 2 0 011-2 2 2 0 10-2-3' },
  ];

  return (
    <div style={{ padding: '28px 32px 48px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 20 }}>
        <WEyebrow>Profile</WEyebrow>
        <h1 style={{ margin: '6px 0 0', fontFamily: WFONT, fontSize: 28, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.025em' }}>Account settings</h1>
        <div style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, marginTop: 6 }}>
          Manage your personal details, security, verification status, and payment methods.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <WCard padding={20}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: 12, background: 'linear-gradient(135deg, #1F1F1F, #4a4a4a)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: WFONT, fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em' }}>AY</div>
              <div style={{ fontFamily: WFONT, fontSize: 16, fontWeight: 800, color: WBRAND.ink, marginTop: 12, letterSpacing: '-0.01em' }}>Ahmet Yılmaz</div>
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 2 }}>ahmet@kanzasset.com</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                <WPill tone="positive">{WIcon.check(WBRAND.positive)} Verified</WPill>
                <WPill tone="accent">Tier 3</WPill>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${WBRAND.line}` }}>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Member since</div>
                <WMonoNum size={12} style={{ marginTop: 4, display: 'block' }}>Mar 2024</WMonoNum>
              </div>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Tx count</div>
                <WMonoNum size={12} style={{ marginTop: 4, display: 'block' }}>247</WMonoNum>
              </div>
            </div>
          </WCard>

          <WCard padding={6}>
            {sections.map(s => {
              const on = s.id === section;
              return (
                <button key={s.id} onClick={() => setSection(s.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: on ? WBRAND.surface : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: WFONT, fontSize: 13, fontWeight: on ? 700 : 500, color: WBRAND.ink, letterSpacing: '-0.005em' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d={s.icon} stroke={on ? WBRAND.ink : WBRAND.muted} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ flex: 1 }}>{s.label}</span>
                  {on && WIcon.arrowRight(WBRAND.muted2)}
                </button>
              );
            })}
          </WCard>

          <WCard padding={16}>
            <button onClick={onLogout} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 13, fontWeight: 600, color: WBRAND.red, textAlign: 'left' }}>Sign out of all devices</button>
          </WCard>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {section === 'account'      && <ProfAccount/>}
          {section === 'security'     && <ProfSecurity/>}
          {section === 'kyc'          && <ProfKYC/>}
          {section === 'destinations' && <ProfDestinations/>}
          {section === 'prefs'        && <ProfPrefs/>}
          {section === 'help'         && <ProfHelp/>}
        </div>
      </div>
    </div>
  );
}
