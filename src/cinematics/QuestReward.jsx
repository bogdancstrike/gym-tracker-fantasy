import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { Panel } from '../ui/Panel.jsx';
import { Button } from '../ui/Button.jsx';

export function QuestReward({ quest, onDismiss }) {
  const { fantasy } = useTheme();
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div onClick={onDismiss} style={{
      position: 'absolute', inset: 0, zIndex: 88,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      display: 'grid', placeItems: 'center',
      animation: 'fadeIn 240ms ease-out both', cursor: 'pointer',
    }}>
      <div className="ascend" style={{ width: 280 }}>
        <Panel ticks style={{ padding: 22, textAlign: 'center', position: 'relative' }}>
          <div className="hud" style={{
            fontSize: 10, letterSpacing: '0.4em',
            color: fantasy ? 'oklch(0.88 0.16 88)' : 'var(--cyan)',
          }}>
            {fantasy ? '❦ PATH WALKED ❦' : '⟡ QUEST CLEARED ⟡'}
          </div>
          <div className="mythic glow-text" style={{ fontSize: 22, color: 'var(--ink)', marginTop: 8 }}>
            {quest.title}
          </div>
          <div className="hud" style={{
            marginTop: 14, fontSize: 22,
            color: fantasy ? 'oklch(0.88 0.16 88)' : 'var(--cyan)',
          }}>
            +{quest.xp} {fantasy ? 'lumen' : 'XP'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-dim)', marginTop: 8, fontStyle: 'italic' }}>
            {fantasy ? 'A petal drifts where your shadow stood.' : 'The system rewards persistence.'}
          </div>
          <Button variant="primary" style={{ marginTop: 14, width: '100%' }}
                  onClick={(e) => { e.stopPropagation(); onDismiss(); }}>
            {fantasy ? 'Walk on' : 'Acknowledge'}
          </Button>
        </Panel>
      </div>
    </div>
  );
}
