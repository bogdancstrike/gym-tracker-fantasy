import { useGame } from '../contexts/GameContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { Panel } from '../ui/Panel.jsx';
import { Checkbox } from '../ui/Checkbox.jsx';
import { HudHeader } from '../ui/HudHeader.jsx';
import { DIFFICULTY_MULTIPLIER } from '../data/ranks.js';

const DIFF_COLOR = {
  easy:      'var(--gold)',
  normal:    'var(--cyan)',
  hard:      'var(--violet)',
  nightmare: 'var(--danger)',
};

export function Quests() {
  const { quests, completeQuest, difficulty } = useGame();
  const { fantasy } = useTheme();
  const mult = DIFFICULTY_MULTIPLIER[difficulty] ?? 1;

  return (
    <div className="screen-enter">
      <HudHeader
        title={fantasy ? "Today's Path" : 'Daily Missions'}
        sub={fantasy ? `FANTASY · DIFFICULTY ${difficulty.toUpperCase()}` : `SOLO LEVELING · DIFFICULTY ${difficulty.toUpperCase()}`}
      />
      <div style={{ padding: '10px 16px 130px', display: 'grid', gap: 12 }}>
        {quests.map(q => {
          const pct = Math.min(100, (q.progress / q.target) * 100);
          const xp = Math.round(q.xp * mult);
          return (
            <Panel key={q.id} glass ticks style={{ padding: 20 }}>
              <div className="row-quest" style={{ display: 'flex', alignItems: 'center', gap: 20, borderRadius: 12 }}>
                <Checkbox checked={q.done} onChange={() => completeQuest(q.id)} ariaLabel={q.title} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="mythic glow-text" style={{ 
                      fontSize: 18, 
                      color: q.done ? 'var(--ink-dim)' : 'var(--ink)', 
                      textDecoration: q.done ? 'line-through' : 'none',
                      transition: 'all 300ms'
                    }}>
                      {q.title}
                    </div>
                    <div className="hud" style={{ fontSize: 11, color: DIFF_COLOR[q.difficulty], fontWeight: 700 }}>
                      +{xp} {fantasy ? 'lumen' : 'XP'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                    <div className="stat-bar" style={{ flex: 1, height: 6 }}>
                      <span style={{ 
                        width: `${pct}%`, 
                        background: q.done ? 'var(--gold)' : `linear-gradient(90deg, ${DIFF_COLOR[q.difficulty]}, var(--violet))` 
                      }} />
                    </div>
                    <span className="hud" style={{ fontSize: 11, color: 'var(--ink-dim)', minWidth: 80, textAlign: 'right' }}>
                      {q.progress} / {q.target} {q.unit}
                    </span>
                  </div>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
