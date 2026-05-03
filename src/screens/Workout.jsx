import { useState } from 'react';
import { useGame } from '../contexts/GameContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { Panel } from '../ui/Panel.jsx';
import { Button } from '../ui/Button.jsx';
import { Icon } from '../ui/Icon.jsx';
import { FloatingXp } from '../ui/FloatingXp.jsx';
import { useFloatingXp } from '../hooks/useFloatingXp.js';

export function Workout() {
  const { workout, setWorkout, gainXp, claimWorkout, setScreen } = useGame();
  const { fantasy } = useTheme();
  const { ticks, spawn } = useFloatingXp();

  const [time, setTime] = useState(0); // not animated to keep deterministic; could be intervalled

  const totalSets = workout.exercises.reduce((s, e) => s + e.sets.length, 0);
  const doneSets  = workout.exercises.reduce((s, e) => s + e.sets.filter(x => x.done).length, 0);

  const toggleSet = (exId, idx, btnRect) => {
    setWorkout(w => ({
      ...w,
      exercises: w.exercises.map(ex => ex.id !== exId ? ex : {
        ...ex,
        sets: ex.sets.map((s, i) => i !== idx ? s : { ...s, done: !s.done, reps: !s.done ? Number(String(s.target).match(/×\s*(\d+)/)?.[1] || 5) : 0 }),
      }),
    }));
    if (btnRect) {
      const rect = btnRect.getBoundingClientRect();
      const parent = btnRect.closest('.workout-root');
      if (parent) {
        const p = parent.getBoundingClientRect();
        spawn(40, rect.left - p.left, rect.top - p.top - 12);
      }
    }
    gainXp(40);
  };

  return (
    <div className="screen-enter workout-root" style={{ position: 'relative', padding: '6px 16px 130px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0 14px' }}>
        <button onClick={() => setScreen('home')} style={{
          background: 'transparent', border: 'none', color: 'var(--ink-dim)',
          display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
        }}>
          <Icon.x size={16} />
          <span className="hud" style={{ fontSize: 11, letterSpacing: '0.16em' }}>EXIT</span>
        </button>
        <div className="hud" style={{ fontSize: 11, color: 'var(--cyan)', letterSpacing: '0.18em' }}>
          {doneSets}/{totalSets} {fantasy ? 'CYCLES' : 'SETS'}
        </div>
      </div>

      <Panel ticks style={{ padding: 16 }}>
        <div className="hud" style={{ fontSize: 10, letterSpacing: '0.24em', color: 'var(--cyan)' }}>
          {fantasy ? 'TODAY · TRAIN' : 'LIVE WORKOUT'}
        </div>
        <div className="mythic glow-text" style={{ fontSize: 22, color: 'var(--ink)', marginTop: 4 }}>
          {workout.name}
        </div>
      </Panel>

      <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
        {workout.exercises.map(ex => (
          <Panel key={ex.id} style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div className="mythic" style={{ fontSize: 16, color: 'var(--ink)' }}>{ex.name}</div>
              <div className="hud" style={{ fontSize: 10, color: 'var(--ink-dim)' }}>
                {ex.sets.filter(s => s.done).length}/{ex.sets.length}
              </div>
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {ex.sets.map((s, i) => (
                <button key={i} onClick={(e) => toggleSet(ex.id, i, e.currentTarget)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: 10,
                  border: '1px solid var(--line)',
                  background: s.done
                    ? 'linear-gradient(180deg, color-mix(in oklab, var(--cyan) 30%, transparent), color-mix(in oklab, var(--violet) 18%, transparent))'
                    : 'rgba(13,15,30,0.45)',
                  color: 'var(--ink)', cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}>
                  <span className="hud" style={{ fontSize: 10, color: 'var(--ink-dim)' }}>SET {i + 1}</span>
                  <span className="mono" style={{ fontSize: 13, color: s.done ? 'var(--ink)' : 'var(--ink-dim)' }}>{s.target}</span>
                  <span className={`chk ${s.done ? 'checked' : ''}`} style={{ width: 20, height: 20 }} />
                </button>
              ))}
            </div>
          </Panel>
        ))}
      </div>

      <Button 
        variant="primary" 
        style={{ width: '100%', marginTop: 14 }} 
        onClick={() => { claimWorkout(); setScreen('home'); }}
        disabled={doneSets < totalSets}
      >
        {fantasy ? 'Bloom · End Training' : 'Complete · Claim XP'}
      </Button>

      {ticks.map(t => <FloatingXp key={t.id} {...t} />)}
    </div>
  );
}
