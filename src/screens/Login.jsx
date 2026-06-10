import { useState, useRef } from 'react';
import { t } from '../lib/i18n.js';
import { WBRAND, WFONT, WMONO } from '../lib/index.js';
import { useIsMobile } from '../lib/useResponsive.js';
import { getAuthChannel } from '../lib/authChannel.js';
import { WIcon } from '../components/icons.jsx';
import { WMark, AHLGMark } from '../components/coinicons.jsx';
import { WPrimary, WSecondary, WPill } from '../components/primitives.jsx';
import { WCountdown } from '../components/shared.jsx';

// ─── Shared centered auth shell — brand panel left, form right ──
function WAuthLayout({ children }) {
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
          <WMark size={26}/>
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
          <WMark size={30}/>
          <span style={{ fontFamily: WFONT, fontWeight: 800, fontSize: 21, letterSpacing: '-0.02em' }}>Kanzasset</span>
        </div>

        <div style={{ position: 'relative' }}>
          <AHLGMark size={52}/>
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

const authInput = {
  width: '100%', height: 46, borderRadius: 10, border: `1px solid ${WBRAND.line2}`,
  background: WBRAND.white, padding: '0 14px', outline: 'none',
  fontFamily: WFONT, fontSize: 14, color: WBRAND.ink, fontWeight: 500, boxSizing: 'border-box',
};
const authLink = {
  background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
  fontFamily: WFONT, fontSize: 12, fontWeight: 700, color: WBRAND.ink,
};

function AuthField({ label, trailing, children }) {
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
function WebLogin({ onContinue }) {
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
              <span style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${WBRAND.accent}`, background: WBRAND.accent, display: 'grid', placeItems: 'center' }}>
                {WIcon.check('#fff')}
              </span>
              <span style={{ fontFamily: WFONT, fontSize: 13, color: WBRAND.ink, fontWeight: 500 }}>{t('Keep me signed in')}</span>
            </label>
            <button type="button" style={authLink}>{t('Forgot password?')}</button>
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
          {t('New to Kanzasset?')} <button style={{ ...authLink, fontSize: 13 }}>{t('Request access')}</button>
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

// ─── Full auth lifecycle: login → 2fa → onAuthed ──────────────
export function WebAuth({ onAuthed }) {
  const [stage, setStage] = useState('login'); // login | 2fa

  if (stage === '2fa') return <WebVerify2FA onVerified={onAuthed} onBack={() => setStage('login')}/>;
  return <WebLogin onContinue={() => setStage('2fa')}/>;
}
