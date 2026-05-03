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
