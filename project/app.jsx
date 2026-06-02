// AHLG / Kanzasset prototype root + tweakable theme
const { useState: useStateApp, useMemo, useEffect } = React;

// ─── Theme presets ──────────────────────────────────────────────
const PALETTES = [
  { id: 'kanzasset', label: 'Kanzasset', red: '#D4202B' },
  { id: 'vault',     label: 'Vault',     red: '#B58A3E' },
  { id: 'currency',  label: 'Currency',  red: '#1E40AF' },
  { id: 'mint',      label: 'Mint',      red: '#0E6B4A' },
];

const SURFACES = {
  bright: {
    ink: '#0A0A0A', muted: '#8A8A8E', line: '#ECECEC',
    surface: '#F5F5F5', surface2: '#FAFAFA', white: '#FFFFFF',
    bodyBg: '#FAFAFA', dark: false,
  },
  warm: {
    ink: '#1A1814', muted: '#8E8A82', line: '#E8E0CF',
    surface: '#F3EBD9', surface2: '#FAF4E6', white: '#FFFBF1',
    bodyBg: '#F1E9D6', dark: false,
  },
  night: {
    ink: '#F4F4F5', muted: '#7C7C82', line: '#262626',
    surface: '#1A1A1A', surface2: '#0F0F0F', white: '#0A0A0A',
    bodyBg: '#000000', dark: true,
  },
};

const TYPE_TONES = {
  minimal:   { titleCase: 'lowercase',  titleWeight: 800, navCase: 'lowercase',  navTracking: '-0.01em' },
  editorial: { titleCase: 'uppercase',  titleWeight: 700, navCase: 'uppercase',  navTracking: '0.08em' },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "kanzasset",
  "surface": "bright",
  "tone": "minimal",
  "lang": "en"
}/*EDITMODE-END*/;

// ─── Apply tweaks → mutate window.BRAND in place ────────────────
function applyTheme(t) {
  const palette = PALETTES.find(p => p.id === t.palette) || PALETTES[0];
  const surface = SURFACES[t.surface] || SURFACES.bright;
  const tone    = TYPE_TONES[t.tone] || TYPE_TONES.minimal;
  Object.assign(window.BRAND, {
    red: palette.red,
    redDark: palette.red,
    ink: surface.ink,
    ink2: surface.ink,
    muted: surface.muted,
    line: surface.line,
    surface: surface.surface,
    surface2: surface.surface2,
    white: surface.white,
    titleCase: tone.titleCase,
    titleWeight: tone.titleWeight,
    navCase: tone.navCase,
    navTracking: tone.navTracking,
    darkMode: surface.dark,
  });
  document.body.style.background = surface.bodyBg;
  window.LANG = t.lang || 'en';
}

function App({ initial = 'wallet', themeKey }) {
  const [tab, setTab] = useStateApp(initial);
  const [shared, setShared] = useStateApp({});

  const navigate = (target, extras = {}) => {
    if (Object.keys(extras).length) setShared({ ...shared, ...extras });
    setTab(target);
  };

  const rtl = isRTL();

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} style={{
      position: 'relative', width: '100%', height: '100%',
      background: window.BRAND.white, overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden',
        paddingTop: 54,
      }}>
        {tab === 'wallet'  && <WalletScreen  state={shared} setState={(p) => setShared({ ...shared, ...p })} navigate={navigate} />}
        {tab === 'mint'    && <MintScreen    state={shared} setState={(p) => setShared({ ...shared, ...p })} navigate={navigate} />}
        {tab === 'redeem'  && <RedeemScreen  state={shared} setState={(p) => setShared({ ...shared, ...p })} navigate={navigate} />}
        {tab === 'profile' && <ProfileScreen state={shared} setState={(p) => setShared({ ...shared, ...p })} navigate={navigate} />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

function FrameOf({ initial, themeKey }) {
  return (
    <IOSDevice width={390} height={844} dark={window.BRAND.darkMode}>
      <App initial={initial} themeKey={themeKey}/>
    </IOSDevice>
  );
}

function Root() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  applyTheme(t);
  const themeKey = `${t.palette}|${t.surface}|${t.tone}|${t.lang}`;

  // Expose a way for nested screens (e.g. profile/language picker) to change
  // the language. Updates the tweak, which re-applies the theme on next render.
  React.useEffect(() => {
    window.setLang = (code) => setTweak('lang', code);
  }, [setTweak]);

  return (
    <>
      <DesignCanvas
        defaultZoom={0.7}
        title="Kanzasset · AHLG mint & redeem"
        subtitle="Mobile (390 × 844) · Manrope · tweakable theme"
      >
        <DCSection id="screens" title="Core screens" subtitle="Each frame is independently interactive — tap the bottom nav, open sheets, switch redeem modes, etc.">
          <DCArtboard id="wallet"  label="Wallet"  width={390} height={844}><FrameOf initial="wallet"  themeKey={themeKey}/></DCArtboard>
          <DCArtboard id="mint"    label="Mint"    width={390} height={844}><FrameOf initial="mint"    themeKey={themeKey}/></DCArtboard>
          <DCArtboard id="redeem"  label="Redeem"  width={390} height={844}><FrameOf initial="redeem"  themeKey={themeKey}/></DCArtboard>
          <DCArtboard id="profile" label="Profile" width={390} height={844}><FrameOf initial="profile" themeKey={themeKey}/></DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks" noDeckControls>
        <TweakSection label="Palette">
          <TweakColor
            label="Brand"
            value={t.palette}
            options={PALETTES.map(p => ({ value: p.id, label: p.label, color: p.red }))}
            onChange={(v) => setTweak('palette', v)}
          />
        </TweakSection>

        <TweakSection label="Surface">
          <TweakRadio
            label="Mode"
            value={t.surface}
            options={[
              { value: 'bright', label: 'Bright' },
              { value: 'warm',   label: 'Warm' },
              { value: 'night',  label: 'Night' },
            ]}
            onChange={(v) => setTweak('surface', v)}
          />
        </TweakSection>

        <TweakSection label="Type tone">
          <TweakRadio
            label="Headings"
            value={t.tone}
            options={[
              { value: 'minimal',   label: 'Minimal' },
              { value: 'editorial', label: 'Editorial' },
            ]}
            onChange={(v) => setTweak('tone', v)}
          />
        </TweakSection>

        <TweakSection label="Language">
          <TweakSelect
            label="Locale"
            value={t.lang}
            options={[
              { value: 'en', label: 'English' },
              { value: 'tr', label: 'Türkçe' },
              { value: 'ar', label: 'العربية (RTL)' },
              { value: 'fr', label: 'Français' },
              { value: 'de', label: 'Deutsch' },
              { value: 'zh', label: '中文' },
            ]}
            onChange={(v) => setTweak('lang', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root/>);
