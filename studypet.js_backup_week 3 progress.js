/**
 * STUDYPET — Virtual Pet & Pixel Art Engine
 * Faithful to the 90s OS pixel-art illustration:
 * Features the cozy white kitten sipping purple coffee, with steam,
 * alongside Florapup, Pyrolux, and Lunafox species.
 */

const PET_SPECIES_DATA = {
    aconite_cat: {
        id: 'aconite_cat',
        name: 'Aconite Kitty',
        element: 'Calm & Cozy Focus',
        affinity: 'Lo-Fi Chill, Tea & Mindful Breaks',
        palette: { primary: '#EAEAEA', secondary: '#C5C5CE', accent: '#8B5CF6', egg: '#E2E8F0' },
        stages: {
            egg: { name: 'Pixel Snooze Egg', desc: 'A gentle, warm pixel-art egg wrapped in a soft lavender glow.' },
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
    pyrolux: {
        id: 'pyrolux',
        name: 'Pyrolux',
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
    },
    lunafox: {
        id: 'lunafox',
        name: 'Lunafox',
        element: 'Tide & Starlight',
        affinity: 'Deep Focus, Research & Serene Reflection',
        palette: { primary: '#50727B', secondary: '#78A083', accent: '#F3D58A', egg: '#BFE2F7' },
        stages: {
            egg: { name: 'Moonstone Dew Egg', desc: 'A translucent iridescent egg that shines softly like a moonlit pool.' },
            baby: { name: 'Dewlet', desc: 'A tiny droplet kitsune with liquid-blue ears and a soft glowing chest.' },
            young: { name: 'Mistral Kit', desc: 'A graceful mist-walking fox kit with two floating spirit ribbons.' },
            teen: { name: 'Tidekeeper', desc: 'A serene river fox with three flowing water tails that soothe anxious thoughts.' },
            adult: { name: 'Abyssal Oracle', desc: 'A regal five-tailed spirit fox that guides deep cognitive synthesis.' },
            mythical: { name: 'Cosmic Aurora Kyubi', desc: 'A legendary nine-tailed celestial fox dancing beneath the northern lights.' }
        }
    }
};

const RETRO_PIXEL_QUOTES = [
    "take breaks!\ndrink water\nrest your eyes\n:3c",
    "good job studying today!\nremember to stretch\nyou are doing great ✨",
    "one problem at a time~\nmy tea is nice and warm\nlet's keep going! ☕",
    "breathe in...\nbreathe out...\nrest your mind :3",
    "every minute you focus\nmakes you wiser!\npurrrrr~ 🐾",
    "don't rush!\nslow and steady\nfinishes the assignment 📚"
];

class PetManager {
    constructor() {
        this.store = window.dataStore;
        this.talkTimeout = null;
        this.isDrinking = false;
    }

    get pet() {
        return this.store.state.pet;
    }

    // Generate Pixel Art SVG matching the exact illustration from the uploaded image
    renderPetSVG(speciesId = this.pet.species, stage = this.pet.stage, equippedHat = this.pet.equippedHat, equippedScarf = this.pet.equippedScarf) {
        // If it's the Aconite Cat or default young/teen stage, render the cozy coffee-sipping pixel kitten!
        if (speciesId === 'aconite_cat' || stage === 'young' || stage === 'teen' || stage === 'baby' || stage === 'adult') {
            return this.renderCozyPixelCat(equippedHat, equippedScarf);
        }

        // Default egg
        if (stage === 'egg') {
            return `
        <svg viewBox="0 0 160 160" width="100%" height="100%" shape-rendering="crispEdges">
          <ellipse cx="80" cy="140" rx="35" ry="10" fill="rgba(0,0,0,0.2)"/>
          <ellipse cx="80" cy="85" rx="42" ry="50" fill="#EAEAEA" stroke="#101010" stroke-width="4"/>
          <!-- Pixel spots -->
          <rect x="65" y="70" width="10" height="10" fill="#8B5CF6"/>
          <rect x="90" y="85" width="8" height="8" fill="#8B5CF6"/>
          <rect x="75" y="105" width="12" height="12" fill="#8B5CF6"/>
          <!-- Top tiny ears/ribbon -->
          <polygon points="65,40 75,25 80,40" fill="#F4C4B5" stroke="#101010" stroke-width="2"/>
          <polygon points="95,40 85,25 80,40" fill="#F4C4B5" stroke="#101010" stroke-width="2"/>
        </svg>
      `;
        }

        return this.renderCozyPixelCat(equippedHat, equippedScarf);
    }

    // Exact reproduction of the cozy white cat with purple coffee mug & steam from the uploaded art
    renderCozyPixelCat(equippedHat, equippedScarf) {
        let hatOverlay = '';
        if (equippedHat === 'scholar_cap') {
            hatOverlay = `
        <g class="pixel-hat">
          <polygon points="75,2 120,14 75,26 30,14" fill="#2D3748" stroke="#000" stroke-width="2.5"/>
          <rect x="62" y="20" width="26" height="8" rx="2" fill="#1A202C"/>
          <line x1="75" y1="14" x2="112" y2="30" stroke="#FFD700" stroke-width="2.5"/>
          <circle cx="112" cy="32" r="3" fill="#FFD700"/>
        </g>
      `;
        } else if (equippedHat === 'wizard_hat') {
            hatOverlay = `
        <g class="pixel-hat">
          <ellipse cx="75" cy="22" rx="32" ry="8" fill="#4C1D95" stroke="#000" stroke-width="2"/>
          <polygon points="50,20 75,-12 100,20" fill="#6D28D9" stroke="#000" stroke-width="2"/>
          <circle cx="88" cy="4" r="3" fill="#FDE047"/>
        </g>
      `;
        } else if (equippedHat === 'cozy_beanie') {
            hatOverlay = `
        <g class="pixel-hat">
          <path d="M52 24 C52 4 98 4 98 24 Z" fill="#D98D72" stroke="#000" stroke-width="2"/>
          <rect x="48" y="20" width="54" height="8" rx="2" fill="#FFF8EC" stroke="#000" stroke-width="1.5"/>
          <circle cx="75" cy="4" r="6" fill="#FFF8EC" stroke="#000" stroke-width="1.5"/>
        </g>
      `;
        }

        let scarfOverlay = '';
        if (equippedScarf === 'knit_scarf') {
            scarfOverlay = `
        <g class="pixel-scarf">
          <rect x="52" y="78" width="46" height="12" rx="4" fill="#D98D72" stroke="#000" stroke-width="2"/>
          <rect x="82" y="86" width="10" height="20" rx="2" fill="#D98D72" stroke="#000" stroke-width="1.5"/>
        </g>
      `;
        }

        return `
      <svg class="pet-creature-svg" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <!-- Shadow -->
        <ellipse cx="80" cy="148" rx="48" ry="12" fill="rgba(0,0,0,0.3)"/>

        <!-- Fluffy Curled Cat Tail -->
        <path d="M38 128 C20 120 16 100 28 92 C36 86 48 94 44 110 C42 120 40 125 40 135 Z" fill="#D2D2D8" stroke="#1A1A1A" stroke-width="3"/>
        <path d="M36 126 C24 118 20 102 30 96 C36 92 44 98 40 110 Z" fill="#EFEFEF"/>

        <!-- Cat Left Ear (Pointy Pixel) -->
        <polygon points="36,48 50,14 74,40" fill="#EFEFEF" stroke="#1A1A1A" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="42,44 52,22 68,38" fill="#C59B9B"/>

        <!-- Cat Right Ear -->
        <polygon points="114,48 100,14 76,40" fill="#EFEFEF" stroke="#1A1A1A" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="108,44 98,22 82,38" fill="#C59B9B"/>

        <!-- Cute Chubby Head -->
        <ellipse cx="75" cy="62" rx="42" ry="32" fill="#EFEFEF" stroke="#1A1A1A" stroke-width="3.5"/>

        <!-- Cute Curved Peaceful Closed Eyes (^ ^) -->
        <path d="M50 62 Q58 52 66 62" stroke="#1A1A1A" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M84 62 Q92 52 100 62" stroke="#1A1A1A" stroke-width="3.5" stroke-linecap="round" fill="none"/>

        <!-- Cute Triangular Nose (Soft Reddish-Terracotta) -->
        <polygon points="71,68 79,68 75,76" fill="#A84B4B" stroke="#1A1A1A" stroke-width="1.5"/>

        <!-- Chubby Cat Body / Legs (Sitting Cozy) -->
        <ellipse cx="78" cy="115" rx="36" ry="28" fill="#D2D2D8" stroke="#1A1A1A" stroke-width="3.5"/>
        <ellipse cx="76" cy="112" rx="32" ry="25" fill="#EFEFEF"/>

        <!-- Cat Little Back/Paws -->
        <ellipse cx="50" cy="134" rx="14" ry="10" fill="#EFEFEF" stroke="#1A1A1A" stroke-width="3"/>
        <ellipse cx="102" cy="134" rx="14" ry="10" fill="#EFEFEF" stroke="#1A1A1A" stroke-width="3"/>

        <!-- Purple Ceramic Mug with Warm Coffee/Tea (Directly from user image!) -->
        <g class="pixel-purple-mug" transform="${this.isDrinking ? 'translate(0, -6)' : 'translate(0, 0)'}">
          <!-- Mug Handle -->
          <path d="M102 96 C114 96 114 114 102 114" stroke="#4C1D95" stroke-width="4.5" fill="none" stroke-linecap="round"/>
          <path d="M102 96 C111 96 111 114 102 114" stroke="#6D28D9" stroke-width="2.5" fill="none" stroke-linecap="round"/>

          <!-- Mug Body -->
          <rect x="76" y="88" width="28" height="30" rx="4" fill="#6D28D9" stroke="#1A1A1A" stroke-width="3"/>
          <rect x="78" y="90" width="24" height="6" fill="#4C1D95"/>
          <ellipse cx="90" cy="90" rx="12" ry="4" fill="#3B1C10"/>

          <!-- White Paws Hugging the Mug -->
          <ellipse cx="74" cy="104" rx="8" ry="7" fill="#EFEFEF" stroke="#1A1A1A" stroke-width="2"/>
          <ellipse cx="102" cy="104" rx="7" ry="7" fill="#EFEFEF" stroke="#1A1A1A" stroke-width="2"/>
        </g>

        <!-- Dynamic Cosmetic Overlays -->
        ${hatOverlay}
        ${scarfOverlay}
      </svg>
    `;
    }

    // Interactivity Actions
    petCreature() {
        this.pet.happiness = Math.min(100, (this.pet.happiness || 80) + 8);
        this.pet.totalInteractions = (this.pet.totalInteractions || 0) + 1;
        this.store.saveState();

        if (window.soundEngine) window.soundEngine.playPetChirp();
        this.showFloatingEffect('❤️');
        this.triggerAnimation('bounce');
        this.sayRandomQuote();
    }

    feedPet(foodItem) {
        this.isDrinking = true;
        setTimeout(() => { this.isDrinking = false; if (window.app) window.app.renderAll(); }, 1200);

        this.pet.hunger = Math.max(0, (this.pet.hunger || 20) - 25);
        this.pet.happiness = Math.min(100, (this.pet.happiness || 80) + 6);
        this.pet.energy = Math.min(100, (this.pet.energy || 80) + 10);
        this.pet.totalInteractions = (this.pet.totalInteractions || 0) + 1;
        this.store.saveState();

        if (window.soundEngine) window.soundEngine.playSparkle();
        this.showFloatingEffect('☕');
        this.triggerAnimation('bounce');
        this.say("sip... sip... warm coffee makes studying so cozy! :3c");
    }

    playWithPet() {
        this.pet.energy = Math.max(0, (this.pet.energy || 80) - 10);
        this.pet.happiness = 100;
        this.pet.totalInteractions = (this.pet.totalInteractions || 0) + 1;
        this.store.saveState();

        if (window.soundEngine) window.soundEngine.playCoin();
        this.showFloatingEffect('✨');
        this.triggerAnimation('wiggle');
        this.say("yay! keyboard clack clack! time for focus mode! 🐾");
    }

    cleanPet() {
        this.pet.cleanliness = 100;
        this.pet.happiness = Math.min(100, (this.pet.happiness || 80) + 5);
        this.pet.totalInteractions = (this.pet.totalInteractions || 0) + 1;
        this.store.saveState();

        if (window.soundEngine) window.soundEngine.playSparkle();
        this.showFloatingEffect('🫧');
        this.say("fresh screen, clean desk, peaceful mind! ✨");
    }

    sleepPet() {
        this.pet.energy = 100;
        this.store.saveState();

        if (window.soundEngine) window.soundEngine.playGong();
        this.showFloatingEffect('💤');
        this.say("zzz... dreaming under pixel starlight... 🌙");
    }

    say(text) {
        const bubble = document.getElementById('pet-speech-bubble');
        if (!bubble) return;

        bubble.innerText = text;
        bubble.style.display = 'block';

        if (this.talkTimeout) clearTimeout(this.talkTimeout);
        this.talkTimeout = setTimeout(() => {
            bubble.style.display = 'none';
        }, 6000);
    }

    sayRandomQuote() {
        const quote = RETRO_PIXEL_QUOTES[Math.floor(Math.random() * RETRO_PIXEL_QUOTES.length)];
        this.say(quote);
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

    processExpGain(expGained) {
        let p = this.pet;
        p.exp += expGained;

        let expNeeded = p.level * 60 + 50;
        let didLevelUp = false;

        while (p.exp >= expNeeded) {
            p.exp -= expNeeded;
            p.level += 1;
            didLevelUp = true;
            expNeeded = p.level * 60 + 50;
        }

        p.maxExp = expNeeded;
        this.store.saveState();

        if (didLevelUp) {
            if (window.soundEngine) window.soundEngine.playLevelUp();
            if (window.app) window.app.showToast('Level Up! 🌟', `${p.name} reached Level ${p.level}!`, 'achievement');
        }
    }
}

// Global Pet Manager Instance
const petManager = new PetManager();
window.petManager = petManager;
