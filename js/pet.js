/**
 * STUDYPET — Virtual Pet & Pixel Art Engine
 * Faithful to the 90s OS pixel-art sanctuary aesthetic.
 * Fully supports all 3 companion lines & evolution:
 * 1. Aconite Kitty (Tea, Mug & Chill Lo-Fi)
 * 2. Florapup (Nature & Botany)
 * 3. Lunapurr (Celestial companion — Moonlight, Dreams & Imagination)
 * Plus legacy support for Pyrolux.
 */

const PET_SPECIES_DATA = {
  aconite_cat: {
    id: 'aconite_cat',
    name: 'Aconite Kitty',
    subtitle: 'Tea, Mug & Chill Lo-Fi',
    element: 'Calm & Cozy Focus',
    affinity: 'Lo-Fi Chill, Tea & Mindful Breaks',
    palette: { primary: '#EAEAEA', secondary: '#C5C5CE', accent: '#8B5CF6', egg: '#E2E8F0' },
    stages: {
      egg: { name: 'Pixel Snooze Egg', desc: 'A gentle, warm pixel-art egg wrapped in a soft lavender glow with a sleepy paw motif.' },
      baby: { name: 'Pixel Kitten', desc: 'A tiny white kitten with big sleepy ears that curls up beside your keyboard.' },
      young: { name: 'Tea Sipper Kit', desc: 'An adorable peaceful kitten sitting at the desk sipping coffee from a purple mug.' },
      teen: { name: 'Lo-Fi Scholar Cat', desc: 'A relaxed feline companion typing away on retro mechanical keycaps.' },
      adult: { name: 'Zen Study Master', desc: 'A serene master of focus surrounded by warm steam, books, and night starlight.' },
      mythical: { name: 'Celestial Astral Neko', desc: 'An immortal starlight kitten whose calm purrs dissolve all academic stress.' }
    }
  },
  florapup: {
    id: 'florapup',
    name: 'Florapup',
    subtitle: 'Nature & Botany',
    element: 'Nature & Growth',
    affinity: 'Patience, Botany & Structured Learning',
    palette: { primary: '#526B55', secondary: '#A8B99A', accent: '#F3D58A', egg: '#C4D3B9' },
    stages: {
      egg: { name: 'Moss Sprout Egg', desc: 'A warm, jade-speckled egg topped with a tiny green leaf sprout.' },
      baby: { name: 'Sproutling', desc: 'A fuzzy, round plant-pup with floppy leaf ears and curious dark eyes.' },
      young: { name: 'Clover Bark', desc: 'An energetic puppy with a four-leaf clover tail that wags when you study.' },
      teen: { name: 'Bramble Hound', desc: 'A sleek, agile canine woven with protective flowering brambles.' },
      adult: { name: 'Forest Guardian', desc: 'A majestic botanical wolf crowned with blossoming antlers and ancient moss.' },
      mythical: { name: 'Celestial Yggdrasil Hound', desc: 'A mythical nature deity enveloped in golden sunlit pollen and infinite wisdom.' }
    }
  },
  lunafox: {
    id: 'lunafox',
    name: 'Lunapurr', // Displayed everywhere as Lunapurr per Guide requirement
    subtitle: 'Celestial companion — Moonlight, Dreams & Imagination',
    element: 'Moonlight, Dreams & Imagination',
    affinity: 'Deep Focus, Research & Serene Reflection',
    palette: { primary: '#F8FAFC', secondary: '#C4B5FD', accent: '#FDE047', egg: '#BFE2F7' },
    stages: {
      egg: { name: 'Egg', desc: 'A pale moonlit egg with a small cat motif and soft lavender/celestial glow.' },
      baby: { name: 'Baby', desc: 'A tiny, cuddly celestial kitten with soft moonlit colors.' },
      young: { name: 'Young', desc: 'A lively young cat with clearer celestial details and a small moon/star accessory.' },
      teen: { name: 'Teen', desc: 'A graceful taller cat with more elaborate lunar clothing/accessories.' },
      adult: { name: 'Adult', desc: 'A mature moonlit cat with a flowing celestial cape or outfit and stronger starlight details.' },
      mythical: { name: 'Mythical Cat', desc: 'A majestic final celestial cat with ornate lunar/celestial accessories, luminous effects, and the most elaborate silhouette.' }
    }
  },
  pyrolux: {
    id: 'pyrolux',
    name: 'Pyrolux',
    subtitle: 'Flame & Courage',
    element: 'Flame & Courage',
    affinity: 'Passion, Problem Solving & Bold Projects',
    palette: { primary: '#D98D72', secondary: '#F4C4B5', accent: '#E5BE53', egg: '#F4C4B5' },
    stages: {
      egg: { name: 'Ember Hearth Egg', desc: 'A terracotta egg radiating a cozy warmth like a crackling hearth.' },
      baby: { name: 'Emberkit', desc: 'A tiny kitten with glowing ember ears and a tail tip that sparkles.' },
      young: { name: 'Sparksphinx', desc: 'A curious winged cat that pounces playfully whenever you solve hard questions.' },
      teen: { name: 'Blazeclaw', desc: 'A fierce, graceful feline with fiery markings and soaring confidence.' },
      adult: { name: 'Solar Pyrewing', desc: 'A noble dragon-feline with radiant wings made of gentle campfire flame.' },
      mythical: { name: 'Eternal Phoenix Chimera', desc: 'An immortal starfire guardian whose radiant aura dispels all self-doubt.' }
    }
  }
};

// Evolution level milestones shared by all companions
const PET_EVOLUTION_LEVELS = [
  { stage: 'egg', level: 1, minLevel: 1 },
  { stage: 'baby', level: 2, minLevel: 2 },
  { stage: 'young', level: 3, minLevel: 3 },
  { stage: 'teen', level: 6, minLevel: 6 },
  { stage: 'adult', level: 10, minLevel: 10 },
  { stage: 'mythical', level: 15, minLevel: 15 }
];

// Companion personality quotes
const COMPANION_QUOTES = {
  aconite_cat: {
    idle: [
      "take breaks!\ndrink water\nrest your eyes\n:3c",
      "one problem at a time~\nmy tea is nice and warm\nlet's keep going! ☕",
      "breathe in...\nbreathe out...\nrest your mind :3",
      "every minute you focus\nmakes you wiser!\npurrrrr~ 🐾",
      "don't rush!\nslow and steady\nfinishes the assignment 📚",
      "tiny break time.\nstretch your paws\nand sip something warm."
    ],
    pet: [
      "purrrrr~ thank you for the love! 🐾",
      "*nuzzles gently against your hand* :3",
      "soft pats make studying so peaceful! ✨",
      "warm purrs for your hard work today! ❤️"
    ],
    feed: [
      "sip... sip... warm tea makes studying so cozy! :3c",
      "munch munch! sweet treats fuel deep focus! 🥐",
      "delicious! my stamina is totally restored! ☕",
      "thank you for the treat, scholar! :3"
    ],
    play: [
      "yay! keyboard clack clack! time for focus mode! 🐾",
      "pounce! caught the tricky bug! :3c",
      "swishing my tail to the lo-fi beat! 🎵",
      "study break play keeps our spirits bright! ✨"
    ],
    clean: [
      "fresh screen, clean desk, peaceful mind! ✨",
      "all clean and tidy! ready for deep work! 🫧",
      "sparkling neat! a clear space brings clear thoughts! 🌿"
    ],
    sleep: [
      "zzz... dreaming of cozy libraries and warm tea... 🌙",
      "snug as a kitten... resting up for tomorrow... 💤",
      "soft purring snoozes... sleep well, scholar... 🐾"
    ],
    study_start: [
      "let's dive into deep focus together! ☕",
      "ready with my purple mug! you've got this! 📚",
      "one page at a time. we can do this together!"
    ],
    study_complete: [
      "incredible focus! look how much you accomplished! 🌟",
      "time to stretch and hydrate! so proud of you! ☕",
      "another milestone completed together! purrrrr~ ✨"
    ],
    hatch: [
      "mew! hello world! I'm so happy you incubated me! 🐣",
      "purrrrr! together we will conquer every study goal! 🐾"
    ],
    levelUp: [
      "ding! Level up! our focus bond grows stronger! 🌟",
      "we grew wiser today! yay! :3c"
    ],
    evolution: [
      "I have evolved! Surrounded by cozy wisdom and starlight! ✨",
      "our shared dedication made this transformation possible! 💜"
    ]
  },
  florapup: {
    idle: [
      "little steps make strong roots!\nyou're growing every day! 🌱",
      "let's water our ideas\nand see them bloom! 🌸",
      "breathe in the fresh forest air!\nyou are doing wonderfully! 🌿",
      "sunlight and patience\nturn tiny seeds into mighty trees! 🌳",
      "wag wag! your study habit\nis growing so lush! 🐾",
      "patience is a root\nwhose fruit is very sweet! 🍯"
    ],
    pet: [
      "*wags four-leaf clover tail enthusiastically!* 🍀",
      "leaf ears twitch happily! thank you for the pat! 🐾",
      "woof! warm sunshine and happy scratches! ❤️",
      "cuddling up like a happy moss pup! 🌿"
    ],
    feed: [
      "crunch crunch! sweet berries are the best forest treat! 🫐",
      "yummy botanicals! my leaves are glowing green! 🍃",
      "nourished and ready to sprout new ideas! 🍎"
    ],
    play: [
      "pounce on the falling blossom! gotcha! 🌸",
      "chasing clover butterflies around the desk! 🦋",
      "bark! let's dig into this assignment with joy! 🐾"
    ],
    clean: [
      "clean and dewy like morning leaves! 🫧",
      "brushed and polished! no stray pollen here! 🌿"
    ],
    sleep: [
      "curled up in a bed of soft clover... zzz... 🌙",
      "dreaming of sunlit meadows and deep forests... 💤"
    ],
    study_start: [
      "time to plant our focus and watch it grow! 🌱",
      "roots steady, mind sharp! let's study! 🌳",
      "I'll guard your study grove with all my heart! 🐾"
    ],
    study_complete: [
      "we blossomed today! look at all that fresh knowledge! 🌸",
      "tail wagging at maximum speed! amazing job! 🍀",
      "growth takes time, and today you grew so much! 🌟"
    ],
    hatch: [
      "sprout! I popped out of my mossy egg! Woof! 🐣",
      "ready to grow beside you every single day! 🌱"
    ],
    levelUp: [
      "new leaves unfurl! we reached a higher level! 🌟",
      "stronger roots, taller branches! Level up! 🌳"
    ],
    evolution: [
      "I've transformed into a magnificent guardian! 🌸",
      "nature's ancient wisdom flows through our bond! 🌿"
    ]
  },
  lunafox: { // Lunapurr
    idle: [
      "the moon says\nit's okay to rest\nfor a moment. 🌙",
      "dream big, little scholar.\neven stars start\nas tiny lights. ✨",
      "serene thoughts\nwhisper in the twilight.\nkeep going quietly. 🌌",
      "the quiet night\nis our secret study sanctuary. 🐾",
      "every idea is a constellation\nwaiting to be mapped. 🌠",
      "soft starlight clears away\nall doubt and strain. 💜"
    ],
    pet: [
      "*purrs with soft celestial vibrations* 🌙",
      "stardust tickles my ears! thank you, friend! ✨",
      "a gentle stroke under the moonlit sky... ❤️",
      "my celestial fur shimmers with gratitude! 🐾"
    ],
    feed: [
      "delicate starlight treats! sweetness for the soul! 🫐",
      "sip... cool lunar nectar revives my inner magic! 🌌",
      "delicious! my spirit feels luminous again! ✨"
    ],
    play: [
      "leaping through shimmering constellations! 🌠",
      "batting at floating starlight orbs! so fun! 🐾",
      "chasing moonbeams across your desk! 🌙"
    ],
    clean: [
      "purified by cool moonbeams and clear water! 🫧",
      "pristine starlight sheen restored! 🌌"
    ],
    sleep: [
      "curled beneath a blanket of aurora lights... zzz... 🌙",
      "drifting through dreams of silver starlight... 💤"
    ],
    study_start: [
      "let our minds enter the serene realm of deep inquiry. 🌌",
      "the moonlight illuminates every obscure concept. ✨",
      "calm as a starlit pool. let us begin. 🌙"
    ],
    study_complete: [
      "marvelous reflection. you navigated the stars today! 🌟",
      "wisdom shines through you like the full moon! 🌌",
      "rest now, scholar. you have done noble work. 💜"
    ],
    hatch: [
      "the shell parted beneath moonlit skies! hello, scholar! 🐣",
      "I am Lunapurr, your faithful celestial companion! 🌙"
    ],
    levelUp: [
      "our celestial aura expands! Level up! 🌟",
      "new constellations unlocked in our journey! ✨"
    ],
    evolution: [
      "behold! the celestial moonlight crowns our shared dedication! 🌌",
      "I have stepped into my majestic form! 🌙✨"
    ]
  },
  pyrolux: {
    idle: [
      "keep the flame of curiosity blazing! 🔥",
      "bold problems deserve bold solutions! ⚔️",
      "warmth and courage conquer any exam! 🌟"
    ],
    pet: ["*crackles with cozy campfire warmth!* ❤️"],
    feed: ["spicy honey apples fuel my fire! 🍏"],
    play: ["flame pounce! ignite your enthusiasm! 🐾"],
    clean: ["sparkling clean like glowing embers! 🫧"],
    sleep: ["curled beside the cozy hearth... zzz... 🌙"],
    study_start: ["let's blaze through this assignment! 🔥"],
    study_complete: ["victory! that study session was on fire! 🏆"],
    hatch: ["crack! born from cozy hearth embers! 🐣"],
    levelUp: ["flame burns brighter! Level up! 🌟"],
    evolution: ["phoenix flame rebirth! 🐉✨"]
  }
};

class PetManager {
  constructor() {
    this.store = window.dataStore;
    this.talkTimeout = null;
    this.isDrinking = false;
    this.lastQuoteIndex = {};
  }

  get pet() {
    return this.store.state.pet;
  }

  get speciesId() {
    const raw = (this.pet && this.pet.species) || 'aconite_cat';
    return raw === 'lunapurr' ? 'lunafox' : raw;
  }

  get speciesData() {
    return PET_SPECIES_DATA[this.speciesId] || PET_SPECIES_DATA.aconite_cat;
  }

  getSpeciesData(id) {
    const sp = id || this.speciesId;
    return PET_SPECIES_DATA[sp] || PET_SPECIES_DATA.aconite_cat;
  }

  get speciesDisplayName() {
    return this.speciesData.name;
  }

  // Helper: map level to evolutionary stage based on standard thresholds
  getStageForLevel(level = (this.pet && this.pet.level) || 1, isHatched = (this.pet && this.pet.isHatched)) {
    if (!isHatched) return 'egg';
    if (level < 3) return 'baby';
    if (level < 6) return 'young';
    if (level < 10) return 'teen';
    if (level < 15) return 'adult';
    return 'mythical';
  }

  // ==========================================================================
  // MAIN-SCREEN & PROFILE RENDERING DISPATCHER
  // Dispatches dynamically by (speciesId, stage, equippedItems)
  // NEVER unconditionally forces Aconite cat!
  // ==========================================================================
  renderPetSVG(speciesId = this.pet.species, stage = this.pet.stage, equippedHat = this.pet.equippedHat, equippedScarf = this.pet.equippedScarf, extraOptions = {}) {
    const canonicalSpecies = (speciesId === 'lunapurr') ? 'lunafox' : (speciesId || this.pet.species || 'aconite_cat');
    const curStage = stage || this.pet.stage || 'egg';

    // Construct unified equipped object
    const equipped = {
      head: equippedHat !== undefined ? equippedHat : (this.pet.equipped && this.pet.equipped.head) || this.pet.equippedHat || null,
      neck: equippedScarf !== undefined ? equippedScarf : (this.pet.equipped && this.pet.equipped.neck) || this.pet.equippedScarf || null,
      body: (this.pet.equipped && this.pet.equipped.body) || null,
      back: (this.pet.equipped && this.pet.equipped.back) || null,
      special: (this.pet.equipped && this.pet.equipped.special) || null
    };

    const petSpec = {
      species: canonicalSpecies,
      stage: curStage,
      equipped: equipped
    };

    const renderOpts = {
      stage: curStage,
      isDrinking: this.isDrinking,
      ...extraOptions
    };

    if (window.petRenderer) {
      return window.petRenderer.renderSVG(petSpec, renderOpts);
    }

    // Direct fallback if petRenderer is still initializing
    return `
      <div style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; font-size:2rem;">
        🐾
      </div>
    `;
  }

  // ==========================================================================
  // HATCHING & STUDY TIMER INTEGRATION
  // ==========================================================================
  completeFocusSession(expReward = 25) {
    if (!this.pet.isHatched) {
      this.hatchEgg();
    }
    this.processExpGain(expReward);
    this.sayRandomQuote('study_complete');
  }

  hatchEgg() {
    if (this.pet.isHatched) return;

    this.pet.isHatched = true;
    this.pet.stage = 'baby';
    this.pet.hatchedAt = new Date().toISOString();
    this.pet.level = Math.max(2, this.pet.level || 2); // Hatched baby unlocks at level 2

    // Record in history
    if (!Array.isArray(this.pet.evolutionHistory)) this.pet.evolutionHistory = [];
    this.pet.evolutionHistory.push({
      stage: 'baby',
      date: new Date().toISOString().split('T')[0],
      level: this.pet.level,
      title: `Hatched into ${this.speciesData.stages.baby.name}! 🐣`
    });

    this.store.saveStateImmediate();

    if (window.soundEngine) {
      window.soundEngine.playLevelUp();
      setTimeout(() => window.soundEngine.playSparkle(), 600);
    }

    this.showHatchingModal();

    if (window.app) {
      window.app.renderAll();
      window.app.showToast('Egg Hatched! 🐣', `${this.pet.name} is now a newborn ${this.speciesData.stages.baby.name}!`, 'achievement');
    }
  }

  showHatchingModal() {
    const modal = document.getElementById('hatching-modal');
    if (!modal) return;

    const babyForm = this.speciesData.stages.baby;

    modal.innerHTML = `
      <div class="modal-card" style="text-align: center; max-width: 480px; border: 3px solid #8B5CF6;">
        <div style="font-size: 3rem; margin-bottom: 8px;">🐣 ✨ 💖</div>
        <h2 style="font-size: 1.8rem; color: var(--color-forest-dark);">Your Egg Has Hatched!</h2>
        <p style="color: var(--color-muted-text); font-size: 0.92rem; margin-bottom: 16px;">
          Your quiet study consistency nurtured the egg into life!
        </p>

        <div style="width: 140px; height: 140px; margin: 0 auto 16px auto; background: #181E34; border-radius: 50%; padding: 10px; border: 2px solid #C4B5FD;">
          ${this.renderPetSVG(this.pet.species, 'baby')}
        </div>

        <div style="font-weight: 800; font-size: 1.3rem; color: #8B5CF6;">${babyForm.name}</div>
        <p style="font-size: 0.88rem; color: var(--color-dark-text); margin: 8px 0 20px 0; line-height: 1.5;">
          ${babyForm.desc}
        </p>

        <!-- Pet Nickname Prompt -->
        <div style="background: var(--color-warm-cream-alt); padding: 14px; border-radius: var(--radius-md); text-align: left; margin-bottom: 20px;">
          <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">
            Companion Nickname:
          </label>
          <div style="display: flex; gap: 8px; margin-top: 6px;">
            <input type="text" id="hatch-rename-input" value="${this.pet.name || this.speciesDisplayName}" style="flex: 1;">
            <button class="btn btn-primary btn-sm" onclick="window.petManager.handleHatchRename()">Save Name</button>
          </div>
        </div>

        <button class="btn btn-gold btn-lg" style="width: 100%;" onclick="document.getElementById('hatching-modal').classList.remove('active'); window.petManager.sayRandomQuote('hatch');">
          Welcome to the World! 🌟
        </button>
      </div>
    `;

    modal.classList.add('active');
  }

  handleHatchRename() {
    const input = document.getElementById('hatch-rename-input');
    if (input && input.value.trim()) {
      this.renamePet(input.value.trim());
      if (window.app) window.app.showToast('Renamed!', `Companion is now named "${this.pet.name}"`, 'default');
    }
  }

  // ==========================================================================
  // EVOLUTION SYSTEM
  // ==========================================================================
  processExpGain(expGained) {
    let p = this.pet;
    p.exp = (p.exp || 0) + expGained;

    let expNeeded = p.level * 60 + 50;
    let didLevelUp = false;

    while (p.exp >= expNeeded) {
      p.exp -= expNeeded;
      p.level += 1;
      didLevelUp = true;
      expNeeded = p.level * 60 + 50;
    }

    p.maxExp = expNeeded;

    // Check Hatching Milestone if still in egg and has positive focus experience
    if (!p.isHatched && expGained > 0) {
      this.hatchEgg();
      return;
    }

    if (didLevelUp) {
      this.checkEvolution();
      if (window.soundEngine) window.soundEngine.playLevelUp();
      if (window.app) window.app.showToast('Level Up! 🌟', `${p.name} reached Level ${p.level}!`, 'achievement');
      this.sayRandomQuote('levelUp');
    }

    this.store.saveState();
  }

  checkEvolution() {
    if (!this.pet.isHatched) return;

    const targetStage = this.getStageForLevel(this.pet.level, true);
    if (targetStage !== this.pet.stage) {
      const oldStage = this.pet.stage;
      this.pet.stage = targetStage;

      // Log in evolution history
      if (!Array.isArray(this.pet.evolutionHistory)) this.pet.evolutionHistory = [];
      const stageData = this.speciesData.stages[targetStage] || { name: targetStage };
      this.pet.evolutionHistory.push({
        stage: targetStage,
        date: new Date().toISOString().split('T')[0],
        level: this.pet.level,
        title: `Evolved into ${stageData.name}! ✨`
      });

      this.store.saveStateImmediate();
      this.showEvolutionCeremony(oldStage, targetStage);
    }
  }

  showEvolutionCeremony(oldStage, newStage) {
    const modal = document.getElementById('evolution-modal');
    if (!modal) return;

    const stageInfo = this.speciesData.stages[newStage] || { name: newStage, desc: 'A wonderful new evolutionary stage!' };
    const quotes = (COMPANION_QUOTES[this.speciesId] && COMPANION_QUOTES[this.speciesId].evolution) || COMPANION_QUOTES.aconite_cat.evolution;
    const celebrationQuote = quotes[Math.floor(Math.random() * quotes.length)];

    modal.innerHTML = `
      <div class="evolution-ceremony-card" style="text-align: center; max-width: 520px; padding: 32px 24px;">
        <div style="font-size: 2.8rem; margin-bottom: 8px;">🌟 🐾 💖 🌟</div>
        <div style="font-family:'Press Start 2P', monospace; font-size: 1.1rem; color: #F59E0B; margin-bottom: 8px;">
          PET EVOLUTION!
        </div>
        <div style="font-size: 0.95rem; color: var(--color-muted-text); margin-bottom: 20px;">
          ${oldStage.toUpperCase()} ➔ <strong style="color: #8B5CF6;">${newStage.toUpperCase()}</strong> (Level ${this.pet.level})
        </div>

        <div class="evolution-sparkle-avatar" style="width: 170px; height: 170px; margin: 0 auto 20px auto; background: #131A35; border-radius: 50%; padding: 12px; border: 3px solid #FDE047; box-shadow: 0 0 24px rgba(253, 224, 71, 0.45);">
          ${this.renderPetSVG(this.pet.species, newStage)}
        </div>

        <h3 style="font-size: 1.5rem; color: var(--color-forest-dark); margin-bottom: 8px;">${stageInfo.name}</h3>
        <p style="font-size: 0.9rem; color: var(--color-dark-text); line-height: 1.5; margin-bottom: 20px;">
          ${stageInfo.desc}
        </p>

        <div style="background: var(--color-warm-cream-alt); border-left: 4px solid #8B5CF6; padding: 12px 16px; border-radius: 4px; font-style: italic; color: #4C1D95; margin-bottom: 24px; font-size: 0.92rem;">
          "${celebrationQuote}"
        </div>

        <button class="btn btn-gold btn-lg" style="width: 100%;" onclick="document.getElementById('evolution-modal').classList.remove('active'); if(window.app) window.app.renderAll();">
          Celebrate New Form! ✨
        </button>
      </div>
    `;

    modal.classList.add('active');
    if (window.soundEngine) {
      window.soundEngine.playLevelUp();
    }
  }

  // ==========================================================================
  // EQUIPMENT SYSTEM (5 SLOTS: head, neck, body, back, special)
  // ==========================================================================
  equipItem(itemId, slot = 'head') {
    if (!this.pet.equipped) {
      this.pet.equipped = { head: null, neck: null, body: null, back: null, special: null };
    }

    this.pet.equipped[slot] = itemId;

    // Backwards compatibility mirrors
    if (slot === 'head') this.pet.equippedHat = itemId;
    if (slot === 'neck') this.pet.equippedScarf = itemId;

    this.store.saveState();

    if (window.soundEngine) window.soundEngine.playSparkle();
    if (window.app) {
      window.app.renderAll();
      window.app.showToast('Item Equipped', `Equipped item in ${slot.toUpperCase()} slot!`, 'exp');
    }
  }

  unequipItem(slot = 'head') {
    if (!this.pet.equipped) return;

    this.pet.equipped[slot] = null;
    if (slot === 'head') this.pet.equippedHat = null;
    if (slot === 'neck') this.pet.equippedScarf = null;

    this.store.saveState();

    if (window.app) {
      window.app.renderAll();
      window.app.showToast('Item Unequipped', `Removed item from ${slot.toUpperCase()} slot.`, 'default');
    }
  }

  // Rename Companion
  renamePet(newName) {
    if (!newName || !newName.trim()) return false;
    this.pet.name = newName.trim();
    this.store.saveState();

    if (window.app) {
      window.app.renderAll();
      window.app.showToast('Companion Renamed', `Your study companion is now "${this.pet.name}".`, 'default');
    }
    return true;
  }

  // ==========================================================================
  // PET INTERACTIVITY (Petting, Feeding, Playing, Cleaning, Sleeping)
  // ==========================================================================
  petCreature() {
    this.pet.happiness = Math.min(100, (this.pet.happiness || 80) + 8);
    this.pet.totalInteractions = (this.pet.totalInteractions || 0) + 1;
    this.store.saveState();

    if (window.soundEngine) window.soundEngine.playPetChirp();
    this.showFloatingEffect('❤️');
    this.triggerAnimation('bounce');
    this.sayRandomQuote('pet');
  }

  feedPet(foodItem) {
    this.isDrinking = true;
    setTimeout(() => {
      this.isDrinking = false;
      if (window.app) window.app.renderAll();
    }, 1200);

    this.pet.hunger = Math.max(0, (this.pet.hunger || 20) - 25);
    this.pet.happiness = Math.min(100, (this.pet.happiness || 80) + 6);
    this.pet.energy = Math.min(100, (this.pet.energy || 80) + 10);
    this.pet.totalInteractions = (this.pet.totalInteractions || 0) + 1;
    this.store.saveState();

    if (window.soundEngine) window.soundEngine.playSparkle();
    this.showFloatingEffect('☕');
    this.triggerAnimation('bounce');
    this.sayRandomQuote('feed');
  }

  playWithPet() {
    this.pet.energy = Math.max(0, (this.pet.energy || 80) - 10);
    this.pet.happiness = 100;
    this.pet.totalInteractions = (this.pet.totalInteractions || 0) + 1;
    this.store.saveState();

    if (window.soundEngine) window.soundEngine.playCoin();
    this.showFloatingEffect('✨');
    this.triggerAnimation('wiggle');
    this.sayRandomQuote('play');
  }

  cleanPet() {
    this.pet.cleanliness = 100;
    this.pet.happiness = Math.min(100, (this.pet.happiness || 80) + 5);
    this.pet.totalInteractions = (this.pet.totalInteractions || 0) + 1;
    this.store.saveState();

    if (window.soundEngine) window.soundEngine.playSparkle();
    this.showFloatingEffect('🫧');
    this.sayRandomQuote('clean');
  }

  sleepPet() {
    this.pet.energy = 100;
    this.store.saveState();

    if (window.soundEngine) window.soundEngine.playGong();
    this.showFloatingEffect('💤');
    this.sayRandomQuote('sleep');
  }

  // ==========================================================================
  // DIALOGUE & SPEECH SYSTEM
  // Context-aware quotes for idle, study, pet, feed, clean, sleep, hatch, evolution
  // ==========================================================================
  say(text) {
    const bubble = document.getElementById('pet-speech-bubble');
    if (!bubble) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('studypet:speech', { detail: { text } }));
      }
      return;
    }

    bubble.innerText = text;
    bubble.style.display = 'block';

    if (this.talkTimeout) clearTimeout(this.talkTimeout);
    this.talkTimeout = setTimeout(() => {
      bubble.style.display = 'none';
    }, 6000);
  }

  sayRandomQuote(context = 'idle') {
    const speciesQuotes = COMPANION_QUOTES[this.speciesId] || COMPANION_QUOTES.aconite_cat;
    const pool = speciesQuotes[context] || speciesQuotes.idle || COMPANION_QUOTES.aconite_cat.idle;

    if (!pool || pool.length === 0) return;

    const lastIdx = this.lastQuoteIndex[context] !== undefined ? this.lastQuoteIndex[context] : -1;
    let nextIdx = Math.floor(Math.random() * pool.length);

    // Prevent immediate repetition if multiple quotes exist
    if (pool.length > 1 && nextIdx === lastIdx) {
      nextIdx = (nextIdx + 1) % pool.length;
    }
    this.lastQuoteIndex[context] = nextIdx;

    let quote = pool[nextIdx];

    // Safely substitute pet nickname and scholar name
    const scholarName = (this.store.state.user && this.store.state.user.name) || 'Scholar';
    const petNickname = (this.pet && this.pet.name) || this.speciesDisplayName;
    quote = quote.replace(/\{scholar\}/gi, scholarName).replace(/\{pet\}/gi, petNickname);

    this.say(quote);
    return quote;
  }

  // Returns a random quote string without displaying it (useful for external callers)
  getRandomQuote(context = 'idle', speciesId = null) {
    const sp = speciesId ? (speciesId === 'lunapurr' ? 'lunafox' : speciesId) : this.speciesId;
    const speciesQuotes = COMPANION_QUOTES[sp] || COMPANION_QUOTES.aconite_cat;
    const pool = speciesQuotes[context] || speciesQuotes.idle || COMPANION_QUOTES.aconite_cat.idle;
    if (!pool || pool.length === 0) return '';
    return pool[Math.floor(Math.random() * pool.length)];
  }

  showFloatingEffect(emoji) {
    const stage = document.querySelector('.pixel-cat-character-box');
    if (!stage) return;

    const fx = document.createElement('div');
    fx.className = 'floating-fx';
    fx.textContent = emoji;
    fx.style.left = `${40 + (Math.random() * 20 - 10)}%`;
    fx.style.top = '10%';

    stage.appendChild(fx);
    setTimeout(() => fx.remove(), 1200);
  }

  triggerAnimation(animClass) {
    const el = document.getElementById('pet-creature-wrapper');
    if (!el) return;
    el.classList.remove('bounce', 'wiggle');
    void el.offsetWidth;
    el.classList.add(animClass);
  }
}

// Global Pet Manager Instance
const petManager = new PetManager();
if (typeof window !== 'undefined') {
  window.petManager = petManager;
}
if (typeof module !== 'undefined') {
  module.exports = { PetManager, PET_SPECIES_DATA, PET_EVOLUTION_LEVELS };
}
