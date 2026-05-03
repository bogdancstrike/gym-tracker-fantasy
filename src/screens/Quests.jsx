import { useGame } from '../contexts/GameContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { Panel } from '../ui/Panel.jsx';
import { Button } from '../ui/Button.jsx';
import { Checkbox } from '../ui/Checkbox.jsx';
import { HudHeader } from '../ui/HudHeader.jsx';
import { Icon } from '../ui/Icon.jsx';

export function Quests() {
  const { quests, completeQuest } = useGame();
  const { fantasy } = useTheme();

  return (
    <div className="screen-enter">
      <HudHeader 
        title={fantasy ? 'Daily Paths' : 'Daily Quests'} 
        sub={fantasy ? 'FANTASY · DAILY GIFTS' : 'SOLO LEVELING · SYSTEM MISSIONS'} 
      />
      <div style={{ padding: '4px 16px 130px', display: 'grid', gap: 12 }}>
        {quests.map(q => (
          <Panel 
            key={q.id} 
            glass={q.done} 
            style={{ 
              padding: 20, 
              opacity: q.done ? 0.6 : 1,
              border: q.done ? '1px solid var(--line)' : '1px solid rgba(139, 148, 255, 0.3)',
              transition: 'all 300ms'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ marginTop: 4 }}>
                <Checkbox checked={q.done} onChange={() => completeQuest(q.id)} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="mythic" style={{ 
                    fontSize: 18, 
                    color: q.done ? 'var(--ink-dim)' : 'var(--ink)',
                    textDecoration: q.done ? 'line-through' : 'none'
                  }}>
                    {q.title}
                  </div>
                  <div className="hud" style={{ 
                    fontSize: 9, 
                    color: q.difficulty === 'nightmare' ? 'var(--danger)' : 'var(--cyan)',
                    background: 'rgba(255,255,255,0.03)',
                    padding: '2px 8px', borderRadius: 4
                  }}>
                    {q.difficulty.toUpperCase()}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon.lightning size={12} color="var(--cyan)" />
                    <span className="hud" style={{ fontSize: 10, color: 'var(--cyan)' }}>+{q.xp} {fantasy ? 'lumen' : 'XP'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon.target size={12} color="var(--ink-ghost)" />
                    <span className="hud" style={{ fontSize: 10, color: 'var(--ink-dim)' }}>
                      {q.done ? '100 / 100' : '0 / 100'} %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
