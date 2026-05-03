import { useState, useMemo } from 'react';
import { useGame } from '../contexts/GameContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { Panel } from '../ui/Panel.jsx';
import { RankEmblem } from '../ui/RankEmblem.jsx';
import { StatBar } from '../ui/StatBar.jsx';
import { Button } from '../ui/Button.jsx';
import { Icon } from '../ui/Icon.jsx';
import { RANK_COLORS } from '../data/ranks.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

export function Dashboard() {
  const { activeAvatar, race, setScreen, quests, effectiveStats, addMetric, updateActive } = useGame();
  const { fantasy, lex } = useTheme();
  const av = activeAvatar;
  const rc = RANK_COLORS[av.rank];

  const [metricType, setMetricType] = useState('weight');
  const [metricValue, setMetricValue] = useState('');

  // --- Metrics Data ---
  const metrics = av.metrics || [];
  const weightData = metrics.filter(m => m.type === 'weight').map(m => ({
    ...m,
    dateFormatted: new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }));
  const kcalData = metrics.filter(m => m.type === 'kcal').map(m => ({
    ...m,
    dateFormatted: new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }));

  // --- History & Stats Data ---
  const history = av.history || [];
  const recordRows = Object.entries(av.records || {}).slice(0, 6);
  
  // Workouts in last 30 days
  const last30Days = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const count = history.filter(h => new Date(h.date).toDateString() === dateStr).length;
      data.push({
        name: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        workouts: count
      });
    }
    return data;
  }, [history]);

  // Workout Frequency (Type distribution)
  const frequencyData = useMemo(() => {
    const types = history.reduce((acc, h) => {
      acc[h.type] = (acc[h.type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(types).map(([name, value]) => ({ name: name.toUpperCase(), value }));
  }, [history]);

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
      {/* Champion Card */}
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

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 16 }}>
        <StatTile label="Streak" value={`${av.streak}d`} icon={Icon.flame} color="var(--gold)" />
        <StatTile label={fantasy ? 'Lumen Today' : 'XP Today'} value={`+${av.totalXpToday}`} icon={Icon.lightning} color="var(--cyan)" />
        <StatTile label={fantasy ? 'Glades' : 'Bosses'} value={av.bossWins || 0} icon={Icon.skull} color="var(--danger)" />
        <StatTile label="Total Workouts" value={history.length} icon={Icon.barbell} color="var(--violet)" />
      </div>

      {/* Attribute Panel (Full Width) */}
      <Panel glass style={{ padding: 24, marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="hud" style={{ fontSize: 11, letterSpacing: '0.24em', color: 'var(--ink-dim)' }}>
            {fantasy ? 'GIFTS' : 'ATTRIBUTES'}
          </div>
          <div className="hud" style={{ fontSize: 10, color: 'var(--gold)' }}>
            STRENGTHENED BY SOUL
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: x => x % 2 === 0 ? 12 : 24 }}>
          {Object.entries(effectiveStats).map(([k, v]) => (
            <StatBar key={k} label={k} value={v} max={120} color={race?.color || 'var(--cyan)'} />
          ))}
        </div>
      </Panel>

      <Panel glass style={{ padding: 20, marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div className="hud" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--cyan)' }}>PERSONAL RECORDS</div>
          <button onClick={() => setScreen('history')} style={{
            border: '1px solid var(--line)',
            background: 'rgba(13,15,30,0.45)',
            color: 'var(--ink-dim)',
            borderRadius: 8,
            padding: '7px 10px',
            cursor: 'pointer',
            fontSize: 11,
          }}>
            View log
          </button>
        </div>
        {recordRows.length === 0 ? (
          <div style={{ color: 'var(--ink-dim)', fontSize: 13 }}>Complete workouts to establish records.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 10 }}>
            {recordRows.map(([name, record]) => (
              <div key={name} style={{
                border: '1px solid var(--line)',
                borderRadius: 10,
                padding: 12,
                background: 'rgba(13,15,30,0.45)',
              }}>
                <div className="mythic" style={{ color: 'var(--ink)', fontSize: 14 }}>{name}</div>
                <div style={{ color: 'var(--cyan)', fontSize: 12, marginTop: 6 }}>
                  Best set: {record.bestSet?.weight || 0}kg x {record.bestSet?.reps || 0}
                </div>
                <div style={{ color: 'var(--ink-dim)', fontSize: 11, marginTop: 4 }}>
                  e1RM {record.bestEstimatedOneRepMax || 0}kg · volume {Math.round(record.bestWorkoutVolume || 0)}kg
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {/* Advanced Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, marginTop: 16 }}>
        
        {/* Workout History (30 Days) */}
        <Panel glass style={{ padding: 20 }}>
          <div className="hud" style={{ fontSize: 10, color: 'var(--violet)', marginBottom: 16 }}>WORKOUT INTENSITY (LAST 30 DAYS)</div>
          <div style={{ height: 180, width: '100%', minHeight: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last30Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--ink-ghost)" fontSize={9} tickMargin={10} hide={window.innerWidth < 500} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ background: 'rgba(10,11,28,0.95)', border: '1px solid var(--line)', borderRadius: 8, fontSize: 10 }}
                />
                <Area type="monotone" dataKey="workouts" stroke="var(--violet)" fill="rgba(168, 85, 247, 0.2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Workout Frequency */}
        <Panel glass style={{ padding: 20 }}>
          <div className="hud" style={{ fontSize: 10, color: 'var(--cyan)', marginBottom: 16 }}>ACTIVITY DISTRIBUTION</div>
          <div style={{ height: 180, width: '100%', minHeight: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--ink-ghost)" fontSize={9} tickMargin={10} />
                <YAxis fontSize={9} stroke="var(--ink-ghost)" />
                <Tooltip contentStyle={{ background: 'rgba(10,11,28,0.95)', border: '1px solid var(--line)', borderRadius: 8, fontSize: 10 }} />
                <Bar dataKey="value" fill="var(--cyan)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Metrics Section */}
      <Panel glass style={{ padding: 24, marginTop: 16 }}>
        <div className="hud" style={{ fontSize: 11, letterSpacing: '0.24em', color: 'var(--ink-dim)', marginBottom: 20 }}>
          {fantasy ? 'CHRONICLES OF PROGRESS' : 'METRICS & TRACKING'}
        </div>
        
        {/* Metric Input */}
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* Weight Chart */}
          <div>
            <div className="hud" style={{ fontSize: 10, color: 'var(--cyan)', marginBottom: 16 }}>Bodyweight (KG)</div>
            <div style={{ height: 200, minHeight: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="dateFormatted" stroke="var(--ink-ghost)" fontSize={9} />
                  <YAxis domain={['auto', 'auto']} stroke="var(--ink-ghost)" fontSize={9} />
                  <Tooltip contentStyle={{ background: 'rgba(10,11,28,0.95)', border: '1px solid var(--line)', fontSize: 10 }} />
                  <Line type="monotone" dataKey="value" stroke="var(--cyan)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Caloric Intake */}
          <div>
            <div className="hud" style={{ fontSize: 10, color: 'var(--gold)', marginBottom: 16 }}>Caloric Intake (kcal)</div>
            <div style={{ height: 200, minHeight: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kcalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="dateFormatted" stroke="var(--ink-ghost)" fontSize={9} />
                  <YAxis domain={['auto', 'auto']} stroke="var(--ink-ghost)" fontSize={9} />
                  <Tooltip contentStyle={{ background: 'rgba(10,11,28,0.95)', border: '1px solid var(--line)', fontSize: 10 }} />
                  <Line type="monotone" dataKey="value" stroke="var(--gold)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
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
