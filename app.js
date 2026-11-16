/**
 * STUDYPET — Master Application Controller & Router
 * Enhanced Retro 90s OS & Pixel Art Sanctuary Edition
 * Features:
 * - Real-Time Dynamic Day / Sunset / Night Window Sky
 * - Dual-Layer Sound Mixing (Rain/Fire + Lo-Fi/Piano/Noise/OST)
 * - Animated Cassette Tape & Audio Spectrum Visualizer
 * - Interactive Desk Clutter (Sticky Notes, Mechanical Keyboard, CRT Minigame)
 * - Break-Time Coffee-Brewing Mini-Game
 */

class StudyPetApp {
  constructor() {
    this.currentView = 'home';
    this.store = window.dataStore;
    this.timeOfDay = this.calculateTimeOfDay(); // 'day', 'sunset', 'night'
    this.visualizerInterval = null;
    this.init();
  }

  calculateTimeOfDay() {
    const hr = new Date().getHours();
    if (hr >= 6 && hr < 17) return 'day';
    if (hr >= 17 && hr < 20) return 'sunset';
    return 'night';
  }

  init() {
    if (!this.store.state.user.isOnboarded) {
      this.showOnboardingWizard();
    }

    if (this.store.state.user.theme) {
      document.documentElement.setAttribute('data-theme', this.store.state.user.theme);
    }

    this.setupShortcuts();
    this.renderAll();

    // Start Real-Time Sky and Clock Tick
    setInterval(() => {
      const prevTime = this.timeOfDay;
      this.timeOfDay = this.calculateTimeOfDay();
      this.updateRetroClock();
      if (prevTime !== this.timeOfDay) {
        this.updateSkyScene();
      }
    }, 1000);

    // Visibility change listener to immediately update sky lighting when tab becomes active
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        const prevTime = this.timeOfDay;
        this.timeOfDay = this.calculateTimeOfDay();
        if (prevTime !== this.timeOfDay) {
          this.updateSkyScene();
        }
        this.updateRetroClock();
      }
    });

    // Audio Spectrum Visualizer Loop
    this.startSpectrumVisualizer();
  }

  updateSkyScene() {
    const windowSky = document.getElementById('pixel-window-sky');
    if (windowSky) {
      windowSky.className = `pixel-night-window ${this.timeOfDay}`;
      const sceneryEl = windowSky.querySelector('.fairytale-scenery-container');
      if (sceneryEl) {
        sceneryEl.outerHTML = this.renderWindowScenery();
      }
    }
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Escape closes modals
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        const lockOverlay = document.getElementById('focus-lock-overlay');
        if (lockOverlay && lockOverlay.classList.contains('active')) {
          window.studyTimer.toggleFocusLock();
        }
      }

      // Space toggles timer if in study room
      if (e.code === 'Space' && this.currentView === 'study-room' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        window.studyTimer.togglePlayPause();
      }

      // Typing key sound feedback for immersive mechanical keyboard feeling!
      if (!['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
        if (window.soundEngine && !window.soundEngine.isMuted) {
          window.soundEngine.playMechanicalKey();
        }
      }
    });
  }

  navigateTo(viewName) {
    if (window.soundEngine) window.soundEngine.playClick();
    this.currentView = viewName;

    document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === viewName);
    });

    this.renderCurrentView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderAll() {
    this.renderTopBar();
    this.renderSidebarMiniPet();
    this.renderCurrentView();
  }

  renderTopBar() {
    const user = this.store.state.user;
    const scholarName = user.scholarName || user.name || 'Scholar';
    const pet = this.store.state.pet;
    const coinsEl = document.getElementById('top-bar-coins');
    const streakEl = document.getElementById('top-bar-streak');
    const soundBtn = document.getElementById('header-sound-btn');
    const greetingEl = document.getElementById('page-greeting');

    if (coinsEl) coinsEl.textContent = `${user.coins || 0} 🪙`;
    if (streakEl) streakEl.textContent = `${user.streak || 0} 🔥`;
    if (soundBtn) {
      soundBtn.textContent = user.soundEnabled ? '🔔' : '🔕';
    }
    if (greetingEl) {
      greetingEl.textContent = `Welcome back, ${scholarName}! Ready to grow together with ${pet.name || 'your companion'}?`;
    }
  }

  toggleSound() {
    this.store.state.user.soundEnabled = !this.store.state.user.soundEnabled;
    if (window.soundEngine) {
      window.soundEngine.setMute(!this.store.state.user.soundEnabled);
    }
    this.store.saveState();
    this.renderTopBar();
  }

  renderSidebarMiniPet() {
    const pet = this.store.state.pet;
    const container = document.getElementById('sidebar-mini-pet');
    if (!container) return;

    const expPercent = Math.min(100, Math.round(((pet.exp || 0) / (pet.maxExp || 150)) * 100));
    const speciesLabel = window.petManager ? window.petManager.speciesDisplayName : 'Companion';

    container.innerHTML = `
      <div class="mini-pet-avatar" style="border: 2px solid var(--os-window-dark); background: #181E34;">
        ${window.petManager.renderPetSVG(pet.species, pet.stage, pet.equippedHat, pet.equippedScarf)}
      </div>
      <div class="mini-pet-meta">
        <div class="pet-name">${pet.name}</div>
        <div class="pet-level-badge">${speciesLabel} • Lvl ${pet.level}</div>
        <div class="mini-pet-exp-bar">
          <div class="mini-pet-exp-fill" style="width: ${expPercent}%;"></div>
        </div>
      </div>
    `;
  }

  renderCurrentView() {
    const mainContainer = document.getElementById('view-container');
    if (!mainContainer) return;

    switch (this.currentView) {
      case 'home':
        mainContainer.innerHTML = this.getViewHome();
        this.initNightStars();
        this.updateRetroClock();
        break;
      case 'study-room':
        mainContainer.innerHTML = this.getViewStudyRoom();
        window.studyTimer.updateDisplay();
        break;
      case 'planner':
        mainContainer.innerHTML = this.getViewPlanner();
        break;
      case 'pet-evolution':
        mainContainer.innerHTML = this.getViewPetEvolution();
        break;
      case 'shop':
        mainContainer.innerHTML = this.getViewShop();
        break;
      case 'quests':
        mainContainer.innerHTML = this.getViewQuests();
        break;
      case 'future-me':
        mainContainer.innerHTML = this.getViewFutureMe();
        break;
      case 'statistics':
        mainContainer.innerHTML = this.getViewStatistics();
        break;
      case 'settings':
        mainContainer.innerHTML = this.getViewSettings();
        break;
      default:
        mainContainer.innerHTML = this.getViewHome();
    }
  }

  // --------------------------------------------------------------------------
  // VIEW: HOME / MY WORLD
  // --------------------------------------------------------------------------
  getViewHome() {
    const user = this.store.state.user;
    const pet = this.store.state.pet;
    const weather = window.soundEngine ? window.soundEngine.weatherLayer : 'rain';
    const music = window.soundEngine ? window.soundEngine.musicLayer : 'lofi';

    const upcomingTasks = (this.store.state.tasks || [])
      .filter(t => t.status !== 'completed')
      .slice(0, 3);

    return `
      <!-- RETRO 90s OS WINDOW FRAME -->
      <div class="retro-os-window">
        <!-- Title Bar -->
        <div class="retro-os-titlebar">
          <div class="retro-os-title-left">
            <span>🐾</span>
            <span>STUDYPET / studypet.exe</span>
          </div>
          <div class="retro-os-controls">
            <button class="retro-os-btn" onclick="window.app.toggleSanctuaryCollapse()" title="Minimize">_</button>
            <button class="retro-os-btn" onclick="window.studyTimer.toggleFocusLock()" title="Maximize">□</button>
            <button class="retro-os-btn" onclick="window.app.showCoffeeMiniGame()" title="Take a Coffee Break">☕</button>
          </div>
        </div>

        <!-- OS Sub-banner with Real-Time Sky Mode -->
        <div class="retro-os-subbanner">
          <span>Take a break.</span>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span style="font-size: 0.6rem; cursor: pointer;" onclick="window.app.cycleTimeOfDay()" title="Click to cycle Sky Lighting">
              SKY: ${this.timeOfDay.toUpperCase()} ☀️🌙
            </span>
            <span style="font-size: 0.6rem; opacity: 0.85;">${window.petManager.speciesDisplayName.toUpperCase()} • LVL ${pet.level} • ${pet.name.toUpperCase()}</span>
          </div>
        </div>

        <!-- Canvas Workspace: Left Paint Tools + Center Pixel Study Scene -->
        <div class="retro-canvas-workspace" id="retro-canvas-workspace">
          <!-- Left MS Paint-style Tool Palette -->
          <div class="retro-paint-toolbox">
            <div class="retro-tools-grid">
              <div class="retro-tool-btn active" title="Pointer" onclick="window.soundEngine.playClick()">↖</div>
              <div class="retro-tool-btn" title="Add Task" onclick="window.app.showAddTaskModal()">✏️</div>
              <div class="retro-tool-btn" title="Pet Shop" onclick="window.app.navigateTo('shop')">🪣</div>
              <div class="retro-tool-btn" title="Color Picker" onclick="window.app.navigateTo('pet-evolution')">🎨</div>
              <div class="retro-tool-btn" title="Statistics" onclick="window.app.navigateTo('statistics')">🔍</div>
              <div class="retro-tool-btn" title="Clean Sanctuary" onclick="window.petManager.cleanPet()">🫧</div>
              <div class="retro-tool-btn" title="Brew Coffee Mini-Game" onclick="window.app.showCoffeeMiniGame()">☕</div>
              <div class="retro-tool-btn" title="Notebook" onclick="window.app.navigateTo('future-me')">📓</div>
              <div class="retro-tool-btn" title="Play Toy" onclick="window.petManager.playWithPet()">🎾</div>
              <div class="retro-tool-btn" title="Focus Timer" onclick="window.app.navigateTo('study-room')">⏱️</div>
            </div>
            <div class="retro-tool-rainbow" title="Color Spectrum"></div>
            <div class="retro-brush-sizes">
              <div class="retro-brush-line"></div>
              <div class="retro-brush-line"></div>
              <div class="retro-brush-line"></div>
            </div>
          </div>

          <!-- Center Pixel Art Scene -->
          <div class="retro-pixel-scene">
            <!-- Dynamic Real-Time Sky Window with Fairytale Landscape Scenery -->
            <div class="pixel-night-window ${this.timeOfDay}" id="pixel-window-sky">
              ${this.renderWindowScenery()}

              <!-- Hanging Ivy/Vines -->
              <svg class="pixel-vines" viewBox="0 0 250 24" preserveAspectRatio="none">
                <path d="M0,0 Q30,18 60,6 Q90,22 130,8 Q170,24 210,6 Q235,16 250,2" fill="none" stroke="#2D5A3A" stroke-width="5"/>
                <circle cx="25" cy="12" r="5" fill="#4E8D5B"/>
                <circle cx="75" cy="14" r="6" fill="#4E8D5B"/>
                <circle cx="120" cy="16" r="5" fill="#4E8D5B"/>
                <circle cx="175" cy="18" r="6" fill="#4E8D5B"/>
                <circle cx="225" cy="12" r="5" fill="#4E8D5B"/>
              </svg>

              <!-- Celestial Body: Moon at night, Sun during day -->
              ${this.timeOfDay === 'day' ? '<div class="pixel-sun"></div>' : '<div class="pixel-moon"></div>'}

              <!-- Twinkling Pixel Stars (visible in night / sunset) -->
              <div id="pixel-stars-box" style="position: absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;"></div>

              <!-- Rain on Window Glass Container -->
              <div class="pixel-rain-container ${weather === 'rain' ? 'active' : ''}" id="pixel-rain-box">
                ${this.renderRainDrops()}
              </div>
            </div>

            <!-- Desk Surface -->
            <div class="pixel-desk-surface">
              <div class="pixel-rainbow-strip"></div>

              <!-- Potted Desk Succulent -->
              <div class="pixel-desk-plant" onclick="window.petManager.say('green leaves drink sunlight!\ndon\'t forget your water! 🌿')" title="Water plant">
                <svg width="48" height="62" viewBox="0 0 48 62">
                  <polygon points="8,32 40,32 34,60 14,60" fill="#6B5B7B" stroke="#000" stroke-width="2"/>
                  <path d="M24,32 C14,20 10,8 24,2 C38,8 34,20 24,32 Z" fill="#2E7D32" stroke="#000" stroke-width="2"/>
                  <path d="M24,32 C8,28 0,16 8,10 C16,4 20,18 24,32 Z" fill="#43A047" stroke="#000" stroke-width="2"/>
                  <path d="M24,32 C40,28 48,16 40,10 C32,4 28,18 24,32 Z" fill="#43A047" stroke="#000" stroke-width="2"/>
                </svg>
              </div>

              <!-- Pixel Mini Tamagotchi Kitty Friend -->
              <div class="pixel-mini-tamagotchi" onclick="window.petManager.petCreature()" title="Click to pet!">
                <svg width="34" height="26" viewBox="0 0 34 26">
                  <rect x="0" y="0" width="34" height="26" fill="#2D3A56" stroke="#000" stroke-width="2"/>
                  <circle cx="8" cy="8" r="1.5" fill="#FFF"/>
                  <circle cx="26" cy="18" r="1.5" fill="#FFF"/>
                  <rect x="10" y="8" width="16" height="12" fill="#FFF8EC"/>
                  <polygon points="10,8 14,4 14,8" fill="#F4C4B5"/>
                  <polygon points="26,8 22,4 22,8" fill="#F4C4B5"/>
                  <rect x="13" y="11" width="2" height="2" fill="#000"/>
                  <rect x="21" y="11" width="2" height="2" fill="#000"/>
                  <rect x="17" y="14" width="2" height="2" fill="#E57373"/>
                </svg>
              </div>

              <!-- Spiral Study Notebook -->
              <div class="pixel-desk-notebook" onclick="window.app.navigateTo('planner')" title="Open Academic Planner">
                <div style="padding: 6px 10px; color: #9CA3AF; font-size: 8px; font-family:'Press Start 2P';">
                  🌱 NOTES
                </div>
              </div>
              <div class="pixel-desk-pen"></div>

              <!-- Main Cute Pixel Cat Sitting on Desk with Coffee Mug -->
              <div class="pixel-cat-character-box" onclick="window.petManager.petCreature()" title="Click to pet or talk!">
                <div class="pixel-mug-steam">
                  <div class="steam-particle"></div>
                  <div class="steam-particle"></div>
                  <div class="steam-particle"></div>
                </div>

                <div class="pixel-speech-balloon" id="pet-speech-bubble">take breaks!
drink water
rest your eyes
:3c</div>

                <div id="pet-creature-wrapper" style="width: 155px; height: 155px;">
                  ${window.petManager.renderPetSVG()}
                </div>
              </div>

              <!-- CRT Computer Monitor with Interactive Sticky Note -->
              <div class="pixel-crt-monitor" onclick="window.app.showCrtMiniGame()" title="Click CRT to Play Pixel Minigame!">
                <div class="crt-sticky-note" onclick="event.stopPropagation(); window.app.showStickyNoteModal();" title="Sticky Note">📝</div>
                <div class="pixel-crt-screen">
                  <div class="crt-screen-scanline"></div>
                  <svg width="44" height="38" viewBox="0 0 44 38">
                    <polygon points="8,10 16,2 20,8 24,8 28,2 36,10 38,28 6,28" fill="#1E293B" stroke="#00FFAA" stroke-width="1.5"/>
                    <rect x="14" y="14" width="3" height="3" fill="#00FFAA"/>
                    <rect x="27" y="14" width="3" height="3" fill="#00FFAA"/>
                    <path d="M19,22 Q22,25 25,22" stroke="#00FFAA" stroke-width="1.5" fill="none"/>
                  </svg>
                </div>
              </div>

              <!-- Mechanical Keyboard with Clickable Keycaps & Mouse -->
              <div class="pixel-mechanical-keyboard" onclick="window.soundEngine.playMechanicalKey()" title="Click mechanical keys to clack!">
                ${Array(24).fill(0).map(() => `<div class="keycap-press"></div>`).join('')}
              </div>
              <div class="pixel-mouse" onclick="window.soundEngine.playMechanicalKey()"></div>
              <div class="pixel-mouse-cord"></div>
            </div>

            <!-- Bottom Left Pop-up RPG Menu: [ITEMS, SAVE, SYSTEM, END] -->
            <div class="retro-rpg-menu">
              <div class="retro-rpg-menu-item" onclick="window.app.navigateTo('shop')">
                <span>📝</span> ITEMS
              </div>
              <div class="retro-rpg-menu-item" onclick="window.settingsManager.exportDataFile()">
                <span>💾</span> SAVE
              </div>
              <div class="retro-rpg-menu-item" onclick="window.app.navigateTo('settings')">
                <span>🖥️</span> SYSTEM
              </div>
              <div class="retro-rpg-menu-item" onclick="window.app.showCoffeeMiniGame()">
                <span>☕</span> BREAK
              </div>
            </div>
          </div>
        </div>

        <!-- Retro Bottom Taskbar: Swatches, Eraser Count & Digital Timer -->
        <div class="retro-os-taskbar">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span title="Eraser count">🧹 0</span>
            <div class="retro-swatches-row">
              <div style="font-size: 10px; cursor: pointer;" onclick="window.petManager.say('smile! you are doing great! :3')">🙂</div>
              <div class="retro-color-chip" style="background:#FF6B6B;" onclick="window.app.changeAccentColor('#FF6B6B')"></div>
              <div class="retro-color-chip" style="background:#FFD93D;" onclick="window.app.changeAccentColor('#FFD93D')"></div>
              <div class="retro-color-chip" style="background:#6BCB77;" onclick="window.app.changeAccentColor('#6BCB77')"></div>
              <div class="retro-color-chip" style="background:#4D96FF;" onclick="window.app.changeAccentColor('#4D96FF')"></div>
              <div class="retro-color-chip" style="background:#9B51E0;" onclick="window.app.changeAccentColor('#9B51E0')"></div>
              <div class="retro-color-chip" style="background:#FFF;" onclick="window.app.changeAccentColor('#526B55')"></div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 14px;">
            <span style="font-size: 0.65rem; color: #333;">FOCUS: <strong>${window.studyTimer.mode.toUpperCase()}</strong></span>
            <div class="retro-digital-clock" id="retro-digital-clock">00:25:00</div>
          </div>
        </div>
      </div>

      <!-- DUAL-LAYER SOUNDTRACK & AUDIO SPECTRUM DECK -->
      <div class="retro-soundtrack-deck">
        <!-- Visual Equalizer & Cassette Tape Deck -->
        <div class="cassette-visual-deck">
          <div class="cassette-tape-box">
            <div class="cassette-reel ${music !== 'none' || weather !== 'none' ? 'spinning' : ''}"></div>
            <div>
              <div style="font-family:'Press Start 2P'; font-size:0.6rem; color:#FBBF24;">CASSETTE DECK</div>
              <div style="font-family:'VT323'; font-size:1.15rem; color:#FFF;" id="now-playing-label">
                ${music.toUpperCase()} + ${weather.toUpperCase()}
              </div>
            </div>
            <div class="cassette-reel ${music !== 'none' || weather !== 'none' ? 'spinning' : ''}"></div>
          </div>

          <!-- 8 Spectrum Equalizer Bars -->
          <div class="spectrum-bars-row" id="spectrum-bars">
            <div class="eq-bar" style="height: 10px;"></div>
            <div class="eq-bar" style="height: 16px;"></div>
            <div class="eq-bar" style="height: 22px;"></div>
            <div class="eq-bar" style="height: 14px;"></div>
            <div class="eq-bar" style="height: 26px;"></div>
            <div class="eq-bar" style="height: 18px;"></div>
            <div class="eq-bar" style="height: 12px;"></div>
            <div class="eq-bar" style="height: 8px;"></div>
          </div>

          <!-- Auto-Sync Checkbox -->
          <label style="display: flex; align-items: center; gap: 6px; font-family:'VT323'; font-size:1.1rem; color:#E5E7EB; cursor:pointer;">
            <input type="checkbox" ${window.soundEngine && window.soundEngine.autoSyncTimer ? 'checked' : ''} onchange="window.soundEngine.autoSyncTimer = this.checked;">
            Auto-Sync with Timer
          </label>
        </div>

        <!-- Layer 1: Weather Layer (Rain / Fire / None) -->
        <div style="margin-bottom: 10px;">
          <div style="font-family:'Press Start 2P'; font-size:0.62rem; color:#374151; margin-bottom: 6px;">
            🌧️ AMBIENT WEATHER LAYER:
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="soundtrack-btn ${weather === 'rain' ? 'active' : ''}" onclick="window.app.setWeatherLayer('rain')">
              🌧️ Rain on Glass
            </button>
            <button class="soundtrack-btn ${weather === 'fire' ? 'active' : ''}" onclick="window.app.setWeatherLayer('fire')">
              🔥 Cozy Campfire
            </button>
            <button class="soundtrack-btn ${weather === 'none' ? 'active' : ''}" onclick="window.app.setWeatherLayer('none')">
              ⛔ No Weather
            </button>
          </div>
        </div>

        <!-- Layer 2: Music & Noise Layer -->
        <div>
          <div style="font-family:'Press Start 2P'; font-size:0.62rem; color:#374151; margin-bottom: 6px;">
            🎧 MUSIC & FOCUS NOISE LAYER:
          </div>
          <div class="soundtrack-tracks-grid">
            <button class="soundtrack-btn ${music === 'lofi' ? 'active' : ''}" onclick="window.app.setMusicLayer('lofi')">
              🎧 Lo-Fi Beats
            </button>
            <button class="soundtrack-btn ${music === 'piano' ? 'active' : ''}" onclick="window.app.setMusicLayer('piano')">
              🎹 Piano Arpeggios
            </button>
            <button class="soundtrack-btn ${music === 'brown' ? 'active' : ''}" onclick="window.app.setMusicLayer('brown')">
              🟤 Brown Noise
            </button>
            <button class="soundtrack-btn ${music === 'pink' ? 'active' : ''}" onclick="window.app.setMusicLayer('pink')">
              🌸 Pink Noise
            </button>
            <button class="soundtrack-btn ${music === 'videogame' ? 'active' : ''}" onclick="window.app.setMusicLayer('videogame')">
              🎮 Retro Games OST
            </button>
            <button class="soundtrack-btn ${music === 'none' ? 'active' : ''}" onclick="window.app.setMusicLayer('none')">
              🔕 Mute Music
            </button>
          </div>
        </div>
      </div>

      <!-- DASHBOARD REST OF LAYOUT: STATS, GOALS & DEADLINES -->
      <div class="dashboard-grid" style="margin-top: 24px;">
        <div class="dashboard-left">
          <!-- QUICK ACTIONS STRIP -->
          <div class="card">
            <div class="card-header" style="margin-bottom: 14px;">
              <div class="card-title"><span class="card-title-icon">⚡</span> Quick Actions</div>
              <span style="font-size: 0.8rem; font-weight: 600; color: var(--color-muted-text);">${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
            <div class="quick-actions-bar">
              <div class="quick-action-card" onclick="window.app.navigateTo('study-room')">
                <span class="quick-action-icon">⏱️</span>
                <span class="quick-action-label">Start Study</span>
              </div>
              <div class="quick-action-card" onclick="window.app.showAddTaskModal()">
                <span class="quick-action-icon">📝</span>
                <span class="quick-action-label">Add Task</span>
              </div>
              <div class="quick-action-card" onclick="window.app.navigateTo('planner')">
                <span class="quick-action-icon">📅</span>
                <span class="quick-action-label">Planner</span>
              </div>
              <div class="quick-action-card" onclick="window.app.navigateTo('future-me')">
                <span class="quick-action-icon">💌</span>
                <span class="quick-action-label">Future Me</span>
              </div>
              <div class="quick-action-card" onclick="window.app.navigateTo('shop')">
                <span class="quick-action-icon">🛍️</span>
                <span class="quick-action-label">Pet Shop</span>
              </div>
            </div>
          </div>

          <!-- TODAY'S DAILY PROGRESS STRIP -->
          <div class="stats-summary-strip">
            <div class="stat-box">
              <div class="stat-icon-wrapper stat-icon-time">⏱️</div>
              <div class="stat-content">
                <div class="stat-val">${user.todayMinutes || 0}m</div>
                <div class="stat-lbl">Study Time Today</div>
              </div>
            </div>
            <div class="stat-box">
              <div class="stat-icon-wrapper stat-icon-tasks">🎯</div>
              <div class="stat-content">
                <div class="stat-val">${user.todayCompletedTasks || 0}</div>
                <div class="stat-lbl">Tasks Finished</div>
              </div>
            </div>
            <div class="stat-box">
              <div class="stat-icon-wrapper stat-icon-streak">🔥</div>
              <div class="stat-content">
                <div class="stat-val">${user.streak || 0} Days</div>
                <div class="stat-lbl">Active Streak</div>
              </div>
            </div>
            <div class="stat-box">
              <div class="stat-icon-wrapper stat-icon-exp">🪙</div>
              <div class="stat-content">
                <div class="stat-val">+${user.todayCoinsEarned || 0}</div>
                <div class="stat-lbl">Coins Earned Today</div>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-right">
          <!-- DAILY GOALS -->
          <div class="card">
            <div class="card-header">
              <div class="card-title"><span class="card-title-icon">🌱</span> Daily Goals</div>
              <span class="badge" style="background: var(--color-pastel-yellow-light); color: #B7791F;">Daily Target</span>
            </div>
            <div class="goals-list">
              <div class="goal-item ${user.todayMinutes >= 60 ? 'completed' : ''}">
                <div class="goal-info">
                  <div class="goal-checkbox">${user.todayMinutes >= 60 ? '✓' : ''}</div>
                  <div>
                    <div class="goal-title">Study for 60 Minutes</div>
                    <div style="font-size: 0.72rem; color: var(--color-muted-text);">${user.todayMinutes} / 60 mins</div>
                  </div>
                </div>
                <span class="goal-reward-badge">+30 EXP</span>
              </div>

              <div class="goal-item ${(user.todayCompletedTasks || 0) >= 2 ? 'completed' : ''}">
                <div class="goal-info">
                  <div class="goal-checkbox">${(user.todayCompletedTasks || 0) >= 2 ? '✓' : ''}</div>
                  <div>
                    <div class="goal-title">Complete 2 Assignments</div>
                    <div style="font-size: 0.72rem; color: var(--color-muted-text);">${user.todayCompletedTasks || 0} / 2 done</div>
                  </div>
                </div>
                <span class="goal-reward-badge">+20 🪙</span>
              </div>

              <div class="goal-item completed">
                <div class="goal-info">
                  <div class="goal-checkbox">✓</div>
                  <div>
                    <div class="goal-title">Maintain a Focus Session</div>
                    <div style="font-size: 0.72rem; color: var(--color-muted-text);">Accomplished today!</div>
                  </div>
                </div>
                <span class="goal-reward-badge">+25 EXP</span>
              </div>
            </div>
          </div>

          <!-- UPCOMING DEADLINES -->
          <div class="card">
            <div class="card-header">
              <div class="card-title"><span class="card-title-icon">⏳</span> Upcoming Deadlines</div>
              <button class="btn btn-outline btn-sm" onclick="window.app.navigateTo('planner')">View All</button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${upcomingTasks.map(t => `
                <div style="background: var(--color-warm-cream-alt); padding: 12px 14px; border-radius: var(--radius-sm); border-left: 4px solid ${t.priority === 'urgent' ? '#D98D72' : '#526B55'};">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; font-size: 0.88rem; color: var(--color-forest-dark);">${t.title}</span>
                    <span class="badge badge-${t.priority}" style="font-size: 0.65rem;">${t.priority}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 0.76rem; color: var(--color-muted-text);">
                    <span>${t.subject}</span>
                    <span style="font-family: var(--font-mono); font-weight: 700;">📅 ${t.deadline ? t.deadline.split('T')[0] : 'No date'}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // AUDIO CONTROLS & DUAL-LAYER HELPERS
  // --------------------------------------------------------------------------
  setWeatherLayer(type) {
    if (window.soundEngine) {
      window.soundEngine.setWeatherLayer(type);
    }
    const rainBox = document.getElementById('pixel-rain-box');
    if (rainBox) {
      rainBox.classList.toggle('active', type === 'rain');
    }
    this.renderCurrentView();
    this.showToast('Weather Layer', type === 'rain' ? 'Rain on Glass 🌧️' : type === 'fire' ? 'Campfire Hearth 🔥' : 'Weather Muted', 'exp');
  }

  setMusicLayer(track) {
    if (window.soundEngine) {
      window.soundEngine.setMusicLayer(track);
    }
    this.renderCurrentView();
    this.showToast('Music Track', track.toUpperCase(), 'coin');
  }

  startSpectrumVisualizer() {
    setInterval(() => {
      if (!window.soundEngine) return;
      const bands = window.soundEngine.getSpectrumData();
      const bars = document.querySelectorAll('.eq-bar');
      if (bars && bars.length > 0) {
        bars.forEach((bar, idx) => {
          const val = bands[idx] || 0.1;
          const h = Math.max(4, Math.round(val * 24));
          bar.style.height = `${h}px`;
        });
      }
    }, 100);
  }

  cycleTimeOfDay() {
    const cycle = { day: 'sunset', sunset: 'night', night: 'day' };
    this.timeOfDay = cycle[this.timeOfDay];
    this.updateSkyScene();
    this.showToast('Sky Lighting', `Window shifted to ${this.timeOfDay.toUpperCase()} 🌙☀️`, 'achievement');
  }

  renderWindowScenery() {
    const time = this.timeOfDay || 'day';

    let skyDef = '';
    let mountainBack = '';
    let mountainMid = '';
    let waterfallColor = '';
    let waterfallShimmer = '';
    let castleStone = '';
    let castleRoof = '';
    let castleWindowGlow = '';
    let lakeRipple = '';
    let treeBark = '';
    let blossomColor = '';
    let blossomCenter = '';
    let lanternBody = '';
    let lanternGlow = '';
    let celestialBody = '';

    if (time === 'day') {
      skyDef = `
        <linearGradient id="fairytale-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#4A90E2"/>
          <stop offset="45%" stop-color="#87CEEB"/>
          <stop offset="75%" stop-color="#FDE2E4"/>
          <stop offset="100%" stop-color="#FEF3C7"/>
        </linearGradient>
      `;
      mountainBack = '#93C5FD';
      mountainMid = '#60A5FA';
      waterfallColor = '#E0F2FE';
      waterfallShimmer = '#FFFFFF';
      castleStone = '#F1F5F9';
      castleRoof = '#6366F1';
      castleWindowGlow = '#FEF08A';
      lakeRipple = 'rgba(255, 255, 255, 0.6)';
      treeBark = '#451A03';
      blossomColor = '#F472B6';
      blossomCenter = '#FDE2E4';
      lanternBody = '#FEF3C7';
      lanternGlow = 'rgba(254, 240, 138, 0.5)';
      celestialBody = `
        <circle cx="210" cy="35" r="14" fill="#FDE047" opacity="0.9"/>
        <circle cx="210" cy="35" r="22" fill="#FEF08A" opacity="0.3"/>
      `;
    } else if (time === 'sunset') {
      skyDef = `
        <linearGradient id="fairytale-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3D1A45"/>
          <stop offset="35%" stop-color="#831843"/>
          <stop offset="65%" stop-color="#BE185D"/>
          <stop offset="85%" stop-color="#FB923C"/>
          <stop offset="100%" stop-color="#FDE047"/>
        </linearGradient>
      `;
      mountainBack = '#581C87';
      mountainMid = '#3B0764';
      waterfallColor = '#FBCFE8';
      waterfallShimmer = '#FFF';
      castleStone = '#4C1D95';
      castleRoof = '#9D174D';
      castleWindowGlow = '#FDE047';
      lakeRipple = 'rgba(253, 224, 71, 0.5)';
      treeBark = '#2A140E';
      blossomColor = '#FB7185';
      blossomCenter = '#FFE4E6';
      lanternBody = '#FDE047';
      lanternGlow = 'rgba(253, 224, 71, 0.8)';
      celestialBody = `
        <circle cx="210" cy="45" r="15" fill="#FB923C" opacity="0.95"/>
        <circle cx="210" cy="45" r="24" fill="#FDE047" opacity="0.35"/>
      `;
    } else { // night
      skyDef = `
        <linearGradient id="fairytale-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#060919"/>
          <stop offset="40%" stop-color="#0F172A"/>
          <stop offset="75%" stop-color="#1E1B4B"/>
          <stop offset="100%" stop-color="#312E81"/>
        </linearGradient>
      `;
      mountainBack = '#1E1B4B';
      mountainMid = '#0F172A';
      waterfallColor = '#67E8F9';
      waterfallShimmer = '#E0F2FE';
      castleStone = '#1E1B4B';
      castleRoof = '#312E81';
      castleWindowGlow = '#FDE047';
      lakeRipple = 'rgba(165, 243, 252, 0.45)';
      treeBark = '#1C0E07';
      blossomColor = '#C084FC';
      blossomCenter = '#F3E8FF';
      lanternBody = '#FDE047';
      lanternGlow = 'rgba(250, 204, 21, 0.85)';
      celestialBody = `
        <path d="M 215,25 A 12,12 0 1 0 215,45 A 9,9 0 1 1 215,25 Z" fill="#FEF08A"/>
        <circle cx="210" cy="35" r="18" fill="#FEF08A" opacity="0.15"/>
      `;
    }

    const meadowColor1 = time === 'night' ? '#064E3B' : (time === 'sunset' ? '#831843' : '#34D399');
    const meadowColor2 = time === 'night' ? '#022C22' : (time === 'sunset' ? '#500724' : '#10B981');
    const lakeColor = time === 'night' ? '#090D22' : (time === 'sunset' ? '#581C87' : '#0284C7');

    return `
      <div class="fairytale-scenery-container" style="position: absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1; overflow:hidden;">
        <svg viewBox="0 0 250 170" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            ${skyDef}
            <linearGradient id="waterfall-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${waterfallColor}" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="${waterfallColor}" stop-opacity="0.4"/>
            </linearGradient>
            <filter id="lantern-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <!-- Sky Background -->
          <rect width="250" height="170" fill="url(#fairytale-sky)"/>

          <!-- Celestial Body (Sun/Moon) -->
          ${celestialBody}

          <!-- Distant Fairytale Mountains (Back Layer) -->
          <path d="M-10,105 Q30,65 75,90 T160,75 T260,95 L260,170 L-10,170 Z" fill="${mountainBack}" opacity="0.6"/>

          <!-- Distant Fairytale Mountains (Mid Layer) -->
          <path d="M-10,115 Q40,82 85,102 T175,88 T260,110 L260,170 L-10,170 Z" fill="${mountainMid}" opacity="0.8"/>

          <!-- Cascading Fairytale Waterfall from mountain gap -->
          <path d="M72,98 L76,98 L78,138 L70,138 Z" fill="url(#waterfall-grad)"/>
          <path d="M73,100 L75,100 L76,136 L72,136 Z" fill="${waterfallShimmer}" opacity="0.7"/>
          <ellipse cx="74" cy="138" rx="8" ry="3" fill="${waterfallColor}" opacity="0.5"/>

          <!-- Second Waterfall -->
          <path d="M128,94 L131,94 L132,126 L127,126 Z" fill="url(#waterfall-grad)" opacity="0.8"/>
          <ellipse cx="129" cy="126" rx="5" ry="2" fill="${waterfallColor}" opacity="0.4"/>

          <!-- Fairytale Castle atop Mountain Ridge -->
          <g id="fairytale-castle" transform="translate(142, 60)">
            <rect x="10" y="20" width="22" height="22" fill="${castleStone}"/>
            <rect x="6" y="14" width="7" height="28" fill="${castleStone}"/>
            <polygon points="6,14 9.5,4 13,14" fill="${castleRoof}"/>
            <rect x="29" y="16" width="7" height="26" fill="${castleStone}"/>
            <polygon points="29,16 32.5,7 36,16" fill="${castleRoof}"/>
            <polygon points="17,20 21,8 25,20" fill="${castleRoof}"/>
            <line x1="21" y1="8" x2="21" y2="4" stroke="#FDE047" stroke-width="0.8"/>
            <polygon points="9.5,4 9.5,1 13,2.5" fill="#F43F5E"/>
            <polygon points="32.5,7 32.5,4 36,5.5" fill="#F43F5E"/>
            <rect x="18" y="24" width="3" height="4" rx="1.5" fill="${castleWindowGlow}" filter="${time !== 'day' ? 'url(#lantern-glow-filter)' : ''}"/>
            <rect x="23" y="24" width="3" height="4" rx="1.5" fill="${castleWindowGlow}" filter="${time !== 'day' ? 'url(#lantern-glow-filter)' : ''}"/>
            <rect x="8" y="20" width="3" height="4" rx="1" fill="${castleWindowGlow}"/>
            <rect x="31" y="22" width="3" height="4" rx="1" fill="${castleWindowGlow}"/>
          </g>

          <!-- Dreamy Pastel Fantasy Meadow / Rolling Banks -->
          <path d="M-10,132 Q35,122 80,136 T180,126 T260,134 L260,170 L-10,170 Z" fill="${meadowColor1}"/>
          <path d="M-10,140 Q45,130 95,142 T190,134 T260,144 L260,170 L-10,170 Z" fill="${meadowColor2}"/>

          <!-- Wild Meadow Flowers -->
          <circle cx="28" cy="136" r="1.5" fill="#F472B6"/>
          <circle cx="48" cy="138" r="1.5" fill="#FDE047"/>
          <circle cx="95" cy="144" r="1.5" fill="#FFFFFF"/>
          <circle cx="160" cy="134" r="1.5" fill="#F472B6"/>
          <circle cx="185" cy="137" r="1.5" fill="#FDE047"/>
          <circle cx="215" cy="140" r="1.5" fill="#A78BFA"/>

          <!-- Reflective Lake / Stream in Foreground -->
          <path d="M-10,145 C40,142 80,148 130,144 C180,140 220,146 260,143 L260,170 L-10,170 Z" fill="${lakeColor}"/>
          
          <!-- Lake Water Ripples & Castle Reflection -->
          <ellipse cx="165" cy="150" rx="14" ry="1.5" fill="${lakeRipple}"/>
          <ellipse cx="160" cy="156" rx="20" ry="1.2" fill="${lakeRipple}"/>
          <ellipse cx="75" cy="148" rx="12" ry="1.5" fill="${waterfallShimmer}" opacity="0.6"/>
          <ellipse cx="76" cy="154" rx="16" ry="1.2" fill="${waterfallShimmer}" opacity="0.4"/>
          <ellipse cx="110" cy="158" rx="25" ry="1" fill="${lakeRipple}"/>
          <ellipse cx="220" cy="152" rx="18" ry="1.2" fill="${lakeRipple}"/>

          <!-- Left Flowering Tree Branches Framing Scene -->
          <path d="M-5,10 Q25,25 45,15 Q65,6 80,18" stroke="${treeBark}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
          <path d="M25,22 Q35,36 50,38" stroke="${treeBark}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <path d="M45,15 Q55,26 70,24" stroke="${treeBark}" stroke-width="2" fill="none" stroke-linecap="round"/>

          <!-- Right Blossom Branches Framing Scene -->
          <path d="M255,14 Q225,28 200,16 Q180,8 165,22" stroke="${treeBark}" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M220,24 Q210,38 190,36" stroke="${treeBark}" stroke-width="2.2" fill="none" stroke-linecap="round"/>

          <!-- Lush Cherry / Enchanted Blossoms (Left) -->
          <circle cx="20" cy="16" r="4.5" fill="${blossomColor}"/>
          <circle cx="20" cy="16" r="1.5" fill="${blossomCenter}"/>
          <circle cx="38" cy="18" r="5" fill="${blossomColor}"/>
          <circle cx="38" cy="18" r="2" fill="${blossomCenter}"/>
          <circle cx="52" cy="13" r="4" fill="${blossomColor}"/>
          <circle cx="68" cy="14" r="5.5" fill="${blossomColor}"/>
          <circle cx="68" cy="14" r="2" fill="${blossomCenter}"/>
          <circle cx="80" cy="18" r="4" fill="${blossomColor}"/>
          <circle cx="50" cy="38" r="4.5" fill="${blossomColor}"/>
          <circle cx="36" cy="32" r="3.5" fill="${blossomColor}"/>

          <!-- Lush Blossoms (Right) -->
          <circle cx="235" cy="18" r="5" fill="${blossomColor}"/>
          <circle cx="215" cy="20" r="4.5" fill="${blossomColor}"/>
          <circle cx="215" cy="20" r="1.5" fill="${blossomCenter}"/>
          <circle cx="198" cy="14" r="5" fill="${blossomColor}"/>
          <circle cx="178" cy="16" r="4" fill="${blossomColor}"/>
          <circle cx="165" cy="22" r="4.5" fill="${blossomColor}"/>
          <circle cx="190" cy="36" r="4" fill="${blossomColor}"/>

          <!-- Drifting Petals in the Breeze -->
          <ellipse cx="60" cy="48" rx="2.5" ry="1.2" transform="rotate(25 60 48)" fill="${blossomColor}" opacity="0.85"/>
          <ellipse cx="98" cy="62" rx="2" ry="1" transform="rotate(-15 98 62)" fill="${blossomColor}" opacity="0.7"/>
          <ellipse cx="140" cy="50" rx="2.5" ry="1.2" transform="rotate(40 140 50)" fill="${blossomColor}" opacity="0.75"/>
          <ellipse cx="180" cy="70" rx="2" ry="1" transform="rotate(10 180 70)" fill="${blossomColor}" opacity="0.8"/>

          <!-- Warm Hanging Paper Lanterns with Glowing Halo -->
          <!-- Lantern 1 (Left Branch) -->
          <line x1="50" y1="38" x2="50" y2="48" stroke="#1F2937" stroke-width="0.8"/>
          <circle cx="50" cy="53" r="12" fill="${lanternGlow}" filter="url(#lantern-glow-filter)" opacity="0.6"/>
          <rect x="47" y="47" width="6" height="2" fill="#78350F"/>
          <rect x="46" y="49" width="8" height="9" rx="2" fill="${lanternBody}" stroke="#B45309" stroke-width="0.7"/>
          <line x1="50" y1="49" x2="50" y2="58" stroke="#D97706" stroke-width="0.6"/>
          <rect x="47" y="58" width="6" height="1.5" fill="#78350F"/>
          <line x1="50" y1="59.5" x2="50" y2="63" stroke="#B45309" stroke-width="0.8"/>

          <!-- Lantern 2 (Right Branch) -->
          <line x1="190" y1="36" x2="190" y2="45" stroke="#1F2937" stroke-width="0.8"/>
          <circle cx="190" cy="50" r="12" fill="${lanternGlow}" filter="url(#lantern-glow-filter)" opacity="0.6"/>
          <rect x="187" y="44" width="6" height="2" fill="#78350F"/>
          <rect x="186" y="46" width="8" height="9" rx="2" fill="${lanternBody}" stroke="#B45309" stroke-width="0.7"/>
          <line x1="190" y1="46" x2="190" y2="55" stroke="#D97706" stroke-width="0.6"/>
          <rect x="187" y="55" width="6" height="1.5" fill="#78350F"/>
          <line x1="190" y1="56.5" x2="190" y2="60" stroke="#B45309" stroke-width="0.8"/>
        </svg>
      </div>
    `;
  }

  changeAccentColor(colorHex) {
    document.documentElement.style.setProperty('--color-forest', colorHex);
    this.showToast('Palette Swatch', `Applied color ${colorHex}`, 'default');
  }

  toggleSanctuaryCollapse() {
    const ws = document.getElementById('retro-canvas-workspace');
    if (ws) {
      ws.style.display = ws.style.display === 'none' ? 'flex' : 'none';
    }
  }

  renderRainDrops() {
    let drops = '';
    for (let i = 0; i < 24; i++) {
      const left = Math.random() * 100;
      const delay = Math.random() * 1.5;
      const dur = 0.5 + Math.random() * 0.5;
      drops += `<div class="rain-drop" style="left: ${left}%; animation-delay: ${delay}s; animation-duration: ${dur}s;"></div>`;
    }
    return drops;
  }

  initNightStars() {
    const box = document.getElementById('pixel-stars-box');
    if (!box) return;

    box.innerHTML = '';
    if (this.timeOfDay === 'day') return; // Stars only at sunset / night

    const starCoords = [
      { x: 15, y: 35 }, { x: 35, y: 15 }, { x: 65, y: 40 },
      { x: 95, y: 20 }, { x: 120, y: 50 }, { x: 150, y: 25 },
      { x: 180, y: 45 }, { x: 45, y: 80 }, { x: 140, y: 85 }
    ];

    starCoords.forEach((coord, i) => {
      const s = document.createElement('div');
      s.className = 'pixel-star';
      s.textContent = '✦';
      s.style.left = `${coord.x}px`;
      s.style.top = `${coord.y}px`;
      s.style.animationDelay = `${(i * 0.3).toFixed(1)}s`;
      box.appendChild(s);
    });
  }

  updateRetroClock() {
    const el = document.getElementById('retro-digital-clock');
    if (!el) return;

    if (window.studyTimer && window.studyTimer.state === 'running') {
      const total = window.studyTimer.remainingSeconds;
      const hrs = String(Math.floor(total / 3600)).padStart(2, '0');
      const mins = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
      const secs = String(total % 60).padStart(2, '0');
      el.textContent = `${hrs}:${mins}:${secs}`;
    } else {
      const d = new Date();
      const hrs = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      const secs = String(d.getSeconds()).padStart(2, '0');
      el.textContent = `${hrs}:${mins}:${secs}`;
    }
  }

  // --------------------------------------------------------------------------
  // INTERACTIVE DESK CLUTTER MODALS
  // --------------------------------------------------------------------------
  showStickyNoteModal() {
    const modal = document.getElementById('sticky-note-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-card" style="background:#FFF9C4; border: 2px solid #FBC02D; max-width: 420px; font-family:'VT323', monospace;">
        <div class="modal-header">
          <h3 style="font-size: 1.5rem; color:#856404;">📝 Study Desk Sticky Note</h3>
          <button class="modal-close-btn" onclick="document.getElementById('sticky-note-modal').classList.remove('active');">✕</button>
        </div>
        <div style="font-size: 1.3rem; line-height: 1.5; color: #533f03;">
          "Take breaks! Drink water, rest your eyes, and trust the process. You are doing great today! :3c"
        </div>
        <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
          <button class="btn btn-gold btn-sm" onclick="document.getElementById('sticky-note-modal').classList.remove('active'); window.petManager.petCreature();">
            Pet Companion ❤️
          </button>
        </div>
      </div>
    `;
    modal.classList.add('active');
  }

  showCrtMiniGame() {
    const modal = document.getElementById('crt-terminal-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-card" style="background:#0F172A; border: 3px solid #00FFAA; color:#00FFAA; max-width: 480px; text-align:center; font-family:'Press Start 2P', monospace;">
        <div class="modal-header" style="border-bottom: 1px solid #00FFAA;">
          <h3 style="color:#00FFAA; font-size: 0.9rem;">CRT TERMINAL OS 0.9</h3>
          <button class="modal-close-btn" style="color:#00FFAA;" onclick="document.getElementById('crt-terminal-modal').classList.remove('active');">✕</button>
        </div>
        <div style="padding: 20px 0;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🐱 💻 ✨</div>
          <p style="font-size: 0.72rem; line-height: 1.8;">
            SYSTEM STATUS: ALL GOOD<br>
            COZY LEVEL: 100%<br>
            FOCUS FACTOR: OPTIMAL<br>
            "Clack away and conquer your goals!"
          </p>
          <div style="margin-top: 20px;">
            <button class="btn btn-primary btn-sm" onclick="window.soundEngine.playCoin(); document.getElementById('crt-terminal-modal').classList.remove('active'); window.studyTimer.startTimer(); window.app.navigateTo('study-room');">
              RUN FOCUS_TIMER.EXE ▶️
            </button>
          </div>
        </div>
      </div>
    `;
    modal.classList.add('active');
  }

  // --------------------------------------------------------------------------
  // BREAK-TIME COFFEE BREWING MINI-GAME
  // --------------------------------------------------------------------------
  showCoffeeMiniGame() {
    const modal = document.getElementById('coffee-mini-game-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-card coffee-game-card" style="max-width: 500px;">
        <div class="modal-header">
          <h3 style="font-size: 1.4rem;">☕ Break Time: Cozy Drink Brewer</h3>
          <button class="modal-close-btn" onclick="document.getElementById('coffee-mini-game-modal').classList.remove('active');">✕</button>
        </div>

        <p style="font-size: 1.15rem; color: var(--color-muted-text);">
          Brew a comforting drink for yourself and your companion during study breaks!
        </p>

        <div class="coffee-cup-preview" id="brewed-cup">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <rect x="18" y="25" width="44" height="42" rx="6" fill="#6D28D9" stroke="#000" stroke-width="2.5"/>
            <path d="M62 35 C74 35 74 55 62 55" stroke="#4C1D95" stroke-width="4.5" fill="none"/>
            <ellipse cx="40" cy="27" rx="20" ry="7" fill="#3B1C10"/>
            <circle cx="40" cy="27" r="4" fill="#F4E8C1"/>
          </svg>
        </div>

        <div class="coffee-choice-grid">
          <button class="coffee-choice-btn selected" onclick="window.app.selectDrink('matcha', this)">
            <span style="font-size: 1.5rem;">🍵</span>
            <span>Matcha Latte</span>
          </button>
          <button class="coffee-choice-btn" onclick="window.app.selectDrink('coffee', this)">
            <span style="font-size: 1.5rem;">☕</span>
            <span>Dark Roast</span>
          </button>
          <button class="coffee-choice-btn" onclick="window.app.selectDrink('boba', this)">
            <span style="font-size: 1.5rem;">🧋</span>
            <span>Warm Chai</span>
          </button>
        </div>

        <button class="btn btn-gold btn-lg" style="width: 100%; margin-top: 10px;" onclick="window.app.finishBrewDrink()">
          Pour Drink & Share with Companion (+15 🪙, +20 Joy) ✨
        </button>
      </div>
    `;
    modal.classList.add('active');
  }

  selectDrink(type, btn) {
    document.querySelectorAll('.coffee-choice-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    if (window.soundEngine) window.soundEngine.playMechanicalKey();

    const cup = document.getElementById('brewed-cup');
    if (!cup) return;

    if (type === 'matcha') {
      cup.innerHTML = `
        <svg width="80" height="80" viewBox="0 0 80 80">
          <rect x="18" y="25" width="44" height="42" rx="6" fill="#4E8D5B" stroke="#000" stroke-width="2.5"/>
          <path d="M62 35 C74 35 74 55 62 55" stroke="#2D5A3A" stroke-width="4.5" fill="none"/>
          <ellipse cx="40" cy="27" rx="20" ry="7" fill="#68D391"/>
          <circle cx="40" cy="27" r="4" fill="#F4E8C1"/>
        </svg>
      `;
    } else if (type === 'coffee') {
      cup.innerHTML = `
        <svg width="80" height="80" viewBox="0 0 80 80">
          <rect x="18" y="25" width="44" height="42" rx="6" fill="#6D28D9" stroke="#000" stroke-width="2.5"/>
          <path d="M62 35 C74 35 74 55 62 55" stroke="#4C1D95" stroke-width="4.5" fill="none"/>
          <ellipse cx="40" cy="27" rx="20" ry="7" fill="#3B1C10"/>
          <circle cx="40" cy="27" r="4" fill="#F4E8C1"/>
        </svg>
      `;
    } else {
      cup.innerHTML = `
        <svg width="80" height="80" viewBox="0 0 80 80">
          <rect x="18" y="25" width="44" height="42" rx="6" fill="#D98D72" stroke="#000" stroke-width="2.5"/>
          <path d="M62 35 C74 35 74 55 62 55" stroke="#A9563E" stroke-width="4.5" fill="none"/>
          <ellipse cx="40" cy="27" rx="20" ry="7" fill="#E8B4A2"/>
          <circle cx="40" cy="27" r="4" fill="#FFF"/>
        </svg>
      `;
    }
  }

  finishBrewDrink() {
    if (window.soundEngine) {
      window.soundEngine.playCoffeePour();
      setTimeout(() => window.soundEngine.playSparkle(), 400);
    }

    this.store.addRewards(20, 15, 'Brewed Cozy Drink During Study Break');
    this.store.state.pet.happiness = 100;
    this.store.state.pet.hunger = Math.max(0, (this.store.state.pet.hunger || 20) - 20);
    this.store.saveState();

    document.getElementById('add-task-modal').classList.remove('active');
    this.renderAll();
    window.petManager.say('sip... sip... delicious!\nmy stamina is fully restored! :3c');
    this.showToast('Cozy Drink Brewed! ☕', '+15 Study Coins, Happiness Restored!', 'coin');
  }

  // --------------------------------------------------------------------------
  // VIEW: STUDY ROOM
  // --------------------------------------------------------------------------
  getViewStudyRoom() {
    const subjects = ['Computer Science', 'Mathematics', 'Psychology', 'History', 'Literature', 'General Study'];
    const currentSubj = window.studyTimer.selectedSubject || 'Computer Science';
    const weather = window.soundEngine ? window.soundEngine.weatherLayer : 'rain';
    const music = window.soundEngine ? window.soundEngine.musicLayer : 'lofi';

    return `
      <div class="study-room-layout">
        <div class="card timer-main-card">
          <div class="timer-mode-tabs">
            <div class="timer-tab ${window.studyTimer.mode === 'pomodoro' ? 'active' : ''}" data-mode="pomodoro" onclick="window.studyTimer.setMode('pomodoro')">Pomodoro (25m)</div>
            <div class="timer-tab ${window.studyTimer.mode === 'extended' ? 'active' : ''}" data-mode="extended" onclick="window.studyTimer.setMode('extended')">Extended (50m)</div>
            <div class="timer-tab ${window.studyTimer.mode === 'custom' ? 'active' : ''}" data-mode="custom" onclick="window.studyTimer.setMode('custom')">Custom</div>
            <div class="timer-tab ${window.studyTimer.mode === 'stopwatch' ? 'active' : ''}" data-mode="stopwatch" onclick="window.studyTimer.setMode('stopwatch')">Stopwatch</div>
          </div>

          <div class="studying-pet-desk">
            <div style="position: relative; width: 110px; height: 110px;">
              ${window.petManager.renderPetSVG()}
            </div>
          </div>

          <div class="timer-display-stage">
            <svg class="timer-svg" viewBox="0 0 300 300">
              <circle class="timer-track-circle" cx="150" cy="150" r="130"></circle>
              <circle class="timer-progress-circle" id="timer-progress-circle" cx="150" cy="150" r="130"></circle>
            </svg>
            <div class="timer-center-content">
              <div class="timer-digits" id="timer-digits">25:00</div>
              <div class="timer-session-label">${window.studyTimer.mode.toUpperCase()} FOCUS</div>
              <div id="interruption-alert" class="interruption-alert-badge" style="display: none;"></div>
            </div>
          </div>

          <div class="timer-controls-row">
            <button class="timer-btn-sec" onclick="window.studyTimer.resetTimer()" title="Reset Timer">🔄</button>
            <button class="timer-btn-main" id="timer-toggle-btn" onclick="window.studyTimer.togglePlayPause()" title="Play / Pause">▶️</button>
            <button class="timer-btn-sec" onclick="window.studyTimer.toggleFocusLock()" title="Focus Lock Zen Mode">🔲</button>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div class="card">
            <div class="card-header">
              <div class="card-title"><span class="card-title-icon">📚</span> Session Focus</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div>
                <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Subject</label>
                <select style="width: 100%; margin-top: 4px;" onchange="window.studyTimer.selectedSubject = this.value;">
                  ${subjects.map(s => `<option value="${s}" ${s === currentSubj ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
              </div>

              ${window.studyTimer.mode === 'custom' ? `
                <div>
                  <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Custom Minutes (1 - 180)</label>
                  <input type="number" id="custom-min-input" min="1" max="180" value="30" style="width: 100%; margin-top: 4px;" onchange="window.studyTimer.setMode('custom');">
                </div>
              ` : ''}

              <div style="background: var(--color-warm-cream-alt); padding: 12px; border-radius: var(--radius-sm); border: 1.5px solid var(--color-border-subtle);">
                <div style="font-weight: 700; font-size: 0.82rem; color: var(--color-forest);">Completion Rewards:</div>
                <div style="font-size: 0.85rem; color: var(--color-dark-text); margin-top: 3px;">
                  ✨ <strong>${window.studyTimer.mode === 'pomodoro' ? '25 EXP + 10 Coins' : window.studyTimer.mode === 'extended' ? '50 EXP + 22 Coins' : 'Pro-rated EXP & Coins'}</strong>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title"><span class="card-title-icon">🎧</span> Study Audio Controls</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div>
                <div style="font-size:0.75rem; font-weight:700; color:var(--color-muted-text); margin-bottom:4px;">WEATHER:</div>
                <div style="display: flex; gap: 6px;">
                  <button class="soundtrack-btn ${weather === 'rain' ? 'active' : ''}" onclick="window.app.setWeatherLayer('rain')">🌧️ Rain</button>
                  <button class="soundtrack-btn ${weather === 'fire' ? 'active' : ''}" onclick="window.app.setWeatherLayer('fire')">🔥 Fire</button>
                  <button class="soundtrack-btn ${weather === 'none' ? 'active' : ''}" onclick="window.app.setWeatherLayer('none')">⛔ None</button>
                </div>
              </div>
              <div>
                <div style="font-size:0.75rem; font-weight:700; color:var(--color-muted-text); margin-bottom:4px;">MUSIC / NOISE:</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                  <button class="soundtrack-btn ${music === 'lofi' ? 'active' : ''}" onclick="window.app.setMusicLayer('lofi')">🎧 Lo-Fi</button>
                  <button class="soundtrack-btn ${music === 'piano' ? 'active' : ''}" onclick="window.app.setMusicLayer('piano')">🎹 Piano</button>
                  <button class="soundtrack-btn ${music === 'brown' ? 'active' : ''}" onclick="window.app.setMusicLayer('brown')">🟤 Brown</button>
                  <button class="soundtrack-btn ${music === 'videogame' ? 'active' : ''}" onclick="window.app.setMusicLayer('videogame')">🎮 8-Bit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // ACADEMIC PLANNER, PET EVOLUTION, SHOP, QUESTS, FUTURE ME, STATS, SETTINGS
  // --------------------------------------------------------------------------
  getViewPlanner() {
    const tasks = window.taskManager.getFilteredTasks();
    return `
      <div>
        <div class="planner-top-actions">
          <div class="planner-filters-row">
            <div class="search-input-wrap">
              <span class="search-icon">🔍</span>
              <input type="text" placeholder="Search tasks, subjects..." value="${window.taskManager.searchQuery}" oninput="window.taskManager.searchQuery = this.value; window.app.renderCurrentView();">
            </div>
            <select onchange="window.taskManager.statusFilter = this.value; window.app.renderCurrentView();">
              <option value="all">All Statuses</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
            <select onchange="window.taskManager.priorityFilter = this.value; window.app.renderCurrentView();">
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select onchange="window.taskManager.sortBy = this.value; window.app.renderCurrentView();">
              <option value="deadline">Sort by Deadline</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title (A-Z)</option>
            </select>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-outline" onclick="window.academicCalendar.showAddEventModal()">Calendar 📅</button>
            <button class="btn btn-primary" onclick="window.app.showAddTaskModal()">+ Add New Task 📝</button>
          </div>
        </div>

        <div class="tasks-grid">
          ${tasks.map(t => {
      const completedSubtasks = (t.subtasks || []).filter(s => s.completed).length;
      const totalSubtasks = (t.subtasks || []).length;
      const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : (t.status === 'completed' ? 100 : 0);
      return `
              <div class="task-item-card">
                <div>
                  <div class="task-header">
                    <span class="task-subject-tag">${t.subject}</span>
                    <span class="badge badge-${t.priority}">${t.priority}</span>
                  </div>
                  <div class="task-title">${t.title}</div>
                  <div class="task-desc">${t.description || 'No additional notes provided.'}</div>
                </div>
                ${totalSubtasks > 0 ? `
                  <div>
                    <div class="task-subtasks-summary">
                      <span>Subtasks: ${completedSubtasks}/${totalSubtasks}</span>
                      <div class="subtasks-mini-bar"><div class="subtasks-mini-fill" style="width: ${progress}%;"></div></div>
                      <span>${progress}%</span>
                    </div>
                  </div>
                ` : ''}
                <div class="task-footer">
                  <div class="task-deadline"><span>📅 ${t.deadline ? t.deadline.split('T')[0] : 'No deadline'}</span></div>
                  <div class="task-actions">
                    <button class="btn btn-outline btn-sm" onclick="window.taskManager.showTaskTimeline('${t.id}')">⏳</button>
                    <button class="btn btn-secondary btn-sm" onclick="window.taskManager.studyTask('${t.id}')">⏱️</button>
                    <button class="btn ${t.status === 'completed' ? 'btn-outline' : 'btn-primary'} btn-sm" onclick="window.taskManager.toggleTaskComplete('${t.id}')">
                      ${t.status === 'completed' ? '✓ Done' : 'Complete'}
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="window.taskManager.deleteTask('${t.id}')">🗑️</button>
                  </div>
                </div>
              </div>
            `;
    }).join('')}
        </div>
      </div>
    `;
  }

  getViewPetEvolution() {
    const pet = this.store.state.pet;
    const species = PET_SPECIES_DATA[pet.species] || PET_SPECIES_DATA.aconite_cat;
    const stages = ['egg', 'baby', 'young', 'teen', 'adult', 'mythical'];
    const currentStageInfo = species.stages[pet.stage] || { name: pet.stage, desc: '' };
    const refImgPath = `assets/${pet.species === 'florapup' ? 'florapup' : pet.species === 'lunafox' ? 'lunapurr' : 'aconite-kitty'}-evolution-reference.jpg`;

    return `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div class="card" style="display: flex; align-items: center; justify-content: space-between; gap: 30px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 280px;">
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
              <span class="badge" style="background: var(--color-pastel-yellow-light); color: #B7791F;">
                ${species.element}
              </span>
              <span class="badge" style="background: var(--color-sage-soft); color: var(--color-forest);">
                ${species.affinity}
              </span>
            </div>
            <h2 style="font-size: 2rem; color: var(--color-forest-dark);">${pet.name} <span style="font-size: 1.2rem; font-weight: 600; color: #8B5CF6;">(${species.name})</span></h2>
            <div style="font-weight: 700; color: #6D28D9; font-size: 1rem; margin-top: 4px;">
              Current Form: ${currentStageInfo.name}
            </div>
            <p style="color: var(--color-muted-text); margin-top: 6px; font-size: 0.95rem; line-height: 1.5;">
              ${currentStageInfo.desc}
            </p>
            <div style="display: flex; gap: 20px; margin-top: 18px;">
              <div>
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-muted-text);">GROWTH STAGE</div>
                <div style="font-size: 1.2rem; font-weight: 800; color: var(--color-forest);">${pet.stage.toUpperCase()}</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-muted-text);">SCHOLAR LEVEL</div>
                <div style="font-size: 1.2rem; font-weight: 800; color: var(--color-terracotta);">Level ${pet.level}</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-muted-text);">EXPERIENCE</div>
                <div style="font-size: 1.2rem; font-weight: 800; color: #B7791F;">${pet.exp} / ${pet.maxExp} EXP</div>
              </div>
            </div>
            <div style="width: 100%; height: 10px; background: var(--color-border-subtle); border-radius: 99px; margin-top: 14px; overflow: hidden;">
              <div style="height: 100%; background: linear-gradient(90deg, #F3D58A, #D98D72); border-radius: 99px; width: ${Math.min(100, Math.round((pet.exp / pet.maxExp) * 100))}%;"></div>
            </div>
            <div style="margin-top: 16px; display: flex; gap: 10px; flex-wrap: wrap;">
              <button class="btn btn-outline btn-sm" onclick="window.app.showEvolutionReferenceModal('${refImgPath}', '${species.name}')">
                View Official Reference Sheet 📜
              </button>
              <button class="btn btn-primary btn-sm" onclick="window.app.showRenameModal()">
                Rename Companion ✏️
              </button>
            </div>
          </div>
          <div style="width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; background: #141B33; border-radius: var(--radius-xl); border: 2px dashed var(--color-border); padding: 10px;">
            ${window.petManager.renderPetSVG()}
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title"><span class="card-title-icon">🌳</span> Evolutionary Journey (${species.name})</div>
            <span style="font-size: 0.8rem; color: var(--color-muted-text);">Unlock Levels: Lvl 1, 2, 3, 6, 10, 15</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px;">
            ${stages.map((st, index) => {
      const isPastOrCurrent = stages.indexOf(pet.stage) >= index;
      const isCurrent = pet.stage === st;
      const stInfo = species.stages[st] || { name: st, desc: '' };
      const reqLvl = PET_EVOLUTION_LEVELS.find(l => l.stage === st)?.level || 1;

      return `
                <div style="background: ${isCurrent ? 'var(--color-sage-soft)' : 'var(--color-white)'}; border: 2px solid ${isCurrent ? 'var(--color-forest)' : 'var(--color-border)'}; border-radius: var(--radius-md); padding: 14px; text-align: center; opacity: ${isPastOrCurrent ? '1' : '0.45'}; transition: all 0.2s;">
                  <div style="font-size: 0.72rem; font-weight: 800; color: ${isCurrent ? 'var(--color-forest-dark)' : 'var(--color-muted-text)'}; margin-bottom: 6px;">
                    LEVEL ${reqLvl} ${isCurrent ? '• CURRENT' : ''}
                  </div>
                  <div style="width: 80px; height: 80px; margin: 0 auto 8px auto;">
                    ${window.petManager.renderPetSVG(pet.species, st)}
                  </div>
                  <div style="font-weight: 700; font-size: 0.88rem; color: var(--color-forest-dark); line-height: 1.2;">${stInfo.name}</div>
                  <div style="font-size: 0.72rem; color: var(--color-muted-text); text-transform: uppercase; margin-top: 2px;">Stage ${index + 1}: ${st}</div>
                  <div style="font-size: 0.72rem; color: var(--color-dark-text); margin-top: 6px; line-height: 1.3;">
                    ${stInfo.desc}
                  </div>
                </div>
              `;
    }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  getViewShop() {
    return `
      <div>
        <div class="shop-tabs">
          <button class="shop-tab-btn ${window.shopManager.currentCategory === 'all' ? 'active' : ''}" onclick="window.shopManager.currentCategory = 'all'; window.app.renderCurrentView();">All Items</button>
          <button class="shop-tab-btn ${window.shopManager.currentCategory === 'food' ? 'active' : ''}" onclick="window.shopManager.currentCategory = 'food'; window.app.renderCurrentView();">Pet Food 🍓</button>
          <button class="shop-tab-btn ${window.shopManager.currentCategory === 'hat' ? 'active' : ''}" onclick="window.shopManager.currentCategory = 'hat'; window.app.renderCurrentView();">Hats & Caps 🎓</button>
          <button class="shop-tab-btn ${window.shopManager.currentCategory === 'clothing' ? 'active' : ''}" onclick="window.shopManager.currentCategory = 'clothing'; window.app.renderCurrentView();">Clothing 🧣</button>
          <button class="shop-tab-btn ${window.shopManager.currentCategory === 'furniture' ? 'active' : ''}" onclick="window.shopManager.currentCategory = 'furniture'; window.app.renderCurrentView();">Decor & Furniture 🪴</button>
          <button class="shop-tab-btn ${window.shopManager.currentCategory === 'background' ? 'active' : ''}" onclick="window.shopManager.currentCategory = 'background'; window.app.renderCurrentView();">Room Themes 🌌</button>
        </div>
        <div class="shop-grid">${window.shopManager.renderShopGrid()}</div>
      </div>
    `;
  }

  getViewQuests() {
    return `
      <div style="display: flex; flex-direction: column; gap: 28px;">
        <div class="card">
          <div class="card-header"><div class="card-title"><span class="card-title-icon">📜</span> Daily Study Quests</div></div>
          <div class="quests-list">${window.questManager.renderDailyQuests()}</div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><span class="card-title-icon">🌟</span> Weekly Academic Milestones</div></div>
          <div class="quests-list">${window.questManager.renderWeeklyQuests()}</div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><span class="card-title-icon">🏆</span> Achievements Gallery</div></div>
          <div class="achievements-gallery">${window.questManager.renderAchievementsGallery()}</div>
        </div>
      </div>
    `;
  }

  getViewFutureMe() {
    return `
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
          <div>
            <h3 style="font-size: 1.4rem; color: var(--color-forest-dark);">Letters to Future Self 💌</h3>
            <p style="color: var(--color-muted-text); font-size: 0.88rem;">A digital time capsule for your thoughts, hopes, and academic goals. Sealed with wax!</p>
          </div>
          <button class="btn btn-terracotta" onclick="window.futureMeManager.showComposeModal()">+ Write a New Letter ✉️</button>
        </div>
        <div class="future-me-grid">${window.futureMeManager.renderLettersGrid()}</div>
      </div>
    `;
  }

  getViewStatistics() {
    const totalHours = window.statsManager.getTotalHours();
    const sessionsCount = window.statsManager.sessions.length;
    return `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div class="stats-summary-strip">
          <div class="stat-box">
            <div class="stat-icon-wrapper stat-icon-time">⌛</div>
            <div class="stat-content"><div class="stat-val">${totalHours}h</div><div class="stat-lbl">Total Study Hours</div></div>
          </div>
          <div class="stat-box">
            <div class="stat-icon-wrapper stat-icon-tasks">🎯</div>
            <div class="stat-content"><div class="stat-val">${sessionsCount}</div><div class="stat-lbl">Focus Sessions Completed</div></div>
          </div>
          <div class="stat-box">
            <div class="stat-icon-wrapper stat-icon-streak">🔥</div>
            <div class="stat-content"><div class="stat-val">${this.store.state.user.bestStreak || 7} Days</div><div class="stat-lbl">Best Study Streak</div></div>
          </div>
          <div class="stat-box">
            <div class="stat-icon-wrapper stat-icon-exp">✨</div>
            <div class="stat-content"><div class="stat-val">${this.store.state.user.totalExp || 0}</div><div class="stat-lbl">Total Accumulated EXP</div></div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <div class="card">
            <div class="card-header"><div class="card-title"><span class="card-title-icon">📊</span> 7-Day Study Minutes</div></div>
            ${window.statsManager.renderActivityChartSVG()}
          </div>
          <div class="card">
            <div class="card-header"><div class="card-title"><span class="card-title-icon">🟩</span> Consistency Heatmap</div></div>
            ${window.statsManager.renderHeatmapGrid()}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><span class="card-title-icon">📜</span> Focus Session History</div></div>
          ${window.statsManager.renderSessionLogs()}
        </div>
      </div>
    `;
  }

  getViewSettings() {
    const user = this.store.state.user;
    return `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 780px;">
        <div class="card">
          <div class="card-header"><div class="card-title"><span class="card-title-icon">👤</span> Scholar Profile</div></div>
          <form onsubmit="event.preventDefault(); window.app.handleSaveProfile(this);">
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                <div><label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Scholar Username</label><input type="text" name="name" value="${user.name}" required style="width: 100%; margin-top: 4px;"></div>
                <div><label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Title / Year</label><input type="text" name="title" value="${user.title || 'Undergraduate Scholar'}" style="width: 100%; margin-top: 4px;"></div>
              </div>
              <div><label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Primary Study Goal</label><input type="text" name="studyGoal" value="${user.studyGoal}" style="width: 100%; margin-top: 4px;"></div>
              <button type="submit" class="btn btn-primary" style="margin-top: 8px;">Save Profile Changes</button>
            </div>
          </form>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><span class="card-title-icon">💾</span> Data Management</div></div>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="btn btn-outline" onclick="window.settingsManager.exportDataFile()">Export Backup JSON 📥</button>
            <label class="btn btn-outline" style="cursor: pointer;">Import Backup JSON 📤<input type="file" accept=".json" style="display: none;" onchange="window.settingsManager.importDataFile(this.files[0])"></label>
            <button class="btn btn-outline" style="color: #C53030; border-color: #FEB2B2;" onclick="window.settingsManager.confirmResetDemo()">Reset to Demo Data ⚠️</button>
          </div>
        </div>
      </div>
    `;
  }

  handleSaveProfile(form) {
    const formData = new FormData(form);
    window.settingsManager.updateProfile({
      name: formData.get('name'),
      title: formData.get('title'),
      studyGoal: formData.get('studyGoal')
    });
  }

  showAddTaskModal() {
    const modal = document.getElementById('add-task-modal');
    if (!modal) return;
    const defaultDate = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 16);

    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3>Create Academic Task 📝</h3>
          <button class="modal-close-btn" onclick="document.getElementById('add-task-modal').classList.remove('active');">✕</button>
        </div>
        <form onsubmit="event.preventDefault(); window.app.handleCreateTaskSubmit(this);">
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Task Title</label>
              <input type="text" name="title" required placeholder="e.g. Cognitive Psychology Term Paper" style="width: 100%; margin-top: 4px;">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div><label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Subject</label><input type="text" name="subject" required value="Computer Science" style="width: 100%; margin-top: 4px;"></div>
              <div>
                <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Category</label>
                <select name="category" style="width: 100%; margin-top: 4px;">
                  <option value="Assignment">Assignment</option><option value="Exam">Exam Prep</option><option value="Reading">Reading</option><option value="Project">Project</option>
                </select>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div><label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Deadline</label><input type="datetime-local" name="deadline" required value="${defaultDate}" style="width: 100%; margin-top: 4px;"></div>
              <div>
                <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Priority</label>
                <select name="priority" style="width: 100%; margin-top: 4px;">
                  <option value="urgent">Urgent 🔴</option><option value="high">High 🟠</option><option value="medium" selected>Medium 🟡</option><option value="low">Low 🟢</option>
                </select>
              </div>
            </div>
            <div>
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Subtasks (Comma separated)</label>
              <input type="text" name="subtasksRaw" placeholder="e.g. Read outline, Write first draft, Review citations" style="width: 100%; margin-top: 4px;">
            </div>
            <button type="submit" class="btn btn-primary" style="margin-top: 8px;">Add to Planner 🌿</button>
          </div>
        </form>
      </div>
    `;
    modal.classList.add('active');
  }

  handleCreateTaskSubmit(form) {
    const formData = new FormData(form);
    const rawSubs = formData.get('subtasksRaw') || '';
    const subtasks = rawSubs.split(',').map(s => s.trim()).filter(Boolean).map((st, i) => ({ id: 'st_' + Date.now() + '_' + i, title: st, completed: false }));

    window.taskManager.createTask({
      title: formData.get('title'),
      subject: formData.get('subject'),
      category: formData.get('category'),
      deadline: formData.get('deadline'),
      priority: formData.get('priority'),
      subtasks: subtasks
    });
    document.getElementById('add-task-modal').classList.remove('active');
  }

  quickFeed() {
    const berry = (this.store.state.inventory || []).find(i => i.id === 'berry_tart' && i.count > 0);
    window.petManager.feedPet(berry || { name: 'Warm Mug of Coffee' });
  }

  showToast(title, desc, type = 'default') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    let icon = '🌿';
    if (type === 'coin') icon = '🪙';
    else if (type === 'exp') icon = '✨';
    else if (type === 'achievement') icon = '🏆';

    toast.innerHTML = `<div class="toast-icon">${icon}</div><div class="toast-body"><div class="toast-title">${title}</div><div class="toast-desc">${desc}</div></div>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

  selectCompanionCard(speciesId, cardEl) {
    if (window.soundEngine) window.soundEngine.playClick();

    // Deselect all cards
    document.querySelectorAll('.companion-choice-card').forEach(c => {
      c.classList.remove('selected');
      c.setAttribute('aria-checked', 'false');
    });

    // Select this card
    const card = cardEl || document.querySelector(`.companion-choice-card[data-species="${speciesId}"]`);
    if (card) {
      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    }

    // Auto-suggest default pet nickname if current name is default or empty
    const petNameInput = document.getElementById('onboarding-pet-name');
    if (petNameInput) {
      const defaultNames = {
        'aconite_cat': 'Aconite',
        'florapup': 'Sprout',
        'lunafox': 'Luna'
      };
      const prevDefaults = ['Aconite', 'Sprout', 'Luna', 'Kitten', 'Companion', ''];
      if (prevDefaults.includes(petNameInput.value.trim())) {
        petNameInput.value = defaultNames[speciesId] || 'Companion';
      }
    }

    // Enable submit button
    const submitBtn = document.getElementById('onboarding-submit-btn');
    if (submitBtn) {
      submitBtn.removeAttribute('disabled');
      submitBtn.classList.remove('btn-disabled');
    }
  }

  showOnboardingWizard() {
    const modal = document.getElementById('onboarding-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 760px; width: 95%; max-height: 92vh; overflow-y: auto; text-align: center; padding: 24px;">
        <div style="font-size: 2.4rem; margin-bottom: 4px;">🌱 🐱 📜</div>
        <h2 style="font-size: 1.6rem; color: var(--color-forest-dark); margin: 0 0 6px 0;">Welcome to STUDYPET OS</h2>
        <p style="color: var(--color-muted-text); font-size: 0.9rem; margin: 0 0 20px 0;">
          <em>"Take a break. Grow Your Pet, Grow Yourself."</em><br>
          Select your faithful study companion and start your academic journey.
        </p>

        <form onsubmit="event.preventDefault(); window.app.handleOnboardingFinish(this);">
          <!-- Scholar & Pet Information -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; text-align: left; margin-bottom: 20px; background: var(--color-warm-cream); padding: 14px 18px; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
            <div>
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Scholar / User Name:</label>
              <input type="text" name="userName" id="onboarding-scholar-name" required value="${this.store.state.user.name || 'Scholar'}" placeholder="e.g. Scholar Lin" style="width: 100%; margin-top: 4px; padding: 8px 10px; border-radius: var(--radius-sm); border: 2px solid var(--color-border);">
            </div>
            <div>
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Companion Nickname:</label>
              <input type="text" name="petName" id="onboarding-pet-name" required value="Aconite" placeholder="e.g. Aconite" style="width: 100%; margin-top: 4px; padding: 8px 10px; border-radius: var(--radius-sm); border: 2px solid var(--color-border);">
            </div>
          </div>

          <!-- Exactly Three Companion Choice Cards -->
          <div style="text-align: left; margin-bottom: 8px;">
            <label style="font-weight: 800; font-size: 0.95rem; color: var(--color-forest-dark);">Choose Your Companion:</label>
            <span style="font-size: 0.78rem; color: var(--color-muted-text); margin-left: 8px;">Click any card to select</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; text-align: left;" role="radiogroup" aria-label="Companion Choices">
            <!-- 1. Aconite Kitty -->
            <div class="companion-choice-card selected" data-species="aconite_cat" tabindex="0" role="radio" aria-checked="true" onclick="window.app.selectCompanionCard('aconite_cat', this)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); window.app.selectCompanionCard('aconite_cat', this);}">
              <span class="companion-card-badge">Selected ✓</span>
              <!-- Egg illustration centred at top -->
              <div style="width: 100%; display: flex; justify-content: center; align-items: center; height: 110px; background: linear-gradient(135deg,#F3E8FF,#EDE9FE); border-radius: 8px; margin-bottom: 10px;">
                <div style="width: 90px; height: 90px;">
                  ${window.petRenderer ? window.petRenderer.renderEgg('aconite_cat') : '🥚'}
                </div>
              </div>
              <div class="companion-card-header">
                <span class="companion-card-emoji">🐱</span>
                <div>
                  <div class="companion-card-title">Aconite Kitty</div>
                  <div class="companion-card-subtitle">Tea, Mug & Chill Lo-Fi</div>
                </div>
              </div>
              <p class="companion-card-desc">
                A cozy cat companion — tea, books, lo-fi sessions, and calm focus.
              </p>
              <div class="companion-card-meta" style="margin-top: auto; padding-top: 8px; border-top: 1px dashed var(--color-border-subtle);">
                <span class="meta-tag">Mindful Study</span>
                <span class="meta-tag">6 Stages</span>
              </div>
              <input type="radio" name="species" value="aconite_cat" checked style="display: none;">
            </div>

            <!-- 2. Florapup -->
            <div class="companion-choice-card" data-species="florapup" tabindex="0" role="radio" aria-checked="false" onclick="window.app.selectCompanionCard('florapup', this)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); window.app.selectCompanionCard('florapup', this);}">
              <span class="companion-card-badge">Selected ✓</span>
              <!-- Egg illustration centred at top -->
              <div style="width: 100%; display: flex; justify-content: center; align-items: center; height: 110px; background: linear-gradient(135deg,#DCFCE7,#D1FAE5); border-radius: 8px; margin-bottom: 10px;">
                <div style="width: 90px; height: 90px;">
                  ${window.petRenderer ? window.petRenderer.renderEgg('florapup') : '🥚'}
                </div>
              </div>
              <div class="companion-card-header">
                <span class="companion-card-emoji">🌱</span>
                <div>
                  <div class="companion-card-title">Florapup</div>
                  <div class="companion-card-subtitle">Nature & Botany</div>
                </div>
              </div>
              <p class="companion-card-desc">
                A botanical pup companion — clover, blossoms, moss, and forest magic.
              </p>
              <div class="companion-card-meta" style="margin-top: auto; padding-top: 8px; border-top: 1px dashed var(--color-border-subtle);">
                <span class="meta-tag">Botany & Growth</span>
                <span class="meta-tag">6 Stages</span>
              </div>
              <input type="radio" name="species" value="florapup" style="display: none;">
            </div>

            <!-- 3. Lunapurr -->
            <div class="companion-choice-card" data-species="lunafox" tabindex="0" role="radio" aria-checked="false" onclick="window.app.selectCompanionCard('lunafox', this)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); window.app.selectCompanionCard('lunafox', this);}">
              <span class="companion-card-badge">Selected ✓</span>
              <!-- Egg illustration centred at top -->
              <div style="width: 100%; display: flex; justify-content: center; align-items: center; height: 110px; background: linear-gradient(135deg,#EDE9FE,#DDD6FE); border-radius: 8px; margin-bottom: 10px;">
                <div style="width: 90px; height: 90px;">
                  ${window.petRenderer ? window.petRenderer.renderEgg('lunafox') : '🥚'}
                </div>
              </div>
              <div class="companion-card-header">
                <span class="companion-card-emoji">🌙</span>
                <div>
                  <div class="companion-card-title">Lunapurr</div>
                  <div class="companion-card-subtitle">Celestial — Moonlight & Dreams</div>
                </div>
              </div>
              <p class="companion-card-desc">
                A celestial cat companion — moonlight, dreams, night skies, and serene magic.
              </p>
              <div class="companion-card-meta" style="margin-top: auto; padding-top: 8px; border-top: 1px dashed var(--color-border-subtle);">
                <span class="meta-tag">Dreams & Stars</span>
                <span class="meta-tag">6 Stages</span>
              </div>
              <input type="radio" name="species" value="lunafox" style="display: none;">
            </div>
          </div>

          <button type="submit" id="onboarding-submit-btn" class="btn btn-gold btn-lg" style="width: 100%; font-size: 1.05rem; padding: 14px;">
            Confirm Companion & Enter My World ☕✨
          </button>
        </form>
      </div>
    `;
    modal.classList.add('active');
  }

  handleOnboardingFinish(form) {
    const formData = new FormData(form);
    const userName = (formData.get('userName') || 'Scholar').trim();
    const petName = (formData.get('petName') || 'Aconite').trim();
    const species = formData.get('species') || 'aconite_cat';

    // Store scholar and user name
    this.store.state.user.name = userName;
    this.store.state.user.scholarName = userName;
    this.store.state.user.isOnboarded = true;

    // Initialize pet data as Level 1 Egg of the chosen companion
    this.store.state.pet.species = species;
    this.store.state.pet.name = petName;
    this.store.state.pet.stage = 'egg';
    this.store.state.pet.level = 1;
    this.store.state.pet.exp = 0;
    this.store.state.pet.maxExp = 100;
    this.store.state.pet.isHatched = false;
    this.store.state.pet.equipped = { head: null, neck: null, body: null, back: null, special: null };
    this.store.saveState();

    if (window.soundEngine) window.soundEngine.playLevelUp();
    document.getElementById('onboarding-modal').classList.remove('active');
    this.renderAll();
    this.showToast('Welcome to STUDYPET OS! 🌿', `Ready to study with ${petName}!`, 'achievement');
  }

  showRenameModal() {
    const modal = document.getElementById('rename-pet-modal');
    if (!modal) return;
    const currentName = this.store.state.pet.name || 'Companion';

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 440px;">
        <div class="modal-header">
          <h3>Rename Companion 🏷️</h3>
          <button class="modal-close-btn" onclick="document.getElementById('rename-pet-modal').classList.remove('active');">✕</button>
        </div>
        <form onsubmit="event.preventDefault(); window.app.handleRenameSubmit(this);">
          <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 10px;">
            <p style="font-size: 0.85rem; color: var(--color-muted-text); margin: 0;">
              Give your companion a special nickname to accompany you through every study session!
            </p>
            <div>
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Companion Nickname:</label>
              <input type="text" name="newName" required value="${currentName}" maxlength="24" style="width: 100%; margin-top: 6px; padding: 8px 12px; border-radius: var(--radius-sm); border: 2px solid var(--color-border);">
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px;">
              <button type="button" class="btn btn-outline" onclick="document.getElementById('rename-pet-modal').classList.remove('active');">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Name 💾</button>
            </div>
          </div>
        </form>
      </div>
    `;
    modal.classList.add('active');
  }

  handleRenameSubmit(form) {
    const formData = new FormData(form);
    const newName = formData.get('newName');
    if (newName && newName.trim()) {
      window.petManager.renamePet(newName.trim());
      document.getElementById('rename-pet-modal').classList.remove('active');
      this.renderAll();
      this.showToast('Companion Renamed ✨', `Your companion is now named ${newName.trim()}!`, 'achievement');
    }
  }

  showEvolutionReferenceModal(imageSrc, speciesName) {
    let modal = document.getElementById('reference-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'reference-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 820px; width: 92%; max-height: 90vh; overflow-y: auto;">
        <div class="modal-header">
          <h3>${speciesName} — Evolution Reference Sheet 📜</h3>
          <button class="modal-close-btn" onclick="document.getElementById('reference-modal').classList.remove('active');">✕</button>
        </div>
        <div style="text-align: center; margin-top: 12px;">
          <img src="${imageSrc}" alt="${speciesName} Reference Sheet" style="max-width: 100%; height: auto; border-radius: var(--radius-md); border: 2px solid var(--color-border); box-shadow: 0 4px 16px rgba(0,0,0,0.2);">
          <div style="margin-top: 14px; font-size: 0.85rem; color: var(--color-muted-text); text-align: left; background: var(--color-warm-cream); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
            <strong>Evolution Milestones:</strong> Egg (Lvl 1) ➔ Baby (Lvl 2) ➔ Young (Lvl 3) ➔ Teen (Lvl 6) ➔ Adult (Lvl 10) ➔ Mythical (Lvl 15).
          </div>
        </div>
      </div>
    `;
    modal.classList.add('active');
  }
}

// Global Application Instance
window.addEventListener('DOMContentLoaded', () => {
  window.app = new StudyPetApp();
});

// Export for Node.js testing
if (typeof module !== 'undefined') {
  module.exports = { StudyPetApp };
}

