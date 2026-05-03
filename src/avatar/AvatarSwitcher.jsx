import { useGame } from '../contexts/GameContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { Button } from '../ui/Button.jsx';
import { RankEmblem } from '../ui/RankEmblem.jsx';
import { RaceGlyph } from '../characters/RaceGlyph.jsx';
import { RACES } from '../data/races.js';

export function AvatarSwitcher({ onClose, onCreateNew }) {
  const { avatars, activeId, switchAvatar } = useGame();
  const { fantasy } = useTheme();

  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 92,
        background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-end',
        animation: 'fadeIn 200ms ease-out both',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="ascend"
        style={{
          width: '100%',
          background: 'rgba(8,8,18,0.97)',
          border: '1px solid var(--line)',
          borderRadius: '20px 20px 0 0',
          padding: '16px 14px 32px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div className="hud" style={{
            fontSize: 10, letterSpacing: '0.3em',
            color: fantasy ? 'oklch(0.88 0.16 88)' : 'var(--cyan)',
          }}>
            {fantasy ? '❦ CHAMPIONS ❦' : '⟡ VESSELS ⟡'}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none',
              color: 'var(--ink-dim)', cursor: 'pointer',
              fontSize: 20, padding: 0, lineHeight: 1,
            }}
          >×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
          {avatars.map(av => {
            const race = RACES.find(r => r.id === av.race);
            const isActive = av.id === activeId;
            return (
              <div
                key={av.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 12,
                  border: `1px solid ${isActive ? 'var(--cyan)' : 'var(--line)'}`,
                  background: isActive
                    ? 'color-mix(in oklab, var(--cyan) 10%, transparent)'
                    : 'rgba(13,15,30,0.6)',
                  transition: 'all 200ms',
                }}
              >
                <RaceGlyph race={race} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mythic" style={{ fontSize: 14, color: 'var(--ink)' }}>
                    {av.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-dim)', marginTop: 2 }}>
                    {fantasy ? 'Bough' : 'Rank'} {av.rank}
                    {' · '}
                    {fantasy ? 'Bloom' : 'Lvl'} {av.level}
                  </div>
                </div>
                <RankEmblem rank={av.rank} size={36} />
                {isActive ? (
                  <div className="hud" style={{
                    fontSize: 9, letterSpacing: '0.22em',
                    color: 'var(--cyan)', whiteSpace: 'nowrap',
                  }}>
                    {fantasy ? 'AWAKENED' : 'ACTIVE'}
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    style={{ padding: '6px 14px', fontSize: 11, whiteSpace: 'nowrap' }}
                    onClick={() => switchAvatar(av.id)}
                  >
                    {fantasy ? 'Awaken' : 'Switch'}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <Button
          variant="primary"
          style={{ width: '100%', marginTop: 14 }}
          onClick={onCreateNew}
        >
          {fantasy ? '❦ Awaken a New Champion' : '⟡ Create New Vessel'}
        </Button>
      </div>
    </div>
  );
}
