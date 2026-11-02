/**
 * STUDYPET â€” Master Application Controller & Router
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
            this.timeOfDay = this.calculateTimeOfDay();
            this.updateRetroClock();
        }, 1000);

        // Audio Spectrum Visualizer Loop
        this.startSpectrumVisualizer();
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
        const coinsEl = document.getElementById('top-bar-coins');
        const streakEl = document.getElementById('top-bar-streak');
        const soundBtn = document.getElementById('header-sound-btn');

        if (coinsEl) coinsEl.textContent = `${user.coins || 0} ðŸª™`;
        if (streakEl) streakEl.textContent = `${user.streak || 0} 🔥`;
        if (soundBtn) {
            soundBtn.textContent = user.soundEnabled ? 'ðŸ””' : 'ðŸ”•';
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

        container.innerHTML = `
      <div class="mini-pet-avatar" style="border: 2px solid var(--os-window-dark); background: #181E34;">
        ${window.petManager.renderPetSVG(pet.species, pet.stage, pet.equippedHat, pet.equippedScarf)}
      </div>
      <div class="mini-pet-meta">
        <div class="pet-name">${pet.name}</div>
        <div class="pet-level-badge">Lvl ${pet.level} • ${pet.stage.toUpperCase()}</div>
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
            <span>aconite / studypet.exe</span>
          </div>
          <div class="retro-os-controls">
            <button class="retro-os-btn" onclick="window.app.toggleSanctuaryCollapse()" title="Minimize">_</button>
            <button class="retro-os-btn" onclick="window.studyTimer.toggleFocusLock()" title="Maximize">â–¡</button>
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
            <span style="font-size: 0.6rem; opacity: 0.85;">LVL ${pet.level} • ${pet.name.toUpperCase()}</span>
          </div>
        </div>

        <!-- Canvas Workspace: Left Paint Tools + Center Pixel Study Scene -->
        <div class="retro-canvas-workspace" id="retro-canvas-workspace">
          <!-- Left MS Paint-style Tool Palette -->
          <div class="retro-paint-toolbox">
            <div class="retro-tools-grid">
              <div class="retro-tool-btn active" title="Pointer" onclick="window.soundEngine.playClick()">â†–</div>
              <div class="retro-tool-btn" title="Add Task" onclick="window.app.showAddTaskModal()">âœï¸</div>
              <div class="retro-tool-btn" title="Pet Shop" onclick="window.app.navigateTo('shop')">ðŸª£</div>
              <div class="retro-tool-btn" title="Color Picker" onclick="window.app.navigateTo('pet-evolution')">ðŸŽ¨</div>
              <div class="retro-tool-btn" title="Statistics" onclick="window.app.navigateTo('statistics')">ðŸ”</div>
              <div class="retro-tool-btn" title="Clean Sanctuary" onclick="window.petManager.cleanPet()">ðŸ«§</div>
              <div class="retro-tool-btn" title="Brew Coffee Mini-Game" onclick="window.app.showCoffeeMiniGame()">☕</div>
              <div class="retro-tool-btn" title="Notebook" onclick="window.app.navigateTo('future-me')">ðŸ““</div>
              <div class="retro-tool-btn" title="Play Toy" onclick="window.petManager.playWithPet()">ðŸŽ¾</div>
              <div class="retro-tool-btn" title="Focus Timer" onclick="window.app.navigateTo('study-room')">â±ï¸</div>
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
            <!-- Dynamic Real-Time Sky Window (Day / Sunset / Night) -->
            <div class="pixel-night-window ${this.timeOfDay}" id="pixel-window-sky">
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
              <div class="pixel-desk-plant" onclick="window.petManager.say('green leaves drink sunlight!\ndon\'t forget your water! ðŸŒ¿')" title="Water plant">
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
                <span>–¥ï¸</span> SYSTEM
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
              <div style="font-size: 10px; cursor: pointer;" onclick="window.petManager.say('smile! you are doing great! :3')">ðŸ™‚</div>
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
            ðŸŒ§ï¸ AMBIENT WEATHER LAYER:
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="soundtrack-btn ${weather === 'rain' ? 'active' : ''}" onclick="window.app.setWeatherLayer('rain')">
              ðŸŒ§ï¸ Rain on Glass
            </button>
            <button class="soundtrack-btn ${weather === 'fire' ? 'active' : ''}" onclick="window.app.setWeatherLayer('fire')">
              🔥 Cozy Campfire
            </button>
            <button class="soundtrack-btn ${weather === 'none' ? 'active' : ''}" onclick="window.app.setWeatherLayer('none')">
              â›” No Weather
            </button>
          </div>
        </div>

        <!-- Layer 2: Music & Noise Layer -->
        <div>
          <div style="font-family:'Press Start 2P'; font-size:0.62rem; color:#374151; margin-bottom: 6px;">
            ðŸŽ§ MUSIC & FOCUS NOISE LAYER:
          </div>
          <div class="soundtrack-tracks-grid">
            <button class="soundtrack-btn ${music === 'lofi' ? 'active' : ''}" onclick="window.app.setMusicLayer('lofi')">
              ðŸŽ§ Lo-Fi Beats
            </button>
            <button class="soundtrack-btn ${music === 'piano' ? 'active' : ''}" onclick="window.app.setMusicLayer('piano')">
              ðŸŽ¹ Piano Arpeggios
            </button>
            <button class="soundtrack-btn ${music === 'brown' ? 'active' : ''}" onclick="window.app.setMusicLayer('brown')">
              ðŸŸ¤ Brown Noise
            </button>
            <button class="soundtrack-btn ${music === 'pink' ? 'active' : ''}" onclick="window.app.setMusicLayer('pink')">
              ðŸŒ¸ Pink Noise
            </button>
            <button class="soundtrack-btn ${music === 'videogame' ? 'active' : ''}" onclick="window.app.setMusicLayer('videogame')">
              ðŸŽ® Retro Games OST
            </button>
            <button class="soundtrack-btn ${music === 'none' ? 'active' : ''}" onclick="window.app.setMusicLayer('none')">
              ðŸ”• Mute Music
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
              <div class="card-title"><span class="card-title-icon">âš¡</span> Quick Actions</div>
              <span style="font-size: 0.8rem; font-weight: 600; color: var(--color-muted-text);">${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
            <div class="quick-actions-bar">
              <div class="quick-action-card" onclick="window.app.navigateTo('study-room')">
                <span class="quick-action-icon">â±ï¸</span>
                <span class="quick-action-label">Start Study</span>
              </div>
              <div class="quick-action-card" onclick="window.app.showAddTaskModal()">
                <span class="quick-action-icon">📝</span>
                <span class="quick-action-label">Add Task</span>
              </div>
              <div class="quick-action-card" onclick="window.app.navigateTo('planner')">
                <span class="quick-action-icon">ðŸ“…</span>
                <span class="quick-action-label">Planner</span>
              </div>
              <div class="quick-action-card" onclick="window.app.navigateTo('future-me')">
                <span class="quick-action-icon">ðŸ’Œ</span>
                <span class="quick-action-label">Future Me</span>
              </div>
              <div class="quick-action-card" onclick="window.app.navigateTo('shop')">
                <span class="quick-action-icon">ðŸ›ï¸</span>
                <span class="quick-action-label">Pet Shop</span>
              </div>
            </div>
          </div>

          <!-- TODAY'S DAILY PROGRESS STRIP -->
          <div class="stats-summary-strip">
            <div class="stat-box">
              <div class="stat-icon-wrapper stat-icon-time">â±ï¸</div>
              <div class="stat-content">
                <div class="stat-val">${user.todayMinutes || 0}m</div>
                <div class="stat-lbl">Study Time Today</div>
              </div>
            </div>
            <div class="stat-box">
              <div class="stat-icon-wrapper stat-icon-tasks">ðŸŽ¯</div>
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
              <div class="stat-icon-wrapper stat-icon-exp">ðŸª™</div>
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
                <span class="goal-reward-badge">+20 ðŸª™</span>
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
              <div class="card-title"><span class="card-title-icon">â³</span> Upcoming Deadlines</div>
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
                    <span style="font-family: var(--font-mono); font-weight: 700;">ðŸ“… ${t.deadline ? t.deadline.split('T')[0] : 'No date'}</span>
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
        this.showToast('Weather Layer', type === 'rain' ? 'Rain on Glass ðŸŒ§ï¸' : type === 'fire' ? 'Campfire Hearth 🔥' : 'Weather Muted', 'exp');
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
        this.renderCurrentView();
        this.showToast('Sky Lighting', `Window shifted to ${this.timeOfDay.toUpperCase()} ðŸŒ™â˜€ï¸`, 'achievement');
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
            s.textContent = 'âœ¦';
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
            Pet Companion â¤ï¸
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
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🐱 ðŸ’» ✨</div>
          <p style="font-size: 0.72rem; line-height: 1.8;">
            SYSTEM STATUS: ALL GOOD<br>
            COZY LEVEL: 100%<br>
            FOCUS FACTOR: OPTIMAL<br>
            "Clack away and conquer your goals!"
          </p>
          <div style="margin-top: 20px;">
            <button class="btn btn-primary btn-sm" onclick="window.soundEngine.playCoin(); document.getElementById('crt-terminal-modal').classList.remove('active'); window.studyTimer.startTimer(); window.app.navigateTo('study-room');">
              RUN FOCUS_TIMER.EXE â–¶ï¸
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
            <span style="font-size: 1.5rem;">ðŸµ</span>
            <span>Matcha Latte</span>
          </button>
          <button class="coffee-choice-btn" onclick="window.app.selectDrink('coffee', this)">
            <span style="font-size: 1.5rem;">☕</span>
            <span>Dark Roast</span>
          </button>
          <button class="coffee-choice-btn" onclick="window.app.selectDrink('boba', this)">
            <span style="font-size: 1.5rem;">ðŸ§‹</span>
            <span>Warm Chai</span>
          </button>
        </div>

        <button class="btn btn-gold btn-lg" style="width: 100%; margin-top: 10px;" onclick="window.app.finishBrewDrink()">
          Pour Drink & Share with Companion (+15 ðŸª™, +20 Joy) ✨
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
            <button class="timer-btn-sec" onclick="window.studyTimer.resetTimer()" title="Reset Timer">ðŸ”„</button>
            <button class="timer-btn-main" id="timer-toggle-btn" onclick="window.studyTimer.togglePlayPause()" title="Play / Pause">â–¶ï¸</button>
            <button class="timer-btn-sec" onclick="window.studyTimer.toggleFocusLock()" title="Focus Lock Zen Mode">ðŸ”²</button>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div class="card">
            <div class="card-header">
              <div class="card-title"><span class="card-title-icon">ðŸ“š</span> Session Focus</div>
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
              <div class="card-title"><span class="card-title-icon">ðŸŽ§</span> Study Audio Controls</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div>
                <div style="font-size:0.75rem; font-weight:700; color:var(--color-muted-text); margin-bottom:4px;">WEATHER:</div>
                <div style="display: flex; gap: 6px;">
                  <button class="soundtrack-btn ${weather === 'rain' ? 'active' : ''}" onclick="window.app.setWeatherLayer('rain')">ðŸŒ§ï¸ Rain</button>
                  <button class="soundtrack-btn ${weather === 'fire' ? 'active' : ''}" onclick="window.app.setWeatherLayer('fire')">🔥 Fire</button>
                  <button class="soundtrack-btn ${weather === 'none' ? 'active' : ''}" onclick="window.app.setWeatherLayer('none')">â›” None</button>
                </div>
              </div>
              <div>
                <div style="font-size:0.75rem; font-weight:700; color:var(--color-muted-text); margin-bottom:4px;">MUSIC / NOISE:</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                  <button class="soundtrack-btn ${music === 'lofi' ? 'active' : ''}" onclick="window.app.setMusicLayer('lofi')">ðŸŽ§ Lo-Fi</button>
                  <button class="soundtrack-btn ${music === 'piano' ? 'active' : ''}" onclick="window.app.setMusicLayer('piano')">ðŸŽ¹ Piano</button>
                  <button class="soundtrack-btn ${music === 'brown' ? 'active' : ''}" onclick="window.app.setMusicLayer('brown')">ðŸŸ¤ Brown</button>
                  <button class="soundtrack-btn ${music === 'videogame' ? 'active' : ''}" onclick="window.app.setMusicLayer('videogame')">ðŸŽ® 8-Bit</button>
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
              <span class="search-icon">ðŸ”</span>
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
            <button class="btn btn-outline" onclick="window.academicCalendar.showAddEventModal()">Calendar ðŸ“…</button>
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
                  <div class="task-deadline"><span>ðŸ“… ${t.deadline ? t.deadline.split('T')[0] : 'No deadline'}</span></div>
                  <div class="task-actions">
                    <button class="btn btn-outline btn-sm" onclick="window.taskManager.showTaskTimeline('${t.id}')">â³</button>
                    <button class="btn btn-secondary btn-sm" onclick="window.taskManager.studyTask('${t.id}')">â±ï¸</button>
                    <button class="btn ${t.status === 'completed' ? 'btn-outline' : 'btn-primary'} btn-sm" onclick="window.taskManager.toggleTaskComplete('${t.id}')">
                      ${t.status === 'completed' ? '✓ Done' : 'Complete'}
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="window.taskManager.deleteTask('${t.id}')">ðŸ—‘ï¸</button>
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

        return `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div class="card" style="display: flex; align-items: center; justify-content: space-between; gap: 30px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 280px;">
            <span class="badge" style="background: var(--color-pastel-yellow-light); color: #B7791F; margin-bottom: 8px;">
              ${species.element}
            </span>
            <h2 style="font-size: 2rem; color: var(--color-forest-dark);">${pet.name} (${species.name})</h2>
            <p style="color: var(--color-muted-text); margin-top: 6px; font-size: 0.95rem; line-height: 1.5;">
              ${species.stages[pet.stage] ? species.stages[pet.stage].desc : 'A wonderful faithful study companion.'}
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
          </div>
          <div style="width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; background: #141B33; border-radius: var(--radius-xl); border: 2px dashed var(--color-border);">
            ${window.petManager.renderPetSVG()}
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title"><span class="card-title-icon">ðŸŒ³</span> Evolutionary Journey</div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px;">
            ${stages.map((st, index) => {
            const isPastOrCurrent = stages.indexOf(pet.stage) >= index;
            const isCurrent = pet.stage === st;
            const stInfo = species.stages[st] || { name: st };

            return `
  <div style="background: ${isCurrent ? 'var(--color-sage-soft)' : 'var(--color-white)'}; border: 2px solid ${isCurrent ? 'var(--color-forest)' : 'var(--color-border)'}; border-radius: var(--radius-md); padding: 14px; text-align: center; opacity: ${isPastOrCurrent ? '1' : '0.5'};">
    <div style="width: 70px; height: 70px; margin: 0 auto 8px auto;">
      ${window.petManager.renderPetSVG(pet.species, st)}
    </div>
    <div style="font-weight: 700; font-size: 0.88rem; color: var(--color-forest-dark);">${stInfo.name}</div>
    <div style="font-size: 0.72rem; color: var(--color-muted-text); text-transform: uppercase;">Stage ${index + 1}: ${st}</div>
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
          <button class="shop-tab-btn ${window.shopManager.currentCategory === 'food' ? 'active' : ''}" onclick="window.shopManager.currentCategory = 'food'; window.app.renderCurrentView();">Pet Food ðŸ“</button>
          <button class="shop-tab-btn ${window.shopManager.currentCategory === 'hat' ? 'active' : ''}" onclick="window.shopManager.currentCategory = 'hat'; window.app.renderCurrentView();">Hats & Caps ðŸŽ“</button>
          <button class="shop-tab-btn ${window.shopManager.currentCategory === 'clothing' ? 'active' : ''}" onclick="window.shopManager.currentCategory = 'clothing'; window.app.renderCurrentView();">Clothing ðŸ§£</button>
          <button class="shop-tab-btn ${window.shopManager.currentCategory === 'furniture' ? 'active' : ''}" onclick="window.shopManager.currentCategory = 'furniture'; window.app.renderCurrentView();">Decor & Furniture ðŸª´</button>
          <button class="shop-tab-btn ${window.shopManager.currentCategory === 'background' ? 'active' : ''}" onclick="window.shopManager.currentCategory = 'background'; window.app.renderCurrentView();">Room Themes ðŸŒŒ</button>
        </div>
        <div class="shop-grid">${window.shopManager.renderShopGrid()}</div>
      </div>
    `;
    }

    getViewQuests() {
        return `
      <div style="display: flex; flex-direction: column; gap: 28px;">
        <div class="card">
          <div class="card-header"><div class="card-title"><span class="card-title-icon">ðŸ“œ</span> Daily Study Quests</div></div>
          <div class="quests-list">${window.questManager.renderDailyQuests()}</div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><span class="card-title-icon">ðŸŒŸ</span> Weekly Academic Milestones</div></div>
          <div class="quests-list">${window.questManager.renderWeeklyQuests()}</div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><span class="card-title-icon">ðŸ†</span> Achievements Gallery</div></div>
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
            <h3 style="font-size: 1.4rem; color: var(--color-forest-dark);">Letters to Future Self ðŸ’Œ</h3>
            <p style="color: var(--color-muted-text); font-size: 0.88rem;">A digital time capsule for your thoughts, hopes, and academic goals. Sealed with wax!</p>
          </div>
          <button class="btn btn-terracotta" onclick="window.futureMeManager.showComposeModal()">+ Write a New Letter âœ‰ï¸</button>
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
            <div class="stat-icon-wrapper stat-icon-time">âŒ›</div>
            <div class="stat-content"><div class="stat-val">${totalHours}h</div><div class="stat-lbl">Total Study Hours</div></div>
          </div>
          <div class="stat-box">
            <div class="stat-icon-wrapper stat-icon-tasks">ðŸŽ¯</div>
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
            <div class="card-header"><div class="card-title"><span class="card-title-icon">ðŸ“Š</span> 7-Day Study Minutes</div></div>
            ${window.statsManager.renderActivityChartSVG()}
          </div>
          <div class="card">
            <div class="card-header"><div class="card-title"><span class="card-title-icon">ðŸŸ©</span> Consistency Heatmap</div></div>
            ${window.statsManager.renderHeatmapGrid()}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><span class="card-title-icon">ðŸ“œ</span> Focus Session History</div></div>
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
          <div class="card-header"><div class="card-title"><span class="card-title-icon">ðŸ‘¤</span> Scholar Profile</div></div>
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
            <button class="btn btn-outline" onclick="window.settingsManager.exportDataFile()">Export Backup JSON ðŸ“¥</button>
            <label class="btn btn-outline" style="cursor: pointer;">Import Backup JSON ðŸ“¤<input type="file" accept=".json" style="display: none;" onchange="window.settingsManager.importDataFile(this.files[0])"></label>
            <button class="btn btn-outline" style="color: #C53030; border-color: #FEB2B2;" onclick="window.settingsManager.confirmResetDemo()">Reset to Demo Data âš ï¸</button>
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
                  <option value="urgent">Urgent ðŸ”´</option><option value="high">High ðŸŸ </option><option value="medium" selected>Medium ðŸŸ¡</option><option value="low">Low ðŸŸ¢</option>
                </select>
              </div>
            </div>
            <div>
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Subtasks (Comma separated)</label>
              <input type="text" name="subtasksRaw" placeholder="e.g. Read outline, Write first draft, Review citations" style="width: 100%; margin-top: 4px;">
            </div>
            <button type="submit" class="btn btn-primary" style="margin-top: 8px;">Add to Planner ðŸŒ¿</button>
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
        let icon = 'ðŸŒ¿';
        if (type === 'coin') icon = 'ðŸª™';
        else if (type === 'exp') icon = '✨';
        else if (type === 'achievement') icon = 'ðŸ†';

        toast.innerHTML = `<div class="toast-icon">${icon}</div><div class="toast-body"><div class="toast-title">${title}</div><div class="toast-desc">${desc}</div></div>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 400);
        }, 3800);
    }

    showOnboardingWizard() {
        const modal = document.getElementById('onboarding-modal');
        if (!modal) return;

        modal.innerHTML = `
      <div class="modal-card" style="max-width: 580px; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 8px;">☕ 🐱 ðŸ’»</div>
        <h2 style="font-size: 1.8rem; color: var(--color-forest-dark);">Welcome to STUDYPET OS</h2>
        <p style="color: var(--color-muted-text); font-size: 0.95rem; margin-bottom: 24px;">
          <em>"Take a break. Grow Your Pet, Grow Yourself."</em><br>
          A cozy, nostalgic 90s desktop study simulator.
        </p>
        <form onsubmit="event.preventDefault(); window.app.handleOnboardingFinish(this);">
          <div style="display: flex; flex-direction: column; gap: 16px; text-align: left;">
            <div><label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Scholar Name:</label><input type="text" name="userName" required value="Scholar" style="width: 100%; margin-top: 4px;"></div>
            <div>
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Companion Choice:</label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 6px;">
                <label style="cursor: pointer; border: 2px solid var(--color-sage); border-radius: var(--radius-md); padding: 10px; text-align: center; background: var(--color-white);">
                  <input type="radio" name="species" value="aconite_cat" checked style="display: none;">
                  <div style="font-size: 1.8rem;">🐱</div>
                  <div style="font-weight: 700; font-size: 0.85rem;">Aconite Kitty</div>
                  <div style="font-size: 0.72rem; color: var(--color-muted-text);">Tea, Mug & Chill Lo-Fi</div>
                </label>
                <label style="cursor: pointer; border: 2px solid var(--color-sage); border-radius: var(--radius-md); padding: 10px; text-align: center; background: var(--color-white);">
                  <input type="radio" name="species" value="florapup" style="display: none;">
                  <div style="font-size: 1.8rem;">🌱</div>
                  <div style="font-weight: 700; font-size: 0.85rem;">Florapup</div>
                  <div style="font-size: 0.72rem; color: var(--color-muted-text);">Nature & Botany</div>
                </label>
              </div>
            </div>
            <div><label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Name Your Companion:</label><input type="text" name="petName" required value="Aconite" style="width: 100%; margin-top: 4px;"></div>
            <button type="submit" class="btn btn-gold btn-lg" style="margin-top: 14px; width: 100%;">Enter My World ☕✨</button>
          </div>
        </form>
      </div>
    `;
        modal.classList.add('active');
    }

    handleOnboardingFinish(form) {
        const formData = new FormData(form);
        this.store.state.user.name = formData.get('userName');
        this.store.state.user.isOnboarded = true;
        this.store.state.pet.species = formData.get('species');
        this.store.state.pet.name = formData.get('petName');
        this.store.saveState();

        if (window.soundEngine) window.soundEngine.playLevelUp();
        document.getElementById('onboarding-modal').classList.remove('active');
        this.renderAll();
        this.showToast('Welcome to STUDYPET OS! ðŸŒ¿', `Ready to study with ${this.store.state.pet.name}!`, 'achievement');
    }
}

// Global Application Instance
window.addEventListener('DOMContentLoaded', () => {
    window.app = new StudyPetApp();
});

