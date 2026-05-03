import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { INITIAL_AVATARS, RACES } from '../data/races.js';
import { QUEST_POOL } from '../data/quests.js';
import { LIVE_WORKOUT, createWorkoutFromProfile } from '../data/workout.js';
import { PROGRAMS } from '../data/programs.js';
import { RANKS, DIFFICULTY_MULTIPLIER, getRankForLevel } from '../data/ranks.js';
import { INVENTORY, LOOT_POOL } from '../data/inventory.js';

const GameContext = createContext(null);

export const STORAGE_KEY = 'ascend_hunters_forge_v1';

function mergePrograms(customPrograms = []) {
  const merged = {
    3: [...(PROGRAMS[3] || [])],
    4: [...(PROGRAMS[4] || [])],
    5: [...(PROGRAMS[5] || [])],
  };
  customPrograms.forEach(program => {
    const freq = Number(program.frequency || program.freq || program.days?.length || 3);
    if (!merged[freq]) merged[freq] = [];
    merged[freq].push(program);
  });
  return merged;
}

function getAvatarProgram(avatar, customPrograms = []) {
  const freq = avatar?.program?.freq || 4;
  const allPrograms = mergePrograms(customPrograms);
  const programs = allPrograms[freq] || allPrograms[4] || [];
  return programs.find(p => p.id === avatar?.program?.id) || programs[0];
}

function normalizeAvatar(avatar, legacyWorkout, customPrograms = []) {
  const program = getAvatarProgram(avatar, customPrograms);
  const profile = avatar.profile || {
    sex: 'not-specified',
    bodyweightKg: '',
    experience: 'beginner',
    goal: 'strength',
    splitStyle: program?.name || 'Upper / Lower',
    startingLifts: {
      bench: 35,
      squat: 45,
      deadlift: 60,
      overhead: 22.5,
    },
  };

  return {
    ...avatar,
    profile,
    equippedIds: avatar.equippedIds || [],
    history: avatar.history || [],
    metrics: avatar.metrics || [],
    workout: avatar.workout || legacyWorkout || createWorkoutFromProfile(profile, program),
  };
}

function getRandomQuests(count = 5) {
  const shuffled = [...QUEST_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(q => ({ ...q, done: false }));
}

export function GameProvider({ children }) {
  // Load initial state from Local Storage
  const [isLoaded, setIsLoaded] = useState(false);
  const [avatars, setAvatars] = useState(INITIAL_AVATARS.map(av => normalizeAvatar(av)));
  const [activeId, setActiveId] = useState(INITIAL_AVATARS[0].id);
  const [quests, setQuests] = useState([]);
  const [difficulty, setDifficulty] = useState('normal');
  const [screen, setScreen] = useState('home');
  const [inventory, setInventory] = useState(INVENTORY);
  const [lastQuestRefresh, setLastQuestRefresh] = useState(null);
  const [customPrograms, setCustomPrograms] = useState([]);

  // Modals & overlays
  const [bossIntro, setBossIntro] = useState(null);
  const [bossVictory, setBossVictory] = useState(null);
  const [questReward, setQuestReward] = useState(null);
  const [levelUp, setLevelUp] = useState(null);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [switchCine, setSwitchCine] = useState(null);
  const [lootDrop, setLootDrop] = useState(null);

  // Persistence: Load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const savedCustomPrograms = data.customPrograms || [];
        setCustomPrograms(savedCustomPrograms);
        const savedAvatars = data.avatars || INITIAL_AVATARS;
        setAvatars(savedAvatars.map(av => normalizeAvatar(av, data.workout, savedCustomPrograms)));
        setActiveId(data.activeId || savedAvatars[0]?.id || INITIAL_AVATARS[0].id);
        setQuests(data.quests || []);
        setDifficulty(data.difficulty || 'normal');
        setInventory(data.inventory || INVENTORY);
        setLastQuestRefresh(data.lastQuestRefresh);
      } catch (e) {
        console.error("Failed to load game state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Persistence: Save
  useEffect(() => {
    if (!isLoaded) return;
    const data = {
      avatars, activeId, quests, difficulty, inventory, lastQuestRefresh, customPrograms,
      schemaVersion: 2,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [avatars, activeId, quests, difficulty, inventory, lastQuestRefresh, customPrograms, isLoaded]);

  // Daily Refresh Logic
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastQuestRefresh !== today) {
      setQuests(getRandomQuests(5));
      setLastQuestRefresh(today);
      // Reset daily XP tracking on the avatar
      setAvatars(as => as.map(a => ({ ...a, totalXpToday: 0 })));
    }
  }, [lastQuestRefresh]);

  const activeAvatar = avatars.find(a => a.id === activeId) || avatars[0];
  const race = RACES.find(r => r.id === activeAvatar.race);
  const workout = activeAvatar?.workout || LIVE_WORKOUT;
  const availablePrograms = useMemo(() => mergePrograms(customPrograms), [customPrograms]);

  const updateActive = useCallback((patch) => {
    setAvatars(as => as.map(a => a.id === activeId ? { ...a, ...patch } : a));
  }, [activeId]);

  const setWorkout = useCallback((nextWorkout) => {
    setAvatars(as => as.map(a => {
      if (a.id !== activeId) return a;
      const workoutValue = typeof nextWorkout === 'function' ? nextWorkout(a.workout || LIVE_WORKOUT) : nextWorkout;
      return { ...a, workout: workoutValue };
    }));
  }, [activeId]);

  const addMetric = useCallback((type, value) => {
    updateActive({
      metrics: [
        ...(activeAvatar.metrics || []),
        { id: Date.now(), type, value, date: new Date().toISOString() }
      ]
    });
  }, [activeAvatar.metrics, updateActive]);

  const effectiveStats = useMemo(() => {
    const stats = { ...activeAvatar.stats };
    const equippedItems = inventory.filter(it => (activeAvatar.equippedIds || []).includes(it.id));
    equippedItems.forEach(item => {
      if (item.stats) {
        Object.entries(item.stats).forEach(([stat, val]) => {
          if (stats[stat] !== undefined) stats[stat] += val;
        });
      }
    });
    return stats;
  }, [activeAvatar.stats, activeAvatar.equippedIds, inventory]);

  const toggleEquip = useCallback((itemId) => {
    setAvatars(as => as.map(a => {
      if (a.id !== activeId) return a;
      const equippedIds = a.equippedIds || [];
      if (equippedIds.includes(itemId)) {
        return { ...a, equippedIds: equippedIds.filter(id => id !== itemId) };
      } else {
        return { ...a, equippedIds: [...equippedIds, itemId] };
      }
    }));
  }, [activeId]);

  const dropLoot = useCallback((sourceType = 'workout', isBoss = false) => {
    const roll = Math.random() * 100;
    let tier = 'common';
    if (isBoss) {
      if (roll < 15) tier = 'legendary';
      else if (roll < 45) tier = 'epic';
      else tier = 'rare';
    } else {
      if (roll < 5) tier = 'epic';
      else if (roll < 30) tier = 'rare';
      else tier = 'common';
    }
    const pool = LOOT_POOL.filter(it => it.tier === tier);
    if (pool.length === 0) return null;
    const template = pool[Math.floor(Math.random() * pool.length)];
    const newItem = {
      ...template,
      id: `loot-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      equipped: false,
    };
    setInventory(prev => [...prev, newItem]);
    return newItem;
  }, []);

  const completeQuest = useCallback((id) => {
    setQuests(qs => {
      const q = qs.find(x => x.id === id);
      if (q && !q.done) {
        const mult = DIFFICULTY_MULTIPLIER[difficulty] ?? 1;
        const rewardXp = Math.round(q.xp * mult);
        setQuestReward({ ...q, xp: rewardXp });
        
        if (Math.random() < 0.15) {
          setTimeout(() => {
            const item = dropLoot('quest');
            if (item) setLootDrop(item);
          }, 1000);
        }
      }
      return qs.map(q => q.id === id ? { ...q, done: !q.done } : q);
    });
  }, [difficulty, dropLoot]);

  const gainXp = useCallback((amount) => {
    const newPct = activeAvatar.xp + (amount / (activeAvatar.xpMax / 100));
    if (newPct >= 100) {
      const nextLevel = activeAvatar.level + 1;
      const nextRank = getRankForLevel(nextLevel);
      updateActive({ 
        xp: 5, level: nextLevel, rank: nextRank,
        totalXpToday: activeAvatar.totalXpToday + amount 
      });
      setTimeout(() => {
        setLevelUp({ fromLevel: activeAvatar.level, toLevel: nextLevel, fromRank: activeAvatar.rank, toRank: nextRank });
        const item = dropLoot('levelup');
        if (item) setLootDrop(item);
      }, 400);
    } else {
      updateActive({ xp: newPct, totalXpToday: activeAvatar.totalXpToday + amount });
    }
  }, [activeAvatar, updateActive, dropLoot]);

  const claimWorkout = useCallback((isBoss = false) => {
    const amount = isBoss ? 450 : 150;
    const today = new Date().toISOString();
    
    const workoutEntry = {
      id: Date.now(),
      type: isBoss ? 'boss' : 'workout',
      date: today,
      name: workout.name,
      program: activeAvatar.program,
      exercises: workout.exercises,
    };
    const history = [...(activeAvatar.history || []), workoutEntry];

    if (isBoss) {
      setBossVictory({ xp: amount, time: Math.floor(Math.random() * 20) + 15 });
      updateActive({ 
        bossWins: (activeAvatar.bossWins || 0) + 1,
        totalXpToday: activeAvatar.totalXpToday + amount,
        history
      });
    } else {
      updateActive({ 
        totalXpToday: activeAvatar.totalXpToday + amount,
        history
      });
    }
    gainXp(amount);
    if (isBoss || Math.random() < 0.4) {
      const item = dropLoot('workout', isBoss);
      if (item) setLootDrop(item);
    }
  }, [gainXp, dropLoot, workout.name, activeAvatar.history, activeAvatar.bossWins, updateActive]);

  const switchAvatar = useCallback((id) => {
    if (id === activeId) { setSwitcherOpen(false); return; }
    const from = activeAvatar;
    const to = avatars.find(a => a.id === id);
    setSwitcherOpen(false);
    setSwitchCine({ from, to });
    setTimeout(() => { setActiveId(id); setScreen('home'); }, 1200);
  }, [activeAvatar, activeId, avatars]);

  const createAvatar = useCallback((newAv) => {
    const program = getAvatarProgram(newAv, customPrograms);
    const workout = createWorkoutFromProfile(newAv.profile, program);
    const avWithEquip = {
      ...newAv,
      equippedIds: [],
      rank: getRankForLevel(newAv.level),
      history: [],
      metrics: [],
      workout,
    };
    setAvatars(as => [...as, avWithEquip]);
    setActiveId(newAv.id);
    setCreateOpen(false);
    setScreen('home');
  }, [customPrograms]);

  const saveCustomProgram = useCallback((program) => {
    const freq = Number(program.frequency || program.freq || program.days?.length || 3);
    const normalized = {
      ...program,
      frequency: freq,
      custom: true,
      id: program.id || `custom-${Date.now()}`,
      days: (program.days || []).slice(0, freq),
    };
    setCustomPrograms(programs => {
      const exists = programs.some(p => p.id === normalized.id);
      return exists
        ? programs.map(p => p.id === normalized.id ? normalized : p)
        : [...programs, normalized];
    });
  }, []);

  const deleteCustomProgram = useCallback((id) => {
    setCustomPrograms(programs => programs.filter(program => program.id !== id));
  }, []);

  const deleteAvatar = useCallback((id) => {
    setAvatars(as => {
      if (as.length <= 1) return as;
      const remaining = as.filter(a => a.id !== id);
      if (id === activeId && remaining[0]) {
        setActiveId(remaining[0].id);
        setScreen('home');
      }
      return remaining;
    });
  }, [activeId]);

  const value = useMemo(() => ({
    avatars, activeAvatar, race, activeId, effectiveStats,
    quests, workout, setWorkout,
    difficulty, setDifficulty,
    screen, setScreen,
    inventory, toggleEquip,
    customPrograms, availablePrograms, saveCustomProgram, deleteCustomProgram,
    bossIntro, setBossIntro,
    bossVictory, setBossVictory,
    questReward, setQuestReward,
    levelUp, setLevelUp,
    switcherOpen, setSwitcherOpen,
    createOpen, setCreateOpen,
    switchCine, setSwitchCine,
    lootDrop, setLootDrop,
    completeQuest, gainXp, claimWorkout, switchAvatar, createAvatar, deleteAvatar, addMetric, updateActive,
  }), [
    avatars, activeAvatar, race, activeId, effectiveStats,
    quests, workout, difficulty, screen,
    inventory, toggleEquip,
    customPrograms, availablePrograms, saveCustomProgram, deleteCustomProgram,
    bossIntro, bossVictory, questReward, levelUp, switcherOpen, createOpen, switchCine, lootDrop,
    completeQuest, gainXp, claimWorkout, switchAvatar, createAvatar, deleteAvatar, addMetric, updateActive,
  ]);

  if (!isLoaded) return null; // Prevent hydration mismatch or flash of empty state

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
