import { useGame } from '../contexts/GameContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { Panel } from '../ui/Panel.jsx';
import { RankEmblem } from '../ui/RankEmblem.jsx';
import { StatBar } from '../ui/StatBar.jsx';
import { Button } from '../ui/Button.jsx';
import { Divider } from '../ui/Divider.jsx';
import { Icon } from '../ui/Icon.jsx';
import { RANK_COLORS } from '../data/ranks.js';

export function Dashboard() {
  const { activeAvatar, race, setScreen, quests, effectiveStats } = useGame();
  const { fantasy, lex } = useTheme();
  const av = activeAvatar;
  const rc = RANK_COLORS[av.rank];

  return (
    <div className="screen-enter" style={{ padding: '6px 16px 130px' }}>
      {/* Hunter card */}
      <Panel glass ticks style={{ padding: 24, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <RankEmblem rank={av.rank} size={100} pulsing />
            <div style={{ 
              position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
              background: 'var(--bg)', border: '1px solid var(--line)', padding: '2px 10px',
              borderRadius: 12, fontSize: 10, color: 'var(--cyan)'
            }} className="hud">
              LVL {av.level}
            </div>
          </div>
          
          <div style={{ flex: 1, minWidth: 300 }}>
            <div className="hud" style={{ fontSize: 11, letterSpacing: '0.28em', color: rc.a }}>
              {fantasy ? 'BOUGH' : 'RANK'} {av.rank} · {fantasy ? lex(rc.label) || rc.label : rc.label}
            </div>
            <div className="mythic glow-text" style={{ fontSize: 32, marginTop: 6, color: 'var(--ink)' }}>
              {av.name}
            </div>
            <div style={{ fontSize: 14, color: 'var(--ink-dim)', fontStyle: fantasy ? 'italic' : 'normal', marginTop: 4 }}>
              {av.title}
            </div>
            
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="hud" style={{ fontSize: 11, color: 'var(--ink-dim)' }}>
                  {fantasy ? 'BLOOM PROGRESS' : 'XP PROGRESS'}
                </span>
                <span className="hud" style={{ fontSize: 11, color: 'var(--cyan)' }}>
                  {Math.round((av.xp / 100) * av.xpMax)} / {av.xpMax} {fantasy ? 'lumen' : 'XP'}
                </span>
              </div>
              <div className="stat-bar" style={{ height: 8 }}>
                <div className="shimmer" style={{
                  width: `${av.xp}%`, height: '100%', borderRadius: 4,
                }} />
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* Today stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginTop: 16 }}>
        <StatTile label="Streak" value={`${av.streak}d`} icon={Icon.flame} color="var(--gold)" />
        <StatTile label={fantasy ? 'Lumen Today' : 'XP Today'} value={`+${av.totalXpToday}`} icon={Icon.lightning} color="var(--cyan)" />
        <StatTile label={fantasy ? 'Paths' : 'Quests'} value={`${quests.filter(q => q.done).length}/${quests.length}`} icon={Icon.check} color="var(--violet)" />
      </div>

      {/* Stat grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginTop: 16 }}>
        <Panel glass style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="hud" style={{ fontSize: 11, letterSpacing: '0.24em', color: 'var(--ink-dim)' }}>
              {fantasy ? 'GIFTS' : 'ATTRIBUTES'}
            </div>
            <div className="hud" style={{ fontSize: 10, color: 'var(--gold)' }}>
              STRENGTHENED BY SOUL
            </div>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {Object.entries(effectiveStats).map(([k, v]) => (
              <StatBar key={k} label={k} value={v} max={120} color={race?.color || 'var(--cyan)'} />
            ))}
          </div>
        </Panel>

        <Panel glass style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="hud" style={{ fontSize: 11, letterSpacing: '0.24em', color: 'var(--ink-dim)', marginBottom: 20 }}>
            {fantasy ? 'QUICK ACTIONS' : 'COMMAND CENTER'}
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            <Button variant="primary" onClick={() => setScreen('workout')} style={{ width: '100%', padding: '16px' }}>
              {fantasy ? "Walk Today's Path" : 'Begin Solo Leveling'}
            </Button>
            <Button onClick={() => setScreen('quests')} style={{ width: '100%', padding: '14px' }}>
              {fantasy ? 'Review Paths' : 'View Mission List'}
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function StatTile({ label, value, icon: IconC, color }) {
  return (
    <div className="glass-fantasy" style={{
      padding: '16px 20px', borderRadius: 12,
      border: '1px solid var(--line)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color }}>
        <IconC size={16} />
        <span className="hud" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--ink-dim)' }}>{label}</span>
      </div>
      <div className="mythic" style={{ fontSize: 24, fontWeight: 700, marginTop: 6, color: 'var(--ink)' }}>
        {value}
      </div>
    </div>
  );
}
