import { useState, useEffect } from 'react';
import { WBRAND, WFONT, WMONO, wfmt, getNumberStyle, setNumberStyle, getTheme, applyTheme } from '../lib/index.js';
import { getAuthChannel, setAuthChannel } from '../lib/authChannel.js';
import { getLang, setLang, t } from '../lib/i18n.js';
import { toast } from '../components/Toast.jsx';

const LANG_EN = 'English';
const LANG_TR = 'Türkçe';
const NUMFMT_US = '1,234.56  ·  US / UK';
const NUMFMT_EU = '1.234,56  ·  Europe';
import { WIcon } from '../components/icons.jsx';
import { WCard, WPrimary, WSecondary, WEyebrow, WNum, WMonoNum, WPill, WCopyButton } from '../components/primitives.jsx';
import { useIsMobile } from '../lib/useResponsive.js';

function FormRow({ label, hint, children }) {
  const mobile = useIsMobile();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '220px 1fr', gap: mobile ? 8 : 24, padding: mobile ? '14px 16px' : '18px 22px', borderBottom: `1px solid ${WBRAND.line}`, alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{label}</div>
        {hint && <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 4, lineHeight: 1.5 }}>{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function TextField({ value, placeholder, disabled = false, locked = false, suffix }) {
  const ro = disabled || locked;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', borderRadius: 8, background: ro ? WBRAND.surface : WBRAND.white, border: `1px solid ${WBRAND.line2}` }}>
      <input defaultValue={value} placeholder={placeholder} disabled={ro} readOnly={locked} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: WFONT, fontSize: 13, color: ro ? WBRAND.muted : WBRAND.ink, fontWeight: 500 }}/>
      {locked && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <rect x="5" y="11" width="14" height="9" rx="2" stroke={WBRAND.muted2} strokeWidth="1.7"/>
          <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={WBRAND.muted2} strokeWidth="1.7"/>
        </svg>
      )}
      {suffix && <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>{suffix}</span>}
    </div>
  );
}

function SectionCard({ title, sub, children, footer }) {
  const mobile = useIsMobile();
  return (
    <WCard padding={0} style={{ minWidth: 0 }}>
      <div style={{ padding: mobile ? '14px 16px 12px' : '18px 22px 14px', borderBottom: `1px solid ${WBRAND.line}` }}>
        <div style={{ fontFamily: WFONT, fontSize: 15, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.015em' }}>{title}</div>
        {sub && <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 4 }}>{sub}</div>}
      </div>
      {children}
      {footer && (
        <div style={{ padding: mobile ? '12px 16px' : '14px 22px', borderTop: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'flex-end', gap: 8, background: WBRAND.surface2, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
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

function ProfAccount({ navigate }) {
  const profMobile = useIsMobile();
  return (
    <SectionCard
      title={t('Personal details')}
      sub={t("These details are locked because they're used for identity verification.")}
      footer={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            {WIcon.shield(WBRAND.muted)}
            <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, fontWeight: 500 }}>
              {t('Need to update something? Our team will verify and change it for you.')}
            </span>
          </div>
          <WPrimary onClick={() => navigate && navigate('support')}
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round"/></svg>}>
            {t('Contact support')}
          </WPrimary>
        </div>
      }
    >
      <FormRow label={t('Full legal name')} hint={t('Must match your government-issued ID exactly.')}>
        <div style={{ display: 'grid', gridTemplateColumns: profMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
          <TextField value="Ahmet" locked/>
          <TextField value="Yılmaz" locked/>
        </div>
      </FormRow>
      <FormRow label={t('Email')} hint={t('Used for sign-in and important account notifications.')}>
        <div style={{ display: 'flex', gap: 8 }}>
          <TextField value="ahmet@kanzasset.com" locked/>
          <WPill tone="positive" style={{ alignSelf: 'center' }}>{WIcon.check(WBRAND.positive)} {t('Verified')}</WPill>
        </div>
      </FormRow>
      <FormRow label={t('Phone number')} hint={t('Used for SMS 2FA and large-withdrawal confirmation.')}>
        <div style={{ display: 'flex', gap: 8 }}>
          <TextField value="+90 532 444 7890" locked/>
          <WPill tone="positive" style={{ alignSelf: 'center' }}>{WIcon.check(WBRAND.positive)} {t('Verified')}</WPill>
        </div>
      </FormRow>
      <FormRow label={t('Country of residence')} hint={t('Determines available payment rails and shipping zones.')}>
        <TextField value="🇹🇷 Türkiye" locked/>
      </FormRow>
      <FormRow label={t('Date of birth')} hint={t('Used to verify legal age and identity.')}>
        <TextField value="14 March 1986" locked/>
      </FormRow>
      <FormRow label={t('Tax residency')} hint={t('Required for reporting jurisdictions where applicable.')}>
        <TextField value="Türkiye · TR-VKN 9043221854" locked/>
      </FormRow>
    </SectionCard>
  );
}

function ProfSecurity() {
  const mobile = useIsMobile();
  const [twoFA, setTwoFA] = useState(getAuthChannel());
  useEffect(() => { setAuthChannel(twoFA); }, [twoFA]);
  const pickTwoFA = (id) => { if (id === twoFA) return; setTwoFA(id); toast(id === 'email' ? t('Codes will be sent by email') : t('Codes will be sent by SMS'), { title: t('Two-factor updated') }); };

  return (
    <>
      <SectionCard title={t('Two-factor authentication')} sub={t('Choose how we send your verification code at sign-in and for withdrawals.')}>
        <div style={{ padding: mobile ? '14px 16px 16px' : '18px 22px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 12 }}>
            {[
              { id: 'email', label: t('Email'), dest: 'a••••t@kanzasset.com',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg> },
              { id: 'sms',   label: 'SMS', dest: '+90 532 ••• 7890',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="6" y="2.5" width="12" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.7"/><path d="M10.5 18.5h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg> },
            ].map(m => {
              const on = twoFA === m.id;
              return (
                <button key={m.id} onClick={() => pickTwoFA(m.id)} style={{
                  textAlign: 'left', cursor: 'pointer', padding: '14px 16px', borderRadius: 12,
                  border: `1.5px solid ${on ? WBRAND.red : WBRAND.line2}`,
                  background: on ? WBRAND.surface2 : WBRAND.white,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: on ? WBRAND.redSoft : WBRAND.surface, color: on ? WBRAND.red : WBRAND.muted, display: 'grid', placeItems: 'center' }}>{m.icon}</div>
                    <div style={{ width: 18, height: 18, borderRadius: 9, border: `1.5px solid ${on ? WBRAND.red : WBRAND.line2}`, background: on ? WBRAND.red : 'transparent', display: 'grid', placeItems: 'center' }}>{on && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }}/>}</div>
                  </div>
                  <div style={{ fontFamily: WFONT, fontSize: 14, fontWeight: 700, color: WBRAND.ink, marginTop: 12, letterSpacing: '-0.01em' }}>{m.label}</div>
                  <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 2 }}>{m.dest}</div>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 14, padding: '12px 14px', background: WBRAND.surface, borderRadius: 10 }}>
            {WIcon.shield(WBRAND.ink)}
            <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.ink, lineHeight: 1.5 }}>
              {t('We\'ll send your 6-digit code by')} <strong>{twoFA === 'email' ? t('email') : t('SMS')}</strong> {t('every time you sign in or request a withdrawal.')}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title={t('Sign-in security')}>
        <div style={{ padding: '4px 22px 0' }}>
          {[
            { l: 'Password',          v: 'Last changed Mar 12, 2026',  pill: <WPill tone="neutral">{t('Strong')}</WPill>,                                 cta: 'Change' },
            { l: 'Authenticator app', v: '1Password · iPhone 15',      pill: <WPill tone="positive">{WIcon.check(WBRAND.positive)} {t('Active')}</WPill>, cta: 'Reset' },
            { l: 'Passkeys',          v: 'iCloud Keychain · Touch ID', pill: <WPill tone="positive">{WIcon.check(WBRAND.positive)} {t('2 devices')}</WPill>, cta: 'Manage' },
          ].map((r, i, arr) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{t(r.l)}</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 3 }}>{r.v}</div>
              </div>
              {r.pill}
              <WSecondary size="sm">{t(r.cta)}</WSecondary>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title={t('Active sessions')} sub={t('Devices currently signed in to your Kanzasset account.')}>
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
                  {s.curr && <WPill tone="positive">{t('This device')}</WPill>}
                </div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 3 }}>{s.loc} · {s.ts}</div>
              </div>
              {!s.curr && <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.red }}>{t('Revoke')}</button>}
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}

function ProfKYC() {
  const mobile = useIsMobile();
  return (
    <>
      <SectionCard title={t('Verification status')} sub={t('Your verification tier unlocks higher daily limits and physical delivery.')}>
        <div style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: mobile ? 'flex-start' : 'center', gap: 20, marginBottom: 20, flexWrap: mobile ? 'wrap' : 'nowrap' }}>
            <div style={{ width: 64, height: 64, borderRadius: 12, background: WBRAND.redSoft, display: 'grid', placeItems: 'center', color: WBRAND.red, fontFamily: WFONT, fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>T3</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: WFONT, fontSize: 18, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.015em' }}>{t('Tier 3 · Institutional')}</div>
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 4 }}>Verified May 2, 2024 · Renewal Apr 2027</div>
            </div>
            <WPill tone="positive" style={{ fontSize: 12, padding: '6px 12px' }}>{WIcon.check(WBRAND.positive)} {t('Verified')}</WPill>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 4 }}>
            {['Tier 1 · Identity', 'Tier 2 · Address', 'Tier 3 · Institutional'].map((l, i) => (
              <div key={i} style={{ height: 4, borderRadius: 2, background: WBRAND.positive }}/>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
            {['Tier 1 · Identity', 'Tier 2 · Address', 'Tier 3 · Institutional'].map((l, i) => (
              <div key={i} style={{ fontFamily: WFONT, fontSize: 11, fontWeight: 600, color: WBRAND.ink }}>✓ {t(l)}</div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title={t('Submitted documents')}>
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
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{t(d.l)}</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 3 }}>{d.v}</div>
              </div>
              <WPill tone="positive">{WIcon.check(WBRAND.positive)} {t('Approved')}</WPill>
              <WSecondary size="sm">{t('View')}</WSecondary>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title={t('Account limits')}>
        <div style={{ padding: '4px 22px 22px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(2, 1fr)', gap: 12 }}>
            {[
              { l: 'Daily mint limit',          used: '24.5k', total: '500k USDT', pct: 4.9 },
              { l: 'Daily redeem limit',         used: '11.2k', total: '500k USDT', pct: 2.2 },
              { l: 'Daily withdrawal',           used: '12k',   total: '250k USDT', pct: 4.8 },
              { l: 'Physical delivery / month',  used: '0',     total: '20 kg',     pct: 0   },
            ].map((k, i) => (
              <div key={i} style={{ padding: 16, border: `1px solid ${WBRAND.line}`, borderRadius: 12 }}>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t(k.l)}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
                  <WNum size={20} weight={800} style={{ letterSpacing: '-0.02em' }}>{k.used}</WNum>
                  <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted }}>/ {k.total}</span>
                </div>
                <div style={{ height: 4, background: WBRAND.surface, borderRadius: 2, marginTop: 10, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.max(k.pct, 1)}%`, height: '100%', background: WBRAND.accent }}/>
                </div>
                <div style={{ fontFamily: WMONO, fontSize: 11, color: WBRAND.muted, marginTop: 6 }}>{wfmt(k.pct, 1)}% {t('used')}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </>
  );
}

function ProfDestinations() {
  const mobile = useIsMobile();
  const [tab, setTab] = useState('crypto');
  const [addOpen, setAddOpen] = useState(false);

  const cryptoAddrs = [
    { l: 'Cold wallet · USDT', ch: 'Ethereum · ERC-20', a: '0xC4e1A3...8fB9hPq', added: 'Mar 20, 2026', verified: true  },
    { l: 'Cold wallet · USDC', ch: 'Ethereum · ERC-20', a: '0xA1b2C3...4D5e6F7', added: 'Mar 22, 2026', verified: true  },
    { l: 'Ledger · USDT',      ch: 'Ethereum · ERC-20', a: '0x88aF12...e8WzX2k', added: 'Apr 11, 2026', verified: true  },
    { l: 'Hot wallet · USDT',  ch: 'Ethereum · ERC-20', a: '0xDeF456...789aBcD', added: 'May 13, 2026', verified: false },
  ];
  const [bankDef, setBankDef] = useState(0);
  const banks = [
    { bank: 'Emirates NBD',    ccy: 'AED', iban: 'AE07 0331 2345 6789 0001 198'  },
    { bank: 'JP Morgan Chase', ccy: 'USD', iban: '021000021 · 802135 2249'       },
    { bank: 'Garanti BBVA',    ccy: 'EUR', iban: 'TR33 0006 2000 4290 0000 0001' },
    { bank: 'Lloyds Bank',     ccy: 'GBP', iban: 'GB29 LOYD 3092 1031 9876 54'   },
  ];
  const [shipDef, setShipDef] = useState(0);
  const shipAddrs = [
    { label: 'Home',     city: 'Dubai',    line: 'Marina Plaza, Tower 1, Apt 2208',   country: 'UAE'     },
    { label: 'Office',   city: 'Dubai',    line: 'DMCC Almas Tower, Floor 38',        country: 'UAE'     },
    { label: 'Istanbul', city: 'Istanbul', line: 'Levent Mah. Büyükdere Cad. No:185', country: 'Türkiye' },
  ];

  const tabs = [
    { id: 'crypto',   label: t('Crypto addresses'), count: cryptoAddrs.length },
    { id: 'bank',     label: t('Bank accounts'),    count: banks.length       },
    { id: 'shipping', label: t('Shipping'),         count: shipAddrs.length   },
  ];

  return (
    <SectionCard
      title={t('Whitelisted destinations')}
      sub={t('Pre-approved crypto addresses, bank accounts and shipping addresses. Withdrawals and physical delivery can only be sent to verified destinations.')}
      footer={<WPrimary onClick={() => setAddOpen(true)}>{WIcon.plus('#fff')} {tab === 'crypto' ? t('Add new address') : tab === 'bank' ? t('Add bank account') : t('Add shipping address')}</WPrimary>}
    >
      <div style={{ padding: '0 22px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', gap: 4, overflowX: mobile ? 'auto' : 'visible', WebkitOverflowScrolling: 'touch' }}>
        {tabs.map(t => {
          const on = t.id === tab;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '12px 14px 14px', border: 'none', background: 'transparent', cursor: 'pointer', position: 'relative', fontFamily: WFONT, fontSize: 13, fontWeight: on ? 700 : 500, color: on ? WBRAND.ink : WBRAND.muted, letterSpacing: '-0.005em', display: 'flex', alignItems: 'center', gap: 8, marginBottom: -1, flexShrink: 0, whiteSpace: 'nowrap' }}>
              <span>{t.label}</span>
              <span style={{ fontFamily: WFONT, fontSize: 10, fontWeight: 700, background: on ? WBRAND.panel : WBRAND.surface, color: on ? '#fff' : WBRAND.muted, padding: '2px 7px', borderRadius: 10, fontVariantNumeric: 'tabular-nums' }}>{t.count}</span>
              {on && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, background: WBRAND.accent }}/>}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '4px 22px 18px' }}>
        {tab === 'crypto' && cryptoAddrs.map((r, i, arr) => (
          <div key={i} style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: mobile ? 'stretch' : 'center', gap: mobile ? 10 : 14, padding: '14px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: WBRAND.surface, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{WIcon.shield(WBRAND.ink)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', rowGap: 4 }}>
                  <span style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{r.l}</span>
                  {!r.verified && <WPill tone="warn">{t('24h review · 8h left')}</WPill>}
                  {r.verified && <WPill tone="positive">{WIcon.check(WBRAND.positive)} {t('Verified')}</WPill>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3, flexWrap: 'wrap', rowGap: 2 }}>
                  <WMonoNum size={11} color={WBRAND.muted}>{r.a}</WMonoNum>
                  <span style={{ width: 1, height: 10, background: WBRAND.line }}/>
                  <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted }}>{r.ch} · {t('added')} {r.added}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, justifyContent: mobile ? 'flex-end' : 'flex-start' }}>
              <WCopyButton text={r.a}/>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.red, padding: '6px 4px' }}>{t('Remove')}</button>
            </div>
          </div>
        ))}

        {tab === 'bank' && banks.map((b, i, arr) => (
          <div key={i} style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: mobile ? 'stretch' : 'center', gap: mobile ? 10 : 14, padding: '14px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: WBRAND.surface, display: 'grid', placeItems: 'center', fontFamily: WFONT, fontWeight: 800, fontSize: 11, color: WBRAND.ink, letterSpacing: '0.02em', flexShrink: 0 }}>{b.ccy}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', rowGap: 4 }}>
                  <span style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{b.bank}</span>
                  {bankDef === i && <WPill tone="accent">{t('Default')} {b.ccy}</WPill>}
                  <WPill tone="positive">{WIcon.check(WBRAND.positive)} {t('Verified')}</WPill>
                </div>
                <WMonoNum size={11} color={WBRAND.muted} style={{ marginTop: 3, display: 'block', wordBreak: 'break-all' }}>{b.iban}</WMonoNum>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, justifyContent: mobile ? 'flex-end' : 'flex-start' }}>
              {bankDef !== i && <WSecondary size="sm" onClick={() => { setBankDef(i); toast(`${b.bank} ${t('set as default')} ${b.ccy} ${t('account')}`, { title: t('Default updated') }); }}>{t('Make default')}</WSecondary>}
              <WSecondary size="sm">{t('Edit')}</WSecondary>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.red, padding: '6px 4px' }}>{t('Remove')}</button>
            </div>
          </div>
        ))}

        {tab === 'shipping' && shipAddrs.map((a, i, arr) => (
          <div key={i} style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: mobile ? 'stretch' : 'center', gap: mobile ? 10 : 14, padding: '14px 0', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: WBRAND.surface, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s-6-5.5-6-11a6 6 0 1 1 12 0c0 5.5-6 11-6 11z" stroke={WBRAND.ink} strokeWidth="1.7" strokeLinejoin="round"/><circle cx="12" cy="10" r="2.2" stroke={WBRAND.ink} strokeWidth="1.7"/></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', rowGap: 4 }}>
                  <span style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{a.label} · {a.city}</span>
                  {shipDef === i && <WPill tone="accent">{t('Default shipping')}</WPill>}
                  <WPill tone="positive">{WIcon.check(WBRAND.positive)} {t('Verified')}</WPill>
                </div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 3 }}>{a.line}, {a.country}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, justifyContent: mobile ? 'flex-end' : 'flex-start' }}>
              {shipDef !== i && <WSecondary size="sm" onClick={() => { setShipDef(i); toast(`${a.label} · ${a.city} ${t('set as default shipping address')}`, { title: t('Default updated') }); }}>{t('Make default')}</WSecondary>}
              <WSecondary size="sm">{t('Edit')}</WSecondary>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.red, padding: '6px 4px' }}>{t('Remove')}</button>
            </div>
          </div>
        ))}
      </div>
      {addOpen && <AddDestinationModal tab={tab} onClose={() => setAddOpen(false)}/>}
    </SectionCard>
  );
}

// ─── Add destination modal (crypto address / bank / shipping) ─
export function AddDestinationModal({ tab, onClose }) {
  const [submitted, setSubmitted] = useState(false);

  const cfg = {
    crypto: {
      title: t('Add crypto address'),
      sub: t('New addresses require a 24-hour security hold before first withdrawal.'),
      review: t('24-hour security review'),
      fields: [
        { id: 'label',   label: t('Label'),          placeholder: t('e.g. Cold wallet · USDT') },
        { id: 'network', label: t('Network'),        value: 'Ethereum · ERC-20', select: ['Ethereum · ERC-20'] },
        { id: 'address', label: t('Wallet address'), placeholder: '0x…', mono: true },
      ],
    },
    bank: {
      title: t('Add bank account'),
      sub: t('Accounts must be held in your verified legal name (Ahmet Yılmaz).'),
      review: t('24-hour security review'),
      fields: [
        { id: 'bank',  label: t('Bank name'),      placeholder: t('e.g. Emirates NBD') },
        { id: 'ccy',   label: t('Currency'),       value: 'AED', select: ['AED', 'USD', 'EUR', 'GBP'] },
        { id: 'iban',  label: t('IBAN / Account'), placeholder: 'AE07 0331 2345 6789 0001 198', mono: true },
        { id: 'swift', label: t('SWIFT / BIC'),    placeholder: 'EBILAEAD', mono: true },
      ],
    },
    shipping: {
      title: t('Add shipping address'),
      sub: t('We ship insured to UAE, Türkiye, Saudi Arabia and Kuwait.'),
      review: t('Verified instantly'),
      fields: [
        { id: 'label',   label: t('Label'),          placeholder: t('e.g. Home, Office') },
        { id: 'line',    label: t('Street address'), placeholder: t('Building, street, apt') },
        { id: 'city',    label: t('City'),           placeholder: 'Dubai' },
        { id: 'country', label: t('Country'),        value: 'United Arab Emirates', select: ['United Arab Emirates', 'Türkiye', 'Saudi Arabia', 'Kuwait'] },
      ],
    },
  }[tab];

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(10,10,10,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} className="kz-pop" style={{ width: 440, maxWidth: '100%', boxSizing: 'border-box', background: WBRAND.white, borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.22)' }}>
        {submitted ? (
          <>
            <div style={{ padding: '36px 28px 8px', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 32, margin: '0 auto', background: tab === 'shipping' ? 'rgba(15,122,71,0.10)' : 'rgba(183,121,31,0.12)', display: 'grid', placeItems: 'center' }}>
                {tab === 'shipping'
                  ? <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={WBRAND.positive} strokeWidth="1.8"/><path d="M7.5 12.5l3 3 6-6.5" stroke={WBRAND.positive} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : WIcon.shield(WBRAND.warn)}
              </div>
              <h2 style={{ margin: '20px 0 0', fontFamily: WFONT, fontSize: 20, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.02em' }}>
                {tab === 'shipping' ? t('Address added') : t('Submitted for review')}
              </h2>
              <div style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, marginTop: 8, lineHeight: 1.55, padding: '0 12px' }}>
                {tab === 'shipping'
                  ? t('Your new shipping address is ready to use for physical delivery.')
                  : `${t('For your security, this destination will be available for use after a')} ${cfg.review.toLowerCase()}. ${t("We'll notify you once it clears.")}`}
              </div>
            </div>
            <div style={{ padding: '22px 24px 22px' }}>
              <WPrimary size="lg" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>{t('Done')}</WPrimary>
            </div>
          </>
        ) : (
          <>
            <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${WBRAND.line}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <h2 style={{ margin: 0, fontFamily: WFONT, fontSize: 18, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.02em' }}>{cfg.title}</h2>
                <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 5, lineHeight: 1.5 }}>{cfg.sub}</div>
              </div>
              <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', flexShrink: 0, background: WBRAND.surface, cursor: 'pointer', color: WBRAND.ink, display: 'grid', placeItems: 'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
            </div>

            <div style={{ padding: '18px 24px 4px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {cfg.fields.map(f => (
                <div key={f.id}>
                  <div style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.ink, marginBottom: 7, letterSpacing: '-0.005em' }}>{f.label}</div>
                  {f.select ? (
                    <SelectField value={f.value} options={f.select} onChange={() => {}}/>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', height: 44, padding: '0 14px', borderRadius: 10, border: `1px solid ${WBRAND.line2}`, background: WBRAND.white }}>
                      <input placeholder={f.placeholder} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: f.mono ? WMONO : WFONT, fontSize: 13, color: WBRAND.ink, fontWeight: 500 }}/>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {tab !== 'shipping' && (
              <div style={{ padding: '14px 24px 0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: WBRAND.surface, borderRadius: 10 }}>
                  {WIcon.shield(WBRAND.ink)}
                  <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.ink, lineHeight: 1.5 }}>
                    {t('New')} {tab === 'crypto' ? t('addresses') : t('accounts')} {t('are held for')} <strong>{t('24 hours')}</strong> {t('before the first withdrawal as a security measure.')}
                  </div>
                </div>
              </div>
            )}

            <div style={{ padding: '18px 24px 22px', display: 'flex', gap: 8 }}>
              <WSecondary size="lg" onClick={onClose} style={{ flex: 1, justifyContent: 'center', height: 52 }}>{t('Cancel')}</WSecondary>
              <WPrimary size="lg" onClick={() => { setSubmitted(true); toast(tab === 'shipping' ? t('Shipping address added') : `${tab === 'crypto' ? t('Address') : t('Bank account')} ${t('submitted for review')}`, { title: tab === 'shipping' ? t('Address added') : t('Submitted') }); }} style={{ flex: 1, justifyContent: 'center' }}>
                {tab === 'shipping' ? t('Add address') : t('Add & verify')}
              </WPrimary>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ProfPrefs() {
  const [lang, setLangSel] = useState(getLang() === 'tr' ? LANG_TR : LANG_EN);
  const [ccy, setCcy]   = useState('USDT — US dollar tether');
  const [tz, setTz]     = useState('Europe/Istanbul (UTC+03:00)');
  const [numFmt, setNumFmt] = useState(getNumberStyle() === 'eu' ? NUMFMT_EU : NUMFMT_US);

  return (
    <SectionCard title={t('Preferences', 'Tercihler')} sub={t('Language, currency, and notification settings.', 'Dil, para birimi ve bildirim ayarları.')} footer={<WPrimary onClick={() => toast(t('Preferences saved', 'Tercihler kaydedildi'), { title: t('Saved', 'Kaydedildi') })}>{t('Save preferences', 'Tercihleri kaydet')}</WPrimary>}>
      <FormRow label={t('Display language', 'Görüntüleme dili')} hint={t('Used across the web and mobile apps.', 'Web ve mobil uygulamalar genelinde kullanılır.')}>
        <SelectField value={lang} onChange={(v) => { setLangSel(v); setLang(v === LANG_TR ? 'tr' : 'en'); toast(v === LANG_TR ? 'Dil Türkçe olarak ayarlandı' : 'Language set to English', { title: v === LANG_TR ? 'Dil güncellendi' : 'Language updated' }); }} options={[LANG_EN, LANG_TR]}/>
      </FormRow>
      <FormRow label={t('Display currency')} hint={t('Default currency for portfolio totals and quotes.')}>
        <SelectField value={ccy} onChange={setCcy} groups={[
          { label: 'Crypto', options: ['USDT — US dollar tether', 'USDC — USD Coin', 'AHLG — AHL Gold'] },
          { label: 'Fiat',   options: ['USD — US Dollar', 'AED — UAE Dirham', 'EUR — Euro', 'GBP — Pound Sterling'] },
        ]}/>
      </FormRow>
      <FormRow label={t('Number format')} hint={t('How amounts are grouped across the app — thousands and decimal marks.')}>
        <SelectField value={numFmt} onChange={(v) => { setNumFmt(v); setNumberStyle(v === NUMFMT_EU ? 'eu' : 'us'); toast(`${t('Number format set to')} ${v === NUMFMT_EU ? '1.234,56 (Europe)' : '1,234.56 (US / UK)'}`, { title: t('Number format updated') }); }} options={[NUMFMT_US, NUMFMT_EU]}/>
      </FormRow>
      <FormRow label={t('Time zone')} hint={t('Used for timestamps and limit reset windows.')}>
        <SelectField value={tz} onChange={setTz} options={['Europe/Istanbul (UTC+03:00)', 'Asia/Dubai (UTC+04:00)', 'Europe/London (UTC+00:00)', 'Europe/Paris (UTC+01:00)', 'America/New_York (UTC-05:00)', 'Asia/Singapore (UTC+08:00)']}/>
      </FormRow>
      <FormRow label={t('Email notifications')} hint={t('Choose which events trigger an email.')}>
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
              <span style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.ink, fontWeight: 500 }}>{t(r.l)}</span>
            </label>
          ))}
        </div>
      </FormRow>
      <FormRow label={t('Appearance')} hint={t('Switch between light, dark, or follow system.')}>
        <div style={{ display: 'inline-flex', gap: 6 }}>
          {['Light', 'Dark', 'System'].map((m) => {
            const on = getTheme() === m.toLowerCase();
            return (
              <button key={m} onClick={() => { applyTheme(m.toLowerCase()); toast(t('Appearance') + ': ' + t(m), { title: t('Saved') }); }} style={{ padding: '8px 16px', borderRadius: 8, background: on ? WBRAND.panel : WBRAND.white, color: on ? '#fff' : WBRAND.ink, border: `1px solid ${on ? WBRAND.panel : WBRAND.line2}`, cursor: 'pointer', fontFamily: WFONT, fontSize: 12, fontWeight: 700 }}>{t(m)}</button>
            );
          })}
        </div>
      </FormRow>
    </SectionCard>
  );
}

function ProfHelp({ navigate }) {
  return (
    <>
      <SectionCard title={t('Get help')}>
        <div style={{ padding: '4px 22px 18px' }}>
          {[
            { l: 'Contact support',         sub: t('Open & track tickets · 2h response · 24/7'), go: 'support' },
            { l: 'Schedule a private call', sub: t('Tier 3 desk · Mon–Fri · 09:00–18:00 GST') },
            { l: 'Help center',             sub: t('Articles, guides and FAQs') },
            { l: 'Report a security issue', sub: 'security@kanzasset.com · PGP encrypted' },
          ].map((r, i, arr) => (
            <button key={i} onClick={() => r.go && navigate && navigate(r.go)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{t(r.l)}</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 3 }}>{r.sub}</div>
              </div>
              {WIcon.arrowRight(WBRAND.muted)}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title={t('Legal')}>
        <div style={{ padding: '4px 22px 18px' }}>
          {[
            { l: 'Terms of service',       v: 'v4.2 · effective Apr 1, 2026' },
            { l: 'Privacy policy',         v: 'v3.1 · effective Mar 15, 2026' },
            { l: 'Custody agreement',      v: 'Ahlatcı Metal Refinery FZCO · v2.0' },
            { l: 'Regulatory disclosures', v: 'DMCC, ADGM' },
          ].map((r, i, arr) => (
            <button key={i} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${WBRAND.line}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{t(r.l)}</div>
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

export function WebProfile({ navigate, onLogout, initialSection = 'account' }) {
  const mobile = useIsMobile();
  const [section, setSection] = useState(initialSection);
  useEffect(() => { setSection(initialSection); }, [initialSection]);

  const sections = [
    { id: 'account',      label: t('Account'),                  icon: 'M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zM3 22c0-5 4-9 9-9s9 4 9 9' },
    { id: 'security',     label: t('Security'),                 icon: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z' },
    { id: 'kyc',          label: t('Identity & KYC'),           icon: 'M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM8 11a2 2 0 100-4 2 2 0 000 4zm-3 5c1-2 2-3 3-3s2 1 3 3M13 9h5M13 13h5M13 17h3' },
    { id: 'destinations', label: t('Whitelisted destinations'), icon: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4' },
    { id: 'prefs',        label: t('Preferences'),              icon: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.01a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' },
    { id: 'help',         label: t('Help & legal'),             icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 17v.01M12 14a2 2 0 011-2 2 2 0 10-2-3' },
    { id: 'close',        label: t('Close account'),            icon: 'M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z' },
  ];

  return (
    <div style={{ padding: mobile ? '18px 16px 40px' : '28px 32px 48px', overflowY: 'auto', overflowX: 'hidden', height: '100%', boxSizing: 'border-box' }}>

      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '280px 1fr', gap: mobile ? 16 : 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <WCard padding={20}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: 12, background: 'linear-gradient(135deg, #1F1F1F, #4a4a4a)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: WFONT, fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em' }}>AY</div>
              <div style={{ fontFamily: WFONT, fontSize: 16, fontWeight: 800, color: WBRAND.ink, marginTop: 12, letterSpacing: '-0.01em' }}>Ahmet Yılmaz</div>
              <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 2 }}>ahmet@kanzasset.com</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                <WPill tone="positive">{WIcon.check(WBRAND.positive)} {t('Verified')}</WPill>
                <WPill tone="accent">{t('Tier 3')}</WPill>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${WBRAND.line}` }}>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t('Member since')}</div>
                <WMonoNum size={12} style={{ marginTop: 4, display: 'block' }}>Mar 2024</WMonoNum>
              </div>
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 10, color: WBRAND.muted, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t('Tx count')}</div>
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
            <button onClick={onLogout} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: WFONT, fontSize: 13, fontWeight: 600, color: WBRAND.red, textAlign: 'left' }}>{t('Sign out of all devices')}</button>
          </WCard>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          {section === 'account'      && <ProfAccount navigate={navigate}/>}
          {section === 'security'     && <ProfSecurity/>}
          {section === 'kyc'          && <ProfKYC/>}
          {section === 'destinations' && <ProfDestinations/>}
          {section === 'prefs'        && <ProfPrefs/>}
          {section === 'help'         && <ProfHelp navigate={navigate}/>}
          {section === 'close'        && <ProfCloseAccount onLogout={onLogout}/>}
        </div>
      </div>
    </div>
  );
}

// ─── Close account ────────────────────────────────────────────
function ProfCloseAccount({ onLogout }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <>
      <SectionCard title={t('Close account')} sub={t('Permanently close your Kanzasset account.')}>
        <div style={{ padding: '18px 22px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px', background: WBRAND.surface2, border: `1px solid ${WBRAND.line}`, borderRadius: 12 }}>
            {[
              t('Your AHLG balance must be zero — redeem or withdraw all gold first.'),
              t('All open delivery orders must be completed or cancelled.'),
              t('Closing is permanent and cannot be undone. Transaction records are retained for 7 years for compliance.'),
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ width: 5, height: 5, borderRadius: 3, background: WBRAND.muted2, marginTop: 7, flexShrink: 0 }}/>
                <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.ink, lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '14px 22px', borderTop: `1px solid ${WBRAND.line}`, display: 'flex', justifyContent: 'flex-end', background: WBRAND.surface2, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
          <button onClick={() => setConfirmOpen(true)} style={{ height: 44, padding: '0 20px', borderRadius: 10, cursor: 'pointer', background: WBRAND.white, border: `1px solid ${WBRAND.red}`, color: WBRAND.red, fontFamily: WFONT, fontWeight: 700, fontSize: 14, letterSpacing: '-0.005em', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m1 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke={WBRAND.red} strokeWidth="1.7" strokeLinejoin="round"/></svg>
            {t('Close my account')}
          </button>
        </div>
      </SectionCard>
      {confirmOpen && <CloseAccountModal onClose={() => setConfirmOpen(false)} onLogout={onLogout}/>}
    </>
  );
}

function CloseAccountModal({ onClose, onLogout }) {
  const [text, setText] = useState('');
  const ok = text.trim().toUpperCase() === 'CLOSE';
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(10,10,10,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} className="kz-pop" style={{ width: 440, maxWidth: '100%', boxSizing: 'border-box', background: WBRAND.white, borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.22)' }}>
        <div style={{ padding: '28px 28px 0', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: 30, margin: '0 auto', background: WBRAND.redSoft, display: 'grid', placeItems: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17v.01" stroke={WBRAND.red} strokeWidth="2.2" strokeLinecap="round"/><path d="M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" stroke={WBRAND.red} strokeWidth="1.7" strokeLinejoin="round"/></svg>
          </div>
          <h2 style={{ margin: '18px 0 0', fontFamily: WFONT, fontSize: 20, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.02em' }}>{t('Close your account?')}</h2>
          <p style={{ margin: '8px 0 0', fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, lineHeight: 1.55 }}>
            {t('This permanently closes your Kanzasset account and signs you out of all devices. This action')} <strong style={{ color: WBRAND.ink }}>{t('cannot be undone')}</strong>.
          </p>
        </div>
        <div style={{ padding: '20px 28px 0' }}>
          <div style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.ink, marginBottom: 7 }}>
            {t('Type')} <span style={{ fontFamily: WMONO, color: WBRAND.red }}>CLOSE</span> {t('to confirm')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', height: 44, padding: '0 14px', borderRadius: 10, border: `1px solid ${ok ? WBRAND.red : WBRAND.line2}`, background: WBRAND.white }}>
            <input value={text} onChange={e => setText(e.target.value)} placeholder="CLOSE" autoFocus style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: WMONO, fontSize: 14, color: WBRAND.ink, fontWeight: 500, letterSpacing: '0.08em' }}/>
          </div>
        </div>
        <div style={{ padding: '20px 28px 24px', display: 'flex', gap: 8 }}>
          <WSecondary size="lg" onClick={onClose} style={{ flex: 1, justifyContent: 'center', height: 52 }}>{t('Cancel')}</WSecondary>
          <button onClick={() => ok && onLogout && onLogout()} style={{ flex: 1, height: 52, borderRadius: 10, border: 'none', cursor: ok ? 'pointer' : 'not-allowed', opacity: ok ? 1 : 0.45, background: WBRAND.red, color: '#fff', fontFamily: WFONT, fontWeight: 700, fontSize: 15, letterSpacing: '-0.005em' }}>{t('Close account')}</button>
        </div>
      </div>
    </div>
  );
}
