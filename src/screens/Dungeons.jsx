import { useGame } from '../contexts/GameContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { Panel } from '../ui/Panel.jsx';
import { Button } from '../ui/Button.jsx';
import { HudHeader } from '../ui/HudHeader.jsx';
import { Icon } from '../ui/Icon.jsx';
import { DUNGEONS } from '../data/dungeons.js';
import { RANK_COLORS } from '../data/ranks.js';

export function Dungeons() {
  const { setBossIntro } = useGame();
  const { fantasy } = useTheme();

  return (
    <div className="screen-enter">
      <HudHeader
        title={fantasy ? 'Open Glades' : 'Open Gates'}
        sub={fantasy ? 'FANTASY · DEEP PATHS' : 'SOLO LEVELING · DUNGEON BREACH'}
      />
      <div style={{ padding: '4px 16px 130px', display: 'grid', gap: 12 }}>
        {DUNGEONS.map(d => {
          const rc = RANK_COLORS[d.tier];
          return (
            <Panel key={d.id} ticks style={{ padding: 16, position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', right: -30, top: -30, width: 130, height: 130,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${d.color}55, transparent 70%)`,
                filter: 'blur(2px)', opacity: 0.7,
                animation: 'pulseGlow 4s ease-in-out infinite',
              }} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="hud" style={{ fontSize: 9, letterSpacing: '0.28em', color: rc.a }}>
                    {fantasy ? 'BOUGH' : 'TIER'} {d.tier} · {rc.label}
                  </div>
                  <div style={{ position: 'relative', width: 38, height: 38 }}>
                    <div className="portal-spin" style={{
                      position: 'absolute', inset: 0,
                      border: `1px dashed ${d.color}`, borderRadius: '50%',
                    }} />
                    <div className="portal-counter" style={{
                      position: 'absolute', inset: 6,
                      border: `1px solid ${d.color}`, borderRadius: '50%',
                    }} />
                  </div>
                </div>
                <div className="mythic glow-text" style={{ fontSize: 22, color: 'var(--ink)', marginTop: 6 }}>
                  {d.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-dim)', marginTop: 4, fontStyle: fantasy ? 'italic' : 'normal' }}>
                  {d.lore}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, fontSize: 11, color: 'var(--ink-dim)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon.heart size={11} /> {d.hp.toLocaleString()} HP
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon.lightning size={11} /> +{d.xp} {fantasy ? 'lumen' : 'XP'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon.chest size={11} /> {d.loot.length} loot
                  </span>
                </div>
                <Button variant="primary" style={{ width: '100%', marginTop: 12 }} onClick={() => setBossIntro(d)}>
                  {fantasy ? `Step into ${d.name}` : `Breach · ${d.name}`}
                </Button>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
