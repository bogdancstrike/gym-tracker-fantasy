import { useGame } from '../contexts/GameContext.jsx';
import { Panel } from '../ui/Panel.jsx';
import { workoutVolume } from '../data/trainingProgress.js';

export function History() {
  const { activeAvatar, setSelectedExercise, setScreen } = useGame();
  const history = [...(activeAvatar.history || [])].reverse();

  const openExercise = (name) => {
    setSelectedExercise(name);
    setScreen('exercise');
  };

  return (
    <div className="screen-enter" style={{ padding: '6px 16px 130px' }}>
      <Panel glass ticks style={{ padding: 24, marginTop: 8 }}>
        <div className="hud" style={{ color: 'var(--cyan)', fontSize: 10, letterSpacing: '0.24em' }}>
          TRAINING LOG
        </div>
        <div className="mythic glow-text" style={{ color: 'var(--ink)', fontSize: 30, marginTop: 6 }}>
          Workout History
        </div>
      </Panel>

      <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        {history.length === 0 && (
          <Panel style={{ padding: 18 }}>
            <div style={{ color: 'var(--ink-dim)', fontSize: 13 }}>No completed workouts yet.</div>
          </Panel>
        )}

        {history.map(entry => (
          <Panel key={entry.id} glass style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div className="mythic" style={{ color: 'var(--ink)', fontSize: 18 }}>{entry.name}</div>
                <div style={{ color: 'var(--ink-dim)', fontSize: 12, marginTop: 4 }}>
                  {new Date(entry.date).toLocaleString()} · {entry.type}
                </div>
              </div>
              <div className="hud" style={{ color: 'var(--cyan)', fontSize: 11 }}>
                {Math.round(entry.volume || workoutVolume(entry))} KG VOLUME
              </div>
            </div>

            <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
              {(entry.exercises || []).map(exercise => (
                <div key={`${entry.id}-${exercise.name}`} style={{
                  border: '1px solid var(--line)',
                  borderRadius: 10,
                  padding: 12,
                  background: 'rgba(13,15,30,0.38)',
                }}>
                  <button
                    type="button"
                    onClick={() => openExercise(exercise.name)}
                    className="mythic"
                    style={{
                      border: 0,
                      background: 'transparent',
                      color: 'var(--ink)',
                      fontSize: 15,
                      padding: 0,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {exercise.name}
                  </button>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {(exercise.sets || []).map((set, index) => (
                      <span key={`${entry.id}-${exercise.name}-${index}`} style={{
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
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
