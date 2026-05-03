export const EXERCISE_LIBRARY = [
  { name: 'Bench Press', muscles: ['Chest', 'Triceps', 'Shoulders'], equipment: 'Barbell', sets: 3, reps: 8, weight: 40 },
  { name: 'Incline Dumbbell Press', muscles: ['Chest', 'Shoulders'], equipment: 'Dumbbells', sets: 3, reps: 10, weight: 20 },
  { name: 'Machine Chest Press', muscles: ['Chest'], equipment: 'Machine', sets: 3, reps: 10, weight: 35 },
  { name: 'Cable Fly', muscles: ['Chest'], equipment: 'Cable', sets: 2, reps: 12, weight: 10 },
  { name: 'Push-up', muscles: ['Chest', 'Core'], equipment: 'Bodyweight', sets: 3, reps: 12, weight: 0 },
  { name: 'Squat', muscles: ['Legs', 'Core'], equipment: 'Barbell', sets: 4, reps: 8, weight: 40 },
  { name: 'Front Squat', muscles: ['Legs', 'Core'], equipment: 'Barbell', sets: 3, reps: 8, weight: 30 },
  { name: 'Leg Press', muscles: ['Legs'], equipment: 'Machine', sets: 3, reps: 12, weight: 80 },
  { name: 'Romanian Deadlift', muscles: ['Back', 'Legs'], equipment: 'Barbell', sets: 3, reps: 10, weight: 50 },
  { name: 'Deadlift', muscles: ['Back', 'Legs'], equipment: 'Barbell', sets: 3, reps: 5, weight: 60 },
  { name: 'Walking Lunge', muscles: ['Legs'], equipment: 'Dumbbells', sets: 3, reps: 12, weight: 12 },
  { name: 'Bulgarian Split Squat', muscles: ['Legs'], equipment: 'Dumbbells', sets: 3, reps: 10, weight: 12 },
  { name: 'Leg Curl', muscles: ['Legs'], equipment: 'Machine', sets: 3, reps: 12, weight: 25 },
  { name: 'Standing Calf Raise', muscles: ['Legs'], equipment: 'Machine', sets: 4, reps: 15, weight: 40 },
  { name: 'Barbell Row', muscles: ['Back'], equipment: 'Barbell', sets: 3, reps: 8, weight: 35 },
  { name: 'Dumbbell Row', muscles: ['Back'], equipment: 'Dumbbells', sets: 3, reps: 12, weight: 22.5 },
  { name: 'Lat Pulldown', muscles: ['Back'], equipment: 'Cable', sets: 3, reps: 10, weight: 35 },
  { name: 'Pull-up / Assisted Pull-up', muscles: ['Back', 'Arms'], equipment: 'Bodyweight', sets: 4, reps: 8, weight: 0 },
  { name: 'Cable Row', muscles: ['Back'], equipment: 'Cable', sets: 3, reps: 12, weight: 35 },
  { name: 'Face Pull', muscles: ['Back', 'Shoulders'], equipment: 'Cable', sets: 2, reps: 15, weight: 12.5 },
  { name: 'Overhead Press', muscles: ['Shoulders', 'Triceps'], equipment: 'Barbell', sets: 3, reps: 8, weight: 25 },
  { name: 'Lateral Raise', muscles: ['Shoulders'], equipment: 'Dumbbells', sets: 3, reps: 15, weight: 7.5 },
  { name: 'Rear Delt Fly', muscles: ['Shoulders', 'Back'], equipment: 'Dumbbells', sets: 3, reps: 15, weight: 7.5 },
  { name: 'Dumbbell Curl', muscles: ['Arms'], equipment: 'Dumbbells', sets: 3, reps: 12, weight: 10 },
  { name: 'Hammer Curl', muscles: ['Arms'], equipment: 'Dumbbells', sets: 3, reps: 12, weight: 10 },
  { name: 'Triceps Pressdown', muscles: ['Arms'], equipment: 'Cable', sets: 3, reps: 12, weight: 20 },
  { name: 'Skull Crusher', muscles: ['Arms'], equipment: 'EZ Bar', sets: 3, reps: 10, weight: 20 },
  { name: 'Plank', muscles: ['Core'], equipment: 'Bodyweight', sets: 3, reps: 45, weight: 0 },
  { name: 'Farmer Carry', muscles: ['Core', 'Back'], equipment: 'Dumbbells', sets: 3, reps: 40, weight: 24 },
  { name: 'Burpees', muscles: ['Conditioning'], equipment: 'Bodyweight', sets: 4, reps: 12, weight: 0 },
  { name: 'Sprint Intervals', muscles: ['Conditioning'], equipment: 'Outdoor', sets: 6, reps: 1, weight: 0 },
  { name: 'Bike Cooldown', muscles: ['Conditioning'], equipment: 'Bike', sets: 1, reps: 10, weight: 0 },
];

export const SET_TYPES = [
  { id: 'warmup', label: 'Warmup', short: 'W', xp: 15 },
  { id: 'normal', label: 'Normal', short: 'N', xp: 40 },
  { id: 'drop', label: 'Drop', short: 'D', xp: 35 },
  { id: 'failure', label: 'Failure', short: 'F', xp: 50 },
];

export function createExerciseFromLibrary(template, idSuffix = Date.now()) {
  return {
    id: `ex-${idSuffix}-${Math.floor(Math.random() * 1000)}`,
    name: template.name,
    library: {
      muscles: template.muscles,
      equipment: template.equipment,
    },
    sets: Array.from({ length: template.sets || 3 }, () => ({
      target: template.weight ? `${template.weight}kg × ${template.reps || 8}` : `${template.reps || 8} reps`,
      plannedReps: template.reps || 8,
      reps: template.reps || 8,
      weight: template.weight || 0,
      type: 'normal',
      done: false,
    })),
  };
}
