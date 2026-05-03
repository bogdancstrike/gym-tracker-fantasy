import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { INITIAL_AVATARS, RACES } from '../data/races.js';
import { INITIAL_QUESTS } from '../data/quests.js';
import { LIVE_WORKOUT } from '../data/workout.js';
import { RANKS, DIFFICULTY_MULTIPLIER, getRankForLevel } from '../data/ranks.js';
import { INVENTORY, LOOT_POOL } from '../data/inventory.js';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [avatars, setAvatars] = useState(INITIAL_AVATARS);
  const [activeId, setActiveId] = useState(INITIAL_AVATARS[0].id);
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [workout, setWorkout] = useState(LIVE_WORKOUT);
  const [difficulty, setDifficulty] = useState('normal');
  const [screen, setScreen] = useState('home');
  const [inventory, setInventory] = useState(INVENTORY);

  // Modals & overlays
  const [bossIntro, setBossIntro] = useState(null);
  const [questReward, setQuestReward] = useState(null);
  const [levelUp, setLevelUp] = useState(null);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [switchCine, setSwitchCine] = useState(null);
  const [lootDrop, setLootDrop] = useState(null);

  const activeAvatar = avatars.find(a => a.id === activeId) || avatars[0];
  const race = RACES.find(r => r.id === activeAvatar.race);

  // Calculate effective stats (Base + Equipment)
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

  const updateActive = useCallback((patch) => {
    setAvatars(as => as.map(a => a.id === activeId ? { ...a, ...patch } : a));
  }, [activeId]);

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
    
    // Adjust rates based on boss or level? 
    // User requested: common 70%, rare 25%, unique 5%
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
        
        // Small chance of loot from regular quests
        if (Math.random() < 0.15) {
          setTimeout(() => {
            const item = dropLoot('quest');
            if (item) setLootDrop(item);
          }, 1000);
        }
      }
      return qs.map(q => q.id === id ? {
        ...q,
        done: !q.done,
        progress: !q.done ? q.target : q.progress,
      } : q);
    });
  }, [difficulty, dropLoot]);

  const gainXp = useCallback((amount) => {
    const currentXp = activeAvatar.xp;
    const newPct = activeAvatar.xp + (amount / (activeAvatar.xpMax / 100));
    
    if (newPct >= 100) {
      const nextLevel = activeAvatar.level + 1;
      const nextRank = getRankForLevel(nextLevel);
      
      updateActive({ 
        xp: 5, 
        level: nextLevel, 
        rank: nextRank,
        totalXpToday: activeAvatar.totalXpToday + amount 
      });

      setTimeout(() => {
        setLevelUp({
          fromLevel: activeAvatar.level, toLevel: nextLevel,
          fromRank: activeAvatar.rank, toRank: nextRank,
        });
        
        // Loot on level up!
        const item = dropLoot('levelup');
        if (item) setLootDrop(item);
      }, 400);
    } else {
      updateActive({ 
        xp: newPct, 
        totalXpToday: activeAvatar.totalXpToday + amount 
      });
    }
  }, [activeAvatar, updateActive, dropLoot]);

  const claimWorkout = useCallback((isBoss = false) => {
    const amount = isBoss ? 450 : 150;
    gainXp(amount);
    
    // Guaranteed loot from boss, chance from workout
    if (isBoss || Math.random() < 0.4) {
      const item = dropLoot('workout', isBoss);
      if (item) setLootDrop(item);
    }
  }, [gainXp, dropLoot]);

  const switchAvatar = useCallback((id) => {
    if (id === activeId) { setSwitcherOpen(false); return; }
    const from = activeAvatar;
    const to = avatars.find(a => a.id === id);
    setSwitcherOpen(false);
    setSwitchCine({ from, to });
    setTimeout(() => {
      setActiveId(id);
      setScreen('home');
    }, 1200);
  }, [activeAvatar, activeId, avatars]);

  const createAvatar = useCallback((newAv) => {
    const avWithEquip = { ...newAv, equippedIds: [], rank: getRankForLevel(newAv.level) };
    setAvatars(as => [...as, avWithEquip]);
    setActiveId(newAv.id);
    setCreateOpen(false);
    setScreen('home');
  }, []);

  const value = useMemo(() => ({
    avatars, activeAvatar, race, activeId, effectiveStats,
    quests, workout, setWorkout,
    difficulty, setDifficulty,
    screen, setScreen,
    inventory, toggleEquip,
    bossIntro, setBossIntro,
    questReward, setQuestReward,
    levelUp, setLevelUp,
    switcherOpen, setSwitcherOpen,
    createOpen, setCreateOpen,
    switchCine, setSwitchCine,
    lootDrop, setLootDrop,
    completeQuest, gainXp, claimWorkout, switchAvatar, createAvatar,
  }), [
    avatars, activeAvatar, race, activeId, effectiveStats,
    quests, workout, difficulty, screen,
    inventory, toggleEquip,
    bossIntro, questReward, levelUp, switcherOpen, createOpen, switchCine, lootDrop,
    completeQuest, gainXp, claimWorkout, switchAvatar, createAvatar,
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
