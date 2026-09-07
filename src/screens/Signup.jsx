import { useState } from 'react';
import { t } from '../lib/i18n.js';
import { WBRAND, WFONT, WMONO } from '../lib/index.js';
import { useIsMobile } from '../lib/useResponsive.js';
import { WMark } from '../components/coinicons.jsx';
import { WPrimary, WSecondary } from '../components/primitives.jsx';
import { WCountdown } from '../components/shared.jsx';
import { AuthField, authInput, authLink, CodeInput, passwordRules, RuleRow } from './Login.jsx';

const COUNTRIES = ['United Arab Emirates', 'Türkiye', 'United Kingdom', 'Germany', 'Singapore', 'Switzerland', 'Saudi Arabia', 'Qatar', 'United States'];
const BLOCKLIST = ['United States'];
const RAIL_TITLES = () => [t('Account type'), t('Location'), t('Email'), t('Password'), t('Identity verification')];

// ─── Dark rail — steps + product pitch (desktop), compact bar (mobile) ──
function SignupRail({ step }) {
  const mobile = useIsMobile();
  const titles = RAIL_TITLES();
  const cur = step >= 6 ? 5 : Math.min(4, step);

  if (mobile) {
    return (
      <div style={{ flexShrink: 0, background: WBRAND.panel, color: '#fff', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <WMark size={26} color="#fff"/>
        <span style={{ fontFamily: WFONT, fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em' }}>Kanzasset</span>
        <span style={{ marginLeft: 'auto', fontFamily: WMONO, fontSize: 10.5, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.55)' }}>
          {cur >= 5 ? t('REVIEW') : t('STEP') + ' ' + (cur + 1) + ' ' + t('OF') + ' 5'}
        </span>
      </div>
    );
  }

  return (
    <div style={{ width: 520, flexShrink: 0, background: WBRAND.panel, color: '#fff', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '48px 48px 44px' }}>
      <div style={{ position: 'absolute', top: -120, right: -120, width: 380, height: 380, borderRadius: 190, background: WBRAND.red, opacity: 0.20, filter: 'blur(70px)' }}/>
      <div style={{ position: 'absolute', bottom: -140, left: -80, width: 320, height: 320, borderRadius: 160, background: '#FAC043', opacity: 0.12, filter: 'blur(80px)' }}/>
      <div className="kz-sheen" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(105deg, transparent 42%, rgba(255, 210, 110, 0.10) 50%, transparent 58%)' }}/>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
        <WMark size={30} color="#fff"/>
        <span style={{ fontFamily: WFONT, fontWeight: 800, fontSize: 21, letterSpacing: '-0.02em' }}>Kanzasset</span>
      </div>

      <div style={{ position: 'relative', marginTop: 44 }}>
        <div style={{ fontFamily: WFONT, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>{t('Open an account')}</div>
        <h2 style={{ margin: '12px 0 0', fontFamily: WFONT, fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.16, color: '#fff' }}>
          {t('A few steps to start holding tokenised gold.')}
        </h2>
      </div>

      <div style={{ position: 'relative', marginTop: 36, display: 'flex', flexDirection: 'column' }}>
        {titles.map((title, i) => {
          const done = i < cur, active = i === cur, isLast = i === titles.length - 1;
          return (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 14, flexShrink: 0, display: 'grid', placeItems: 'center',
                  fontFamily: WMONO, fontSize: 11, fontWeight: 700,
                  background: done ? WBRAND.red : active ? 'rgba(255,255,255,0.12)' : 'transparent',
                  border: active ? '1.5px solid #fff' : done ? `1.5px solid ${WBRAND.red}` : '1.5px solid rgba(255,255,255,0.22)',
                  color: done || active ? '#fff' : 'rgba(255,255,255,0.45)',
                }}>{done ? '✓' : i + 1}</div>
                {!isLast && <div style={{ width: 2, flex: 1, minHeight: 20, background: done ? WBRAND.red : 'rgba(255,255,255,0.16)' }}/>}
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingBottom: 14, opacity: active || done ? 1 : 0.5 }}>
                <div style={{ fontFamily: WFONT, fontSize: 13.5, fontWeight: active ? 800 : 600, letterSpacing: '-0.01em', color: '#fff' }}>{title}</div>
                {active && <div style={{ fontFamily: WFONT, fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{t('In progress')}</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: 'relative', marginTop: 'auto', display: 'flex', alignItems: 'flex-start', gap: 9, fontFamily: WFONT, fontSize: 11.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" stroke="rgba(255,255,255,0.6)" strokeWidth="1.7" strokeLinejoin="round"/></svg>
        <span>
          {step >= 7
            ? t('Your account is active — deposits, buying, selling and delivery are unlocked.')
            : step === 6
            ? t('Documents are in. Our compliance team makes the final decision — typically within 1 business day.')
            : t('Your account stays locked until identity verification and our review are complete.')}
        </span>
      </div>
    </div>
  );
}

const flexCta = { flex: 1, justifyContent: 'center' };
const h1Style = { margin: 0, fontFamily: WFONT, fontSize: 25, fontWeight: 800, letterSpacing: '-0.025em', color: WBRAND.ink };
const subPStyle = { margin: '9px 0 0', fontFamily: WFONT, fontSize: 13.5, lineHeight: 1.6, color: WBRAND.muted };
const fieldLabelStyle = { marginBottom: 7, fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.ink };
const hintStyle = { fontSize: 11, color: WBRAND.muted, marginTop: 6, lineHeight: 1.45 };

// ─── Step 0 — account type ──────────────────────────────────────
function StepAccountType({ type, onPick, onNext, onSignin }) {
  const card = (on) => ({
    display: 'flex', alignItems: 'flex-start', gap: 16, padding: 18, borderRadius: 14, textAlign: 'left', width: '100%', cursor: 'pointer',
    fontFamily: 'inherit', background: on ? WBRAND.white : WBRAND.surface, border: `1.5px solid ${on ? WBRAND.ink : WBRAND.line2}`,
    boxShadow: on ? '0 4px 16px rgba(0,0,0,0.06)' : 'none',
  });
  const tile = (on) => ({ width: 44, height: 44, borderRadius: 11, flexShrink: 0, display: 'grid', placeItems: 'center', background: on ? WBRAND.ink : WBRAND.white, color: on ? '#fff' : WBRAND.ink, border: on ? 'none' : `1px solid ${WBRAND.line2}` });
  const radio = (on) => (
    <span style={{ width: 22, height: 22, borderRadius: 11, flexShrink: 0, background: on ? WBRAND.red : 'transparent', border: on ? 'none' : `1.5px solid ${WBRAND.line2}`, display: 'grid', placeItems: 'center' }}>
      {on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </span>
  );

  return (
    <div>
      <h1 style={h1Style}>{t('Who is this account for?')}</h1>
      <p style={subPStyle}>{t("This decides what we ask next and which verification journey you'll go through.")}</p>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={() => onPick('individual')} style={card(type === 'individual')}>
          <span style={tile(type === 'individual')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.7"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
          </span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontFamily: WFONT, fontSize: 16, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{t('Individual')}</span>
            <span style={{ display: 'block', fontFamily: WFONT, fontSize: 12.5, color: WBRAND.muted, marginTop: 3, lineHeight: 1.5 }}>{t("You're opening an account for yourself, as a natural person.")}</span>
          </span>
          {radio(type === 'individual')}
        </button>
        <button onClick={() => onPick('company')} style={card(type === 'company')}>
          <span style={tile(type === 'company')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 21V7l7-3v17M11 21h9V11h-9" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>
          </span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontFamily: WFONT, fontSize: 16, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.01em' }}>{t('Company / Institution')}</span>
            <span style={{ display: 'block', fontFamily: WFONT, fontSize: 12.5, color: WBRAND.muted, marginTop: 3, lineHeight: 1.5 }}>{t('You’re applying on behalf of a company, fund, foundation or trust.')}</span>
          </span>
          {radio(type === 'company')}
        </button>
      </div>
      {type === 'company' && (
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 11, padding: '13px 14px', background: WBRAND.surface, borderRadius: 10 }}>
          <span style={{ width: 30, height: 30, borderRadius: 8, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" stroke={WBRAND.ink} strokeWidth="1.7" strokeLinejoin="round"/></svg>
          </span>
          <span style={{ fontFamily: WFONT, fontSize: 11.5, color: WBRAND.muted, lineHeight: 1.45 }}>
            {t("For a company account, the first verification step is always the authorised representative's own identity.")}
          </span>
        </div>
      )}
      <WPrimary size="lg" onClick={onNext} style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}>{t('Continue')}</WPrimary>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: WFONT, fontSize: 12.5, color: WBRAND.muted }}>
        <span>{t('Already have an account?')}</span>
        <button onClick={onSignin} style={authLink}>{t('Sign in')}</button>
      </div>
    </div>
  );
}

// ─── Step 1 — location + consents ──────────────────────────────
function StepLocation({ type, nat, res, inc, setNat, setRes, setInc, tos, mkt, toggleTos, toggleMkt, onBack, onNext }) {
  const isCo = type === 'company';
  const hits = (isCo ? [inc, nat, res] : [nat, res]).filter(c => BLOCKLIST.includes(c));
  const blocked = hits.length > 0;
  const locFilled = isCo ? (inc && nat && res) : (nat && res);
  const ok = locFilled && tos && !blocked;

  const select = (value, onChange) => (
    <select value={value} onChange={onChange} style={{ width: '100%', height: 48, borderRadius: 10, border: `1px solid ${WBRAND.line2}`, background: WBRAND.white, padding: '0 12px', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, color: WBRAND.ink, cursor: 'pointer' }}>
      <option value="">{t('Select…')}</option>
      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
  );

  const checkbox = (checked, onToggle, label) => (
    <div onClick={onToggle} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', cursor: 'pointer' }}>
      <span style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1, background: WBRAND.white, border: `1.5px solid ${WBRAND.line2}`, display: 'grid', placeItems: 'center' }}>
        {checked && <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={WBRAND.red} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </span>
      <span style={{ fontFamily: WFONT, fontSize: 12.5, color: WBRAND.muted, lineHeight: 1.5 }}>{label}</span>
    </div>
  );

  return (
    <div>
      <h1 style={h1Style}>{isCo ? t('Where is the company based?') : t('Select your location')}</h1>
      <p style={subPStyle}>{t('We check this against our restricted-jurisdiction list before creating anything. Try United States to see the rejection state.')}</p>
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {isCo && (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, paddingBottom: 9, borderBottom: `1px solid ${WBRAND.line}` }}>
              <span style={{ fontFamily: WMONO, fontSize: 10.5, fontWeight: 500, letterSpacing: '0.08em', color: WBRAND.muted2 }}>{t('THE COMPANY')}</span>
              <span style={{ fontFamily: WFONT, fontSize: 11.5, color: WBRAND.muted }}>{t('Where the entity is registered')}</span>
            </div>
            <div>
              <div style={fieldLabelStyle}>{t('Country of incorporation')}</div>
              {select(inc, e => setInc(e.target.value))}
              <div style={hintStyle}>{t('Where the company is legally registered — the licence or trade register country.')}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, marginTop: 8, paddingBottom: 9, borderBottom: `1px solid ${WBRAND.line}` }}>
              <span style={{ fontFamily: WMONO, fontSize: 10.5, fontWeight: 500, letterSpacing: '0.08em', color: WBRAND.muted2 }}>{t('AUTHORISED REPRESENTATIVE')}</span>
              <span style={{ fontFamily: WFONT, fontSize: 11.5, color: WBRAND.muted }}>{t('You — the person opening this account')}</span>
            </div>
          </>
        )}
        <div>
          <div style={fieldLabelStyle}>{t('Nationality')}</div>
          {select(nat, e => setNat(e.target.value))}
          <div style={hintStyle}>{isCo ? t('Your own nationality, as shown on the passport or ID you’ll verify with.') : t("As shown on the passport or ID you'll verify with.")}</div>
        </div>
        <div>
          <div style={fieldLabelStyle}>{t('Country of residence')}</div>
          {select(res, e => setRes(e.target.value))}
          <div style={hintStyle}>{isCo ? t('Where you personally live today — checked alongside the company country.') : t('Where you actually live today — this determines whether we can serve you.')}</div>
        </div>
      </div>

      {blocked && (
        <div style={{ marginTop: 16, padding: '16px 18px', background: WBRAND.redSoft, borderRadius: 12, border: `1px solid ${WBRAND.redSoft}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={WBRAND.redDeep} strokeWidth="1.8"/><path d="M12 7.5v6M12 16.4v.1" stroke={WBRAND.redDeep} strokeWidth="1.9" strokeLinecap="round"/></svg>
            <span style={{ fontFamily: WFONT, fontSize: 13.5, fontWeight: 800, color: WBRAND.redDeep, letterSpacing: '-0.01em' }}>{t("We can't offer our services in your region")}</span>
          </div>
          <p style={{ margin: '8px 0 0', fontFamily: WFONT, fontSize: 12.5, lineHeight: 1.55, color: WBRAND.redDeep }}>
            {t('Kanzasset is not available for')} {hits[0]} {t('at this time. Nothing has been saved and no account was created.')}
          </p>
          <a href="mailto:onboarding@kanzasset.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 14, height: 40, padding: '0 14px', borderRadius: 9, background: WBRAND.white, border: `1px solid ${WBRAND.redSoft}`, fontFamily: WFONT, fontSize: 12.5, fontWeight: 700, color: WBRAND.red }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke={WBRAND.red} strokeWidth="1.7"/><path d="M4 7l8 6 8-6" stroke={WBRAND.red} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {t('Request your country — onboarding@kanzasset.com')}
          </a>
        </div>
      )}

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {checkbox(tos, toggleTos, t('I agree to the Terms of Service and the Privacy Policy.'))}
        {checkbox(mkt, toggleMkt, <>{t('Send me product updates and market insights.')} <span style={{ color: WBRAND.muted2 }}>({t('optional')})</span></>)}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <WSecondary size="lg" onClick={onBack} style={{ width: 120, justifyContent: 'center' }}>{t('Back')}</WSecondary>
        <WPrimary size="lg" onClick={onNext} disabled={!ok} style={flexCta}>{t('Continue')}</WPrimary>
      </div>
    </div>
  );
}

// ─── Step 2a — email ─────────────────────────────────────────────
function StepEmail({ email, setEmail, onBack, onSend }) {
  const ok = /.+@.+\..+/.test(email);
  return (
    <div>
      <span style={{ width: 52, height: 52, borderRadius: 14, background: WBRAND.surface, display: 'grid', placeItems: 'center' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke={WBRAND.ink} strokeWidth="1.7"/><path d="M4 7.5l8 5.5 8-5.5" stroke={WBRAND.ink} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
      <h1 style={{ ...h1Style, marginTop: 18 }}>{t("What's your email address?")}</h1>
      <p style={subPStyle}>{t("This is the address you'll sign in with. We'll send a 6-digit code to confirm it.")}</p>
      <div style={{ marginTop: 24 }}>
        <AuthField label={t('Email address')}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={authInput}/>
        </AuthField>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
        <WSecondary size="lg" onClick={onBack} style={{ width: 120, justifyContent: 'center' }}>{t('Back')}</WSecondary>
        <WPrimary size="lg" onClick={onSend} disabled={!ok} style={flexCta}>{t('Send code')}</WPrimary>
      </div>
      <div style={{ marginTop: 16, padding: '13px 14px', background: WBRAND.surface, borderRadius: 10, fontFamily: WFONT, fontSize: 11.5, color: WBRAND.muted, lineHeight: 1.5 }}>
        {t('We never ask for the code by phone or chat. Make sure')} <b style={{ color: WBRAND.ink }}>no-reply@kanzasset.com</b> {t("isn't blocked.")}
      </div>
    </div>
  );
}

// ─── Step 2b — email OTP ────────────────────────────────────────
function StepEmailCode({ email, onChangeEmail, onVerified }) {
  const [code, setCode] = useState('');
  const [err, setErr] = useState(false);
  const [resends, setResends] = useState(0);

  const handleChange = (v) => {
    setCode(v);
    if (v.length === 6) {
      if (v === '000000') { setErr(true); return; }
      setErr(false);
      setTimeout(onVerified, 450);
    } else setErr(false);
  };

  return (
    <div>
      <span style={{ width: 52, height: 52, borderRadius: 14, background: WBRAND.surface, display: 'grid', placeItems: 'center' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke={WBRAND.ink} strokeWidth="1.7"/><path d="M4 7.5l8 5.5 8-5.5" stroke={WBRAND.ink} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
      <h1 style={{ ...h1Style, marginTop: 18 }}>{t('Enter the 6-digit code')}</h1>
      <p style={subPStyle}>{t('We sent it to')} <b style={{ color: WBRAND.ink }}>{email}</b>. <button onClick={onChangeEmail} style={{ ...authLink, fontSize: 13.5 }}>{t('Change email')}</button></p>
      <div style={{ marginTop: 26 }}>
        <CodeInput value={code} onChange={handleChange} error={err}/>
      </div>
      {err && <div style={{ marginTop: 12, fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.red }}>{t("That code isn't right. Check the latest email — older codes stop working.")}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16 }}>
        <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted }}>{t("Didn't get a code?")}</span>
        <button onClick={() => setResends(n => n + 1)} disabled={resends >= 3} style={{ ...authLink, opacity: resends >= 3 ? 0.4 : 1, cursor: resends >= 3 ? 'not-allowed' : 'pointer' }}>
          {resends >= 3 ? t('Resend limit reached') : t('Resend')}
        </button>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: WBRAND.muted2 }}><WCountdown seconds={180}/></span>
      </div>
      <div style={{ marginTop: 20, padding: '13px 14px', background: WBRAND.surface, borderRadius: 10, fontFamily: WFONT, fontSize: 11.5, color: WBRAND.muted, lineHeight: 1.5 }}>
        {t("Didn't get it? Check spam, and make sure")} <b style={{ color: WBRAND.ink }}>no-reply@kanzasset.com</b> {t("isn't blocked. We never ask for the code by phone or chat.")}
      </div>
    </div>
  );
}

// ─── Step 3 — password ──────────────────────────────────────────
function StepPassword({ onBack, onNext }) {
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const rules = passwordRules(pw);
  const ok = rules.len && rules.case && rules.num && rules.sym && pw === pw2;

  return (
    <div>
      <h1 style={h1Style}>{t('Create your password')}</h1>
      <p style={subPStyle}>{t("You'll sign in with your email and this password. MFA comes after activation.")}</p>
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <AuthField label={t('Password')}>
          <input value={pw} onChange={e => setPw(e.target.value)} type="password" placeholder={t('At least 12 characters')} style={authInput}/>
        </AuthField>
        <AuthField label={t('Confirm password')}>
          <input value={pw2} onChange={e => setPw2(e.target.value)} type="password" placeholder={t('Repeat it')} style={authInput}/>
          {pw2.length > 0 && pw !== pw2 && <div style={{ marginTop: 6, fontFamily: WFONT, fontSize: 11, color: WBRAND.red }}>{t("Passwords don't match yet.")}</div>}
        </AuthField>
      </div>
      <div style={{ marginTop: 18, padding: '16px 18px', borderRadius: 12, background: WBRAND.surface, border: `1px solid ${WBRAND.line2}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 18px' }}>
        <RuleRow ok={rules.len}>{t('At least 12 characters')}</RuleRow>
        <RuleRow ok={rules.case}>{t('Upper and lower case')}</RuleRow>
        <RuleRow ok={rules.num}>{t('At least one number')}</RuleRow>
        <RuleRow ok={rules.sym}>{t('One special character')}</RuleRow>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <WSecondary size="lg" onClick={onBack} style={{ width: 120, justifyContent: 'center' }}>{t('Back')}</WSecondary>
        <WPrimary size="lg" onClick={onNext} disabled={!ok} style={flexCta}>{t('Continue')}</WPrimary>
      </div>
    </div>
  );
}

// ─── Step 4 — identity verification intro ───────────────────────
function StepVerifyIntro({ type, onStart, onSkip }) {
  const row = (n, title, sub, on) => (
    <div style={{ display: 'flex', gap: 14, padding: '14px 16px', alignItems: 'flex-start', borderBottom: n < 3 ? `1px solid ${WBRAND.line}` : 'none', background: on ? WBRAND.surface2 : WBRAND.white }}>
      <span style={{ width: 26, height: 26, borderRadius: 13, flexShrink: 0, display: 'grid', placeItems: 'center', background: on ? WBRAND.ink : WBRAND.surface, color: on ? '#fff' : WBRAND.muted, fontFamily: WMONO, fontSize: 12, fontWeight: 700 }}>{n}</span>
      <span>
        <span style={{ display: 'block', fontFamily: WFONT, fontSize: 13.5, fontWeight: 700, color: WBRAND.ink }}>{title}</span>
        <span style={{ display: 'block', fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 2, lineHeight: 1.45 }}>{sub}</span>
      </span>
    </div>
  );
  return (
    <div style={{ textAlign: 'center' }}>
      <span style={{ width: 64, height: 64, borderRadius: 18, background: WBRAND.redSoft, display: 'grid', placeItems: 'center', margin: '0 auto' }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={WBRAND.positive} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
      <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 6, background: WBRAND.redSoft, fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.positive }}>{t('Account created')}</div>
      <h1 style={{ margin: '14px 0 0', fontFamily: WFONT, fontSize: 25, fontWeight: 800, letterSpacing: '-0.025em', color: WBRAND.ink }}>{t('One last step: identity verification')}</h1>
      <p style={{ margin: '10px auto 0', maxWidth: 420, fontFamily: WFONT, fontSize: 13.5, lineHeight: 1.6, color: WBRAND.muted }}>{t('Handled securely by our verification partner. Have your passport or Emirates ID ready.')}</p>
      {type === 'company' && (
        <p style={{ margin: '10px auto 0', maxWidth: 420, fontFamily: WFONT, fontSize: 12.5, lineHeight: 1.55, color: WBRAND.muted }}>
          {t('For a company account the first step is the authorised representative’s own identity — the company details come right after.')}
        </p>
      )}
      <div style={{ textAlign: 'left', marginTop: 24, border: `1px solid ${WBRAND.line}`, borderRadius: 14, overflow: 'hidden' }}>
        {row(1, t('Identity & document check'), t('ID, selfie, address and a short questionnaire — in one session.'), true)}
        {row(2, t('Our review'), t('Kanzasset compliance makes the final acceptance decision.'), false)}
        {row(3, t('Account activated'), t('Deposit, mint, redeem and transfer unlock.'), false)}
      </div>
      <WPrimary size="lg" onClick={onStart} style={{ width: '100%', justifyContent: 'center', marginTop: 22, gap: 9 }}>
        {t('Start identity verification')}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 6 }}><path d="M5 12h13M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </WPrimary>
      <WSecondary size="lg" onClick={onSkip} style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>{t('Skip for now — go to my profile')}</WSecondary>
    </div>
  );
}

// ─── Step 5 — Sumsub placeholder ────────────────────────────────
function StepSumsub({ onDone }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.muted }}>
          <span style={{ width: 26, height: 26, borderRadius: 8, background: WBRAND.ink, display: 'grid', placeItems: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/></svg>
          </span>
          {t('Secure session — Sumsub')}
        </span>
        <span style={{ fontFamily: WMONO, fontSize: 10.5, letterSpacing: '0.06em', color: WBRAND.muted2 }}>{t('STEP 1 OF 3 · DOCUMENT')}</span>
      </div>
      <h1 style={{ ...h1Style, marginTop: 18 }}>{t('Identity verification')}</h1>
      <p style={subPStyle}>{t("This part runs inside our verification partner's secure session. Placeholder — the real Sumsub screens will be dropped in here.")}</p>
      <div style={{ marginTop: 22, border: `1.5px dashed ${WBRAND.line2}`, borderRadius: 16, background: WBRAND.surface2, padding: 26 }}>
        <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 800, color: WBRAND.ink }}>{t('Passport or national ID')}</div>
        <div style={{ marginTop: 4, fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, lineHeight: 1.5 }}>{t('Photograph the document — all four corners visible, no glare.')}</div>
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ height: 126, borderRadius: 12, border: `1px solid ${WBRAND.line2}`, background: WBRAND.white, display: 'grid', placeItems: 'center', gap: 8 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2.5" stroke={WBRAND.muted2} strokeWidth="1.6"/><circle cx="12" cy="12.5" r="3.2" stroke={WBRAND.muted2} strokeWidth="1.6"/></svg>
            <span style={{ fontFamily: WFONT, fontSize: 11.5, fontWeight: 700, color: WBRAND.muted }}>{t('Front side')}</span>
          </div>
          <div style={{ height: 126, borderRadius: 12, border: `1px solid ${WBRAND.line2}`, background: WBRAND.white, display: 'grid', placeItems: 'center', gap: 8 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2.5" stroke={WBRAND.muted2} strokeWidth="1.6"/><path d="M7 11h6M7 14.5h9" stroke={WBRAND.muted2} strokeWidth="1.6" strokeLinecap="round"/></svg>
            <span style={{ fontFamily: WFONT, fontSize: 11.5, fontWeight: 700, color: WBRAND.muted }}>{t('Back side')}</span>
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', borderRadius: 12, border: `1px solid ${WBRAND.line2}`, background: WBRAND.white }}>
          <span style={{ width: 40, height: 40, borderRadius: 20, background: WBRAND.surface, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="3.6" stroke={WBRAND.muted2} strokeWidth="1.6"/><path d="M5 20c0-3.4 3.1-6 7-6s7 2.6 7 6" stroke={WBRAND.muted2} strokeWidth="1.6" strokeLinecap="round"/></svg>
          </span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontFamily: WFONT, fontSize: 12.5, fontWeight: 700, color: WBRAND.ink }}>{t('Liveness & selfie')}</span>
            <span style={{ display: 'block', fontFamily: WFONT, fontSize: 11.5, color: WBRAND.muted, marginTop: 2 }}>{t('A short face scan, right after the document.')}</span>
          </span>
        </div>
      </div>
      <WPrimary size="lg" onClick={onDone} style={{ width: '100%', justifyContent: 'center', marginTop: 22 }}>{t('Simulate: verification completed')}</WPrimary>
      <p style={{ margin: '14px 0 0', fontFamily: WFONT, fontSize: 11.5, color: WBRAND.muted2, lineHeight: 1.5 }}>{t('Leaving this session? You can return from your profile.')}</p>
    </div>
  );
}

// ─── Step 6 — under review ──────────────────────────────────────
function StepReview({ onApproved, onLimited }) {
  const row = (n, title, sub, tone) => (
    <div style={{ display: 'flex', gap: 14, padding: '14px 16px', alignItems: 'center', borderBottom: n < 3 ? `1px solid ${WBRAND.line}` : 'none', background: n === 2 ? WBRAND.surface2 : WBRAND.white }}>
      {tone === 'done'
        ? <span style={{ width: 26, height: 26, borderRadius: 13, flexShrink: 0, display: 'grid', placeItems: 'center', background: WBRAND.redSoft }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={WBRAND.positive} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        : <span style={{ width: 26, height: 26, borderRadius: 13, flexShrink: 0, display: 'grid', placeItems: 'center', background: tone === 'active' ? WBRAND.ink : WBRAND.surface, color: tone === 'active' ? '#fff' : WBRAND.muted, fontFamily: WMONO, fontSize: 12, fontWeight: 700 }}>{n}</span>}
      <span style={{ flex: 1, fontFamily: WFONT, fontSize: 13.5, fontWeight: 700, color: tone === 'pending' ? WBRAND.muted2 : WBRAND.ink }}>{title}</span>
      <span style={{ fontFamily: WFONT, fontSize: 11.5, fontWeight: 700, color: tone === 'done' ? WBRAND.positive : WBRAND.muted }}>{sub}</span>
    </div>
  );
  return (
    <div style={{ textAlign: 'center' }}>
      <span style={{ width: 64, height: 64, borderRadius: 18, background: WBRAND.surface, display: 'grid', placeItems: 'center', margin: '0 auto' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={WBRAND.ink} strokeWidth="1.7"/><path d="M12 7.5V12l3 2" stroke={WBRAND.ink} strokeWidth="1.7" strokeLinecap="round"/></svg>
      </span>
      <div style={{ margin: '16px 0 0', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 6, background: WBRAND.surface, fontFamily: WMONO, fontSize: 10.5, fontWeight: 500, letterSpacing: '0.06em', color: WBRAND.muted }}>{t('DOCUMENTS SUBMITTED')}</div>
      <h1 style={{ margin: '14px 0 0', fontFamily: WFONT, fontSize: 25, fontWeight: 800, letterSpacing: '-0.025em', color: WBRAND.ink }}>{t("We're reviewing your application")}</h1>
      <p style={{ margin: '10px auto 0', maxWidth: 430, fontFamily: WFONT, fontSize: 13.5, lineHeight: 1.6, color: WBRAND.muted }}>
        {t('Your documents passed the automated checks. Kanzasset compliance makes the final decision — typically within 1 business day(s). We’ll email you as soon as it’s done.')}
      </p>
      <div style={{ textAlign: 'left', marginTop: 24, border: `1px solid ${WBRAND.line}`, borderRadius: 14, overflow: 'hidden' }}>
        {row(1, t('Identity & document check'), t('Passed'), 'done')}
        {row(2, t('Our review'), t('In progress'), 'active')}
        {row(3, t('Account activated'), '', 'pending')}
      </div>
      <WPrimary size="lg" onClick={onApproved} style={{ width: '100%', justifyContent: 'center', marginTop: 22 }}>{t('Simulate: review approved')}</WPrimary>
      <WSecondary size="lg" onClick={onLimited} style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>{t('Go to my profile (limited access)')}</WSecondary>
    </div>
  );
}

// ─── Step 7 — activated ─────────────────────────────────────────
function StepActivated({ onGo }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <span style={{ width: 64, height: 64, borderRadius: 18, background: WBRAND.redSoft, display: 'grid', placeItems: 'center', margin: '0 auto' }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={WBRAND.positive} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
      <div style={{ margin: '16px 0 0', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 6, background: WBRAND.redSoft, fontFamily: WFONT, fontSize: 11, fontWeight: 700, color: WBRAND.positive }}>{t('Account activated')}</div>
      <h1 style={{ margin: '14px 0 0', fontFamily: WFONT, fontSize: 25, fontWeight: 800, letterSpacing: '-0.025em', color: WBRAND.ink }}>{t("You're all set")}</h1>
      <p style={{ margin: '10px auto 0', maxWidth: 420, fontFamily: WFONT, fontSize: 13.5, lineHeight: 1.6, color: WBRAND.muted }}>{t('Your account is approved. Deposits, buying, selling and delivery are unlocked.')}</p>
      <div style={{ textAlign: 'left', marginTop: 24, padding: 16, border: `1px solid ${WBRAND.line}`, borderRadius: 14, background: WBRAND.white }}>
        <div style={{ fontFamily: WFONT, fontSize: 13, fontWeight: 800, color: WBRAND.ink }}>{t('Next: fund your account')}</div>
        <div style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted, marginTop: 3, lineHeight: 1.45 }}>{t('Bank transfer or stablecoin deposit — minting starts once funds land.')}</div>
      </div>
      <WPrimary size="lg" onClick={onGo} style={{ width: '100%', justifyContent: 'center', marginTop: 22, gap: 9 }}>
        {t('Go to my profile')}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 6 }}><path d="M5 12h13M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </WPrimary>
    </div>
  );
}

// ─── Full signup flow ───────────────────────────────────────────
export function WebSignup({ onActivated, onSignin }) {
  const mobile = useIsMobile();
  const [step, setStep] = useState(0);
  const [type, setType] = useState('individual');
  const [nat, setNat] = useState('');
  const [res, setRes] = useState('');
  const [inc, setInc] = useState('');
  const [tos, setTos] = useState(false);
  const [mkt, setMkt] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const next = () => setStep(s => Math.min(7, s + 1));
  const back = () => setStep(s => Math.max(0, s - 1));

  const barTitle = step >= 7 ? t('Account settings') : step === 6 ? t('Application review') : step === 5 ? t('Identity verification') : t('Create your account');
  const barSub = step >= 7 ? t('Your profile and verification status') : step === 6 ? t('Waiting on our compliance decision') : step === 5 ? t('Handled by our verification partner') : t('Step') + ' ' + (step + 1) + ' ' + t('of') + ' 5';

  let content;
  if (step === 0) content = <StepAccountType type={type} onPick={setType} onNext={next} onSignin={onSignin}/>;
  else if (step === 1) content = <StepLocation type={type} nat={nat} res={res} inc={inc} setNat={setNat} setRes={setRes} setInc={setInc} tos={tos} mkt={mkt} toggleTos={() => setTos(v => !v)} toggleMkt={() => setMkt(v => !v)} onBack={back} onNext={next}/>;
  else if (step === 2 && !sent) content = <StepEmail email={email} setEmail={setEmail} onBack={back} onSend={() => setSent(true)}/>;
  else if (step === 2 && sent) content = <StepEmailCode email={email} onChangeEmail={() => setSent(false)} onVerified={next}/>;
  else if (step === 3) content = <StepPassword onBack={back} onNext={next}/>;
  else if (step === 4) content = <StepVerifyIntro type={type} onStart={next} onSkip={onActivated}/>;
  else if (step === 5) content = <StepSumsub onDone={next}/>;
  else if (step === 6) content = <StepReview onApproved={next} onLimited={onActivated}/>;
  else content = <StepActivated onGo={onActivated}/>;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: mobile ? 'column' : 'row', fontFamily: WFONT, background: WBRAND.white, overflow: 'hidden' }}>
      <SignupRail step={step}/>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ height: 64, flexShrink: 0, background: WBRAND.white, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 32px', borderBottom: `1px solid ${WBRAND.line}` }}>
          <span style={{ fontFamily: WFONT, fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em', color: WBRAND.ink }}>{barTitle}</span>
          <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted }}>{barSub}</span>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <div style={{ maxWidth: 520, margin: '0 auto', padding: mobile ? '28px 20px' : '44px 40px' }}>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
