import { useState, useEffect } from 'react';
import { WBRAND, WFONT, WMONO, wfmt } from '../lib/index.js';

// ─── Price chart ──────────────────────────────────────────────
export function WPriceChart({ data, width = 760, height = 260, color = WBRAND.red, showGrid = true, showAxis = true, padding = { top: 16, right: 12, bottom: 28, left: 56 } }) {
  const pad = padding;
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const min = Math.min(...data.map(d => d.v));
  const max = Math.max(...data.map(d => d.v));
  const range = max - min || 1;
  const yMin = min - range * 0.08;
  const yMax = max + range * 0.08;
  const yRange = yMax - yMin;

  const x = i => pad.left + (i / (data.length - 1)) * innerW;
  const y = v => pad.top + (1 - (v - yMin) / yRange) * innerH;

  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.v).toFixed(1)}`).join(' ');
  const area = `${path} L ${x(data.length - 1).toFixed(1)} ${pad.top + innerH} L ${x(0).toFixed(1)} ${pad.top + innerH} Z`;

  const yTicks = [];
  for (let i = 0; i <= 4; i++) {
    const v = yMin + (yRange * (4 - i)) / 4;
    yTicks.push({ v, y: pad.top + (i / 4) * innerH });
  }

  const xTicks = [];
  if (showAxis) {
    for (const i of [0, Math.floor(data.length / 4), Math.floor(data.length / 2), Math.floor(data.length * 3 / 4), data.length - 1]) {
      xTicks.push({ x: x(i), t: data[i].t });
    }
  }

  const gradId = 'wpc-grad-' + Math.abs(Math.sin(width * height)).toString(36).slice(2, 8);

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {showGrid && yTicks.map((t, i) => (
        <line key={i} x1={pad.left} y1={t.y} x2={pad.left + innerW} y2={t.y}
          stroke={WBRAND.line} strokeWidth="1" strokeDasharray={i === 4 ? '0' : '3 3'} />
      ))}
      {showAxis && yTicks.map((t, i) => (
        <text key={'yt' + i} x={pad.left - 8} y={t.y + 3}
          fontFamily={WMONO} fontSize="10" fill={WBRAND.muted} textAnchor="end">
          {wfmt(t.v, 2)}
        </text>
      ))}
      <path d={area} fill={`url(#${gradId})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1].v)} r="4" fill={color} />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1].v)} r="8" fill={color} opacity="0.18" />
      {showAxis && xTicks.map((t, i) => (
        <text key={'xt' + i} x={t.x} y={pad.top + innerH + 18}
          fontFamily={WMONO} fontSize="10" fill={WBRAND.muted} textAnchor="middle">
          {t.t}
        </text>
      ))}
    </svg>
  );
}

// ─── Sparkline ────────────────────────────────────────────────
export function WSparkline({ data, width = 140, height = 36, color = WBRAND.red }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data.map(d => d.v));
  const max = Math.max(...data.map(d => d.v));
  const r = max - min || 1;
  const x = i => (i / (data.length - 1)) * width;
  const y = v => height - 2 - ((v - min) / r) * (height - 4);
  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.v).toFixed(1)}`).join(' ');
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Range tabs ───────────────────────────────────────────────
export function WRangeTabs({ value, onChange, options = ['1D', '1W', '1M', '3M', '1Y', 'ALL'] }) {
  return (
    <div style={{
      display: 'inline-flex', gap: 2, padding: 3,
      background: WBRAND.surface, borderRadius: 8,
    }}>
      {options.map(o => {
        const on = o === value;
        return (
          <button key={o} onClick={() => onChange(o)} style={{
            height: 26, padding: '0 10px', border: 'none', cursor: 'pointer',
            background: on ? WBRAND.white : 'transparent',
            color: on ? WBRAND.ink : WBRAND.muted,
            fontFamily: WFONT, fontWeight: 600, fontSize: 11,
            letterSpacing: '0.02em',
            borderRadius: 6,
            boxShadow: on ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
          }}>{o}</button>
        );
      })}
    </div>
  );
}

// ─── Quote countdown ──────────────────────────────────────────
export function WQuoteCountdown({ seconds = 10 }) {
  const [n, setN] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setN(x => (x <= 1 ? seconds : x - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const r = 5;
  const C = 2 * Math.PI * r;
  const offset = C * (1 - n / seconds);

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: WBRAND.redSoft, color: WBRAND.red,
      borderRadius: 6, padding: '3px 10px 3px 6px',
      fontFamily: WMONO, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.02em', fontVariantNumeric: 'tabular-nums',
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14" style={{ display: 'block', transform: 'rotate(-90deg)' }}>
        <circle cx="7" cy="7" r={r} fill="none" stroke={WBRAND.red} strokeWidth="1.5" opacity="0.22"/>
        <circle cx="7" cy="7" r={r} fill="none" stroke={WBRAND.red} strokeWidth="1.5"
          strokeDasharray={C} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset .9s linear' }}/>
      </svg>
      {n}s
    </span>
  );
}
