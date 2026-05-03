import { useState } from 'react';
import { useGame } from '../contexts/GameContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { Panel } from '../ui/Panel.jsx';
import { RankEmblem } from '../ui/RankEmblem.jsx';
import { StatBar } from '../ui/StatBar.jsx';
import { Button } from '../ui/Button.jsx';
import { Icon } from '../ui/Icon.jsx';
import { RANK_COLORS } from '../data/ranks.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const { activeAvatar, race, setScreen, quests, effectiveStats, addMetric, updateActive } = useGame();
  const { fantasy, lex } = useTheme();
  const av = activeAvatar;
  const rc = RANK_COLORS[av.rank];

  const [metricType, setMetricType] = useState('weight');
  const [metricValue, setMetricValue] = useState('');

  const metrics = av.metrics || [];
  const weightData = metrics.filter(m => m.type === 'weight').map(m => ({
    ...m,
    dateFormatted: new Date(m.date).toLocaleDateString()
  }));
  const kcalData = metrics.filter(m => m.type === 'kcal').map(m => ({
    ...m,
    dateFormatted: new Date(m.date).toLocaleDateString()
  }));

  const handleAddMetric = () => {
    if (!metricValue || isNaN(metricValue)) return;
    addMetric(metricType, parseFloat(metricValue));
    setMetricValue('');
  };

  const deleteMetric = (id) => {
    updateActive({
      metrics: metrics.filter(m => m.id !== id)
    });
  };

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

      {/* Stat Panel (Full Width) */}
      <Panel glass style={{ padding: 24, marginTop: 16 }}>
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

      {/* Metrics Dashboard */}
      <Panel glass style={{ padding: 24, marginTop: 16 }}>
        <div className="hud" style={{ fontSize: 11, letterSpacing: '0.24em', color: 'var(--ink-dim)', marginBottom: 20 }}>
          {fantasy ? 'CHRONICLES OF PROGRESS' : 'METRICS & TRACKING'}
        </div>
        
        {/* Input Form */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <select 
            value={metricType} 
            onChange={e => setMetricType(e.target.value)}
            style={{
              padding: '12px', background: 'rgba(13,15,30,0.6)', border: '1px solid var(--line)',
              borderRadius: 8, color: 'var(--ink)', fontFamily: 'var(--hud-font)', fontSize: 12,
              outline: 'none'
            }}
          >
            <option value="weight">Bodyweight (KG)</option>
            <option value="kcal">Calories (kcal/day)</option>
          </select>
          <input 
            type="number" 
            placeholder="Enter value..."
            value={metricValue}
            onChange={e => setMetricValue(e.target.value)}
            style={{
              flex: 1, minWidth: 150, padding: '12px', background: 'rgba(13,15,30,0.6)', border: '1px solid var(--line)',
              borderRadius: 8, color: 'var(--ink)', fontFamily: 'var(--body-font)', fontSize: 14,
              outline: 'none'
            }}
          />
          <Button variant="primary" onClick={handleAddMetric} style={{ padding: '12px 24px' }}>
            Record
          </Button>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* Weight Chart */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
            <div className="hud" style={{ fontSize: 10, color: 'var(--cyan)', marginBottom: 16 }}>Bodyweight Progression (KG)</div>
            {weightData.length > 0 ? (
              <div style={{ height: 200, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="dateFormatted" stroke="var(--ink-dim)" fontSize={10} tickMargin={10} />
                    <YAxis domain={['auto', 'auto']} stroke="var(--ink-dim)" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ background: 'rgba(10,11,28,0.9)', border: '1px solid var(--line)', borderRadius: 8, fontSize: 12 }}
                      itemStyle={{ color: 'var(--cyan)' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="var(--cyan)" strokeWidth={2} dot={{ r: 3, fill: 'var(--cyan)' }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-dim)', fontSize: 12 }}>
                No records yet.
              </div>
            )}
            
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 100, overflowY: 'auto' }} className="no-scrollbar">
              {weightData.map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: 6 }}>
                  <span style={{ color: 'var(--ink-dim)' }}>{m.dateFormatted}</span>
                  <span className="mythic" style={{ color: 'var(--cyan)' }}>{m.value} KG</span>
                  <button onClick={() => deleteMetric(m.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 10 }}>[X]</button>
                </div>
              ))}
            </div>
          </div>

          {/* Kcal Chart */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
            <div className="hud" style={{ fontSize: 10, color: 'var(--gold)', marginBottom: 16 }}>Caloric Intake (kcal)</div>
            {kcalData.length > 0 ? (
              <div style={{ height: 200, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kcalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="dateFormatted" stroke="var(--ink-dim)" fontSize={10} tickMargin={10} />
                    <YAxis domain={['auto', 'auto']} stroke="var(--ink-dim)" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ background: 'rgba(10,11,28,0.9)', border: '1px solid var(--line)', borderRadius: 8, fontSize: 12 }}
                      itemStyle={{ color: 'var(--gold)' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="var(--gold)" strokeWidth={2} dot={{ r: 3, fill: 'var(--gold)' }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-dim)', fontSize: 12 }}>
                No records yet.
              </div>
            )}

            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 100, overflowY: 'auto' }} className="no-scrollbar">
              {kcalData.map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: 6 }}>
                  <span style={{ color: 'var(--ink-dim)' }}>{m.dateFormatted}</span>
                  <span className="mythic" style={{ color: 'var(--gold)' }}>{m.value} KCAL</span>
                  <button onClick={() => deleteMetric(m.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 10 }}>[X]</button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </Panel>
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
