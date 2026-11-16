/**
 * STUDYPET — Persistent Storage & Automatic Save System
 * Multi-version resilient localStorage layer with schema integrity,
 * automatic debounced persistence, and seamless legacy migration.
 */

const STORAGE_KEY = 'studypet-save-v1';
const LEGACY_STORAGE_KEY = 'STUDYPET_DATA_V2';
const SAVE_VERSION = 1;

const DEFAULT_STATE = {
  version: SAVE_VERSION,
  user: {
    name: 'Scholar',
    title: 'Curious Novice',
    avatar: '🌱',
    studyGoal: 'Master Daily Focus & Nurture Companion',
    dailyTargetMinutes: 60,
    pomodoroStudyMin: 25,
    pomodoroBreakMin: 5,
    extendedStudyMin: 50,
    extendedBreakMin: 10,
    strictMode: false,
    soundEnabled: true,
    theme: 'cozy',
    streak: 0,
    bestStreak: 0,
    lastStudyDate: null,
    coins: 50,
    totalExp: 0,
    todayMinutes: 0,
    todayCompletedTasks: 0,
    todayCoinsEarned: 0,
    todayExpEarned: 0,
    isOnboarded: false
  },
  pet: {
    id: 'pet_companion',
    name: 'Pixel Snooze Egg',
    species: 'aconite_cat', // aconite_cat, florapup, lunafox (displayed as Lunapurr), pyrolux (legacy)
    stage: 'egg', // egg, baby, young, teen, adult, mythical
    isHatched: false,
    hatchSessionsRequired: 1,
    hatchSessionsCompleted: 0,
    level: 1,
    exp: 0,
    maxExp: 100,
    happiness: 100,
    energy: 100,
    hunger: 0, // 0 = full, 100 = starving
    cleanliness: 100,
    mood: 'Peaceful',
    personality: 'Cozy Lo-Fi Companion',
    // 5 Equipment Slots (Head, Neck, Body, Back, Special)
    equipped: {
      head: null,
      neck: null,
      body: null,
      back: null,
      special: null
    },
    // Backwards-compatible aliases
    equippedHat: null,
    equippedScarf: null,
    roomBg: 'attic',
    roomDecor: ['plant', 'rug'],
    totalInteractions: 0,
    hatchedAt: null,
    evolutionHistory: [
      { stage: 'egg', date: new Date().toISOString().split('T')[0], level: 1, title: 'Discovered Snooze Egg' }
    ]
  },
  tasks: [
    {
      id: 'task_01',
      title: 'First Study Milestone: 25-Min Deep Focus',
      subject: 'Core Academics',
      category: 'Assignment',
      deadline: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 16),
      priority: 'high',
      status: 'in-progress',
      estimatedMinutes: 25,
      actualMinutes: 0,
      subtasks: [
        { id: 'st_1', title: 'Prepare desk and close distracting tabs', completed: false },
        { id: 'st_2', title: 'Complete first 25m Focus Session in Study Room', completed: false },
        { id: 'st_3', title: 'Hatch Moonstone Dew Egg into Dewlet! 🐣', completed: false }
      ],
      description: 'Complete your first focus session to incubate and hatch your mysterious companion!',
      createdAt: new Date().toISOString(),
      timeline: [
        { text: 'Discovered mysterious Moonstone Dew Egg in Sanctuary', time: 'Just now' }
      ]
    }
  ],
  calendarEvents: [
    {
      id: 'cal_01',
      title: 'Hatching Celebration & Study Goal Planning',
      date: new Date().toISOString().split('T')[0],
      category: 'presentation',
      time: '12:00',
      color: '#38BDF8'
    }
  ],
  inventory: [
    { id: 'scholar_cap', type: 'head', name: 'Scholar Cap', count: 1 },
    { id: 'knit_scarf', type: 'neck', name: 'Warm Knitted Scarf', count: 1 },
    { id: 'berry_tart', type: 'food', name: 'Berry Tart', count: 3 }
  ],
  transactions: [
    { id: 'tx_init', type: 'earned', amount: 50, reason: 'Welcome to STUDYPET OS', timestamp: 'Just now', balanceAfter: 50 }
  ],
  sessions: [],
  quests: {
    daily: [
      { id: 'dq_1', title: 'Focus for 25 Minutes', target: 25, current: 0, unit: 'min', rewardCoins: 10, rewardExp: 20, claimed: false },
      { id: 'dq_2', title: 'Complete 1 Academic Task', target: 1, current: 0, unit: 'task', rewardCoins: 15, rewardExp: 25, claimed: false },
      { id: 'dq_3', title: 'Interact with Companion: Pet or Clean', target: 2, current: 0, unit: 'times', rewardCoins: 10, rewardExp: 15, claimed: false },
      { id: 'dq_4', title: 'Log a Reflection in Future Me', target: 1, current: 0, unit: 'letter', rewardCoins: 15, rewardExp: 30, claimed: false }
    ],
    weekly: [
      { id: 'wq_1', title: 'Accumulate 180 Study Minutes', target: 180, current: 0, unit: 'min', rewardCoins: 50, rewardExp: 100, claimed: false },
      { id: 'wq_2', title: 'Achieve a 3-Day Study Streak', target: 3, current: 0, unit: 'days', rewardCoins: 60, rewardExp: 120, claimed: false },
      { id: 'wq_3', title: 'Check off 2 Tasks with Subtasks', target: 2, current: 0, unit: 'tasks', rewardCoins: 45, rewardExp: 80, claimed: false }
    ]
  },
  achievements: [
    { id: 'ach_1', title: 'First Spark', desc: 'Complete your very first focus session', icon: '✨', unlocked: false, reward: 20 },
    { id: 'ach_2', title: 'Hatched a Companion', desc: 'Welcome your newborn study pet into the world', icon: '🐣', unlocked: false, reward: 30 },
    { id: 'ach_3', title: 'Cozy Scholar', desc: 'Maintain a 3-day consecutive study streak', icon: '🔥', unlocked: false, progress: 0, maxProgress: 3, reward: 40 },
    { id: 'ach_4', title: 'Unbreakable Dedication', desc: 'Reach a 7-day study streak', icon: '🌟', unlocked: false, progress: 0, maxProgress: 7, reward: 80 },
    { id: 'ach_5', title: 'Centurion of Focus', desc: 'Log 100 cumulative minutes of focus', icon: '⏱️', unlocked: false, progress: 0, maxProgress: 100, reward: 50 },
    { id: 'ach_6', title: 'Task Crusher', desc: 'Complete 5 academic assignments', icon: '🎯', unlocked: false, progress: 0, maxProgress: 5, reward: 60 },
    { id: 'ach_7', title: 'Fashion Icon', desc: 'Equip your pet with a hat and accessory', icon: '🎩', unlocked: false, reward: 25 },
    { id: 'ach_8', title: 'Time Traveler', desc: 'Write and seal your first Future Me time capsule', icon: '📜', unlocked: false, reward: 35 },
    { id: 'ach_9', title: 'Deep Diver', desc: 'Complete an Extended 50-minute session with zero tab switches', icon: '🧘', unlocked: false, progress: 0, maxProgress: 1, reward: 50 },
    { id: 'ach_10', title: 'Mythical Bond', desc: 'Evolve your companion to its Mythical form', icon: '🐉', unlocked: false, progress: 1, maxProgress: 4, reward: 200 }
  ],
  futureLetters: [
    {
      id: 'letter_01',
      title: 'A Letter for Final Exam Week',
      unlockDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      feelingEmoji: '🌱',
      feelingText: 'Determined yet hopeful',
      goalsText: 'Maintain high focus consistency, care for my companion, and believe in steady daily growth.',
      content: 'Dear Future Self,\n\nIf you are reading this, our journey has truly unfolded! Remember when we first began with a gentle Moonstone Dew Egg? Take a deep breath, brew your favorite warm drink, and trust in every single minute of quiet study you poured into your craft.\n\nYou have already grown so much. You got this!\n\n— Past Self',
      isOpened: false
    }
  ]
};

class DataStore {
  constructor() {
    this.saveTimeout = null;
    this.state = this.loadState();
    this.setupAutoSaveListeners();
  }

  loadState() {
    try {
      if (typeof localStorage === 'undefined') {
        return JSON.parse(JSON.stringify(DEFAULT_STATE));
      }

      // 1. Try modern save key
      const modernSerialized = localStorage.getItem(STORAGE_KEY);
      if (modernSerialized) {
        const parsed = JSON.parse(modernSerialized);
        if (parsed && parsed.pet) {
          this.ensureSchemaIntegrity(parsed);
          return parsed;
        }
      }

      // 2. Safe migration from legacy storage key
      const legacySerialized = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacySerialized) {
        const parsed = JSON.parse(legacySerialized);
        if (parsed && parsed.pet) {
          console.log('[StudyPet] Migrating legacy user save to', STORAGE_KEY);
          this.ensureSchemaIntegrity(parsed);
          this.saveStateImmediate(parsed);
          return parsed;
        }
      }

      // 3. Brand new user -> starts with Moonstone Dew Egg!
      const freshState = JSON.parse(JSON.stringify(DEFAULT_STATE));
      this.saveStateImmediate(freshState);
      return freshState;
    } catch (e) {
      console.error('Failed to load state, restoring default:', e);
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  }

  // Guarantee schema backward/forward compatibility and slot assignments
  ensureSchemaIntegrity(targetState) {
    const state = targetState || this.state;
    if (!state) return;
    if (!state.user) state.user = JSON.parse(JSON.stringify(DEFAULT_STATE.user));
    if (!state.user.scholarName) state.user.scholarName = state.user.name || 'Scholar';
    if (!state.pet) state.pet = JSON.parse(JSON.stringify(DEFAULT_STATE.pet));

    // Normalize lunapurr alias to canonical lunafox internal ID
    if (state.pet.species === 'lunapurr') {
      state.pet.species = 'lunafox';
    }

    // Ensure 5 equipment slots exist
    if (!state.pet.equipped) {
      state.pet.equipped = {
        head: state.pet.equippedHat || null,
        neck: state.pet.equippedScarf || null,
        body: null,
        back: null,
        special: null
      };
    } else {
      if (state.pet.equipped.head === undefined) state.pet.equipped.head = state.pet.equippedHat || null;
      if (state.pet.equipped.neck === undefined) state.pet.equipped.neck = state.pet.equippedScarf || null;
      if (state.pet.equipped.body === undefined) state.pet.equipped.body = null;
      if (state.pet.equipped.back === undefined) state.pet.equipped.back = null;
      if (state.pet.equipped.special === undefined) state.pet.equipped.special = null;
    }

    // Mirror backwards compatibility aliases
    state.pet.equippedHat = state.pet.equipped.head;
    state.pet.equippedScarf = state.pet.equipped.neck;

    // Ensure hatching and stage consistency
    if (state.pet.stage === 'egg') {
      if (state.pet.isHatched === undefined) state.pet.isHatched = false;
      if (state.pet.hatchSessionsRequired === undefined) state.pet.hatchSessionsRequired = 1;
      if (state.pet.hatchSessionsCompleted === undefined) state.pet.hatchSessionsCompleted = 0;
    } else {
      // If user already has baby, young, etc. they are already hatched
      state.pet.isHatched = true;
    }

    // Align stage with shared evolution milestones if hatched
    if (state.pet.isHatched) {
      const lvl = state.pet.level || 2;
      if (lvl >= 15) state.pet.stage = 'mythical';
      else if (lvl >= 10) state.pet.stage = 'adult';
      else if (lvl >= 6) state.pet.stage = 'teen';
      else if (lvl >= 3) state.pet.stage = 'young';
      else state.pet.stage = 'baby';
    }

    // Ensure evolution history array exists
    if (!Array.isArray(state.pet.evolutionHistory) || state.pet.evolutionHistory.length === 0) {
      state.pet.evolutionHistory = [
        {
          stage: state.pet.stage || 'baby',
          date: new Date().toISOString().split('T')[0],
          level: state.pet.level || 1,
          title: `Companion: ${state.pet.name || 'Friend'}`
        }
      ];
    }

    // Ensure version and array collections
    state.version = SAVE_VERSION;
    if (!Array.isArray(state.tasks)) state.tasks = [];
    if (!Array.isArray(state.calendarEvents)) state.calendarEvents = [];
    if (!Array.isArray(state.inventory)) state.inventory = [];
    if (!Array.isArray(state.transactions)) state.transactions = [];
    if (!Array.isArray(state.sessions)) state.sessions = [];
    if (!Array.isArray(state.futureLetters)) state.futureLetters = [];
    if (!state.quests) state.quests = JSON.parse(JSON.stringify(DEFAULT_STATE.quests));
    if (!Array.isArray(state.achievements)) state.achievements = JSON.parse(JSON.stringify(DEFAULT_STATE.achievements));
  }

  // Centralized debounced save operation (prevents excessive writes)
  saveState(state = this.state) {
    this.state = state;
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.saveStateImmediate();
    }, 280);
  }

  // Immediate synchronous save (for critical moments: hatching, evolution, beforeunload)
  saveStateImmediate(state = this.state) {
    try {
      this.state = state;
      this.state.version = SAVE_VERSION;
      this.state.lastSaved = Date.now();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
      this.triggerSavedIndicator();
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }

  // Subtle visual "Progress Saved" indicator
  triggerSavedIndicator() {
    if (typeof document === 'undefined') return;
    const indicator = document.getElementById('save-status-indicator');
    if (!indicator) return;

    indicator.classList.add('visible');
    if (this.indicatorTimeout) clearTimeout(this.indicatorTimeout);
    this.indicatorTimeout = setTimeout(() => {
      indicator.classList.remove('visible');
    }, 1800);
  }

  // Page lifecycle listeners
  setupAutoSaveListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.saveStateImmediate();
      }
    });

    window.addEventListener('beforeunload', () => {
      this.saveStateImmediate();
    });
  }

  resetToDemo() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.saveStateImmediate();
    return this.state;
  }

  exportJSON() {
    return JSON.stringify(this.state, null, 2);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.user || !parsed.pet) {
        throw new Error('Invalid StudyPet backup format');
      }
      this.ensureSchemaIntegrity(parsed);
      this.state = parsed;
      this.saveStateImmediate();
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  }

  // Currency & EXP Helper
  addRewards(exp, coins, reason) {
    this.state.user.coins = (this.state.user.coins || 0) + coins;
    this.state.user.totalExp = (this.state.user.totalExp || 0) + exp;
    this.state.user.todayCoinsEarned = (this.state.user.todayCoinsEarned || 0) + coins;
    this.state.user.todayExpEarned = (this.state.user.todayExpEarned || 0) + exp;

    // Pet happiness boost
    this.state.pet.happiness = Math.min(100, (this.state.pet.happiness || 80) + Math.ceil(exp / 4));

    // Ledger transaction
    this.state.transactions.unshift({
      id: 'tx_' + Date.now(),
      type: 'earned',
      amount: coins,
      reason: reason || 'Study Progression',
      timestamp: 'Just now',
      balanceAfter: this.state.user.coins
    });

    this.saveState();
    return { coins: this.state.user.coins, exp: this.state.pet.exp };
  }

  spendCoins(amount, reason) {
    if ((this.state.user.coins || 0) < amount) {
      return false;
    }
    this.state.user.coins -= amount;
    this.state.transactions.unshift({
      id: 'tx_' + Date.now(),
      type: 'spent',
      amount: amount,
      reason: reason,
      timestamp: 'Just now',
      balanceAfter: this.state.user.coins
    });
    this.saveState();
    return true;
  }
}

// Global data store instance
const store = new DataStore();
if (typeof window !== 'undefined') {
  window.dataStore = store;
}
if (typeof module !== 'undefined') {
  module.exports = { DataStore, DEFAULT_STATE };
}
