import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { Panel } from '../ui/Panel.jsx';
import { Button } from '../ui/Button.jsx';
import { RankEmblem } from '../ui/RankEmblem.jsx';
import { BossCinematicScene } from './BossCinematic.jsx';

export function BossIntro({ dungeon, onClose, onAccept }) {
  const { fantasy } = useTheme();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!dungeon) return;
    const t = setTimeout(() => setRevealed(true), 2000);
    return () => clearTimeout(t);
  }, [dungeon]);

  if (!dungeon) return null;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 89,
      background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(10px)',
      display: 'grid', placeItems: 'center', padding: 16,
      animation: 'fadeIn 280ms ease-out both',
    }}>
      <div className="ascend" style={{ width: '100%', maxWidth: 360 }}>
        <Panel ticks style={{ padding: 14, position: 'relative' }}>
          <div className="hud" style={{
            fontSize: 10, letterSpacing: '0.4em',
            color: fantasy ? 'oklch(0.88 0.16 88)' : 'var(--cyan)', textAlign: 'center',
          }}>
            {fantasy ? `❦ A GLADE OPENS ❦` : `⟡ GATE BREACH ⟡`}
          </div>

          <div style={{
            marginTop: 10,
            borderRadius: 16,
            padding: 2,
            background: 'radial-gradient(ellipse at center, color-mix(in oklab, var(--violet) 40%, transparent), transparent 70%)',
            boxShadow: '0 0 40px color-mix(in oklab, var(--violet) 20%, transparent)',
          }}>
            <BossCinematicScene bossId={dungeon.id} height={240} />
          </div>

          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <div
              className="mythic glow-text"
              style={{
                fontSize: 22,
                color: 'var(--ink)',
                animation: revealed ? 'bossNameReveal 0.4s cubic-bezier(0.2,0,0.8,1) both' : undefined,
              }}
            >
              {dungeon.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-dim)', marginTop: 4, fontStyle: 'italic' }}>
              {dungeon.boss}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-dim)', marginTop: 8, lineHeight: 1.5 }}>
              {dungeon.lore}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, padding: '8px 12px',
                        background: 'rgba(13,15,30,0.4)', borderRadius: 10 }}>
            <RankEmblem rank={dungeon.tier} size={44} />
            <div style={{ flex: 1, fontSize: 11, color: 'var(--ink-dim)' }}>
              <div>HP {dungeon.hp.toLocaleString()} · +{dungeon.xp} {fantasy ? 'lumen' : 'XP'}</div>
              <div style={{ marginTop: 2 }}>{dungeon.loot.join(' · ')}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <Button variant="ghost" style={{ flex: 1 }} onClick={onClose}>Withdraw</Button>
            <Button variant="primary" style={{ flex: 2 }} onClick={onAccept}>
              {fantasy ? `Step into ${dungeon.name}` : `Breach Gate`}
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
