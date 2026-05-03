import { useEffect, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { RankEmblem } from '../ui/RankEmblem.jsx';

export function LevelUpCinematic({ fromLevel, toLevel, fromRank, toRank, onDismiss }) {
  const { fantasy } = useTheme();
  useEffect(() => {
    const t = setTimeout(onDismiss, 3600);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return fantasy
    ? <FantasyLevelUp toLevel={toLevel} toRank={toRank} fromRank={fromRank} onDismiss={onDismiss} />
    : <CyberLevelUp   toLevel={toLevel} toRank={toRank} fromRank={fromRank} onDismiss={onDismiss} />;
}

function CyberLevelUp({ toLevel, toRank, fromRank, onDismiss }) {
  return (
    <div onClick={onDismiss} style={{
      position: 'absolute', inset: 0, zIndex: 90,
      background: 'radial-gradient(ellipse at center, rgba(20,5,40,0.95), rgba(0,0,0,0.96))',
      display: 'grid', placeItems: 'center', cursor: 'pointer',
    }}>
      {/* Rays */}
      <div className="rays" style={{
        position: 'absolute', width: 600, height: 600,
        background: 'conic-gradient(from 0deg, transparent 0deg, var(--cyan) 5deg, transparent 10deg, transparent 30deg, var(--violet) 35deg, transparent 40deg, transparent 60deg, var(--cyan) 65deg, transparent 70deg)',
        opacity: 0.5,
      }} />
      <div className="rune" style={{
        position: 'absolute', width: 360, height: 360,
        border: '1px dashed var(--cyan)', borderRadius: '50%',
      }} />
      <div className="ascend" style={{
        textAlign: 'center', position: 'relative', zIndex: 2,
      }}>
        <div className="hud" style={{ fontSize: 11, letterSpacing: '0.4em', color: 'var(--cyan)' }}>
          ⟡ ASCENSION ⟡
        </div>
        <div className="mythic glow-text" style={{ fontSize: 56, fontWeight: 700, marginTop: 8, color: 'var(--ink)' }}>
          LEVEL {toLevel}
        </div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
          <RankEmblem rank={toRank} size={86} pulsing />
        </div>
        {fromRank !== toRank && (
          <div className="hud" style={{ marginTop: 16, fontSize: 11, color: 'var(--gold)', letterSpacing: '0.36em' }}>
            RANK {fromRank} → {toRank}
          </div>
        )}
        <div className="hud" style={{ marginTop: 24, fontSize: 9, color: 'var(--ink-dim)', letterSpacing: '0.32em' }}>
          TAP TO DISMISS
        </div>
      </div>
    </div>
  );
}

function FantasyLevelUp({ toLevel, toRank, fromRank, onDismiss }) {
  const petals = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    id: i, left: Math.random() * 100, dur: 4 + Math.random() * 4, delay: Math.random() * 2.5,
    size: 8 + Math.random() * 10, hue: 80 + Math.random() * 30,
  })), []);

  return (
    <div onClick={onDismiss} style={{
      position: 'absolute', inset: 0, zIndex: 90,
      background: 'radial-gradient(ellipse at center, rgba(20,40,18,0.96), rgba(8,16,8,0.98))',
      display: 'grid', placeItems: 'center', cursor: 'pointer', overflow: 'hidden',
    }}>
      {/* Golden halo ring */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%,-50%)', width: 320, height: 320,
        borderRadius: '50%',
        animation: 'haloBreathe 2.4s ease-in-out infinite, goldenPulse 2.4s ease-in-out infinite',
        border: '1px solid oklch(0.88 0.16 88 / 0.75)',
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%,-50%)', width: 460, height: 460,
        borderRadius: '50%',
        border: '1px dashed oklch(0.88 0.16 88 / 0.4)',
        animation: 'spinSlow 18s linear infinite',
      }} />
      {/* Petals */}
      {petals.map(p => (
        <div key={p.id} className="petal" style={{
          left: `${p.left}%`,
          width: p.size, height: p.size,
          background: `radial-gradient(circle at 30% 30%, oklch(0.92 0.16 ${p.hue}), oklch(0.7 0.18 ${p.hue}))`,
          boxShadow: '0 0 8px oklch(0.88 0.16 88 / 0.7)',
          animation: `petalFall ${p.dur}s ease-in -${p.delay}s infinite`,
        }} />
      ))}

      <div className="ascend" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div className="mythic" style={{
          fontFamily: 'Cinzel Decorative, serif',
          fontSize: 14, letterSpacing: '0.5em',
          color: 'oklch(0.88 0.16 88)',
          textShadow: '0 0 12px oklch(0.88 0.16 88 / 0.6)',
        }}>❦ A NEW BLOOM ❦</div>
        <div style={{
          fontFamily: 'Cinzel Decorative, serif',
          fontSize: 64, fontWeight: 900, marginTop: 6,
          color: '#fff5d0',
          textShadow: '0 0 24px oklch(0.88 0.16 88 / 0.8), 0 4px 0 #2a1a08',
        }}>BLOOM {toLevel}</div>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
          <RankEmblem rank={toRank} size={96} pulsing />
        </div>
        {fromRank !== toRank && (
          <div style={{ marginTop: 16, fontFamily: 'Cinzel, serif', fontStyle: 'italic', fontSize: 14, color: 'oklch(0.88 0.16 88)' }}>
            Bough {fromRank} → {toRank}
          </div>
        )}
        <div style={{ marginTop: 26, fontFamily: 'EB Garamond, serif', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-dim)' }}>
          The world remembers. Walk on.
        </div>
      </div>
    </div>
  );
}
