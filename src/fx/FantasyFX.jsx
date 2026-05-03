// All fantasy-only environmental FX layers, gated by data-theme="fantasy" in CSS.
import { useMemo } from 'react';

const RUNES = ['ᚠ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᛁ', 'ᛗ', 'ᚾ', 'ᛟ', 'ᛏ'];

export function FantasyFX({ intensity = 1 }) {
  const safe = Math.max(0, Math.min(2, intensity));

  const petals = useMemo(() => Array.from({ length: Math.round(14 * safe) }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    duration: 9 + Math.random() * 11,
    delay: Math.random() * 12,
    size: 8 + Math.random() * 8,
    hue: 80 + Math.random() * 30,
  })), [safe]);

  const embers = useMemo(() => Array.from({ length: Math.round(10 * safe) }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    duration: 6 + Math.random() * 6,
    delay: Math.random() * 10,
    size: 2 + Math.random() * 3,
    drift: -30 + Math.random() * 60,
  })), [safe]);

  const runes = useMemo(() => Array.from({ length: Math.round(6 * safe) }, (_, i) => ({
    id: i,
    glyph: RUNES[i % RUNES.length],
    left: 8 + Math.random() * 84,
    top: 18 + Math.random() * 56,
    duration: 10 + Math.random() * 8,
    delay: Math.random() * 12,
    size: 16 + Math.random() * 10,
    color: Math.random() > 0.5 ? 'var(--gold)' : 'var(--cyan)',
  })), [safe]);

  const fogBlobs = useMemo(() => [
    { top: '20%', duration: 50, delay: 0  },
    { top: '55%', duration: 70, delay: 8  },
    { top: '78%', duration: 60, delay: 16 },
  ], []);

  return (
    <div className="fantasy-fx" aria-hidden>
      {/* Petals */}
      {petals.map(p => (
        <div key={`p${p.id}`} className="petal" style={{
          left:  `${p.left}%`,
          width:  p.size, height: p.size,
          background: `radial-gradient(circle at 30% 30%, oklch(0.92 0.15 ${p.hue}), oklch(0.7 0.18 ${p.hue}))`,
          boxShadow: '0 0 6px oklch(0.88 0.16 88 / 0.5)',
          animationDuration:  `${p.duration}s`,
          animationDelay:     `-${p.delay}s`,
        }} />
      ))}
      {/* Embers */}
      {embers.map(e => (
        <div key={`e${e.id}`} className="ember" style={{
          left: `${e.left}%`,
          width: e.size, height: e.size,
          background: 'oklch(0.88 0.16 88)',
          boxShadow: '0 0 8px oklch(0.88 0.16 88), 0 0 14px oklch(0.78 0.16 60)',
          ['--drift']: `${e.drift}px`,
          animationDuration: `${e.duration}s`,
          animationDelay:    `-${e.delay}s`,
        }} />
      ))}
      {/* Floating runes */}
      {runes.map(r => (
        <span key={`r${r.id}`} className="float-rune" style={{
          left:  `${r.left}%`,
          top:   `${r.top}%`,
          fontSize: r.size,
          color:    r.color,
          textShadow: `0 0 12px ${r.color}`,
          animationDuration: `${r.duration}s`,
          animationDelay:    `-${r.delay}s`,
        }}>{r.glyph}</span>
      ))}
      {/* Fog blobs */}
      {fogBlobs.map((f, i) => (
        <div key={`f${i}`} className="fog-blob" style={{
          top: f.top,
          animationDuration: `${f.duration}s`,
          animationDelay:    `-${f.delay}s`,
        }} />
      ))}

      {/* Vine corner ornaments */}
      <VineCorner pos="tl" />
      <VineCorner pos="tr" />
      <VineCorner pos="bl" />
      <VineCorner pos="br" />

      {/* Distant lightning flash */}
      <Lightning />
    </div>
  );
}

function VineCorner({ pos }) {
  const flip = pos === 'tr' || pos === 'br' ? -1 : 1;
  const flipY = pos === 'bl' || pos === 'br' ? -1 : 1;
  const cls = `vine-grow vine-${pos}`;
  const style = {
    position: 'absolute', width: 110, height: 110,
    pointerEvents: 'none',
    transform: `scale(${flip}, ${flipY})`,
    [pos.includes('t') ? 'top' : 'bottom']: 0,
    [pos.includes('l') ? 'left' : 'right']: 0,
    opacity: 0.55,
  };
  return (
    <svg viewBox="0 0 110 110" className={cls} style={style}>
      <path d="M2 108 Q2 60 30 40 Q60 24 80 14" stroke="oklch(0.78 0.18 88 / 0.85)" strokeWidth="1.2" fill="none" />
      <g><circle cx="22" cy="58" r="3" fill="oklch(0.78 0.18 88 / 0.7)" /></g>
      <g><circle cx="40" cy="38" r="3" fill="oklch(0.78 0.16 60 / 0.65)" /></g>
      <g><path d="M58 24 q4 -8 -2 -10 q-4 4 2 10z" fill="oklch(0.78 0.18 88 / 0.65)" /></g>
      <g><path d="M76 16 q4 -8 -2 -10 q-4 4 2 10z" fill="oklch(0.78 0.16 60 / 0.55)" /></g>
    </svg>
  );
}

function Lightning() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(220,235,200,0.18), transparent 70%)',
      animation: 'lightningStrike 24s ease-out infinite',
      mixBlendMode: 'screen',
      pointerEvents: 'none',
    }} />
  );
}
