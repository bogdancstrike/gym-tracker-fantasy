export function setVolume(set) {
  return Number(set?.weight || 0) * Number(set?.reps || 0);
}

export function estimatedOneRepMax(set) {
  const weight = Number(set?.weight || 0);
  const reps = Number(set?.reps || 0);
  if (!weight || !reps) return 0;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

export function exerciseVolume(exercise) {
  return (exercise?.sets || []).reduce((sum, set) => sum + setVolume(set), 0);
}

export function workoutVolume(workout) {
  return (workout?.exercises || []).reduce((sum, exercise) => sum + exerciseVolume(exercise), 0);
}

export function muscleGroupForExercise(name = '') {
  const n = name.toLowerCase();
  if (/bench|chest|incline|fly|push-up|pushup/.test(n)) return 'Chest';
  if (/row|pull|lat|back|deadlift|hinge|face pull/.test(n)) return 'Back';
  if (/squat|leg|lunge|calf|hamstring|quad|front squat/.test(n)) return 'Legs';
  if (/overhead|shoulder|lateral|rear delt|press/.test(n)) return 'Shoulders';
  if (/curl|triceps|skull|arms|pressdown/.test(n)) return 'Arms';
  if (/plank|core|abs|carry/.test(n)) return 'Core';
  if (/sprint|burpee|jump rope|bike|conditioning/.test(n)) return 'Conditioning';
  return 'Other';
}

export function findLastMatchingWorkout(history = [], workout = {}) {
  return [...history]
    .reverse()
    .find(entry =>
      entry.type === 'workout'
      && entry.program?.id === workout.programId
      && (entry.dayName === workout.dayName || entry.name?.endsWith(`· ${workout.dayName}`))
    );
}

export function findLastExercise(history = [], workout = {}, exerciseName) {
  const lastWorkout = findLastMatchingWorkout(history, workout);
  return lastWorkout?.exercises?.find(ex => ex.name === exerciseName) || null;
}

export function buildRecordsFromHistory(history = []) {
  const records = {};
  history.forEach(entry => {
    (entry.exercises || []).forEach(exercise => {
      const current = records[exercise.name] || {
        bestSet: null,
        bestSetVolume: 0,
        bestEstimatedOneRepMax: 0,
        bestWorkoutVolume: 0,
      };
      const exerciseTotal = exerciseVolume(exercise);
      const bestSet = [...(exercise.sets || [])].sort((a, b) => setVolume(b) - setVolume(a))[0];
      const bestSetVolume = bestSet ? setVolume(bestSet) : 0;
      const bestEstimatedOneRepMax = bestSet ? estimatedOneRepMax(bestSet) : 0;
      records[exercise.name] = {
        bestSet: bestSetVolume > current.bestSetVolume ? bestSet : current.bestSet,
        bestSetVolume: Math.max(current.bestSetVolume, bestSetVolume),
        bestEstimatedOneRepMax: Math.max(current.bestEstimatedOneRepMax, bestEstimatedOneRepMax),
        bestWorkoutVolume: Math.max(current.bestWorkoutVolume, exerciseTotal),
      };
    });
  });
  return records;
}

export function buildExerciseHistory(history = [], exerciseName) {
  return history
    .filter(entry => (entry.exercises || []).some(ex => ex.name === exerciseName))
    .map(entry => {
      const exercise = (entry.exercises || []).find(ex => ex.name === exerciseName);
      const bestSet = [...(exercise?.sets || [])].sort((a, b) => estimatedOneRepMax(b) - estimatedOneRepMax(a))[0];
      return {
        id: `${entry.id}-${exerciseName}`,
        date: entry.date,
        dateFormatted: new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        workoutName: entry.name,
        exercise,
        volume: exerciseVolume(exercise),
        bestSet,
        e1rm: estimatedOneRepMax(bestSet),
      };
    });
}

export function buildOneRepMaxTrend(history = [], exerciseNames = ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press']) {
  const byDate = {};
  history.forEach(entry => {
    const label = new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    byDate[label] ||= { name: label };
    exerciseNames.forEach(exerciseName => {
      const exercise = (entry.exercises || []).find(ex => ex.name === exerciseName);
      if (!exercise) return;
      const bestSet = [...(exercise.sets || [])].sort((a, b) => estimatedOneRepMax(b) - estimatedOneRepMax(a))[0];
      byDate[label][exerciseName] = Math.max(byDate[label][exerciseName] || 0, estimatedOneRepMax(bestSet));
    });
  });
  return Object.values(byDate).slice(-12);
}

export function buildMuscleVolumeData(history = [], days = 28) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const totals = {};
  history
    .filter(entry => new Date(entry.date) >= since)
    .forEach(entry => {
      (entry.exercises || []).forEach(exercise => {
        const group = muscleGroupForExercise(exercise.name);
        totals[group] = (totals[group] || 0) + exerciseVolume(exercise);
      });
    });
  return Object.entries(totals)
    .map(([name, volume]) => ({ name, volume: Math.round(volume) }))
    .sort((a, b) => b.volume - a.volume);
}

export function buildAdherenceCalendar(history = [], days = 35) {
  const entriesByDate = {};
  history.forEach(entry => {
    const key = new Date(entry.date).toDateString();
    const existing = entriesByDate[key] || { doneSets: 0, totalSets: 0, sessions: 0 };
    entriesByDate[key] = {
      doneSets: existing.doneSets + Number(entry.doneSets || 0),
      totalSets: existing.totalSets + Number(entry.totalSets || 0),
      sessions: existing.sessions + 1,
    };
  });

  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const key = d.toDateString();
    const entry = entriesByDate[key];
    const ratio = entry?.totalSets ? entry.doneSets / entry.totalSets : 0;
    return {
      key,
      label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      day: d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 1),
      ratio,
      sessions: entry?.sessions || 0,
      status: !entry ? 'missed' : ratio >= 1 ? 'complete' : 'partial',
    };
  });
}

export function getSetRecordBonus(records = {}, exerciseName, set) {
  const record = records[exerciseName];
  if (!record) return null;
  const currentVolume = setVolume(set);
  const currentEstimatedMax = estimatedOneRepMax(set);
  if (currentVolume > (record.bestSetVolume || 0)) {
    return { type: 'volume', xp: 35, label: 'Volume Record' };
  }
  if (currentEstimatedMax > (record.bestEstimatedOneRepMax || 0)) {
    return { type: 'intensity', xp: 50, label: 'Intensity Record' };
  }
  return null;
}

export function getProgressionSuggestion(lastSet, currentSet) {
  if (!lastSet) return 'No previous set. Establish a clean baseline.';
  const lastWeight = Number(lastSet.weight || 0);
  const lastReps = Number(lastSet.reps || 0);
  const currentWeight = Number(currentSet?.weight || 0);
  const currentReps = Number(currentSet?.reps || 0);
  const targetReps = Number(currentSet?.plannedReps || currentSet?.reps || lastReps || 8);
  if (!lastWeight || !lastReps) return 'No comparable load. Keep the set clean and controlled.';

  if (currentWeight > lastWeight) {
    return `Heavier than last time. Try to land ${Math.max(1, Math.min(targetReps, lastReps - 1))}-${targetReps} reps.`;
  }

  if (lastReps < targetReps + 1) {
    return `Progress reps first: aim for ${lastWeight}kg x ${lastReps + 1}.`;
  }

  const suggested = suggestNextSet(lastSet, currentSet);
  return `Suggested: ${suggested.weight}kg x ${suggested.reps}.`;
}

export function suggestNextSet(lastSet, currentSet = {}) {
  const lastWeight = Number(lastSet?.weight || 0);
  const lastReps = Number(lastSet?.reps || 0);
  const targetReps = Number(currentSet?.plannedReps || currentSet?.reps || lastReps || 8);
  if (!lastWeight || !lastReps) return { weight: Number(currentSet?.weight || 0), reps: targetReps };

  const increment = lastWeight < 60 ? 2.5 : 2.5;
  const loadJumpPct = lastReps >= targetReps + 3 ? 0.05 : 0.025;
  const cappedJump = Math.min(0.1, Math.max(0.025, loadJumpPct));
  const rawWeight = lastWeight * (1 + cappedJump);
  const suggestedWeight = Math.round(rawWeight / increment) * increment;
  const e1rm = estimatedOneRepMax(lastSet);
  const predictedReps = Math.floor(Math.max(1, (e1rm / suggestedWeight - 1) * 30));
  const suggestedReps = Math.max(1, Math.min(targetReps, predictedReps || targetReps - 1));

  return {
    weight: suggestedWeight,
    reps: suggestedReps,
  };
}
