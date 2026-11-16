# STUDYPET OS — Gamified Study Life Simulation Platform 🐾💻✨
> **Tagline:** *"Take a break. Grow Your Pet, Grow Yourself."*

STUDYPET is a cozy, nostalgic 90s OS pixel-art gamified study platform and virtual companion simulator. Inspired by classic desktop OS aesthetics, MS Paint, and chill lo-fi study streams, users raise a faithful study pet by improving their real-life academic habits, completing assignments, maintaining focus sessions, and nurturing personal well-being.

---

## 🌟 Core Product Features

### 1. 🏡 My World & 90s OS Pixel Art Sanctuary
- **Cozy Aconite Cat & Elemental Companions**:
  - **Aconite Kitty** *(Cozy Focus & Lo-Fi)*: Peaceful white kitten sitting at the desk with closed eyes, sipping warm tea/coffee from a purple ceramic mug with rising steam!
  - **Florapup** *(Nature & Growth)*: Botanical canine spirit with leaf ears and flower antlers.
  - **Pyrolux** *(Flame & Courage)*: Fiery kitten drake with ember tail.
  - **Lunafox** *(Tide & Serenity)*: Celestial river kitsune with starlight tail ribbons.
- **Dynamic Real-Time Day / Sunset / Night Window Sky**:
  - **Day**: Crisp blue sky with golden shining sun and floating clouds.
  - **Sunset / Twilight**: Warm magenta, violet, and terracotta dusk gradient.
  - **Night**: Midnight navy sky with glowing crescent moon and twinkling pixel stars.
  - Sky automatically matches your actual local clock or can be cycled by clicking the sky status tag!
- **Interactive Desk Clutter**:
  - **Clickable Sticky Notes**: Instant study affirmations and scratch reminders.
  - **Mechanical Keyboard**: Clickable keycaps and typing key sound feedback with realistic tactile clacks.
  - **CRT Monitor**: Retro beige computer monitor with CRT scanline animation and terminal minigame.
  - **Potted Succulent**: Desk plant with gentle breeze sway animation.
- **Break Time Coffee-Brewing Mini-Game**:
  - Take a 5-minute Pomodoro break to brew a hot drink (Matcha Latte, Dark Roast Coffee, or Warm Chai).
  - Pours realistic warm beverage, restores companion energy to 100%, and awards +15 Study Coins!
- **Retro Pop-Up RPG Menu**:
  - `[ITEMS]`: Instant shortcut to Pet Shop & Inventory.
  - `[SAVE]`: 1-click JSON backup export.
  - `[SYSTEM]`: Settings & profile configuration.
  - `[BREAK]`: Launch the cozy drink brewing mini-game.

---

### 2. 📻 Dual-Layer Calming Audio & Music Deck
STUDYPET features a dual-layer audio mixing engine synthesized via the **Web Audio API** (100% offline, zero missing MP3 files):
- **Layer 1: Ambient Weather Layer**:
  - 🌧️ **Rain on Glass**: Filtered white noise with random droplet impact resonance.
  - 🔥 **Cozy Campfire**: Warm crackling fireplace embers.
  - ⛔ **No Weather**: Silence.
- **Layer 2: Music & Focus Noise Layer**:
  - 🎧 **Lo-Fi Chill Beats**: Electric piano chords (Maj9/Min9), sub-bass, and subtle vinyl crackle.
  - 🎹 **Classical Contemporary Piano**: Satie/Debussy-inspired meditative arpeggios.
  - 🟤 **Brown Noise**: Deep, warm 1/f² random-walk low rumble (ideal for ADHD focus).
  - 🌸 **Pink Noise**: Paul Kellet's natural waterfall frequency balance.
  - 🎮 **Retro Video Games OST**: 8-bit/16-bit cozy RPG town square chiptune melody.
  - 🔕 **Mute Music**: Silence.
- **Simultaneous Mixing**: Blend *Rain on Glass* + *Lo-Fi Beats* or *Campfire* + *Piano* at the same time!
- **Cassette Tape Visualizer & Equalizer**: Real-time 8-band animated spectrum analyzer and rotating cassette tape reels while music is playing.
- **Auto-Sync with Timer**: Automatically starts playing when focus begins and pauses on breaks.

---

### 3. ⏱️ Study Room & Focus System
- **Timer Modes**:
  - **Pomodoro**: 25m focus / 5m break / 15m long break.
  - **Extended Focus**: 50m deep focus / 10m break.
  - **Custom Timer**: 1 to 180 minutes configurable duration.
  - **Stopwatch**: Count-up timer with milestone alerts.
- **Pet Study Companion**: Pet sits alongside you at its tiny study desk with spectacles and warm tea.
- **Focus Lock (Zen Mode)**:
  - Fullscreen minimal zen mode.
  - **Tab Visibility Detection** (`visibilitychange` API): Tracks window switching and records distraction counts.
  - Resilient timestamp timing (`Date.now()` delta calculations) so background tabs never lag the clock.
- **Session Rewards**:
  - 25m Pomodoro: **+25 EXP & +10 Study Coins**
  - 50m Extended: **+50 EXP & +22 Study Coins**
  - Flawless Focus bonus when completed with zero interruptions!

---

### 4. 📝 Academic Planner & Task Timelines
- **Full Task CRUD**: Manage assignments, exams, presentations, projects, and readings.
- **Interactive Subtasks**: Checklists with dynamic percentage calculation.
- **Task Timeline**: Modal tracking task creation, study sessions devoted to it, subtasks completed, and final submission.
- **Filter & Sort**: Filter by status (*Not Started, In Progress, Completed, Overdue*), priority (*Urgent, High, Medium, Low*), or subject, and sort by deadline.
- **1-Click Study**: Directly load any task into the Focus Room.

---

### 5. 📅 Academic Calendar System
- **Views**: Monthly calendar grid and Chronological Agenda view.
- **Color-Coded Events**: Exams, assignments, defenses, and study sessions.
- **Quick Scheduling**: Click any date to view scheduled deadlines or quickly schedule new ones.

---

### 6. 🛍️ Pet Shop & Inventory
- **Catalog Categories**:
  - **Pet Food**: Berry Tart, Moon Berries, Golden Honey Apple, Matcha Biscuits.
  - **Hats & Accessories**: Scholar Cap, Wizard Hat, Cozy Beanie, Floral Wreath.
  - **Clothing**: Warm Knitted Scarf, Academy Cape.
  - **Decor & Furniture**: Oak Bookshelf, Bonsai Tree, Pastel Rug.
  - **Room Backgrounds**: Cozy Attic, Enchanted Forest, Twilight Observatory, Sunlit Greenhouse.
  - **Special Consumables**: Streak Freeze Charm.
- **Live Cosmetic Equipment**: Equipping hats and scarves visibly updates your pet in real time!

---

### 7. 📜 Quests & Achievements
- **Daily Quests**: Focus for 25m, check off 1 task, care for your pet, and log journal reflections with claimable Coin and EXP rewards.
- **Weekly Milestones**: 180 study minutes, 5-day streak, multi-subtask completions.
- **Achievements Gallery**: 10+ collectible badges (*First Spark, Hatched Companion, Cozy Scholar, Centurion of Focus, Fashion Icon, Mythical Bond, etc.*).

---

### 8. 💌 Future Me — Letters to Yourself
- **Digital Time Capsule**: Write letters to your future self with current feelings, predictions, and goals.
- **Wax Sealed Envelopes**: Live countdown to the unlock date.
- **Strict Lock Enforcement**: Locked letters cannot be read until their unlock date has passed.
- **Letter Opening Ceremony**: Unfolding parchment stationery modal.

---

### 9. 📊 Analytics, Consistency & Heatmaps
- **30-Day Productivity Heatmap**: Activity grid showing daily study consistency.
- **7-Day Activity Chart**: Responsive SVG bar chart displaying daily study minutes.
- **Focus Session Ledger**: Granular table tracking session history, subjects, interruptions, and rewards.

---

## 🚀 How to Launch and Run

The application is completely self-contained with modern HTML5, CSS3, and ES6+ JavaScript, requiring no dependencies or build steps:

1. Open File Explorer on Windows.
2. Navigate to:
   ```
   C:\Users\manur\.gemini\antigravity\scratch\studypet
   ```
3. Double-click [index.html](file:///C:/Users/manur/.gemini/antigravity/scratch/studypet/index.html).
4. STUDYPET will open in your default browser (Chrome, Edge, Firefox, etc.) populated with demo data and ready to use!

### ⌨️ Keyboard Shortcuts
* `Space`: Start / Pause Focus Timer (while in Study Room).
* `Escape`: Close any open modal or exit Focus Lock mode.
* Any key on keyboard: Realistic mechanical keyboard tactile switch clack sound!
* Click `🔔` in the top bar: Toggle master mute.
