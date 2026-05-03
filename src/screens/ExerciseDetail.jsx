import { useMemo } from 'react';
import { useGame } from '../contexts/GameContext.jsx';
import { Panel } from '../ui/Panel.jsx';
import { buildExerciseHistory } from '../data/trainingProgress.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function ExerciseDetail() {
  const { activeAvatar, selectedExercise, setSelectedExercise, setScreen } = useGame();
  const history = activeAvatar.history || [];

  const exerciseNames = useMemo(() => {
    const names = new Set();
    history.forEach(entry => {
      (entry.exercises || []).forEach(exercise => names.add(exercise.name));
    });
    return [...names].sort();
  }, [history]);

  const currentExercise = selectedExercise || exerciseNames[0] || '';
  const rows = useMemo(() => buildExerciseHistory(history, currentExercise), [history, currentExercise]);
  const best = rows.reduce((acc, row) => ({
    e1rm: Math.max(acc.e1rm, row.e1rm || 0),
    volume: Math.max(acc.volume, row.volume || 0),
    bestSet: (row.e1rm || 0) > (acc.bestSetE1rm || 0) ? row.bestSet : acc.bestSet,
    bestSetE1rm: Math.max(acc.bestSetE1rm, row.e1rm || 0),
  }), { e1rm: 0, volume: 0, bestSet: null, bestSetE1rm: 0 });

  const chartRows = rows.map(row => ({
    name: row.dateFormatted,
    e1rm: row.e1rm,
    volume: Math.round(row.volume),
  }));

  return (
    <div className="screen-enter" style={{ padding: '6px 16px 130px' }}>
      <Panel glass ticks style={{ padding: 24, marginTop: 8 }}>
        <button
          type="button"
          onClick={() => setScreen('history')}
          style={{
            border: '1px solid var(--line)',
            background: 'rgba(13,15,30,0.45)',
            color: 'var(--ink-dim)',
            borderRadius: 8,
            padding: '7px 10px',
            cursor: 'pointer',
            fontSize: 11,
            marginBottom: 14,
          }}
        >
          Back to log
        </button>
        <div className="hud" style={{ color: 'var(--cyan)', fontSize: 10, letterSpacing: '0.24em' }}>
          EXERCISE DETAIL
        </div>
        <div className="mythic glow-text" style={{ color: 'var(--ink)', fontSize: 30, marginTop: 6 }}>
          {currentExercise || 'No Exercise Data'}
        </div>
      </Panel>

      {exerciseNames.length > 0 && (
        <Panel glass style={{ padding: 16, marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {exerciseNames.map(name => (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedExercise(name)}
                style={{
                  border: `1px solid ${name === currentExercise ? 'var(--cyan)' : 'var(--line)'}`,
                  background: name === currentExercise ? 'rgba(34,211,238,0.12)' : 'rgba(13,15,30,0.45)',
                  color: name === currentExercise ? 'var(--cyan)' : 'var(--ink-dim)',
                  borderRadius: 8,
                  padding: '8px 10px',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </Panel>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 16 }}>
        <StatCard label="Sessions" value={rows.length} />
        <StatCard label="Best e1RM" value={`${best.e1rm || 0}kg`} />
        <StatCard label="Best Volume" value={`${Math.round(best.volume || 0)}kg`} />
        <StatCard label="Best Set" value={best.bestSet ? `${best.bestSet.weight || 0}kg x ${best.bestSet.reps || 0}` : '-'} />
      </div>

      {rows.length === 0 ? (
        <Panel glass style={{ padding: 18, marginTop: 16 }}>
          <div style={{ color: 'var(--ink-dim)', fontSize: 13 }}>No logged sets for this exercise yet.</div>
        </Panel>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, marginTop: 16 }}>
            <Panel glass style={{ padding: 20 }}>
              <div className="hud" style={{ fontSize: 10, color: 'var(--cyan)', marginBottom: 16 }}>ESTIMATED 1RM TREND</div>
              <div style={{ height: 220, minHeight: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartRows}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="var(--ink-ghost)" fontSize={9} />
                    <YAxis domain={['auto', 'auto']} stroke="var(--ink-ghost)" fontSize={9} />
                    <Tooltip contentStyle={{ background: 'rgba(10,11,28,0.95)', border: '1px solid var(--line)', fontSize: 10 }} />
                    <Line type="monotone" dataKey="e1rm" stroke="var(--cyan)" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel glass style={{ padding: 20 }}>
              <div className="hud" style={{ fontSize: 10, color: 'var(--gold)', marginBottom: 16 }}>SESSION VOLUME</div>
              <div style={{ height: 220, minHeight: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartRows}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--ink-ghost)" fontSize={9} />
                    <YAxis stroke="var(--ink-ghost)" fontSize={9} />
                    <Tooltip contentStyle={{ background: 'rgba(10,11,28,0.95)', border: '1px solid var(--line)', fontSize: 10 }} />
                    <Bar dataKey="volume" fill="var(--gold)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
            {[...rows].reverse().map(row => (
              <Panel key={row.id} glass style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <div className="mythic" style={{ color: 'var(--ink)', fontSize: 16 }}>{row.workoutName}</div>
                    <div style={{ color: 'var(--ink-dim)', fontSize: 12, marginTop: 4 }}>{new Date(row.date).toLocaleString()}</div>
                  </div>
                  <div className="hud" style={{ color: 'var(--cyan)', fontSize: 11 }}>
                    e1RM {row.e1rm || 0}kg · {Math.round(row.volume || 0)}kg volume
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                  {(row.exercise?.sets || []).map((set, index) => (
                    <span key={`${row.id}-${index}`} style={{
                      color: set.done ? 'var(--cyan)' : 'var(--ink-dim)',
                      border: '1px solid var(--line)',
                      borderRadius: 8,
                      padding: '6px 8px',
                      fontSize: 12,
                      background: 'rgba(0,0,0,0.2)',
                    }}>
                      Set {index + 1}: {set.weight || 0}kg x {set.reps || 0}
                    </span>
                  ))}
                </div>
              </Panel>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <Panel glass style={{ padding: 16 }}>
      <div className="hud" style={{ fontSize: 10, color: 'var(--ink-dim)', letterSpacing: '0.18em' }}>{label}</div>
      <div className="mythic" style={{ fontSize: 22, color: 'var(--ink)', marginTop: 6 }}>{value}</div>
    </Panel>
  );
}
