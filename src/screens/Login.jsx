import { useState, useRef } from 'react';
import { t } from '../lib/i18n.js';
import { WBRAND, WFONT, WMONO } from '../lib/index.js';
import { useIsMobile } from '../lib/useResponsive.js';
import { getAuthChannel } from '../lib/authChannel.js';
import { WIcon } from '../components/icons.jsx';
import { WMark, AGOLDMark } from '../components/coinicons.jsx';
import { WPrimary, WSecondary, WPill } from '../components/primitives.jsx';
import { WCountdown } from '../components/shared.jsx';
import { WebSignup } from './Signup.jsx';

// ─── Shared centered auth shell — brand panel left, form right ──
export function WAuthLayout({ children }) {
  const mobile = useIsMobile();

  // On mobile: drop the big brand panel, show a compact brand bar above a full-width form.
  if (mobile) {
    return (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        fontFamily: WFONT, background: WBRAND.surface, overflowY: 'auto',
      }}>
        <div style={{
          flexShrink: 0, background: WBRAND.panel, color: '#fff',
          padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <WMark size={26} color="#fff"/>
          <span style={{ fontFamily: WFONT, fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em' }}>Kanzasset</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '28px 18px 40px' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      fontFamily: WFONT, background: WBRAND.white, overflow: 'hidden',
    }}>
      {/* Left brand panel */}
      <div style={{
        width: 520, flexShrink: 0, background: WBRAND.panel, color: '#fff',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px 48px 44px',
      }}>
        <div style={{ position: 'absolute', top: -120, right: -120, width: 380, height: 380, borderRadius: 190, background: WBRAND.red, opacity: 0.20, filter: 'blur(70px)' }}/>
        <div style={{ position: 'absolute', bottom: -140, left: -80, width: 320, height: 320, borderRadius: 160, background: '#FAC043', opacity: 0.12, filter: 'blur(80px)' }}/>
        <div className="kz-sheen" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(105deg, transparent 42%, rgba(255, 210, 110, 0.10) 50%, transparent 58%)' }}/>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
          <WMark size={30} color="#fff"/>
          <span style={{ fontFamily: WFONT, fontWeight: 800, fontSize: 21, letterSpacing: '-0.02em' }}>Kanzasset</span>
        </div>

        <div style={{ position: 'relative' }}>
          <AGOLDMark size={52}/>
          <h2 style={{ margin: '24px 0 0', fontFamily: WFONT, fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{t('Gold you can hold,')}<br/><span className="kz-gold-text">{t('tokenised.')}</span></h2>
          <p style={{ margin: '16px 0 0', fontFamily: WFONT, fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', maxWidth: 360 }}>
            {t('Mint, redeem and take delivery of investment-grade gold — backed 1:1 by bullion in the Ahlatcı Metal Refinery vault.')}
          </p>
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 18 }}>
          {[
            { k: t('Reserve ratio'), v: '100%' },
            { k: t('Vaulted gold'), v: '142.7 kg' },
            { k: t('Audited'), v: t('Monthly') },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              {i > 0 && <span style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.14)' }}/>}
              <div>
                <div style={{ fontFamily: WFONT, fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em' }}>{s.v}</div>
                <div style={{ fontFamily: WFONT, fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.k}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form area */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: WBRAND.surface }}>
        <div style={{ width: 400, maxWidth: '100%' }}>{children}</div>
      </div>
    </div>
  );
}

export const authInput = {
  width: '100%', height: 46, borderRadius: 10, border: `1px solid ${WBRAND.line2}`,
  background: WBRAND.white, padding: '0 14px', outline: 'none',
  fontFamily: WFONT, fontSize: 14, color: WBRAND.ink, fontWeight: 500, boxSizing: 'border-box',
};
export const authLink = {
  background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
  fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.red,
};
const authBackLink = {
  display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none',
  cursor: 'pointer', fontFamily: WFONT, fontSize: 13, fontWeight: 600, color: WBRAND.muted, padding: 0, marginBottom: 22,
};
const authIconBadge = {
  width: 52, height: 52, borderRadius: 14, background: WBRAND.surface, border: `1px solid ${WBRAND.line}`,
  display: 'grid', placeItems: 'center',
};
const authNoteBox = {
  marginTop: 18, display: 'flex', alignItems: 'flex-start', gap: 11,
  padding: '13px 14px', background: WBRAND.white, border: `1px solid ${WBRAND.line}`, borderRadius: 10,
};

function BackToSignIn({ onClick, children }) {
  return (
    <button onClick={onClick} style={authBackLink}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H6M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>
      {children}
    </button>
  );
}

// ─── 6-digit code entry (email OTP, sign-in 2FA, password reset) ──
export function CodeInput({ value, onChange, error, disabled }) {
  const mobile = useIsMobile();
  const refs = useRef([]);
  const digits = value.split('');

  const setDigit = (i, v) => {
    const d = v.replace(/\D/g, '').slice(-1);
    const next = value.split(''); next[i] = d;
    onChange(next.join('').slice(0, 6));
    if (d && i < 5 && refs.current[i + 1]) refs.current[i + 1].focus();
  };
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0 && refs.current[i - 1]) refs.current[i - 1].focus();
  };

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <input key={i} ref={el => refs.current[i] = el} value={digits[i] || ''} inputMode="numeric" maxLength={1}
          onChange={e => setDigit(i, e.target.value)} onKeyDown={e => onKey(i, e)} autoFocus={i === 0} disabled={disabled}
          style={{
            ...(mobile ? { flex: 1, minWidth: 0, width: 'auto' } : { width: 54 }),
            height: 60, borderRadius: 10, textAlign: 'center',
            border: `1.5px solid ${error ? WBRAND.red : digits[i] ? WBRAND.ink : WBRAND.line2}`,
            background: WBRAND.white, outline: 'none',
            fontFamily: WMONO, fontSize: mobile ? 20 : 24, fontWeight: 600, color: WBRAND.ink, boxSizing: 'border-box',
          }}/>
      ))}
    </div>
  );
}

// ─── Live password-rule checklist ──────────────────────────────
export function passwordRules(pw) {
  return {
    len: pw.length >= 12,
    case: /[a-z]/.test(pw) && /[A-Z]/.test(pw),
    num: /[0-9]/.test(pw),
    sym: /[^A-Za-z0-9]/.test(pw),
  };
}

export function RuleRow({ ok, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <span style={{ width: 18, height: 18, borderRadius: 9, border: `1.5px solid ${WBRAND.line2}`, flexShrink: 0, display: 'grid', placeItems: 'center' }}>
        {ok && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={WBRAND.positive} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </span>
      <span style={{ fontFamily: WFONT, fontSize: 12.5, color: WBRAND.ink }}>{children}</span>
    </div>
  );
}

export function AuthField({ label, trailing, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
        <span style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.ink, letterSpacing: '-0.005em' }}>{label}</span>
        {trailing}
      </div>
      {children}
    </div>
  );
}

// ─── Step 1 — email + password ────────────────────────────────
function WebLogin({ onContinue, onForgot, onSignup }) {
  const [email, setEmail] = useState('ahmet@kanzasset.com');
  const [pw, setPw] = useState('••••••••••');
  const [showPw, setShowPw] = useState(false);

  return (
    <WAuthLayout>
      <div>
        <h1 style={{ margin: 0, fontFamily: WFONT, fontSize: 26, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.025em' }}>{t('Sign in')}</h1>
        <p style={{ margin: '8px 0 0', fontFamily: WFONT, fontSize: 13, color: WBRAND.muted }}>{t('Welcome back. Enter your credentials to continue.')}</p>

        <form onSubmit={e => { e.preventDefault(); onContinue(); }} style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AuthField label={t('Email address')}>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@company.com" style={authInput}/>
          </AuthField>

          <AuthField label={t('Password')} trailing={
            <button type="button" onClick={() => setShowPw(!showPw)} style={authLink}>{showPw ? t('Hide') : t('Show')}</button>
          }>
            <input value={pw} onChange={e => setPw(e.target.value)} type={showPw ? 'text' : 'password'} placeholder="••••••••" style={authInput}/>
          </AuthField>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <span style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${WBRAND.red}`, background: WBRAND.red, display: 'grid', placeItems: 'center' }}>
                {WIcon.check('#fff')}
              </span>
              <span style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.ink, fontWeight: 500 }}>{t('Keep me signed in')}</span>
            </label>
            <button type="button" onClick={onForgot} style={authLink}>{t('Forgot password?')}</button>
          </div>

          <WPrimary size="lg" onClick={onContinue} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
            {t('Continue')}
          </WPrimary>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
          <span style={{ flex: 1, height: 1, background: WBRAND.line }}/>
          <span style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted2, fontWeight: 600, letterSpacing: '0.04em' }}>{t('OR')}</span>
          <span style={{ flex: 1, height: 1, background: WBRAND.line }}/>
        </div>

        <WSecondary size="lg" onClick={onContinue} style={{ width: '100%', justifyContent: 'center', height: 52 }}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" stroke={WBRAND.ink} strokeWidth="1.7" strokeLinejoin="round"/></svg>}>
          {t('Sign in with passkey')}
        </WSecondary>

        <p style={{ margin: '24px 0 0', textAlign: 'center', fontFamily: WFONT, fontSize: 13, color: WBRAND.muted }}>
          {t('New to Kanzasset?')} <button onClick={onSignup} style={{ ...authLink, fontSize: 13 }}>{t('Create an account')}</button>
        </p>
      </div>
    </WAuthLayout>
  );
}

// ─── Step 2 — email / SMS verification code ───────────────────
function WebVerify2FA({ onVerified, onBack }) {
  const mobile = useIsMobile();
  const channel = getAuthChannel();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const refs = useRef([]);
  const masked = channel === 'email' ? 'a••••t@kanzasset.com' : '+90 532 ••• 7890';
  const full = code.join('').length === 6;

  const setDigit = (i, v) => {
    const d = v.replace(/\D/g, '').slice(-1);
    const next = [...code]; next[i] = d; setCode(next);
    if (d && i < 5 && refs.current[i + 1]) refs.current[i + 1].focus();
  };
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0 && refs.current[i - 1]) refs.current[i - 1].focus();
    if (e.key === 'Enter' && full) { e.preventDefault(); onVerified(); }
  };

  return (
    <WAuthLayout>
      <div>
        <button onClick={onBack} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none',
          cursor: 'pointer', fontFamily: WFONT, fontSize: 13, fontWeight: 600, color: WBRAND.muted, padding: 0, marginBottom: 18,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {t('Back')}
        </button>

        <div style={{ width: 44, height: 44, borderRadius: 11, background: WBRAND.redSoft, display: 'grid', placeItems: 'center', marginBottom: 16 }}>
          {WIcon.shield(WBRAND.red)}
        </div>
        <h1 style={{ margin: 0, fontFamily: WFONT, fontSize: 26, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.025em' }}>{t('Two-factor verification')}</h1>
        <p style={{ margin: '8px 0 0', fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, lineHeight: 1.5 }}>
          {t('Enter the 6-digit code we sent to')} <strong style={{ color: WBRAND.ink }}>{masked}</strong>.
        </p>

        {/* Selected channel (fixed from Security settings) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20, padding: '12px 14px', background: WBRAND.surface, borderRadius: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, display: 'grid', placeItems: 'center', color: WBRAND.ink, flexShrink: 0 }}>
            {channel === 'email'
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="6" y="2.5" width="12" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.7"/><path d="M10.5 18.5h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.ink }}>{channel === 'email' ? t('Code sent via email') : t('Code sent via SMS')}</div>
            <div style={{ fontFamily: WFONT, fontSize: 11, color: WBRAND.muted, marginTop: 1 }}>{masked}</div>
          </div>
          <WPill tone="neutral">2FA</WPill>
        </div>

        {/* Code inputs */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', marginTop: 20 }}>
          {code.map((d, i) => (
            <input key={i} ref={el => refs.current[i] = el} value={d} inputMode="numeric" maxLength={1}
              onChange={e => setDigit(i, e.target.value)} onKeyDown={e => onKey(i, e)} autoFocus={i === 0}
              style={{
                ...(mobile ? { flex: 1, minWidth: 0, width: 'auto' } : { width: 54 }),
                height: 60, borderRadius: 10, textAlign: 'center',
                border: `1.5px solid ${d ? WBRAND.ink : WBRAND.line2}`, background: WBRAND.white, outline: 'none',
                fontFamily: WMONO, fontSize: mobile ? 20 : 24, fontWeight: 600, color: WBRAND.ink, boxSizing: 'border-box',
              }}/>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
          <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted }}>{t("Didn't get a code?")}</span>
          <button style={authLink}>{t('Resend')}</button>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: WBRAND.muted2 }}><WCountdown seconds={299}/></span>
        </div>

        <WPrimary size="lg" onClick={() => full && onVerified()} style={{ width: '100%', justifyContent: 'center', marginTop: 24, opacity: full ? 1 : 0.45, pointerEvents: full ? 'auto' : 'none' }}>
          {t('Verify & sign in')}
        </WPrimary>
      </div>
    </WAuthLayout>
  );
}

// ─── Forgot password · step 1 — enter email ────────────────────
function WebForgotEmail({ email, onEmailChange, onSent, onBack }) {
  return (
    <WAuthLayout>
      <div>
        <BackToSignIn onClick={onBack}>{t('Back to sign in')}</BackToSignIn>
        <span style={authIconBadge}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="16" height="11" rx="2.5" stroke={WBRAND.ink} strokeWidth="1.7"/><path d="M8 10V7.5a4 4 0 018 0V10" stroke={WBRAND.ink} strokeWidth="1.7" strokeLinecap="round"/><circle cx="12" cy="15.5" r="1.4" fill={WBRAND.ink}/></svg>
        </span>
        <h1 style={{ margin: '20px 0 0', fontFamily: WFONT, fontSize: 26, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.025em' }}>{t('Forgot your password?')}</h1>
        <p style={{ margin: '8px 0 0', fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, lineHeight: 1.5 }}>
          {t("Enter the email address you registered with and we'll send a 6-digit reset code, valid for 10 minutes.")}
        </p>
        <div style={{ marginTop: 24 }}>
          <AuthField label={t('Email address')}>
            <input value={email} onChange={e => onEmailChange(e.target.value)} type="email" placeholder="you@example.com" style={authInput}/>
          </AuthField>
        </div>
        <WPrimary size="lg" onClick={onSent} disabled={!/.+@.+\..+/.test(email)} style={{ width: '100%', justifyContent: 'center', marginTop: 22 }}>
          {t('Send reset code')}
        </WPrimary>
        <div style={authNoteBox}>
          <span style={{ width: 30, height: 30, borderRadius: 8, background: WBRAND.surface, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            {WIcon.shield(WBRAND.ink)}
          </span>
          <span style={{ fontFamily: WFONT, fontSize: 11.5, color: WBRAND.muted, lineHeight: 1.45 }}>
            {t("For your security we don't confirm whether an address is registered — you'll see the same screen either way.")}
          </span>
        </div>
      </div>
    </WAuthLayout>
  );
}

// ─── Forgot password · step 2 — enter the reset code ───────────
function WebResetCode({ email, onVerified, onChangeEmail, onBack }) {
  const [code, setCode] = useState('');
  const [err, setErr] = useState(false);
  const [resends, setResends] = useState(0);

  const handleChange = (v) => {
    setCode(v);
    if (v.length === 6) {
      if (v === '000000') setErr(true);
      else { setErr(false); onVerified(); }
    } else {
      setErr(false);
    }
  };

  return (
    <WAuthLayout>
      <div>
        <BackToSignIn onClick={onBack}>{t('Back to sign in')}</BackToSignIn>
        <span style={authIconBadge}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke={WBRAND.ink} strokeWidth="1.7"/><path d="M4 7.5l8 5.5 8-5.5" stroke={WBRAND.ink} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
        <h1 style={{ margin: '20px 0 0', fontFamily: WFONT, fontSize: 26, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.025em' }}>{t('Enter the reset code')}</h1>
        <p style={{ margin: '8px 0 0', fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, lineHeight: 1.5 }}>
          {t('If an account exists for')} <strong style={{ color: WBRAND.ink }}>{email}</strong>, {t('a 6-digit code is on its way.')} <button onClick={onChangeEmail} style={{ ...authLink, fontSize: 13 }}>{t('Change email')}</button>
        </p>
        <div style={{ marginTop: 26 }}>
          <CodeInput value={code} onChange={handleChange} error={err}/>
        </div>
        {err && <div style={{ marginTop: 12, fontFamily: WFONT, fontSize: 12, fontWeight: 600, color: WBRAND.red }}>{t("That code isn't right. Check the latest email — older codes stop working.")}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16 }}>
          <span style={{ fontFamily: WFONT, fontSize: 12, color: WBRAND.muted }}>{t("Didn't get a code?")}</span>
          <button onClick={() => setResends(n => n + 1)} disabled={resends >= 3} style={{ ...authLink, opacity: resends >= 3 ? 0.4 : 1, cursor: resends >= 3 ? 'not-allowed' : 'pointer' }}>
            {resends >= 3 ? t('Resend limit reached') : t('Resend')}
          </button>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: WBRAND.muted2 }}><WCountdown seconds={599}/></span>
        </div>
        <div style={authNoteBox}>
          <span style={{ fontFamily: WFONT, fontSize: 11.5, color: WBRAND.muted, lineHeight: 1.5 }}>
            {t('Check spam if it hasn’t arrived. We never ask for this code by phone or chat.')}
          </span>
        </div>
      </div>
    </WAuthLayout>
  );
}

// ─── Forgot password · step 3 — set a new password ─────────────
function WebNewPassword({ onUpdated, onBack }) {
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const rules = passwordRules(pw);
  const ok = rules.len && rules.case && rules.num && rules.sym && pw === pw2;

  return (
    <WAuthLayout>
      <div>
        <span style={authIconBadge}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="16" height="11" rx="2.5" stroke={WBRAND.ink} strokeWidth="1.7"/><path d="M8 10V7.5a4 4 0 018 0V10" stroke={WBRAND.ink} strokeWidth="1.7" strokeLinecap="round"/><circle cx="12" cy="15.5" r="1.4" fill={WBRAND.ink}/></svg>
        </span>
        <h1 style={{ margin: '20px 0 0', fontFamily: WFONT, fontSize: 26, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.025em' }}>{t('Set a new password')}</h1>
        <p style={{ margin: '8px 0 0', fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, lineHeight: 1.5 }}>{t("Choose a password you haven't used on Kanzasset before.")}</p>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AuthField label={t('New password')}>
            <input value={pw} onChange={e => setPw(e.target.value)} type="password" placeholder={t('At least 12 characters')} style={authInput}/>
          </AuthField>
          <AuthField label={t('Confirm new password')}>
            <input value={pw2} onChange={e => setPw2(e.target.value)} type="password" placeholder={t('Repeat it')} style={authInput}/>
            {pw2.length > 0 && pw !== pw2 && <div style={{ marginTop: 6, fontFamily: WFONT, fontSize: 11, color: WBRAND.red }}>{t("Passwords don't match yet.")}</div>}
          </AuthField>
        </div>
        <div style={{ marginTop: 18, padding: '16px 18px', borderRadius: 12, background: WBRAND.white, border: `1px solid ${WBRAND.line}`, display: 'flex', flexDirection: 'column', gap: 9 }}>
          <RuleRow ok={rules.len}>{t('At least 12 characters')}</RuleRow>
          <RuleRow ok={rules.case}>{t('Upper and lower case')}</RuleRow>
          <RuleRow ok={rules.num && rules.sym}>{t('A number and a special character')}</RuleRow>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <WSecondary size="lg" onClick={onBack} style={{ width: 120, justifyContent: 'center' }}>{t('Back')}</WSecondary>
          <WPrimary size="lg" onClick={onUpdated} disabled={!ok} style={{ flex: 1, justifyContent: 'center' }}>{t('Update password')}</WPrimary>
        </div>
      </div>
    </WAuthLayout>
  );
}

// ─── Forgot password · step 4 — confirmation ────────────────────
function WebResetDone({ onSignin }) {
  return (
    <WAuthLayout>
      <div style={{ textAlign: 'center' }}>
        <span style={{ width: 64, height: 64, borderRadius: 18, background: WBRAND.redSoft, display: 'grid', placeItems: 'center', margin: '0 auto' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={WBRAND.positive} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
        <h1 style={{ margin: '20px 0 0', fontFamily: WFONT, fontSize: 26, fontWeight: 800, color: WBRAND.ink, letterSpacing: '-0.025em' }}>{t('Password updated')}</h1>
        <p style={{ margin: '10px 0 0', fontFamily: WFONT, fontSize: 13, color: WBRAND.muted, lineHeight: 1.6 }}>
          {t("You can sign in with your new password now. We've signed you out everywhere else and sent a confirmation email.")}
        </p>
        <WPrimary size="lg" onClick={onSignin} style={{ width: '100%', justifyContent: 'center', marginTop: 26 }}>{t('Sign in')}</WPrimary>
        <p style={{ margin: '16px 0 0', fontFamily: WFONT, fontSize: 11.5, color: WBRAND.muted2, lineHeight: 1.5 }}>
          {t("Didn't request this change?")} <a href="#" style={{ fontWeight: 700 }}>{t('Contact support immediately.')}</a>
        </p>
      </div>
    </WAuthLayout>
  );
}

// ─── Full auth lifecycle: login → 2fa / signup / reset → onAuthed ──
export function WebAuth({ onAuthed }) {
  const [stage, setStage] = useState('login');
  const [resetEmail, setResetEmail] = useState('');

  const goLogin = () => setStage('login');

  if (stage === '2fa') return <WebVerify2FA onVerified={onAuthed} onBack={goLogin}/>;
  if (stage === 'signup') return <WebSignup onActivated={onAuthed} onSignin={goLogin}/>;
  if (stage === 'forgot-email') return (
    <WebForgotEmail email={resetEmail} onEmailChange={setResetEmail} onSent={() => setStage('forgot-code')} onBack={goLogin}/>
  );
  if (stage === 'forgot-code') return (
    <WebResetCode email={resetEmail} onVerified={() => setStage('forgot-password')} onChangeEmail={() => setStage('forgot-email')} onBack={() => setStage('forgot-email')}/>
  );
  if (stage === 'forgot-password') return (
    <WebNewPassword onUpdated={() => setStage('forgot-done')} onBack={() => setStage('forgot-code')}/>
  );
  if (stage === 'forgot-done') return <WebResetDone onSignin={goLogin}/>;

  return <WebLogin onContinue={() => setStage('2fa')} onForgot={() => setStage('forgot-email')} onSignup={() => setStage('signup')}/>;
}
