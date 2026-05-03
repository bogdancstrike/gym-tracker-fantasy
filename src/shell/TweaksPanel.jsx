import { useState } from 'react';
import { THEMES, useTheme } from '../contexts/ThemeContext.jsx';
import { useGame } from '../contexts/GameContext.jsx';
import { Segmented } from '../ui/Segmented.jsx';
import { ClassViewer3D } from '../characters/ClassViewer3D.jsx';

export function TweaksPanel({ visible, onClose, fxIntensity, setFxIntensity, previewClass, setPreviewClass, previewBoss, setPreviewBoss }) {
  const { themeKey, setThemeKey, fantasy } = useTheme();
  const { difficulty, setDifficulty, setLevelUp, activeAvatar } = useGame();
  const [open, setOpen] = useState(visible);
  if (!visible) return null;

  return (
    <div className="tweaks-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div className="mythic" style={{ fontSize: 14, color: 'var(--cyan)', letterSpacing: '0.1em' }}>TWEAKS</div>
        <button onClick={onClose} style={{
          background: 'transparent', border: 'none', color: 'var(--ink-dim)', cursor: 'pointer',
          fontSize: 16, padding: 0, lineHeight: 1,
        }}>×</button>
      </div>

      <label>WORLD THEME</label>
      <div style={{ display: 'flex', gap: 8 }}>
        {Object.entries(THEMES).map(([k, v]) => (
          <ThemeSwatch key={k} themeKey={k} theme={v} active={themeKey === k} onClick={() => setThemeKey(k)} />
        ))}
      </div>

      <label>QUEST DIFFICULTY</label>
      <Segmented options={['easy', 'normal', 'hard', 'nightmare']} value={difficulty} onChange={setDifficulty} />

      <label>TRIGGER LEVEL UP</label>
      <button onClick={() => setLevelUp({ fromLevel: activeAvatar.level, toLevel: activeAvatar.level + 1, fromRank: activeAvatar.rank, toRank: activeAvatar.rank })}
        style={{
          width: '100%', padding: '8px 10px', border: '1px solid var(--line)',
          background: 'color-mix(in oklab, var(--cyan) 20%, transparent)',
          color: 'var(--ink)', borderRadius: 8, cursor: 'pointer',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.16em',
        }}>⟡ LEVEL UP</button>

      {fantasy && (
        <>
          <label>3D CHAMPION PREVIEW</label>
          <div style={{
            height: 180,
            background: 'linear-gradient(180deg, rgba(40,30,12,0.4), rgba(8,16,8,0.95))',
            borderRadius: 12, border: '1px solid oklch(0.78 0.16 88 / 0.4)',
            display: 'grid', placeItems: 'center', overflow: 'hidden', marginTop: 6,
          }}>
            <ClassViewer3D classId={previewClass} size={180} showStage autoRotate />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
            {['mage','assassin','paladin','berserker','monarch','ranger','necromancer','monk','spellblade'].map(id => (
              <button key={id} onClick={() => setPreviewClass(id)} style={{
                padding: '5px 9px', borderRadius: 6,
                border: `1px solid ${previewClass === id ? 'oklch(0.86 0.16 88)' : 'rgba(255,255,255,0.15)'}`,
                background: previewClass === id ? 'oklch(0.86 0.16 88 / 0.18)' : 'transparent',
                color: previewClass === id ? 'oklch(0.92 0.12 88)' : 'var(--ink-dim)',
                fontFamily: 'Cinzel, serif', fontSize: 9, letterSpacing: '0.16em',
                cursor: 'pointer', textTransform: 'uppercase',
              }}>{id}</button>
            ))}
          </div>

          <label>FANTASY INTENSITY · {Math.round(fxIntensity * 100)}%</label>
          <input type="range" min="0" max="2" step="0.1" value={fxIntensity}
            onChange={(e) => setFxIntensity(parseFloat(e.target.value))} />
        </>
      )}

      <div style={{ marginTop: 14, padding: '8px 10px', background: 'rgba(13,15,30,0.5)', border: '1px solid var(--line)', borderRadius: 8, fontSize: 10, color: 'var(--ink-dim)', lineHeight: 1.5 }}>
        <span style={{ color: 'var(--cyan)' }}>◆</span> Each theme transforms colors, fonts, background motion, and quest cinematics.
      </div>
    </div>
  );
}

function ThemeSwatch({ theme, active, onClick }) {
  const isFantasy = theme.mode === 'fantasy';
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: 0, cursor: 'pointer', textAlign: 'left',
      border: `1.5px solid ${active ? theme.cyan : 'rgba(139,148,255,0.18)'}`,
      borderRadius: 10, overflow: 'hidden',
      background: 'transparent', color: 'inherit',
      boxShadow: active ? `0 0 14px color-mix(in oklab, ${theme.cyan} 40%, transparent)` : 'none',
      transition: 'all 200ms',
    }}>
      <div style={{
        height: 56, position: 'relative', overflow: 'hidden',
        background: isFantasy
          ? `radial-gradient(ellipse 80% 70% at 50% 100%, ${theme.cyan}66, transparent 65%),
             radial-gradient(ellipse 60% 40% at 50% 0%, ${theme.gold}33, transparent 60%),
             linear-gradient(180deg, #0a1812, #05100a)`
          : `radial-gradient(ellipse 70% 50% at 50% 0%, ${theme.violet}55, transparent 60%),
             radial-gradient(ellipse 50% 40% at 50% 100%, ${theme.cyan}33, transparent 60%),
             linear-gradient(180deg, #0a0a18, #05050d)`,
      }}>
        {isFantasy ? (
          <svg viewBox="0 0 100 56" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <text x="50" y="34" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="13" fontStyle="italic" fontWeight="600" fill={theme.gold} opacity="0.95">Verdant</text>
          </svg>
        ) : (
          <>
            <div style={{ position: 'absolute', inset: 0,
              background: `repeating-linear-gradient(transparent, transparent 3px, ${theme.cyan}1a 3px, ${theme.cyan}1a 4px)`,
              opacity: 0.4 }} />
            <svg viewBox="0 0 100 56" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <circle cx="50" cy="28" r="14" fill="none" stroke={theme.violet} strokeWidth="0.5" opacity="0.7" />
              <circle cx="50" cy="28" r="20" fill="none" stroke={theme.cyan}   strokeWidth="0.4" opacity="0.4" strokeDasharray="2 2" />
              <text x="50" y="32" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="0.18em" fill={theme.cyan} fontWeight="700">⟡ARISE⟡</text>
            </svg>
          </>
        )}
      </div>
      <div style={{ padding: '7px 10px 8px', background: 'rgba(13,15,30,0.85)' }}>
        <div className="hud" style={{ fontSize: 10, color: active ? theme.cyan : 'var(--ink)', letterSpacing: '0.16em', fontWeight: 600 }}>
          {theme.label.toUpperCase()}
        </div>
        <div style={{ fontSize: 9, color: 'var(--ink-dim)', marginTop: 1 }}>{theme.sub}</div>
      </div>
    </button>
  );
}
