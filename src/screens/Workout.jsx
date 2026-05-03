import { useEffect, useState } from 'react';
import { useGame } from '../contexts/GameContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { Panel } from '../ui/Panel.jsx';
import { Button } from '../ui/Button.jsx';
import { Icon } from '../ui/Icon.jsx';
import { FloatingXp } from '../ui/FloatingXp.jsx';
import { useFloatingXp } from '../hooks/useFloatingXp.js';
import { formatSetTarget } from '../data/workout.js';
import { findLastExercise, getProgressionSuggestion, getSetRecordBonus } from '../data/trainingProgress.js';

export function Workout() {
  const { activeAvatar, workout, setWorkout, gainXp, awardRecordXp, claimWorkout, setScreen } = useGame();
  const { fantasy } = useTheme();
  const { ticks, spawn } = useFloatingXp();

  const [restSeconds, setRestSeconds] = useState(120);
  const [timerRunning, setTimerRunning] = useState(false);

  const totalSets = workout.exercises.reduce((s, e) => s + e.sets.length, 0);
  const doneSets  = workout.exercises.reduce((s, e) => s + e.sets.filter(x => x.done).length, 0);
  const records = activeAvatar.records || {};

  useEffect(() => {
    if (!timerRunning) return undefined;
    const id = setInterval(() => {
      setRestSeconds(value => {
        if (value <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const updateSet = (exId, idx, patch) => {
    setWorkout(w => ({
      ...w,
      exercises: w.exercises.map(ex => ex.id !== exId ? ex : {
        ...ex,
        sets: ex.sets.map((s, i) => {
          if (i !== idx) return s;
          const next = { ...s, ...patch };
          return {
            ...next,
            target: formatSetTarget(Number(next.weight), Number(next.reps || next.plannedReps), next.target),
          };
        }),
      }),
    }));
  };

  const toggleSet = (exercise, idx, btnRect) => {
    const set = exercise.sets[idx];
    const nextDone = !set.done;
    const completedSet = {
      ...set,
      done: nextDone,
      reps: Number(set.reps || set.plannedReps || String(set.target).match(/×\s*(\d+)/)?.[1] || 5),
      weight: Number(set.weight || 0),
    };
    const recordBonus = nextDone ? getSetRecordBonus(records, exercise.name, completedSet) : null;

    setWorkout(w => ({
      ...w,
      exercises: w.exercises.map(ex => ex.id !== exercise.id ? ex : {
        ...ex,
        sets: ex.sets.map((s, i) => i !== idx ? s : completedSet),
      }),
    }));
    if (btnRect) {
      const rect = btnRect.getBoundingClientRect();
      const parent = btnRect.closest('.workout-root');
      if (parent) {
        const p = parent.getBoundingClientRect();
        spawn(40, rect.left - p.left, rect.top - p.top - 12);
        if (recordBonus) {
          spawn(recordBonus.xp, rect.left - p.left - 90, rect.top - p.top - 42, recordBonus.label);
        }
      }
    }
    if (nextDone) {
      gainXp(40);
      if (recordBonus) awardRecordXp(recordBonus.xp);
      setRestSeconds(120);
      setTimerRunning(true);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
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
          TODAY · TRAIN
        </div>
        <div className="mythic glow-text" style={{ fontSize: 22, color: 'var(--ink)', marginTop: 4 }}>
          {workout.name}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12, flexWrap: 'wrap' }}>
          <div className="hud" style={{ color: timerRunning ? 'var(--cyan)' : 'var(--ink-dim)', fontSize: 12 }}>
            REST {formatTimer(restSeconds)}
          </div>
          <Button variant="ghost" style={{ padding: '6px 10px', fontSize: 10 }} onClick={() => setTimerRunning(v => !v)}>
            {timerRunning ? 'Pause' : 'Start'}
          </Button>
          <Button variant="ghost" style={{ padding: '6px 10px', fontSize: 10 }} onClick={() => { setRestSeconds(120); setTimerRunning(false); }}>
            Reset
          </Button>
        </div>
      </Panel>

      <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
        {workout.exercises.map(ex => {
          const lastExercise = findLastExercise(activeAvatar.history || [], workout, ex.name);
          return (
          <Panel key={ex.id} style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div className="mythic" style={{ fontSize: 16, color: 'var(--ink)' }}>{ex.name}</div>
              <div className="hud" style={{ fontSize: 10, color: 'var(--ink-dim)' }}>
                {ex.sets.filter(s => s.done).length}/{ex.sets.length}
              </div>
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {ex.sets.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
                  gap: 10, padding: '10px 12px', borderRadius: 10,
                  border: '1px solid var(--line)',
                  background: s.done
                    ? 'linear-gradient(180deg, color-mix(in oklab, var(--cyan) 30%, transparent), color-mix(in oklab, var(--violet) 18%, transparent))'
                    : 'rgba(13,15,30,0.45)',
                  color: 'var(--ink)',
                  transition: 'all 200ms ease',
                }}>
                  <span className="hud" style={{ fontSize: 10, color: 'var(--ink-dim)', width: 46 }}>SET {i + 1}</span>
                  <div style={{ width: 112, minWidth: 92 }}>
                    <div className="hud" style={{ fontSize: 8, letterSpacing: '0.12em', color: 'var(--ink-dim)' }}>LAST</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-dim)', marginTop: 3 }}>
                      {lastExercise?.sets?.[i]
                        ? `${lastExercise.sets[i].weight || 0}kg x ${lastExercise.sets[i].reps || 0}`
                        : 'baseline'}
                    </div>
                  </div>
                  <SetInput
                    label="kg"
                    value={s.weight || ''}
                    onChange={value => updateSet(ex.id, i, { weight: value === '' ? 0 : Number(value) })}
                  />
                  <SetInput
                    label="reps"
                    value={s.reps || s.plannedReps || ''}
                    onChange={value => updateSet(ex.id, i, { reps: value === '' ? 0 : Number(value) })}
                  />
                  <button
                    onClick={(e) => toggleSet(ex, i, e.currentTarget)}
                    aria-label={`Mark set ${i + 1} ${s.done ? 'unfinished' : 'done'}`}
                    style={{
                      width: 34, height: 34, flexShrink: 0,
                      display: 'grid', placeItems: 'center',
                      border: '1px solid var(--line)',
                      borderRadius: 8,
                      background: 'rgba(0,0,0,0.18)',
                      color: 'var(--ink)',
                      cursor: 'pointer',
                    }}
                  >
                    <span className={`chk ${s.done ? 'checked' : ''}`} style={{ width: 20, height: 20 }} />
                  </button>
                  <div style={{ flexBasis: '100%', color: 'var(--ink-dim)', fontSize: 11, lineHeight: 1.4, paddingLeft: 56 }}>
                    {getProgressionSuggestion(lastExercise?.sets?.[i], s)}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        );})}
      </div>

      <Button 
        variant="primary" 
        style={{ width: '100%', marginTop: 14 }} 
        onClick={() => { 
          claimWorkout(workout.isBoss, { doneSets, totalSets }); 
          setScreen('home'); 
        }}
        disabled={doneSets === 0}
      >
        {doneSets < totalSets
          ? (fantasy ? 'End Partial Training' : 'End Partial Training')
          : (fantasy ? 'Bloom · End Training' : 'Complete · Claim XP')}
      </Button>

      {ticks.map(t => <FloatingXp key={t.id} {...t} />)}
    </div>
  );
}

function SetInput({ label, value, onChange, disabled = false }) {
  return (
    <label style={{ display: 'grid', gap: 3, flex: 1, minWidth: 0 }}>
      <span className="hud" style={{ fontSize: 8, letterSpacing: '0.14em', color: 'var(--ink-dim)' }}>{label}</span>
      <input
        type="number"
        min="0"
        step={label === 'kg' ? '2.5' : '1'}
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '7px 8px',
          borderRadius: 8,
          border: '1px solid var(--line)',
          background: disabled ? 'rgba(255,255,255,0.03)' : 'rgba(8,8,18,0.55)',
          color: disabled ? 'var(--ink-dim)' : 'var(--ink)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12,
          outline: 'none',
        }}
      />
    </label>
  );
}
