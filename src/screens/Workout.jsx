import { useEffect, useState } from 'react';
import { useGame } from '../contexts/GameContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { Panel } from '../ui/Panel.jsx';
import { Button } from '../ui/Button.jsx';
import { Icon } from '../ui/Icon.jsx';
import { FloatingXp } from '../ui/FloatingXp.jsx';
import { useFloatingXp } from '../hooks/useFloatingXp.js';
import { formatSetTarget } from '../data/workout.js';
import { exerciseVolume, findLastExercise, findLastMatchingWorkout, getProgressionSuggestion, getSetRecordBonus } from '../data/trainingProgress.js';
import { EXERCISE_LIBRARY, SET_TYPES } from '../data/exerciseLibrary.js';

export function Workout() {
  const { activeAvatar, workout, setWorkout, gainXp, awardRecordXp, claimWorkout, setScreen, addExerciseToWorkout } = useGame();
  const { fantasy } = useTheme();
  const { ticks, spawn } = useFloatingXp();

  const [restSeconds, setRestSeconds] = useState(120);
  const [timerRunning, setTimerRunning] = useState(false);
  const [completionSummary, setCompletionSummary] = useState(null);
  const [libraryOpen, setLibraryOpen] = useState(workout.exercises.length === 0);
  const [exerciseQuery, setExerciseQuery] = useState('');
  const [sessionStartedAt] = useState(Date.now());

  const totalSets = workout.exercises.reduce((s, e) => s + e.sets.length, 0);
  const doneSets  = workout.exercises.reduce((s, e) => s + e.sets.filter(x => x.done).length, 0);
  const records = activeAvatar.records || {};
  const filteredExercises = EXERCISE_LIBRARY.filter(exercise => {
    const q = exerciseQuery.trim().toLowerCase();
    if (!q) return true;
    return [
      exercise.name,
      exercise.equipment,
      ...(exercise.muscles || []),
    ].join(' ').toLowerCase().includes(q);
  }).slice(0, 12);

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
      gainXp(SET_TYPES.find(type => type.id === completedSet.type)?.xp || 40);
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

  const buildCompletionSummary = () => {
    const previousWorkout = findLastMatchingWorkout(activeAvatar.history || [], workout);
    const rows = workout.exercises.map(exercise => {
      const previousExercise = previousWorkout?.exercises?.find(item => item.name === exercise.name);
      const currentVolume = exerciseVolume({
        ...exercise,
        sets: (exercise.sets || []).filter(set => set.done),
      });
      const previousVolume = previousExercise ? exerciseVolume(previousExercise) : 0;
      return {
        name: exercise.name,
        currentVolume,
        previousVolume,
        delta: currentVolume - previousVolume,
      };
    });
    return {
      workoutName: workout.name,
      previousDate: previousWorkout?.date,
      rows,
      totalCurrent: rows.reduce((sum, row) => sum + row.currentVolume, 0),
      totalPrevious: rows.reduce((sum, row) => sum + row.previousVolume, 0),
      durationMinutes: Math.max(1, Math.round((Date.now() - sessionStartedAt) / 60000)),
      completedSets: doneSets,
      totalSets,
    };
  };

  const finishTraining = () => {
    const summary = buildCompletionSummary();
    claimWorkout(workout.isBoss, { doneSets, totalSets });
    setCompletionSummary(summary);
    setTimerRunning(false);
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
          {completionSummary ? 'SESSION ENDED' : `${doneSets}/${totalSets} ${fantasy ? 'CYCLES' : 'SETS'}`}
        </div>
      </div>

      <Panel ticks style={{ padding: 16 }}>
        <div className="hud" style={{ fontSize: 10, letterSpacing: '0.24em', color: 'var(--cyan)' }}>
          TODAY · TRAIN
        </div>
        <div className="mythic glow-text" style={{ fontSize: 22, color: 'var(--ink)', marginTop: 4 }}>
          {completionSummary?.workoutName || workout.name}
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
          {!completionSummary && (
            <Button variant="ghost" style={{ padding: '6px 10px', fontSize: 10 }} onClick={() => setLibraryOpen(value => !value)}>
              {libraryOpen ? 'Hide Library' : 'Add Exercise'}
            </Button>
          )}
        </div>
      </Panel>

      {!completionSummary && (
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {libraryOpen && (
            <ExercisePicker
              query={exerciseQuery}
              setQuery={setExerciseQuery}
              exercises={filteredExercises}
              onAdd={(name) => {
                addExerciseToWorkout(name);
                setExerciseQuery('');
                setLibraryOpen(false);
              }}
            />
          )}
          {workout.exercises.map(ex => {
          const lastExercise = findLastExercise(activeAvatar.history || [], workout, ex.name);
          return (
          <Panel key={ex.id} style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <div className="mythic" style={{ fontSize: 16, color: 'var(--ink)' }}>{ex.name}</div>
                {ex.library && (
                  <div style={{ color: 'var(--ink-dim)', fontSize: 11, marginTop: 3 }}>
                    {ex.library.equipment} · {(ex.library.muscles || []).join(', ')}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setWorkout(w => ({
                    ...w,
                    exercises: w.exercises.map(item => item.id !== ex.id ? item : {
                      ...item,
                      sets: [
                        ...item.sets,
                        {
                          target: formatSetTarget(Number(item.sets.at(-1)?.weight || 0), Number(item.sets.at(-1)?.reps || item.sets.at(-1)?.plannedReps || 8)),
                          plannedReps: Number(item.sets.at(-1)?.plannedReps || 8),
                          reps: Number(item.sets.at(-1)?.reps || item.sets.at(-1)?.plannedReps || 8),
                          weight: Number(item.sets.at(-1)?.weight || 0),
                          type: 'normal',
                          done: false,
                        },
                      ],
                    }),
                  }))}
                  style={smallIconButton}
                >
                  + set
                </button>
                <div className="hud" style={{ fontSize: 10, color: 'var(--ink-dim)' }}>
                  {ex.sets.filter(s => s.done).length}/{ex.sets.length}
                </div>
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
                  <SetTypePicker
                    value={s.type || 'normal'}
                    onChange={type => updateSet(ex.id, i, { type })}
                  />
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
            <button
              type="button"
              onClick={() => setWorkout(w => ({ ...w, exercises: w.exercises.filter(item => item.id !== ex.id) }))}
              style={{ ...smallIconButton, marginTop: 10, color: 'var(--danger)' }}
            >
              Remove exercise
            </button>
          </Panel>
        );})}
          {workout.exercises.length === 0 && !libraryOpen && (
            <Button variant="primary" style={{ width: '100%', padding: '14px 0' }} onClick={() => setLibraryOpen(true)}>
              Add First Exercise
            </Button>
          )}
        </div>
      )}

      {completionSummary ? (
        <CompletionProgress summary={completionSummary} />
      ) : (
        <Button
          variant="primary"
          style={{ width: '100%', marginTop: 14 }}
          onClick={finishTraining}
          disabled={doneSets === 0}
        >
          {doneSets < totalSets
            ? (fantasy ? 'End Partial Training' : 'End Partial Training')
            : (fantasy ? 'Bloom · End Training' : 'Complete · Claim XP')}
        </Button>
      )}

      {completionSummary && (
        <Button
          variant="primary"
          style={{ width: '100%', marginTop: 14 }}
          onClick={() => setScreen('home')}
        >
          Return to Champion
        </Button>
      )}

      {ticks.map(t => <FloatingXp key={t.id} {...t} />)}
    </div>
  );
}

function CompletionProgress({ summary }) {
  const maxVolume = Math.max(1, ...summary.rows.flatMap(row => [row.currentVolume, row.previousVolume]));
  const totalDelta = summary.totalCurrent - summary.totalPrevious;

  return (
    <Panel glass ticks style={{ padding: 18, marginTop: 14 }}>
      <div className="hud" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--cyan)' }}>
        SESSION PROGRESS
      </div>
      <div className="mythic" style={{ color: 'var(--ink)', fontSize: 20, marginTop: 6 }}>
        {summary.workoutName}
      </div>
      <div style={{ color: 'var(--ink-dim)', fontSize: 12, marginTop: 6 }}>
        Current volume {Math.round(summary.totalCurrent)}kg · last comparable {Math.round(summary.totalPrevious)}kg · {totalDelta >= 0 ? '+' : ''}{Math.round(totalDelta)}kg
        {summary.previousDate ? ` · previous ${new Date(summary.previousDate).toLocaleDateString()}` : ' · no previous session'} · {summary.durationMinutes} min
      </div>

      <ShareCard summary={summary} />

      <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        {summary.rows.map(row => (
          <div key={row.name} style={{
            border: '1px solid var(--line)',
            borderRadius: 10,
            padding: 12,
            background: 'rgba(13,15,30,0.42)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
              <div className="mythic" style={{ color: 'var(--ink)', fontSize: 14 }}>{row.name}</div>
              <div className="hud" style={{ color: row.delta >= 0 ? 'var(--cyan)' : 'var(--danger)', fontSize: 10 }}>
                {row.delta >= 0 ? '+' : ''}{Math.round(row.delta)}kg
              </div>
            </div>
            <DottedBar label="This session" value={row.currentVolume} max={maxVolume} color="var(--cyan)" />
            <DottedBar label="Last session" value={row.previousVolume} max={maxVolume} color="var(--ink-ghost)" />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ExercisePicker({ query, setQuery, exercises, onAdd }) {
  return (
    <Panel glass ticks style={{ padding: 14 }}>
      <div className="hud" style={{ color: 'var(--cyan)', fontSize: 10, letterSpacing: '0.2em', marginBottom: 10 }}>
        EXERCISE LIBRARY
      </div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search exercise, muscle, equipment..."
        autoFocus
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '12px 13px',
          borderRadius: 10,
          border: '1px solid var(--line)',
          background: 'rgba(8,8,18,0.62)',
          color: 'var(--ink)',
          outline: 'none',
          marginBottom: 10,
        }}
      />
      <div style={{ display: 'grid', gap: 8 }}>
        {exercises.map(exercise => (
          <button
            key={exercise.name}
            type="button"
            onClick={() => onAdd(exercise.name)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              alignItems: 'center',
              border: '1px solid var(--line)',
              borderRadius: 10,
              background: 'rgba(13,15,30,0.45)',
              color: 'var(--ink)',
              padding: '10px 12px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span>
              <span className="mythic" style={{ display: 'block', fontSize: 14 }}>{exercise.name}</span>
              <span style={{ display: 'block', color: 'var(--ink-dim)', fontSize: 11, marginTop: 3 }}>
                {exercise.equipment} · {exercise.muscles.join(', ')}
              </span>
            </span>
            <span className="hud" style={{ color: 'var(--cyan)', fontSize: 10 }}>ADD</span>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function SetTypePicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', width: 104 }}>
      {SET_TYPES.map(type => (
        <button
          key={type.id}
          type="button"
          title={type.label}
          onClick={() => onChange(type.id)}
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            border: `1px solid ${value === type.id ? 'var(--cyan)' : 'var(--line)'}`,
            background: value === type.id ? 'rgba(34,211,238,0.16)' : 'rgba(0,0,0,0.2)',
            color: value === type.id ? 'var(--cyan)' : 'var(--ink-dim)',
            fontSize: 10,
            cursor: 'pointer',
          }}
        >
          {type.short}
        </button>
      ))}
    </div>
  );
}

function ShareCard({ summary }) {
  const text = [
    `${summary.workoutName}`,
    `${summary.completedSets}/${summary.totalSets} sets · ${summary.durationMinutes} min`,
    `Volume: ${Math.round(summary.totalCurrent)}kg`,
    ...summary.rows.map(row => `${row.name}: ${Math.round(row.currentVolume)}kg (${row.delta >= 0 ? '+' : ''}${Math.round(row.delta)}kg)`),
  ].join('\n');

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: summary.workoutName, text });
      return;
    }
    await navigator.clipboard?.writeText(text);
  };

  return (
    <div style={{
      border: '1px solid var(--line)',
      borderRadius: 12,
      background: 'linear-gradient(135deg, rgba(34,211,238,0.14), rgba(168,85,247,0.12))',
      padding: 14,
      marginTop: 14,
    }}>
      <div className="hud" style={{ color: 'var(--gold)', fontSize: 10, letterSpacing: '0.18em' }}>SHARE CARD</div>
      <div style={{ color: 'var(--ink)', fontSize: 13, whiteSpace: 'pre-line', lineHeight: 1.55, marginTop: 8 }}>{text}</div>
      <Button variant="ghost" style={{ marginTop: 12, width: '100%' }} onClick={share}>
        Share / Copy
      </Button>
    </div>
  );
}

function DottedBar({ label, value, max, color }) {
  const dots = 28;
  const activeDots = Math.round((Number(value || 0) / max) * dots);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '96px 1fr 72px', gap: 10, alignItems: 'center', marginTop: 7 }}>
      <div className="hud" style={{ color: 'var(--ink-dim)', fontSize: 9 }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${dots}, minmax(3px, 1fr))`, gap: 3 }}>
        {Array.from({ length: dots }, (_, index) => (
          <span key={index} style={{
            height: 10,
            borderRadius: 3,
            background: index < activeDots ? color : 'rgba(255,255,255,0.06)',
            boxShadow: index < activeDots ? `0 0 10px ${color}` : 'none',
          }} />
        ))}
      </div>
      <div className="hud" style={{ color, fontSize: 10, textAlign: 'right' }}>{Math.round(value || 0)}kg</div>
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

const smallIconButton = {
  border: '1px solid var(--line)',
  borderRadius: 8,
  background: 'rgba(13,15,30,0.45)',
  color: 'var(--ink-dim)',
  padding: '6px 8px',
  cursor: 'pointer',
  fontSize: 11,
};
