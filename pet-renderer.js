/**
 * STUDYPET — Modular Pet & Equipment Renderer Engine
 * Provides faithful, stage-aware pixel/vector art for all 3 companion lines:
 * 1. Aconite Kitty (cat line: Pixel Snooze Egg -> Pixel Kitten -> Tea Sipper Kit -> Lo-Fi Scholar Cat -> Zen Study Master -> Celestial Astral Neko)
 * 2. Florapup (nature line: Moss Sprout Egg -> Sproutling -> Clover Bark -> Bramble Hound -> Forest Guardian -> Celestial Yggdrasil Hound)
 * 3. Lunapurr (celestial cat line: Moonstone Egg -> Baby -> Young -> Teen -> Adult -> Mythical Cat)
 * Plus legacy support for Pyrolux (fire line).
 *
 * Supports stage-aware wearable equipment overlays across 5 slots: Head, Neck, Body, Back, Special.
 */

const PET_STAGE_ANCHORS = {
  egg: {
    head: { x: 80, y: 35, scale: 0.8 },
    neck: { x: 80, y: 88, scale: 0.95 },
    body: { x: 80, y: 115, scale: 1.0 },
    back: { x: 80, y: 90, scale: 1.05 },
    special: { x: 130, y: 115, scale: 0.9 }
  },
  baby: {
    head: { x: 80, y: 48, scale: 0.8 },
    neck: { x: 80, y: 84, scale: 0.8 },
    body: { x: 80, y: 112, scale: 0.8 },
    back: { x: 80, y: 96, scale: 0.85 },
    special: { x: 125, y: 115, scale: 0.85 }
  },
  young: {
    head: { x: 75, y: 44, scale: 0.92 },
    neck: { x: 75, y: 78, scale: 0.92 },
    body: { x: 75, y: 108, scale: 0.92 },
    back: { x: 75, y: 92, scale: 0.95 },
    special: { x: 125, y: 112, scale: 0.92 }
  },
  teen: {
    head: { x: 75, y: 38, scale: 1.0 },
    neck: { x: 75, y: 72, scale: 1.0 },
    body: { x: 75, y: 104, scale: 1.0 },
    back: { x: 75, y: 88, scale: 1.1 },
    special: { x: 130, y: 106, scale: 1.0 }
  },
  adult: {
    head: { x: 75, y: 32, scale: 1.1 },
    neck: { x: 75, y: 66, scale: 1.1 },
    body: { x: 75, y: 98, scale: 1.1 },
    back: { x: 75, y: 82, scale: 1.2 },
    special: { x: 135, y: 100, scale: 1.05 }
  },
  mythical: {
    head: { x: 75, y: 26, scale: 1.18 },
    neck: { x: 75, y: 62, scale: 1.18 },
    body: { x: 75, y: 94, scale: 1.18 },
    back: { x: 75, y: 76, scale: 1.3 },
    special: { x: 140, y: 96, scale: 1.1 }
  }
};

class PetRenderer {
  constructor() {
    this.stageAnchors = PET_STAGE_ANCHORS;
  }

  // Central dispatch: renders the correct selected-species illustration and stage
  renderSVG(pet, options = {}) {
    let species = (pet && pet.species) || 'aconite_cat';
    if (species === 'lunapurr') species = 'lunafox'; // canonical internal ID

    const stage = (options.stage || (pet && pet.stage) || 'egg').toLowerCase();
    const equipped = options.equipped || (pet && pet.equipped) || {
      head: pet && pet.equippedHat,
      neck: pet && pet.equippedScarf,
      body: null,
      back: null,
      special: null
    };

    switch (species) {
      case 'aconite_cat':
        return this.renderAconiteSpecies(stage, equipped, options);
      case 'florapup':
        return this.renderFloraSpecies(stage, equipped, options);
      case 'lunafox':
        return this.renderLunaSpecies(stage, equipped, options);
      case 'pyrolux':
        return this.renderPyroSpecies(stage, equipped, options);
      default:
        return this.renderAconiteSpecies(stage, equipped, options);
    }
  }

  renderCompanion(species, stage = 'egg', equipped = {}, options = {}) {
    return this.renderSVG({ species, stage, equipped }, { stage, equipped, ...options });
  }

  renderEgg(species) {
    return this.renderCompanion(species, 'egg');
  }

  // ==========================================================================
  // 1. ACONITE KITTY (Cat Line)
  // ==========================================================================
  renderAconiteSpecies(stage, equipped, options) {
    switch (stage) {
      case 'egg': return this.renderAconiteEgg(equipped, options);
      case 'baby': return this.renderAconiteBaby(equipped, options);
      case 'young': return this.renderAconiteYoung(equipped, options);
      case 'teen': return this.renderAconiteTeen(equipped, options);
      case 'adult': return this.renderAconiteAdult(equipped, options);
      case 'mythical': return this.renderAconiteMythical(equipped, options);
      default: return this.renderAconiteYoung(equipped, options);
    }
  }

  // Aconite Stage 1: Pixel Snooze Egg
  renderAconiteEgg(equipped, options = {}) {
    const isWobbling = options.wobble || false;
    const showCracks = options.cracks || false;
    const backOverlay = this.renderSlot('back', equipped.back, 'egg');
    const headOverlay = this.renderSlot('head', equipped.head, 'egg');
    const neckOverlay = this.renderSlot('neck', equipped.neck, 'egg');
    const bodyOverlay = this.renderSlot('body', equipped.body, 'egg');
    const specialOverlay = this.renderSlot('special', equipped.special, 'egg');

    return `
      <svg class="pet-creature-svg ${isWobbling ? 'egg-wobbling' : ''}" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <defs>
          <radialGradient id="acEggAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.45"/>
            <stop offset="70%" stop-color="#8B5CF6" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="acEggShell" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF"/>
            <stop offset="40%" stop-color="#F5F3FF"/>
            <stop offset="80%" stop-color="#EDE9FE"/>
            <stop offset="100%" stop-color="#DDD6FE"/>
          </linearGradient>
        </defs>
        <ellipse cx="80" cy="144" rx="42" ry="12" fill="rgba(0,0,0,0.25)"/>
        <ellipse cx="80" cy="90" rx="55" ry="62" fill="url(#acEggAura)"/>
        ${backOverlay}
        <!-- Nest / Cushion -->
        <ellipse cx="80" cy="138" rx="42" ry="12" fill="#4C1D95" stroke="#1E1B4B" stroke-width="2.5"/>
        <ellipse cx="80" cy="135" rx="36" ry="8" fill="#6D28D9"/>
        <!-- Egg Shell -->
        <path d="M80,32 C114,32 128,78 128,112 C128,140 106,145 80,145 C54,145 32,140 32,112 C32,78 46,32 80,32 Z"
              fill="url(#acEggShell)" stroke="#1A1A1A" stroke-width="3" stroke-linejoin="round"/>
        <!-- Cute Sleepy Cat Ears on Egg -->
        <polygon points="56,38 66,20 74,36" fill="#EDE9FE" stroke="#1A1A1A" stroke-width="2.5" stroke-linejoin="round"/>
        <polygon points="60,36 66,24 71,34" fill="#F472B6"/>
        <polygon points="104,38 94,20 86,36" fill="#EDE9FE" stroke="#1A1A1A" stroke-width="2.5" stroke-linejoin="round"/>
        <polygon points="100,36 94,24 89,34" fill="#F472B6"/>
        <!-- Cat Paw Print Motif on Egg -->
        <ellipse cx="80" cy="98" rx="10" ry="8" fill="#8B5CF6"/>
        <circle cx="68" cy="86" r="3.5" fill="#8B5CF6"/>
        <circle cx="76" cy="82" r="3.5" fill="#8B5CF6"/>
        <circle cx="84" cy="82" r="3.5" fill="#8B5CF6"/>
        <circle cx="92" cy="86" r="3.5" fill="#8B5CF6"/>
        <!-- Sleepy Closed Eyes (- -) -->
        <path d="M64,68 Q70,72 76,68" stroke="#6D28D9" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M84,68 Q90,72 96,68" stroke="#6D28D9" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <!-- Soft Blush -->
        <circle cx="58" cy="74" r="4" fill="#F472B6" opacity="0.6"/>
        <circle cx="102" cy="74" r="4" fill="#F472B6" opacity="0.6"/>
        ${showCracks ? `
          <g stroke="#8B5CF6" stroke-width="2.5" fill="none" stroke-linecap="round">
            <path d="M80,35 L74,52 L86,66 L76,82 L84,104 L78,130"/>
            <path d="M74,52 L62,58"/>
            <path d="M86,66 L100,72"/>
          </g>
        ` : ''}
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // Aconite Stage 2: Pixel Kitten
  renderAconiteBaby(equipped, options = {}) {
    const backOverlay = this.renderSlot('back', equipped.back, 'baby');
    const headOverlay = this.renderSlot('head', equipped.head, 'baby');
    const neckOverlay = this.renderSlot('neck', equipped.neck, 'baby');
    const bodyOverlay = this.renderSlot('body', equipped.body, 'baby');
    const specialOverlay = this.renderSlot('special', equipped.special, 'baby');

    return `
      <svg class="pet-creature-svg aconite-baby" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <ellipse cx="80" cy="146" rx="38" ry="10" fill="rgba(0,0,0,0.25)"/>
        ${backOverlay}
        <!-- Tiny curled kitten tail -->
        <path d="M42,126 C28,122 22,106 32,98 C38,94 44,102 42,114 Z" fill="#EAEAEA" stroke="#1A1A1A" stroke-width="3"/>
        <!-- Kitten Body -->
        <ellipse cx="80" cy="118" rx="28" ry="22" fill="#EAEAEA" stroke="#1A1A1A" stroke-width="3"/>
        <ellipse cx="80" cy="116" rx="22" ry="17" fill="#FFFFFF"/>
        <!-- Tiny Paws resting in front -->
        <ellipse cx="68" cy="134" rx="9" ry="7" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="2.5"/>
        <ellipse cx="92" cy="134" rx="9" ry="7" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="2.5"/>
        <!-- Kitten Big Sleepy Ears -->
        <polygon points="42,54 52,24 72,48" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="3" stroke-linejoin="round"/>
        <polygon points="48,50 54,32 67,46" fill="#F472B6"/>
        <polygon points="118,54 108,24 88,48" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="3" stroke-linejoin="round"/>
        <polygon points="112,50 106,32 93,46" fill="#F472B6"/>
        <!-- Chubby Kitten Head -->
        <ellipse cx="80" cy="68" rx="36" ry="28" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="3.2"/>
        <!-- Cute Peeking Sleepy Eyes -->
        <path d="M58,68 Q64,60 70,68" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M90,68 Q96,60 102,68" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" fill="none"/>
        <!-- Pink Nose & Small Mouth -->
        <polygon points="77,73 83,73 80,78" fill="#E11D48"/>
        <path d="M76,80 Q80,83 84,80" stroke="#1A1A1A" stroke-width="1.8" fill="none"/>
        <!-- Rosy Cheeks -->
        <circle cx="54" cy="74" r="5" fill="#F472B6" opacity="0.6"/>
        <circle cx="106" cy="74" r="5" fill="#F472B6" opacity="0.6"/>
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // Aconite Stage 3: Tea Sipper Kit (Faithful to the signature illustration!)
  renderAconiteYoung(equipped, options = {}) {
    const isDrinking = options.isDrinking || false;
    const backOverlay = this.renderSlot('back', equipped.back, 'young');
    const headOverlay = this.renderSlot('head', equipped.head, 'young');
    const neckOverlay = this.renderSlot('neck', equipped.neck, 'young');
    const bodyOverlay = this.renderSlot('body', equipped.body, 'young');
    const specialOverlay = this.renderSlot('special', equipped.special, 'young');

    return `
      <svg class="pet-creature-svg aconite-young" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <ellipse cx="80" cy="148" rx="48" ry="12" fill="rgba(0,0,0,0.3)"/>
        ${backOverlay}
        <!-- Fluffy Curled Cat Tail -->
        <path d="M38,128 C20,120 16,100 28,92 C36,86 48,94 44,110 C42,120 40,125 40,135 Z" fill="#D2D2D8" stroke="#1A1A1A" stroke-width="3"/>
        <path d="M36,126 C24,118 20,102 30,96 C36,92 44,98 40,110 Z" fill="#EFEFEF"/>
        <!-- Cat Left Ear -->
        <polygon points="36,48 50,14 74,40" fill="#EFEFEF" stroke="#1A1A1A" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="42,44 52,22 68,38" fill="#C59B9B"/>
        <!-- Cat Right Ear -->
        <polygon points="114,48 100,14 76,40" fill="#EFEFEF" stroke="#1A1A1A" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="108,44 98,22 82,38" fill="#C59B9B"/>
        <!-- Chubby Head -->
        <ellipse cx="75" cy="62" rx="42" ry="32" fill="#EFEFEF" stroke="#1A1A1A" stroke-width="3.5"/>
        <!-- Peaceful Closed Eyes (^ ^) -->
        <path d="M50,62 Q58,52 66,62" stroke="#1A1A1A" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M84,62 Q92,52 100,62" stroke="#1A1A1A" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <polygon points="71,68 79,68 75,76" fill="#A84B4B" stroke="#1A1A1A" stroke-width="1.5"/>
        <!-- Cat Body & Paws -->
        <ellipse cx="78" cy="115" rx="36" ry="28" fill="#D2D2D8" stroke="#1A1A1A" stroke-width="3.5"/>
        <ellipse cx="76" cy="112" rx="32" ry="25" fill="#EFEFEF"/>
        <ellipse cx="50" cy="134" rx="14" ry="10" fill="#EFEFEF" stroke="#1A1A1A" stroke-width="3"/>
        <ellipse cx="102" cy="134" rx="14" ry="10" fill="#EFEFEF" stroke="#1A1A1A" stroke-width="3"/>
        <!-- Purple Ceramic Mug with Warm Coffee/Tea -->
        ${!equipped.special ? `
          <g class="pixel-purple-mug" transform="${isDrinking ? 'translate(0, -6)' : 'translate(0, 0)'}">
            <path d="M102,96 C114,96 114,114 102,114" stroke="#4C1D95" stroke-width="4.5" fill="none" stroke-linecap="round"/>
            <rect x="76" y="88" width="28" height="30" rx="4" fill="#6D28D9" stroke="#1A1A1A" stroke-width="3"/>
            <rect x="78" y="90" width="24" height="6" fill="#4C1D95"/>
            <ellipse cx="90" cy="90" rx="12" ry="4" fill="#3B1C10"/>
            <ellipse cx="74" cy="104" rx="8" ry="7" fill="#EFEFEF" stroke="#1A1A1A" stroke-width="2"/>
            <ellipse cx="102" cy="104" rx="7" ry="7" fill="#EFEFEF" stroke="#1A1A1A" stroke-width="2"/>
          </g>
        ` : ''}
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // Aconite Stage 4: Lo-Fi Scholar Cat (Taller, headphones, retro keycaps)
  renderAconiteTeen(equipped, options = {}) {
    const backOverlay = this.renderSlot('back', equipped.back, 'teen');
    const headOverlay = this.renderSlot('head', equipped.head, 'teen');
    const neckOverlay = this.renderSlot('neck', equipped.neck, 'teen');
    const bodyOverlay = this.renderSlot('body', equipped.body, 'teen');
    const specialOverlay = this.renderSlot('special', equipped.special, 'teen');

    return `
      <svg class="pet-creature-svg aconite-teen" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <ellipse cx="80" cy="148" rx="46" ry="12" fill="rgba(0,0,0,0.3)"/>
        ${backOverlay}
        <!-- Long poised tail -->
        <path d="M34,130 C16,118 12,88 28,78 C38,72 46,84 40,102 C36,114 36,124 38,136 Z" fill="#D2D2D8" stroke="#1A1A1A" stroke-width="3"/>
        <path d="M32,126 C18,114 16,92 28,84 C34,80 40,88 36,102 Z" fill="#FFFFFF"/>
        <!-- Cat Body (with cute study vest) -->
        <ellipse cx="78" cy="112" rx="34" ry="30" fill="#EAEAEA" stroke="#1A1A1A" stroke-width="3.5"/>
        <path d="M54,92 L102,92 L98,126 L58,126 Z" fill="#8B5CF6" stroke="#1A1A1A" stroke-width="2.5"/>
        <line x1="78" y1="92" x2="78" y2="126" stroke="#FDE047" stroke-width="2"/>
        <circle cx="78" cy="100" r="2.5" fill="#FDE047"/>
        <circle cx="78" cy="112" r="2.5" fill="#FDE047"/>
        <!-- Paws on mechanical keycaps -->
        <ellipse cx="56" cy="132" rx="12" ry="9" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="2.8"/>
        <ellipse cx="98" cy="132" rx="12" ry="9" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="2.8"/>
        <!-- Ears -->
        <polygon points="38,44 48,10 72,36" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="44,40 50,18 66,34" fill="#C59B9B"/>
        <polygon points="114,44 104,10 80,36" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="108,40 102,18 86,34" fill="#C59B9B"/>
        <!-- Head -->
        <ellipse cx="76" cy="58" rx="40" ry="30" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="3.5"/>
        <!-- Focused Lo-Fi Eyes with glasses -->
        <ellipse cx="60" cy="58" rx="10" ry="9" fill="none" stroke="#6D28D9" stroke-width="2.5"/>
        <ellipse cx="92" cy="58" rx="10" ry="9" fill="none" stroke="#6D28D9" stroke-width="2.5"/>
        <line x1="70" y1="58" x2="82" y2="58" stroke="#6D28D9" stroke-width="2.5"/>
        <path d="M54,58 Q60,52 66,58" stroke="#1A1A1A" stroke-width="3" fill="none"/>
        <path d="M86,58 Q92,52 98,58" stroke="#1A1A1A" stroke-width="3" fill="none"/>
        <polygon points="73,64 79,64 76,70" fill="#A84B4B"/>
        <!-- Retro Lo-Fi Headphones -->
        <path d="M34,54 C34,16 118,16 118,54" fill="none" stroke="#4C1D95" stroke-width="4.5" stroke-linecap="round"/>
        <rect x="28" y="44" width="10" height="20" rx="4" fill="#6D28D9" stroke="#1A1A1A" stroke-width="2"/>
        <rect x="114" y="44" width="10" height="20" rx="4" fill="#6D28D9" stroke="#1A1A1A" stroke-width="2"/>
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // Aconite Stage 5: Zen Study Master (Mature, serene robe, books, floating steam)
  renderAconiteAdult(equipped, options = {}) {
    const backOverlay = this.renderSlot('back', equipped.back, 'adult');
    const headOverlay = this.renderSlot('head', equipped.head, 'adult');
    const neckOverlay = this.renderSlot('neck', equipped.neck, 'adult');
    const bodyOverlay = this.renderSlot('body', equipped.body, 'adult');
    const specialOverlay = this.renderSlot('special', equipped.special, 'adult');

    return `
      <svg class="pet-creature-svg aconite-adult" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <ellipse cx="80" cy="150" rx="52" ry="12" fill="rgba(0,0,0,0.3)"/>
        ${backOverlay}
        <!-- Majestic Long Tail with Lavender Bow -->
        <path d="M34,136 C10,122 6,80 26,66 C38,58 48,72 40,94 C34,112 36,128 38,142 Z" fill="#EAEAEA" stroke="#1A1A1A" stroke-width="3.5"/>
        <polygon points="26,66 20,58 34,62 30,74" fill="#8B5CF6"/>
        <!-- Scholar Cat in Master Robe -->
        <ellipse cx="78" cy="114" rx="40" ry="34" fill="#EDE9FE" stroke="#1A1A1A" stroke-width="3.5"/>
        <path d="M44,88 L112,88 L116,138 L40,138 Z" fill="#6D28D9" stroke="#1A1A1A" stroke-width="3"/>
        <path d="M66,88 L78,118 L90,88" stroke="#FDE047" stroke-width="3" fill="none"/>
        <polygon points="78,118 73,124 83,124" fill="#FDE047"/>
        <!-- Paws resting gracefully on Ancient Tome -->
        <rect x="48" y="132" width="60" height="12" rx="3" fill="#854D0E" stroke="#1A1A1A" stroke-width="2.5"/>
        <rect x="52" y="130" width="52" height="4" fill="#FEF08A"/>
        <ellipse cx="58" cy="130" rx="10" ry="7" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="2.5"/>
        <ellipse cx="98" cy="130" rx="10" ry="7" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="2.5"/>
        <!-- Head & Ears with gold earrings -->
        <polygon points="36,40 48,6 72,32" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="42,36 48,14 66,30" fill="#C59B9B"/>
        <circle cx="36" cy="38" r="3.5" fill="#FDE047" stroke="#1A1A1A" stroke-width="1.5"/>
        <polygon points="116,40 104,6 80,32" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="110,36 104,14 86,30" fill="#C59B9B"/>
        <ellipse cx="76" cy="54" rx="42" ry="30" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="3.5"/>
        <!-- Serene Zen Eyes -->
        <path d="M52,54 Q60,46 68,54" stroke="#1A1A1A" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M84,54 Q92,46 100,54" stroke="#1A1A1A" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <polygon points="73,60 79,60 76,66" fill="#A84B4B"/>
        <circle cx="48" cy="62" r="5" fill="#F472B6" opacity="0.5"/>
        <circle cx="104" cy="62" r="5" fill="#F472B6" opacity="0.5"/>
        <!-- Starlight particles above head -->
        <circle cx="42" cy="18" r="2" fill="#FDE047"/>
        <circle cx="110" cy="18" r="2.5" fill="#FDE047"/>
        <circle cx="76" cy="8" r="3" fill="#8B5CF6"/>
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // Aconite Stage 6: Celestial Astral Neko (Luminous crescent moon, cosmic aura)
  renderAconiteMythical(equipped, options = {}) {
    const backOverlay = this.renderSlot('back', equipped.back, 'mythical');
    const headOverlay = this.renderSlot('head', equipped.head, 'mythical');
    const neckOverlay = this.renderSlot('neck', equipped.neck, 'mythical');
    const bodyOverlay = this.renderSlot('body', equipped.body, 'mythical');
    const specialOverlay = this.renderSlot('special', equipped.special, 'mythical');

    return `
      <svg class="pet-creature-svg aconite-mythical" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <defs>
          <radialGradient id="astralAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#C084FC" stop-opacity="0.55"/>
            <stop offset="60%" stop-color="#6D28D9" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#4C1D95" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx="80" cy="150" rx="56" ry="12" fill="rgba(0,0,0,0.35)"/>
        <!-- Glowing Astral Aura -->
        <ellipse cx="80" cy="80" rx="72" ry="72" fill="url(#astralAura)"/>
        <!-- Floating Celestial Crescent Moon Halo -->
        <path d="M80,8 C102,8 116,24 116,46 C116,68 102,84 80,84 C94,76 102,62 102,46 C102,30 94,16 80,8 Z"
              fill="#FDE047" stroke="#CA8A04" stroke-width="1.8" style="filter: drop-shadow(0 0 6px #FDE047);"/>
        ${backOverlay}
        <!-- Twin Cosmic Tails (Curled with starlight tips) -->
        <path d="M42,130 C12,110 4,68 28,52 C38,44 46,58 38,82 C34,102 38,122 44,136 Z"
              fill="#EDE9FE" stroke="#4C1D95" stroke-width="3"/>
        <circle cx="28" cy="52" r="5" fill="#FDE047" style="filter: drop-shadow(0 0 4px #FDE047);"/>
        <path d="M118,130 C148,110 156,68 132,52 C122,44 114,58 122,82 C126,102 122,122 116,136 Z"
              fill="#EDE9FE" stroke="#4C1D95" stroke-width="3"/>
        <circle cx="132" cy="52" r="5" fill="#FDE047" style="filter: drop-shadow(0 0 4px #FDE047);"/>
        <!-- Celestial Body with Astral Robes -->
        <ellipse cx="80" cy="114" rx="42" ry="34" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="3.5"/>
        <path d="M42,90 L118,90 L122,142 L38,142 Z" fill="#4C1D95" stroke="#1E1B4B" stroke-width="3"/>
        <path d="M80,90 L80,142" stroke="#FDE047" stroke-width="2.5"/>
        <ellipse cx="60" cy="134" rx="12" ry="8" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2.5"/>
        <ellipse cx="100" cy="134" rx="12" ry="8" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2.5"/>
        <!-- Ornate Celestial Head & Ears -->
        <polygon points="36,38 48,2 72,28" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="42,34 48,10 66,26" fill="#C084FC"/>
        <polygon points="124,38 112,2 88,28" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="118,34 112,10 94,26" fill="#C084FC"/>
        <ellipse cx="80" cy="52" rx="42" ry="30" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="3.5"/>
        <!-- Glowing Astral Third Eye Gem -->
        <polygon points="80,30 84,36 80,42 76,36" fill="#FDE047" stroke="#CA8A04" stroke-width="1.5" style="filter: drop-shadow(0 0 4px #FDE047);"/>
        <!-- Divine Closed Eyes -->
        <path d="M54,52 Q62,44 70,52" stroke="#4C1D95" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M90,52 Q98,44 106,52" stroke="#4C1D95" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <polygon points="77,58 83,58 80,63" fill="#A84B4B"/>
        <!-- Constellation dots -->
        <circle cx="56" cy="104" r="2" fill="#FDE047"/>
        <circle cx="104" cy="104" r="2" fill="#FDE047"/>
        <circle cx="80" cy="120" r="2.5" fill="#FDE047"/>
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // ==========================================================================
  // 2. FLORAPUP (Nature & Botany Line)
  // ==========================================================================
  renderFloraSpecies(stage, equipped, options) {
    switch (stage) {
      case 'egg': return this.renderFloraEgg(equipped, options);
      case 'baby': return this.renderFloraBaby(equipped, options);
      case 'young': return this.renderFloraYoung(equipped, options);
      case 'teen': return this.renderFloraTeen(equipped, options);
      case 'adult': return this.renderFloraAdult(equipped, options);
      case 'mythical': return this.renderFloraMythical(equipped, options);
      default: return this.renderFloraYoung(equipped, options);
    }
  }

  // Florapup Stage 1: Moss Sprout Egg
  renderFloraEgg(equipped, options = {}) {
    const isWobbling = options.wobble || false;
    const showCracks = options.cracks || false;
    const backOverlay = this.renderSlot('back', equipped.back, 'egg');
    const headOverlay = this.renderSlot('head', equipped.head, 'egg');
    const neckOverlay = this.renderSlot('neck', equipped.neck, 'egg');
    const bodyOverlay = this.renderSlot('body', equipped.body, 'egg');
    const specialOverlay = this.renderSlot('special', equipped.special, 'egg');

    return `
      <svg class="pet-creature-svg ${isWobbling ? 'egg-wobbling' : ''}" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <defs>
          <radialGradient id="floraAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#86EFAC" stop-opacity="0.45"/>
            <stop offset="70%" stop-color="#22C55E" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#22C55E" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="floraEggShell" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stop-color="#F7FEE7"/>
            <stop offset="40%" stop-color="#ECFCCB"/>
            <stop offset="80%" stop-color="#D9F99D"/>
            <stop offset="100%" stop-color="#A8B99A"/>
          </linearGradient>
        </defs>
        <ellipse cx="80" cy="144" rx="44" ry="12" fill="rgba(0,0,0,0.25)"/>
        <ellipse cx="80" cy="90" rx="55" ry="62" fill="url(#floraAura)"/>
        ${backOverlay}
        <!-- Nest of fresh moss and clovers -->
        <ellipse cx="80" cy="138" rx="44" ry="12" fill="#2D5A3A" stroke="#14331E" stroke-width="2.5"/>
        <ellipse cx="80" cy="135" rx="38" ry="8" fill="#4E8D5B"/>
        <circle cx="56" cy="134" r="4" fill="#86EFAC"/>
        <circle cx="104" cy="134" r="4" fill="#86EFAC"/>
        <circle cx="80" cy="140" r="3.5" fill="#F3D58A"/>
        <!-- Egg Shell -->
        <path d="M80,32 C114,32 128,78 128,112 C128,140 106,145 80,145 C54,145 32,140 32,112 C32,78 46,32 80,32 Z"
              fill="url(#floraEggShell)" stroke="#1F2937" stroke-width="3" stroke-linejoin="round"/>
        <!-- Sprouting Twin Leaves on Top -->
        <path d="M80,32 C74,18 62,14 60,20 C58,26 70,30 80,32 Z" fill="#22C55E" stroke="#14331E" stroke-width="2"/>
        <path d="M80,32 C86,16 98,12 100,18 C102,24 90,30 80,32 Z" fill="#4ADE80" stroke="#14331E" stroke-width="2"/>
        <circle cx="80" cy="32" r="3" fill="#FDE047"/>
        <!-- Mossy Speckles & Four-Leaf Clover Pattern -->
        <g fill="#526B55" opacity="0.85">
          <circle cx="68" cy="80" r="4"/>
          <circle cx="76" cy="74" r="4"/>
          <circle cx="84" cy="74" r="4"/>
          <circle cx="92" cy="80" r="4"/>
          <circle cx="80" cy="94" r="5"/>
          <circle cx="98" cy="106" r="3.5"/>
          <circle cx="62" cy="106" r="3"/>
          <circle cx="74" cy="118" r="4"/>
        </g>
        <!-- Sprout Face (Happy closed arc eyes) -->
        <path d="M64,62 Q70,56 76,62" stroke="#166534" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M84,62 Q90,56 96,62" stroke="#166534" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <!-- Soft Botanical Cheeks -->
        <circle cx="58" cy="68" r="4" fill="#FCA5A5" opacity="0.6"/>
        <circle cx="102" cy="68" r="4" fill="#FCA5A5" opacity="0.6"/>
        ${showCracks ? `
          <g stroke="#15803D" stroke-width="2.5" fill="none" stroke-linecap="round">
            <path d="M80,35 L86,54 L74,68 L86,84 L76,108 L82,132"/>
            <path d="M86,54 L98,62"/>
            <path d="M74,68 L60,76"/>
          </g>
        ` : ''}
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // Florapup Stage 2: Sproutling (Round plant pup, floppy leaf ears)
  renderFloraBaby(equipped, options = {}) {
    const backOverlay = this.renderSlot('back', equipped.back, 'baby');
    const headOverlay = this.renderSlot('head', equipped.head, 'baby');
    const neckOverlay = this.renderSlot('neck', equipped.neck, 'baby');
    const bodyOverlay = this.renderSlot('body', equipped.body, 'baby');
    const specialOverlay = this.renderSlot('special', equipped.special, 'baby');

    return `
      <svg class="pet-creature-svg flora-baby" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <ellipse cx="80" cy="146" rx="38" ry="10" fill="rgba(0,0,0,0.25)"/>
        ${backOverlay}
        <!-- Tiny wagging leaf tail -->
        <path d="M106,120 C122,114 128,98 120,90 C112,86 108,98 106,114 Z" fill="#4ADE80" stroke="#14331E" stroke-width="2.5"/>
        <!-- Fuzzy Round Body -->
        <ellipse cx="80" cy="116" rx="30" ry="24" fill="#E2EAD8" stroke="#1F2937" stroke-width="3.2"/>
        <ellipse cx="80" cy="114" rx="22" ry="17" fill="#F7FEE7"/>
        <!-- Floppy Green Leaf Ears -->
        <path d="M48,56 C30,54 22,76 34,92 C42,98 52,80 50,62 Z" fill="#526B55" stroke="#1F2937" stroke-width="3"/>
        <path d="M42,64 Q34,78 40,88" stroke="#86EFAC" stroke-width="1.5" fill="none"/>
        <path d="M112,56 C130,54 138,76 126,92 C118,98 108,80 110,62 Z" fill="#526B55" stroke="#1F2937" stroke-width="3"/>
        <path d="M118,64 Q126,78 120,88" stroke="#86EFAC" stroke-width="1.5" fill="none"/>
        <!-- Head -->
        <ellipse cx="80" cy="68" rx="36" ry="28" fill="#E2EAD8" stroke="#1F2937" stroke-width="3.2"/>
        <!-- Sprout on Head -->
        <path d="M80,40 C76,26 66,24 64,30 C64,36 74,38 80,40 Z" fill="#22C55E" stroke="#14331E" stroke-width="2"/>
        <path d="M80,40 C84,24 94,22 96,28 C96,34 86,38 80,40 Z" fill="#4ADE80" stroke="#14331E" stroke-width="2"/>
        <!-- Curious Shiny Eyes -->
        <ellipse cx="66" cy="68" rx="5.5" ry="6.5" fill="#1F2937"/>
        <circle cx="64" cy="66" r="2" fill="#FFFFFF"/>
        <ellipse cx="94" cy="68" rx="5.5" ry="6.5" fill="#1F2937"/>
        <circle cx="92" cy="66" r="2" fill="#FFFFFF"/>
        <!-- Button Nose & Puppy Smile -->
        <polygon points="77,74 83,74 80,78" fill="#15803D"/>
        <path d="M74,80 Q80,84 86,80" stroke="#1F2937" stroke-width="2" fill="none"/>
        <!-- Soft Blush -->
        <circle cx="56" cy="74" r="4.5" fill="#FCA5A5" opacity="0.6"/>
        <circle cx="104" cy="74" r="4.5" fill="#FCA5A5" opacity="0.6"/>
        <!-- Tiny Paws -->
        <ellipse cx="66" cy="134" rx="9" ry="7" fill="#526B55" stroke="#1F2937" stroke-width="2.5"/>
        <ellipse cx="94" cy="134" rx="9" ry="7" fill="#526B55" stroke="#1F2937" stroke-width="2.5"/>
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // Florapup Stage 3: Clover Bark (Energetic pup, clover tail, leaf collar)
  renderFloraYoung(equipped, options = {}) {
    const backOverlay = this.renderSlot('back', equipped.back, 'young');
    const headOverlay = this.renderSlot('head', equipped.head, 'young');
    const neckOverlay = this.renderSlot('neck', equipped.neck, 'young');
    const bodyOverlay = this.renderSlot('body', equipped.body, 'young');
    const specialOverlay = this.renderSlot('special', equipped.special, 'young');

    return `
      <svg class="pet-creature-svg flora-young" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <ellipse cx="80" cy="148" rx="46" ry="12" fill="rgba(0,0,0,0.3)"/>
        ${backOverlay}
        <!-- Four-leaf clover tail wagging -->
        <g class="flora-tail" transform="translate(108, 96)">
          <path d="M0,24 C10,12 18,6 26,0" stroke="#526B55" stroke-width="3" fill="none"/>
          <circle cx="26" cy="-4" r="6" fill="#22C55E"/>
          <circle cx="34" cy="2" r="6" fill="#22C55E"/>
          <circle cx="26" cy="8" r="6" fill="#16A34A"/>
          <circle cx="18" cy="2" r="6" fill="#16A34A"/>
          <circle cx="26" cy="2" r="2.5" fill="#FDE047"/>
        </g>
        <!-- Body with soft cream belly -->
        <ellipse cx="78" cy="114" rx="36" ry="28" fill="#526B55" stroke="#1F2937" stroke-width="3.5"/>
        <ellipse cx="78" cy="112" rx="26" ry="22" fill="#E2EAD8"/>
        <!-- Floppy Leaf Ears -->
        <path d="M42,52 C20,52 14,80 28,98 C38,104 50,84 46,62 Z" fill="#526B55" stroke="#1F2937" stroke-width="3.2"/>
        <path d="M34,64 Q26,82 34,94" stroke="#A8B99A" stroke-width="2" fill="none"/>
        <path d="M114,52 C136,52 142,80 128,98 C118,104 106,84 110,62 Z" fill="#526B55" stroke="#1F2937" stroke-width="3.2"/>
        <path d="M122,64 Q130,82 122,94" stroke="#A8B99A" stroke-width="2" fill="none"/>
        <!-- Head -->
        <ellipse cx="78" cy="62" rx="38" ry="30" fill="#E2EAD8" stroke="#1F2937" stroke-width="3.5"/>
        <!-- Sprout Crest on Forehead -->
        <path d="M78,32 C72,18 60,16 60,22 C60,28 72,30 78,32 Z" fill="#22C55E" stroke="#14331E" stroke-width="2"/>
        <path d="M78,32 C84,18 96,16 96,22 C96,28 84,30 78,32 Z" fill="#4ADE80" stroke="#14331E" stroke-width="2"/>
        <!-- Big Friendly Puppy Eyes -->
        <ellipse cx="64" cy="60" rx="6" ry="7.5" fill="#1F2937"/>
        <circle cx="62" cy="58" r="2.5" fill="#FFFFFF"/>
        <ellipse cx="92" cy="60" rx="6" ry="7.5" fill="#1F2937"/>
        <circle cx="90" cy="58" r="2.5" fill="#FFFFFF"/>
        <!-- Puppy Nose & Smile with Pink Tongue -->
        <polygon points="74,68 82,68 78,74" fill="#15803D"/>
        <path d="M70,74 Q78,80 86,74" stroke="#1F2937" stroke-width="2.5" fill="none"/>
        <path d="M75,76 Q78,84 81,76 Z" fill="#F472B6"/>
        <!-- Leaf Collar -->
        <path d="M52,82 Q78,92 104,82" stroke="#22C55E" stroke-width="5" stroke-linecap="round" fill="none"/>
        <circle cx="78" cy="88" r="4.5" fill="#F3D58A" stroke="#1F2937" stroke-width="1.5"/>
        <!-- Paws -->
        <ellipse cx="56" cy="134" rx="12" ry="9" fill="#526B55" stroke="#1F2937" stroke-width="2.8"/>
        <ellipse cx="100" cy="134" rx="12" ry="9" fill="#526B55" stroke="#1F2937" stroke-width="2.8"/>
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // Florapup Stage 4: Bramble Hound (Taller, flowering brambles, agile stance)
  renderFloraTeen(equipped, options = {}) {
    const backOverlay = this.renderSlot('back', equipped.back, 'teen');
    const headOverlay = this.renderSlot('head', equipped.head, 'teen');
    const neckOverlay = this.renderSlot('neck', equipped.neck, 'teen');
    const bodyOverlay = this.renderSlot('body', equipped.body, 'teen');
    const specialOverlay = this.renderSlot('special', equipped.special, 'teen');

    return `
      <svg class="pet-creature-svg flora-teen" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <ellipse cx="80" cy="148" rx="48" ry="12" fill="rgba(0,0,0,0.3)"/>
        ${backOverlay}
        <!-- Bushy Leaf-Fern Tail -->
        <path d="M112,124 C138,114 148,82 136,68 C124,58 116,78 112,106 Z" fill="#526B55" stroke="#1F2937" stroke-width="3"/>
        <path d="M118,116 C136,106 142,82 132,74 Z" fill="#86EFAC"/>
        <!-- Sleek Agile Body -->
        <ellipse cx="78" cy="112" rx="36" ry="30" fill="#526B55" stroke="#1F2937" stroke-width="3.5"/>
        <ellipse cx="78" cy="110" rx="26" ry="24" fill="#E2EAD8"/>
        <!-- Flowering Brambles Mantle -->
        <path d="M46,84 Q78,96 110,84" stroke="#854D0E" stroke-width="3" fill="none"/>
        <circle cx="56" cy="88" r="4.5" fill="#F472B6"/>
        <circle cx="56" cy="88" r="2" fill="#FEF08A"/>
        <circle cx="78" cy="94" r="5" fill="#F472B6"/>
        <circle cx="78" cy="94" r="2" fill="#FEF08A"/>
        <circle cx="100" cy="88" r="4.5" fill="#F472B6"/>
        <circle cx="100" cy="88" r="2" fill="#FEF08A"/>
        <!-- Hound Ears (Leafy & Pointed) -->
        <polygon points="36,44 24,14 56,36" fill="#526B55" stroke="#1F2937" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="40,40 32,22 52,34" fill="#A8B99A"/>
        <polygon points="120,44 132,14 100,36" fill="#526B55" stroke="#1F2937" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="116,40 124,22 104,34" fill="#A8B99A"/>
        <!-- Alert Hound Head -->
        <ellipse cx="78" cy="56" rx="38" ry="28" fill="#E2EAD8" stroke="#1F2937" stroke-width="3.5"/>
        <!-- Confident Eyes -->
        <ellipse cx="64" cy="54" rx="6" ry="7" fill="#1F2937"/>
        <circle cx="62" cy="52" r="2" fill="#FFFFFF"/>
        <ellipse cx="92" cy="54" rx="6" ry="7" fill="#1F2937"/>
        <circle cx="90" cy="52" r="2" fill="#FFFFFF"/>
        <!-- Hound Snout -->
        <polygon points="74,62 82,62 78,67" fill="#14532D"/>
        <path d="M72,68 Q78,73 84,68" stroke="#1F2937" stroke-width="2.5" fill="none"/>
        <!-- Sturdy Paws -->
        <ellipse cx="56" cy="134" rx="12" ry="9" fill="#526B55" stroke="#1F2937" stroke-width="2.8"/>
        <ellipse cx="100" cy="134" rx="12" ry="9" fill="#526B55" stroke="#1F2937" stroke-width="2.8"/>
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // Florapup Stage 5: Forest Guardian (Botanical wolf, blossoming antlers, moss cape)
  renderFloraAdult(equipped, options = {}) {
    const backOverlay = this.renderSlot('back', equipped.back, 'adult');
    const headOverlay = this.renderSlot('head', equipped.head, 'adult');
    const neckOverlay = this.renderSlot('neck', equipped.neck, 'adult');
    const bodyOverlay = this.renderSlot('body', equipped.body, 'adult');
    const specialOverlay = this.renderSlot('special', equipped.special, 'adult');

    return `
      <svg class="pet-creature-svg flora-adult" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <ellipse cx="80" cy="150" rx="52" ry="12" fill="rgba(0,0,0,0.35)"/>
        ${backOverlay}
        <!-- Blossoming Wooden Antlers on Head -->
        <g stroke="#78350F" stroke-width="3.2" stroke-linecap="round" fill="none">
          <path d="M52,32 L40,12 L24,14"/>
          <path d="M40,12 L44,0"/>
          <path d="M104,32 L116,12 L132,14"/>
          <path d="M116,12 L112,0"/>
        </g>
        <circle cx="24" cy="14" r="3.5" fill="#F472B6"/>
        <circle cx="44" cy="0" r="3.5" fill="#F472B6"/>
        <circle cx="132" cy="14" r="3.5" fill="#F472B6"/>
        <circle cx="112" cy="0" r="3.5" fill="#F472B6"/>
        <!-- Large Botanical Fern Tail -->
        <path d="M116,128 C146,114 156,76 140,58 C126,46 118,70 114,106 Z" fill="#526B55" stroke="#1F2937" stroke-width="3.5"/>
        <circle cx="140" cy="58" r="4" fill="#FDE047"/>
        <!-- Majestic Wolf Body & Moss Cape -->
        <ellipse cx="78" cy="114" rx="42" ry="34" fill="#526B55" stroke="#1F2937" stroke-width="3.5"/>
        <path d="M42,88 Q78,102 114,88 L118,136 L38,136 Z" fill="#365314" stroke="#1F2937" stroke-width="3"/>
        <path d="M50,88 Q78,110 106,88" fill="#A8B99A"/>
        <!-- Wolf Head -->
        <polygon points="38,38 28,8 60,30" fill="#526B55" stroke="#1F2937" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="118,38 128,8 96,30" fill="#526B55" stroke="#1F2937" stroke-width="3.5" stroke-linejoin="round"/>
        <ellipse cx="78" cy="52" rx="42" ry="28" fill="#E2EAD8" stroke="#1F2937" stroke-width="3.5"/>
        <!-- Wise Calm Eyes -->
        <ellipse cx="62" cy="50" rx="6" ry="6.5" fill="#1F2937"/>
        <circle cx="60" cy="48" r="2" fill="#FDE047"/>
        <ellipse cx="94" cy="50" rx="6" ry="6.5" fill="#1F2937"/>
        <circle cx="92" cy="48" r="2" fill="#FDE047"/>
        <polygon points="74,58 82,58 78,63" fill="#14532D"/>
        <!-- Noble Paws -->
        <ellipse cx="54" cy="134" rx="13" ry="9" fill="#526B55" stroke="#1F2937" stroke-width="2.8"/>
        <ellipse cx="102" cy="134" rx="13" ry="9" fill="#526B55" stroke="#1F2937" stroke-width="2.8"/>
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // Florapup Stage 6: Celestial Yggdrasil Hound (Golden tree crown, sunlit pollen)
  renderFloraMythical(equipped, options = {}) {
    const backOverlay = this.renderSlot('back', equipped.back, 'mythical');
    const headOverlay = this.renderSlot('head', equipped.head, 'mythical');
    const neckOverlay = this.renderSlot('neck', equipped.neck, 'mythical');
    const bodyOverlay = this.renderSlot('body', equipped.body, 'mythical');
    const specialOverlay = this.renderSlot('special', equipped.special, 'mythical');

    return `
      <svg class="pet-creature-svg flora-mythical" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <defs>
          <radialGradient id="yggdrasilAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FEF08A" stop-opacity="0.6"/>
            <stop offset="60%" stop-color="#4ADE80" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#15803D" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx="80" cy="150" rx="56" ry="12" fill="rgba(0,0,0,0.35)"/>
        <ellipse cx="80" cy="80" rx="72" ry="72" fill="url(#yggdrasilAura)"/>
        <!-- Golden Tree of Life / Yggdrasil Crown -->
        <g stroke="#F59E0B" stroke-width="3" stroke-linecap="round" fill="none" style="filter: drop-shadow(0 0 5px #FDE047);">
          <path d="M80,24 L80,4"/>
          <path d="M80,14 L64,2"/>
          <path d="M80,14 L96,2"/>
          <path d="M64,2 L52,8"/>
          <path d="M96,2 L108,8"/>
        </g>
        <circle cx="80" cy="4" r="3.5" fill="#FEF08A"/>
        <circle cx="64" cy="2" r="3" fill="#FEF08A"/>
        <circle cx="96" cy="2" r="3" fill="#FEF08A"/>
        ${backOverlay}
        <!-- Golden-Tipped Botanical Tails -->
        <path d="M120,126 C152,110 162,64 138,44 C124,32 116,60 114,104 Z" fill="#526B55" stroke="#14331E" stroke-width="3.5"/>
        <circle cx="138" cy="44" r="6" fill="#FDE047" style="filter: drop-shadow(0 0 4px #FDE047);"/>
        <!-- Deity Body & Celestial Foliage -->
        <ellipse cx="78" cy="114" rx="44" ry="34" fill="#E2EAD8" stroke="#1F2937" stroke-width="3.5"/>
        <path d="M40,88 L116,88 L122,142 L34,142 Z" fill="#15803D" stroke="#1F2937" stroke-width="3"/>
        <path d="M78,88 L78,142" stroke="#FDE047" stroke-width="2.5"/>
        <ellipse cx="54" cy="134" rx="13" ry="9" fill="#FEF08A" stroke="#1F2937" stroke-width="2.5"/>
        <ellipse cx="102" cy="134" rx="13" ry="9" fill="#FEF08A" stroke="#1F2937" stroke-width="2.5"/>
        <!-- Celestial Wolf Head -->
        <polygon points="36,36 24,4 58,26" fill="#E2EAD8" stroke="#1F2937" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="120,36 132,4 98,26" fill="#E2EAD8" stroke="#1F2937" stroke-width="3.5" stroke-linejoin="round"/>
        <ellipse cx="78" cy="50" rx="42" ry="28" fill="#E2EAD8" stroke="#1F2937" stroke-width="3.5"/>
        <!-- Golden Eyes of Infinite Wisdom -->
        <ellipse cx="62" cy="48" rx="6" ry="6.5" fill="#F59E0B"/>
        <circle cx="60" cy="46" r="2" fill="#FFFFFF"/>
        <ellipse cx="94" cy="48" rx="6" ry="6.5" fill="#F59E0B"/>
        <circle cx="92" cy="46" r="2" fill="#FFFFFF"/>
        <polygon points="74,56 82,56 78,61" fill="#14532D"/>
        <!-- Floating Sunlit Pollen -->
        <circle cx="48" cy="98" r="2.5" fill="#FEF08A"/>
        <circle cx="108" cy="98" r="2.5" fill="#FEF08A"/>
        <circle cx="78" cy="120" r="3" fill="#FEF08A"/>
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // ==========================================================================
  // 3. LUNAPURR (Celestial Cat Line — ID: lunafox, Display: Lunapurr)
  // Cat silhouette at every stage as required by the Guide!
  // ==========================================================================
  renderLunaSpecies(stage, equipped, options) {
    switch (stage) {
      case 'egg': return this.renderLunaEgg(equipped, options);
      case 'baby': return this.renderLunaBaby(equipped, options);
      case 'young': return this.renderLunaYoung(equipped, options);
      case 'teen': return this.renderLunaTeen(equipped, options);
      case 'adult': return this.renderLunaAdult(equipped, options);
      case 'mythical': return this.renderLunaMythical(equipped, options);
      default: return this.renderLunaYoung(equipped, options);
    }
  }

  // Lunapurr Stage 1: Egg (Moonstone / Celestial Cat Egg)
  renderLunaEgg(equipped, options = {}) {
    const isWobbling = options.wobble || false;
    const showCracks = options.cracks || false;
    const backOverlay = this.renderSlot('back', equipped.back, 'egg');
    const headOverlay = this.renderSlot('head', equipped.head, 'egg');
    const neckOverlay = this.renderSlot('neck', equipped.neck, 'egg');
    const bodyOverlay = this.renderSlot('body', equipped.body, 'egg');
    const specialOverlay = this.renderSlot('special', equipped.special, 'egg');

    return `
      <svg class="pet-creature-svg ${isWobbling ? 'egg-wobbling' : ''}" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <defs>
          <radialGradient id="lunaEggAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#93C5FD" stop-opacity="0.5"/>
            <stop offset="60%" stop-color="#818CF8" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#4F46E5" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="lunaEggShell" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF"/>
            <stop offset="30%" stop-color="#F0F9FF"/>
            <stop offset="70%" stop-color="#E0E7FF"/>
            <stop offset="100%" stop-color="#C7D2FE"/>
          </linearGradient>
        </defs>
        <ellipse cx="80" cy="144" rx="44" ry="12" fill="rgba(0,0,0,0.25)"/>
        <ellipse cx="80" cy="90" rx="55" ry="62" fill="url(#lunaEggAura)"/>
        ${backOverlay}
        <!-- Starlight Cushion / Nest -->
        <ellipse cx="80" cy="138" rx="44" ry="12" fill="#1E1B4B" stroke="#0F172A" stroke-width="2.5"/>
        <ellipse cx="80" cy="135" rx="38" ry="8" fill="#312E81"/>
        <circle cx="56" cy="136" r="3" fill="#FDE047"/>
        <circle cx="104" cy="136" r="3" fill="#FDE047"/>
        <circle cx="80" cy="140" r="3" fill="#60A5FA"/>
        <!-- Egg Shell with Cat Silhouette Tips -->
        <path d="M80,32 C114,32 128,78 128,112 C128,140 106,145 80,145 C54,145 32,140 32,112 C32,78 46,32 80,32 Z"
              fill="url(#lunaEggShell)" stroke="#1E1B4B" stroke-width="3" stroke-linejoin="round"/>
        <!-- Tiny Celestial Cat Ear Points on Shell -->
        <polygon points="56,38 64,22 72,36" fill="#E0E7FF" stroke="#1E1B4B" stroke-width="2.2" stroke-linejoin="round"/>
        <polygon points="104,38 96,22 88,36" fill="#E0E7FF" stroke="#1E1B4B" stroke-width="2.2" stroke-linejoin="round"/>
        <!-- Crescent Moon Motif on Shell -->
        <path d="M80,72 C92,72 98,80 98,92 C98,104 92,112 80,112 C88,106 90,98 90,92 C90,86 88,78 80,72 Z"
              fill="#FDE047" stroke="#CA8A04" stroke-width="1.5" style="filter: drop-shadow(0 0 4px #FDE047);"/>
        <!-- Stardust Runes -->
        <circle cx="68" cy="80" r="2" fill="#60A5FA"/>
        <circle cx="92" cy="74" r="2.5" fill="#818CF8"/>
        <circle cx="66" cy="104" r="2.5" fill="#818CF8"/>
        <!-- Sleepy Celestial Eyes -->
        <path d="M64,62 Q70,66 76,62" stroke="#4338CA" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M84,62 Q90,66 96,62" stroke="#4338CA" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        ${showCracks ? `
          <g stroke="#60A5FA" stroke-width="2.5" fill="none" stroke-linecap="round">
            <path d="M80,35 L76,52 L88,68 L78,86 L86,110 L80,132"/>
            <path d="M76,52 L64,60"/>
            <path d="M88,68 L102,74"/>
          </g>
        ` : ''}
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // Lunapurr Stage 2: Baby (Tiny celestial kitten, moonlit fur, starry glow)
  renderLunaBaby(equipped, options = {}) {
    const backOverlay = this.renderSlot('back', equipped.back, 'baby');
    const headOverlay = this.renderSlot('head', equipped.head, 'baby');
    const neckOverlay = this.renderSlot('neck', equipped.neck, 'baby');
    const bodyOverlay = this.renderSlot('body', equipped.body, 'baby');
    const specialOverlay = this.renderSlot('special', equipped.special, 'baby');

    return `
      <svg class="pet-creature-svg luna-baby" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <ellipse cx="80" cy="146" rx="38" ry="10" fill="rgba(0,0,0,0.25)"/>
        ${backOverlay}
        <!-- Tiny curled kitten tail with glowing starlight tip -->
        <path d="M42,126 C28,122 20,104 32,96 C38,92 44,100 42,112 Z" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3"/>
        <circle cx="28" cy="96" r="3.5" fill="#FDE047" style="filter: drop-shadow(0 0 3px #FDE047);"/>
        <!-- Kitten Body -->
        <ellipse cx="80" cy="116" rx="28" ry="22" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3.2"/>
        <ellipse cx="80" cy="114" rx="22" ry="17" fill="#EDE9FE"/>
        <!-- Kitten Ears (Soft Lavender Tip) -->
        <polygon points="42,54 52,22 72,46" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3" stroke-linejoin="round"/>
        <polygon points="48,50 54,30 67,44" fill="#C4B5FD"/>
        <polygon points="118,54 108,22 88,46" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3" stroke-linejoin="round"/>
        <polygon points="112,50 106,30 93,44" fill="#C4B5FD"/>
        <!-- Chubby Celestial Kitten Head -->
        <ellipse cx="80" cy="68" rx="36" ry="28" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3.2"/>
        <!-- Crescent Moon Forehead Speckle -->
        <path d="M80,48 C83,48 85,50 85,53 C85,56 83,58 80,58 C82,56 83,54 83,53 C83,52 82,50 80,48 Z" fill="#FDE047"/>
        <!-- Big Starry Blue Eyes -->
        <ellipse cx="64" cy="68" rx="5.5" ry="6.5" fill="#1E1B4B"/>
        <circle cx="62" cy="66" r="2" fill="#FFFFFF"/>
        <circle cx="65" cy="70" r="1.5" fill="#60A5FA"/>
        <ellipse cx="96" cy="68" rx="5.5" ry="6.5" fill="#1E1B4B"/>
        <circle cx="94" cy="66" r="2" fill="#FFFFFF"/>
        <circle cx="97" cy="70" r="1.5" fill="#60A5FA"/>
        <!-- Nose & Mouth -->
        <polygon points="77,73 83,73 80,77" fill="#C084FC"/>
        <path d="M76,79 Q80,82 84,79" stroke="#1E1B4B" stroke-width="1.8" fill="none"/>
        <circle cx="54" cy="74" r="4.5" fill="#DDD6FE" opacity="0.7"/>
        <circle cx="106" cy="74" r="4.5" fill="#DDD6FE" opacity="0.7"/>
        <!-- Tiny Paws -->
        <ellipse cx="68" cy="134" rx="9" ry="7" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2.5"/>
        <ellipse cx="92" cy="134" rx="9" ry="7" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2.5"/>
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // Lunapurr Stage 3: Young (Lively celestial cat, starry ribbon, crescent pendant)
  renderLunaYoung(equipped, options = {}) {
    const backOverlay = this.renderSlot('back', equipped.back, 'young');
    const headOverlay = this.renderSlot('head', equipped.head, 'young');
    const neckOverlay = this.renderSlot('neck', equipped.neck, 'young');
    const bodyOverlay = this.renderSlot('body', equipped.body, 'young');
    const specialOverlay = this.renderSlot('special', equipped.special, 'young');

    return `
      <svg class="pet-creature-svg luna-young" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <ellipse cx="80" cy="148" rx="46" ry="12" fill="rgba(0,0,0,0.3)"/>
        ${backOverlay}
        <!-- Slender Curled Celestial Cat Tail with Starry Tip -->
        <path d="M38,126 C18,118 12,94 26,84 C34,78 44,88 38,106 C36,116 38,122 40,132 Z" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3"/>
        <circle cx="24" cy="84" r="4.5" fill="#FDE047" style="filter: drop-shadow(0 0 4px #FDE047);"/>
        <!-- Cat Body -->
        <ellipse cx="78" cy="114" rx="34" ry="28" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3.5"/>
        <ellipse cx="78" cy="112" rx="26" ry="22" fill="#EDE9FE"/>
        <!-- Starry Ribbon Collar with Crescent Moon Bell -->
        <path d="M54,82 Q78,92 102,82" stroke="#4F46E5" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path d="M78,88 C82,88 84,90 84,93 C84,96 82,98 78,98 C80,96 81,94 81,93 C81,92 80,90 78,88 Z" fill="#FDE047"/>
        <!-- Pointed Cat Ears with Violet Inner -->
        <polygon points="36,44 48,12 70,38" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="42,40 50,20 64,36" fill="#C4B5FD"/>
        <polygon points="120,44 108,12 86,38" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="114,40 106,20 92,36" fill="#C4B5FD"/>
        <!-- Cat Head -->
        <ellipse cx="78" cy="60" rx="38" ry="30" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3.5"/>
        <!-- Crescent Moon Forehead Emblem -->
        <path d="M78,40 C82,40 85,43 85,47 C85,51 82,54 78,54 C81,51 82,49 82,47 C82,45 81,43 78,40 Z" fill="#FDE047" stroke="#CA8A04" stroke-width="1"/>
        <!-- Luminous Starry Eyes -->
        <ellipse cx="64" cy="58" rx="6" ry="7.5" fill="#1E1B4B"/>
        <circle cx="62" cy="56" r="2.5" fill="#FFFFFF"/>
        <circle cx="65" cy="61" r="1.5" fill="#60A5FA"/>
        <ellipse cx="92" cy="58" rx="6" ry="7.5" fill="#1E1B4B"/>
        <circle cx="90" cy="56" r="2.5" fill="#FFFFFF"/>
        <circle cx="93" cy="61" r="1.5" fill="#60A5FA"/>
        <polygon points="75,66 81,66 78,71" fill="#C084FC"/>
        <path d="M72,72 Q78,76 84,72" stroke="#1E1B4B" stroke-width="2" fill="none"/>
        <!-- Cat Paws -->
        <ellipse cx="56" cy="134" rx="12" ry="9" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2.8"/>
        <ellipse cx="100" cy="134" rx="12" ry="9" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2.8"/>
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // Lunapurr Stage 4: Teen (Graceful cat, lunar robe, star-tipped tail, crescent gem)
  renderLunaTeen(equipped, options = {}) {
    const backOverlay = this.renderSlot('back', equipped.back, 'teen');
    const headOverlay = this.renderSlot('head', equipped.head, 'teen');
    const neckOverlay = this.renderSlot('neck', equipped.neck, 'teen');
    const bodyOverlay = this.renderSlot('body', equipped.body, 'teen');
    const specialOverlay = this.renderSlot('special', equipped.special, 'teen');

    return `
      <svg class="pet-creature-svg luna-teen" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <ellipse cx="80" cy="148" rx="48" ry="12" fill="rgba(0,0,0,0.3)"/>
        ${backOverlay}
        <!-- Flowing Celestial Tail with Starlight Beads -->
        <path d="M34,130 C12,114 8,82 26,68 C36,60 46,74 38,96 C34,110 36,122 40,136 Z" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3.5"/>
        <circle cx="26" cy="68" r="5" fill="#FDE047" style="filter: drop-shadow(0 0 4px #FDE047);"/>
        <!-- Teen Cat in Lunar Cloak -->
        <ellipse cx="78" cy="112" rx="36" ry="30" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3.5"/>
        <path d="M46,86 L110,86 L114,130 L42,130 Z" fill="#312E81" stroke="#1E1B4B" stroke-width="3"/>
        <line x1="78" y1="86" x2="78" y2="130" stroke="#FDE047" stroke-width="2"/>
        <circle cx="78" cy="94" r="3" fill="#FDE047"/>
        <!-- Paws -->
        <ellipse cx="56" cy="134" rx="12" ry="9" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2.8"/>
        <ellipse cx="100" cy="134" rx="12" ry="9" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2.8"/>
        <!-- Elegant Pointed Ears -->
        <polygon points="36,40 48,8 70,34" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="42,36 48,16 64,32" fill="#818CF8"/>
        <polygon points="120,40 108,8 86,34" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="114,36 108,16 92,32" fill="#818CF8"/>
        <!-- Head -->
        <ellipse cx="78" cy="54" rx="38" ry="28" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3.5"/>
        <!-- Forehead Crescent Gem -->
        <path d="M78,32 C83,32 87,36 87,41 C87,46 83,50 78,50 C82,47 83,44 83,41 C83,38 82,35 78,32 Z" fill="#FDE047" stroke="#CA8A04" stroke-width="1.2"/>
        <!-- Calm Serene Eyes -->
        <ellipse cx="64" cy="52" rx="6" ry="7" fill="#1E1B4B"/>
        <circle cx="62" cy="50" r="2" fill="#FFFFFF"/>
        <circle cx="65" cy="54" r="1.5" fill="#60A5FA"/>
        <ellipse cx="92" cy="52" rx="6" ry="7" fill="#1E1B4B"/>
        <circle cx="90" cy="50" r="2" fill="#FFFFFF"/>
        <circle cx="93" cy="54" r="1.5" fill="#60A5FA"/>
        <polygon points="75,59 81,59 78,64" fill="#C084FC"/>
        <circle cx="50" cy="58" r="4.5" fill="#C7D2FE" opacity="0.6"/>
        <circle cx="106" cy="58" r="4.5" fill="#C7D2FE" opacity="0.6"/>
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // Lunapurr Stage 5: Adult (Mature moonlit cat, starlight cloak, hovering lunar orb)
  renderLunaAdult(equipped, options = {}) {
    const backOverlay = this.renderSlot('back', equipped.back, 'adult');
    const headOverlay = this.renderSlot('head', equipped.head, 'adult');
    const neckOverlay = this.renderSlot('neck', equipped.neck, 'adult');
    const bodyOverlay = this.renderSlot('body', equipped.body, 'adult');
    const specialOverlay = this.renderSlot('special', equipped.special, 'adult');

    return `
      <svg class="pet-creature-svg luna-adult" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <ellipse cx="80" cy="150" rx="52" ry="12" fill="rgba(0,0,0,0.35)"/>
        ${backOverlay}
        <!-- Hovering Lunar Orb beside paws -->
        <circle cx="126" cy="116" r="12" fill="#E0E7FF" stroke="#FDE047" stroke-width="2" style="filter: drop-shadow(0 0 6px #818CF8);"/>
        <circle cx="124" cy="113" r="3" fill="#FFFFFF"/>
        <!-- Majestic Long Celestial Tail with Triple Starlight Runes -->
        <path d="M34,136 C10,118 6,76 26,60 C38,50 48,66 40,90 C34,110 36,128 38,142 Z" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3.5"/>
        <circle cx="26" cy="60" r="5" fill="#FDE047" style="filter: drop-shadow(0 0 4px #FDE047);"/>
        <!-- Adult Cat in Celestial Mantle -->
        <ellipse cx="78" cy="114" rx="42" ry="34" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3.5"/>
        <path d="M42,86 L114,86 L118,138 L38,138 Z" fill="#1E1B4B" stroke="#1E1B4B" stroke-width="3"/>
        <path d="M52,86 L78,116 L104,86" stroke="#FDE047" stroke-width="3" fill="none"/>
        <polygon points="78,116 73,122 83,122" fill="#FDE047"/>
        <!-- Paws -->
        <ellipse cx="54" cy="134" rx="12" ry="8" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2.5"/>
        <ellipse cx="98" cy="134" rx="12" ry="8" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2.5"/>
        <!-- Regal Pointed Ears with Gold Earrings -->
        <polygon points="34,38 46,4 70,30" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="40,34 46,12 64,28" fill="#818CF8"/>
        <circle cx="34" cy="36" r="3.5" fill="#FDE047" stroke="#CA8A04" stroke-width="1.2"/>
        <polygon points="122,38 110,4 86,30" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="116,34 110,12 92,28" fill="#818CF8"/>
        <!-- Head -->
        <ellipse cx="78" cy="50" rx="42" ry="28" fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3.5"/>
        <!-- Forehead Crescent Crown -->
        <path d="M78,26 C84,26 89,31 89,37 C89,43 84,48 78,48 C83,44 84,40 84,37 C84,34 83,30 78,26 Z" fill="#FDE047" stroke="#CA8A04" stroke-width="1.5" style="filter: drop-shadow(0 0 4px #FDE047);"/>
        <!-- Serene Luminous Eyes -->
        <ellipse cx="62" cy="48" rx="6" ry="7" fill="#1E1B4B"/>
        <circle cx="60" cy="46" r="2" fill="#FFFFFF"/>
        <circle cx="63" cy="50" r="1.5" fill="#60A5FA"/>
        <ellipse cx="94" cy="48" rx="6" ry="7" fill="#1E1B4B"/>
        <circle cx="92" cy="46" r="2" fill="#FFFFFF"/>
        <circle cx="95" cy="50" r="1.5" fill="#60A5FA"/>
        <polygon points="75,56 81,56 78,61" fill="#C084FC"/>
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // Lunapurr Stage 6: Mythical Cat (Majestic celestial cat empress, elaborate lunar accessories)
  renderLunaMythical(equipped, options = {}) {
    const backOverlay = this.renderSlot('back', equipped.back, 'mythical');
    const headOverlay = this.renderSlot('head', equipped.head, 'mythical');
    const neckOverlay = this.renderSlot('neck', equipped.neck, 'mythical');
    const bodyOverlay = this.renderSlot('body', equipped.body, 'mythical');
    const specialOverlay = this.renderSlot('special', equipped.special, 'mythical');

    return `
      <svg class="pet-creature-svg luna-mythical" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <defs>
          <radialGradient id="lunaCosmicAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#93C5FD" stop-opacity="0.65"/>
            <stop offset="60%" stop-color="#818CF8" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#312E81" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx="80" cy="150" rx="56" ry="12" fill="rgba(0,0,0,0.35)"/>
        <ellipse cx="80" cy="80" rx="72" ry="72" fill="url(#lunaCosmicAura)"/>
        <!-- Elaborate Celestial Crescent Halo -->
        <g style="filter: drop-shadow(0 0 6px #FDE047);">
          <ellipse cx="80" cy="22" rx="36" ry="8" fill="none" stroke="#FDE047" stroke-width="2.5"/>
          <path d="M80,6 C96,6 106,16 106,30 C106,44 96,54 80,54 C90,48 95,40 95,30 C95,20 90,12 80,6 Z" fill="#FDE047"/>
          <circle cx="50" cy="22" r="2.5" fill="#FFFFFF"/>
          <circle cx="110" cy="22" r="2.5" fill="#FFFFFF"/>
        </g>
        ${backOverlay}
        <!-- Twin Flowing Starlight Tails with Celestial Floating Orbs -->
        <path d="M42,130 C12,110 4,68 28,52 C38,44 46,58 38,82 C34,102 38,122 44,136 Z"
              fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3"/>
        <circle cx="28" cy="52" r="5" fill="#60A5FA" style="filter: drop-shadow(0 0 4px #60A5FA);"/>
        <path d="M118,130 C148,110 156,68 132,52 C122,44 114,58 122,82 C126,102 122,122 116,136 Z"
              fill="#F8FAFC" stroke="#1E1B4B" stroke-width="3"/>
        <circle cx="132" cy="52" r="5" fill="#60A5FA" style="filter: drop-shadow(0 0 4px #60A5FA);"/>
        <!-- Mythical Cat Body in Divine Silks -->
        <ellipse cx="80" cy="114" rx="42" ry="34" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="3.5"/>
        <path d="M42,90 L118,90 L122,142 L38,142 Z" fill="#1E1B4B" stroke="#1E1B4B" stroke-width="3"/>
        <path d="M80,90 L80,142" stroke="#FDE047" stroke-width="2.5"/>
        <ellipse cx="60" cy="134" rx="12" ry="8" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2.5"/>
        <ellipse cx="100" cy="134" rx="12" ry="8" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2.5"/>
        <!-- Ornate Ears with Celestial Feathers -->
        <polygon points="34,36 46,0 70,26" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="40,32 46,8 64,24" fill="#818CF8"/>
        <polygon points="126,36 114,0 90,26" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="120,32 114,8 96,24" fill="#818CF8"/>
        <!-- Cat Empress Head -->
        <ellipse cx="80" cy="50" rx="42" ry="30" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="3.5"/>
        <!-- Forehead Starlight Diadem -->
        <polygon points="80,28 84,34 80,40 76,34" fill="#FDE047" stroke="#CA8A04" stroke-width="1.5" style="filter: drop-shadow(0 0 4px #FDE047);"/>
        <!-- Divine Luminous Eyes -->
        <ellipse cx="62" cy="48" rx="6.5" ry="7.5" fill="#1E1B4B"/>
        <circle cx="60" cy="46" r="2.5" fill="#FFFFFF"/>
        <circle cx="64" cy="50" r="1.8" fill="#60A5FA"/>
        <ellipse cx="98" cy="48" rx="6.5" ry="7.5" fill="#1E1B4B"/>
        <circle cx="96" cy="46" r="2.5" fill="#FFFFFF"/>
        <circle cx="100" cy="50" r="1.8" fill="#60A5FA"/>
        <polygon points="77,56 83,56 80,61" fill="#C084FC"/>
        <!-- Hovering Starlight Orbs -->
        <circle cx="50" cy="108" r="3" fill="#FDE047" style="filter: drop-shadow(0 0 3px #FDE047);"/>
        <circle cx="110" cy="108" r="3" fill="#FDE047" style="filter: drop-shadow(0 0 3px #FDE047);"/>
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // ==========================================================================
  // 4. LEGACY PYROLUX (Preserved for existing saves)
  // ==========================================================================
  renderPyroSpecies(stage, equipped, options) {
    const backOverlay = this.renderSlot('back', equipped.back, stage);
    const headOverlay = this.renderSlot('head', equipped.head, stage);
    const neckOverlay = this.renderSlot('neck', equipped.neck, stage);
    const bodyOverlay = this.renderSlot('body', equipped.body, stage);
    const specialOverlay = this.renderSlot('special', equipped.special, stage);

    return `
      <svg class="pet-creature-svg pyrolux-${stage}" viewBox="0 0 160 160" width="100%" height="100%" style="overflow: visible;">
        <ellipse cx="80" cy="148" rx="46" ry="12" fill="rgba(0,0,0,0.3)"/>
        ${backOverlay}
        <!-- Flame Body -->
        <ellipse cx="80" cy="112" rx="36" ry="30" fill="#D98D72" stroke="#1A1A1A" stroke-width="3.5"/>
        <ellipse cx="80" cy="110" rx="26" ry="22" fill="#F4C4B5"/>
        <!-- Flaming Ears -->
        <polygon points="36,44 48,12 70,38" fill="#D98D72" stroke="#1A1A1A" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="42,40 50,20 64,36" fill="#E5BE53"/>
        <polygon points="120,44 108,12 86,38" fill="#D98D72" stroke="#1A1A1A" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="114,40 106,20 92,36" fill="#E5BE53"/>
        <!-- Head -->
        <ellipse cx="78" cy="60" rx="38" ry="30" fill="#F4C4B5" stroke="#1A1A1A" stroke-width="3.5"/>
        <!-- Ember Eyes -->
        <ellipse cx="64" cy="58" rx="6" ry="7.5" fill="#7C2D12"/>
        <circle cx="62" cy="56" r="2.5" fill="#FEF08A"/>
        <ellipse cx="92" cy="58" rx="6" ry="7.5" fill="#7C2D12"/>
        <circle cx="90" cy="56" r="2.5" fill="#FEF08A"/>
        <polygon points="75,66 81,66 78,71" fill="#EA580C"/>
        <!-- Flame Tail -->
        <path d="M38,128 C16,118 10,92 26,82 C36,76 46,88 38,106 Z" fill="#EA580C" stroke="#1A1A1A" stroke-width="3"/>
        <circle cx="24" cy="82" r="4.5" fill="#FEF08A"/>
        <!-- Paws -->
        <ellipse cx="56" cy="134" rx="12" ry="9" fill="#D98D72" stroke="#1A1A1A" stroke-width="2.8"/>
        <ellipse cx="100" cy="134" rx="12" ry="9" fill="#D98D72" stroke="#1A1A1A" stroke-width="2.8"/>
        ${bodyOverlay}${neckOverlay}${headOverlay}${specialOverlay}
      </svg>
    `;
  }

  // ==========================================================================
  // WEARABLE ACCESSORY RENDERING ACROSS 5 SLOTS
  // ==========================================================================
  renderSlot(slot, itemId, stage = 'baby') {
    if (!itemId) return '';
    const anchor = (this.stageAnchors[stage] && this.stageAnchors[stage][slot]) || { x: 80, y: 80, scale: 1.0 };
    const innerSVG = this.getAccessoryGraphic(slot, itemId);
    if (!innerSVG) return '';

    return `
      <g class="wearable-${slot} item-${itemId}" transform="translate(${anchor.x}, ${anchor.y}) scale(${anchor.scale})">
        ${innerSVG}
      </g>
    `;
  }

  getAccessoryGraphic(slot, itemId) {
    // 1. HEAD SLOT
    if (slot === 'head') {
      switch (itemId) {
        case 'scholar_cap':
          return `
            <g transform="translate(-45, -28)">
              <polygon points="45,0 90,12 45,24 0,12" fill="#1E293B" stroke="#000" stroke-width="2.5"/>
              <rect x="32" y="18" width="26" height="8" rx="2" fill="#0F172A"/>
              <line x1="45" y1="12" x2="80" y2="28" stroke="#F59E0B" stroke-width="2.5"/>
              <circle cx="80" cy="30" r="3.5" fill="#F59E0B"/>
            </g>
          `;
        case 'wizard_hat':
          return `
            <g transform="translate(-40, -48)">
              <ellipse cx="40" cy="46" rx="34" ry="9" fill="#4C1D95" stroke="#000" stroke-width="2.5"/>
              <polygon points="15,44 40,-4 65,44" fill="#6D28D9" stroke="#000" stroke-width="2.5"/>
              <circle cx="52" cy="16" r="3.5" fill="#FDE047"/>
            </g>
          `;
        case 'cozy_beanie':
          return `
            <g transform="translate(-32, -32)">
              <path d="M6 30 C6 6 58 6 58 30 Z" fill="#D97706" stroke="#000" stroke-width="2.5"/>
              <rect x="2" y="26" width="60" height="9" rx="3" fill="#FEF3C7" stroke="#000" stroke-width="2"/>
              <circle cx="32" cy="6" r="7" fill="#FEF3C7" stroke="#000" stroke-width="2"/>
            </g>
          `;
        case 'flower_wreath':
          return `
            <g transform="translate(-36, -14)">
              <ellipse cx="36" cy="14" rx="36" ry="10" fill="none" stroke="#15803D" stroke-width="3"/>
              <circle cx="16" cy="12" r="5" fill="#F472B6"/>
              <circle cx="16" cy="12" r="2" fill="#FEF08A"/>
              <circle cx="36" cy="8" r="6" fill="#F43F5E"/>
              <circle cx="36" cy="8" r="2.5" fill="#FEF08A"/>
              <circle cx="56" cy="12" r="5" fill="#38BDF8"/>
              <circle cx="56" cy="12" r="2" fill="#FEF08A"/>
            </g>
          `;
      }
    }

    // 2. NECK SLOT
    if (slot === 'neck') {
      switch (itemId) {
        case 'knit_scarf':
          return `
            <g transform="translate(-30, -6)">
              <rect x="0" y="0" width="60" height="14" rx="5" fill="#D97706" stroke="#000" stroke-width="2.5"/>
              <rect x="40" y="10" width="12" height="24" rx="3" fill="#D97706" stroke="#000" stroke-width="2"/>
              <line x1="42" y1="32" x2="50" y2="32" stroke="#FDE68A" stroke-width="2"/>
            </g>
          `;
        case 'star_pendant':
          return `
            <g transform="translate(-20, -4)">
              <path d="M0,0 Q20,16 40,0" stroke="#F59E0B" stroke-width="2.5" fill="none"/>
              <polygon points="20,10 23,16 30,17 25,22 26,29 20,25 14,29 15,22 10,17 17,16"
                       fill="#FDE047" stroke="#D97706" stroke-width="1.5" style="filter: drop-shadow(0 0 3px #FDE047);"/>
            </g>
          `;
      }
    }

    // 3. BODY SLOT
    if (slot === 'body') {
      switch (itemId) {
        case 'student_cape':
          return `
            <g transform="translate(-32, -4)">
              <path d="M6,0 L58,0 L64,36 C64,44 48,46 32,46 C16,46 0,44 0,36 Z" fill="#1E3A8A" stroke="#000" stroke-width="2.5"/>
              <circle cx="32" cy="6" r="4" fill="#F59E0B"/>
              <line x1="6" y1="2" x2="58" y2="2" stroke="#F59E0B" stroke-width="2"/>
            </g>
          `;
        case 'cozy_sweater':
          return `
            <g transform="translate(-30, -6)">
              <rect x="0" y="0" width="60" height="34" rx="8" fill="#F43F5E" stroke="#000" stroke-width="2.5"/>
              <line x1="15" y1="0" x2="15" y2="34" stroke="#FFE4E6" stroke-width="2" stroke-dasharray="3,2"/>
              <line x1="45" y1="0" x2="45" y2="34" stroke="#FFE4E6" stroke-width="2" stroke-dasharray="3,2"/>
            </g>
          `;
      }
    }

    // 4. BACK SLOT
    if (slot === 'back') {
      switch (itemId) {
        case 'student_cape':
          return `
            <g transform="translate(-46, -10)">
              <path d="M12,0 C0,30 -6,70 6,86 C24,96 68,96 86,86 C98,70 92,30 80,0 Z"
                    fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
              <path d="M16,4 C8,30 2,68 12,82 C28,90 64,90 80,82 C90,68 84,30 76,4 Z"
                    fill="#312E81"/>
            </g>
          `;
        case 'wings':
        case 'fairy_wings':
          return `
            <g transform="translate(-50, -20)">
              <path d="M50,30 C10,0 -10,30 20,50 C40,60 48,40 50,30 Z" fill="#93C5FD" opacity="0.75" stroke="#1E3A8A" stroke-width="2"/>
              <path d="M50,30 C90,0 110,30 80,50 C60,60 52,40 50,30 Z" fill="#93C5FD" opacity="0.75" stroke="#1E3A8A" stroke-width="2"/>
            </g>
          `;
      }
    }

    // 5. SPECIAL SLOT
    if (slot === 'special') {
      switch (itemId) {
        case 'magic_wand':
          return `
            <g transform="translate(0, 0)">
              <line x1="0" y1="20" x2="16" y2="-10" stroke="#78350F" stroke-width="3" stroke-linecap="round"/>
              <polygon points="16,-10 20,-16 26,-10 20,-4" fill="#FDE047" stroke="#CA8A04" stroke-width="1.5"/>
            </g>
          `;
        case 'floating_star':
          return `
            <g transform="translate(10, -10)" style="filter: drop-shadow(0 0 5px #FDE047);">
              <polygon points="10,0 13,7 20,8 15,13 16,20 10,16 4,20 5,13 0,8 7,7" fill="#FDE047"/>
            </g>
          `;
      }
    }

    return '';
  }
}

// Global PetRenderer Instance
const petRenderer = new PetRenderer();
if (typeof window !== 'undefined') {
  window.petRenderer = petRenderer;
}
if (typeof module !== 'undefined') {
  module.exports = { PetRenderer };
}
