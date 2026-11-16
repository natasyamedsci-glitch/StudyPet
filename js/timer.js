/**
 * STUDYPET — Study Room & Focus Timer System
 * Pomodoro, Extended, Custom & Stopwatch modes, Focus Lock, Tab Switching Detection & Rewards
 */

class StudyTimer {
  constructor() {
    this.store = window.dataStore;
    this.mode = 'pomodoro'; // 'pomodoro', 'extended', 'custom', 'stopwatch'
    this.state = 'idle'; // 'idle', 'running', 'paused', 'break'

    this.targetSeconds = 25 * 60;
    this.remainingSeconds = 25 * 60;
    this.elapsedSeconds = 0;

    this.startTime = null;
    this.timerInterval = null;
    this.interruptions = 0;
    this.selectedSubject = 'General Study';
    this.selectedTaskId = null;

    this.circumference = 2 * Math.PI * 130; // Radius 130 in SVG
    this.setupVisibilityDetection();
  }

  setupVisibilityDetection() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state === 'running') {
        this.interruptions++;
        const badge = document.getElementById('interruption-alert');
        if (badge) {
          badge.style.display = 'flex';
          badge.textContent = `⚠️ Tab switch detected! (Interruptions: ${this.interruptions})`;
        }
        if (this.store.state.user.strictMode && window.soundEngine) {
          window.soundEngine.playGong();
        }
      }
    });
  }

  setMode(newMode) {
    if (this.state === 'running') {
      if (!confirm('Switching modes will reset your current active focus session. Continue?')) {
        return;
      }
    }
    this.resetTimer();
    this.mode = newMode;

    if (newMode === 'pomodoro') {
      this.targetSeconds = (this.store.state.user.pomodoroStudyMin || 25) * 60;
    } else if (newMode === 'extended') {
      this.targetSeconds = (this.store.state.user.extendedStudyMin || 50) * 60;
    } else if (newMode === 'custom') {
      const customMin = parseInt(document.getElementById('custom-min-input')?.value || 30, 10);
      this.targetSeconds = customMin * 60;
    } else if (newMode === 'stopwatch') {
      this.targetSeconds = 0;
    }

    this.remainingSeconds = this.targetSeconds;
    this.elapsedSeconds = 0;
    this.updateDisplay();

    // Update active tab styles
    document.querySelectorAll('.timer-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.mode === newMode);
    });
  }

  startTimer() {
    if (this.state === 'running') return;

    if (window.soundEngine) {
      window.soundEngine.playClick();
      window.soundEngine.init();
      if (window.soundEngine.autoSyncTimer) {
        if (window.soundEngine.weatherLayer !== 'none') window.soundEngine.setWeatherLayer(window.soundEngine.weatherLayer);
        if (window.soundEngine.musicLayer !== 'none') window.soundEngine.setMusicLayer(window.soundEngine.musicLayer);
      }
    }

    this.state = 'running';
    this.startTime = Date.now() - (this.elapsedSeconds * 1000);

    const playBtn = document.getElementById('timer-toggle-btn');
    if (playBtn) playBtn.innerHTML = '⏸️';

    // Start background accurate tick
    this.timerInterval = setInterval(() => {
      this.tick();
    }, 250);
  }

  pauseTimer() {
    if (this.state !== 'running') return;
    this.state = 'paused';
    clearInterval(this.timerInterval);

    if (window.soundEngine) window.soundEngine.playClick();

    const playBtn = document.getElementById('timer-toggle-btn');
    if (playBtn) playBtn.innerHTML = '▶️';
  }

  togglePlayPause() {
    if (this.state === 'running') {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.state = 'idle';
    this.elapsedSeconds = 0;
    this.interruptions = 0;

    if (this.mode === 'stopwatch') {
      this.remainingSeconds = 0;
    } else {
      this.remainingSeconds = this.targetSeconds;
    }

    const badge = document.getElementById('interruption-alert');
    if (badge) badge.style.display = 'none';

    const playBtn = document.getElementById('timer-toggle-btn');
    if (playBtn) playBtn.innerHTML = '▶️';

    this.updateDisplay();
  }

  tick() {
    const now = Date.now();
    const actualElapsed = Math.floor((now - this.startTime) / 1000);
    this.elapsedSeconds = actualElapsed;

    if (this.mode === 'stopwatch') {
      this.remainingSeconds = this.elapsedSeconds;
      this.updateDisplay();
    } else {
      this.remainingSeconds = Math.max(0, this.targetSeconds - this.elapsedSeconds);
      this.updateDisplay();

      if (this.remainingSeconds <= 0) {
        this.completeSession();
      }
    }
  }

  updateDisplay() {
    const digitsEl = document.getElementById('timer-digits');
    const ringEl = document.getElementById('timer-progress-circle');

    let total = this.mode === 'stopwatch' ? this.elapsedSeconds : this.remainingSeconds;
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (digitsEl) digitsEl.textContent = formatted;

    // Browser title sync
    document.title = this.state === 'running' ? `(${formatted}) STUDYPET Focus` : 'STUDYPET — Grow Your Pet, Grow Yourself';

    // SVG Circular Progress
    if (ringEl && this.targetSeconds > 0) {
      const progress = (this.targetSeconds - this.remainingSeconds) / this.targetSeconds;
      const offset = this.circumference * (1 - progress);
      ringEl.style.strokeDasharray = `${this.circumference}`;
      ringEl.style.strokeDashoffset = `${offset}`;
    }
  }

  completeSession() {
    clearInterval(this.timerInterval);
    this.state = 'idle';

    if (window.soundEngine) {
      window.soundEngine.playGong();
      setTimeout(() => window.soundEngine.playLevelUp(), 1000);
    }

    const durationMin = Math.max(1, Math.round(this.elapsedSeconds / 60));

    // Economy Calculations
    let expEarned = 0;
    let coinsEarned = 0;

    if (this.mode === 'pomodoro') {
      expEarned = 25;
      coinsEarned = 10;
    } else if (this.mode === 'extended') {
      expEarned = 50;
      coinsEarned = 22;
    } else {
      // Pro-rated ~ 1 EXP per minute, ~ 0.45 coins per minute
      expEarned = Math.round(durationMin * 1);
      coinsEarned = Math.max(1, Math.round(durationMin * 0.45));
    }

    // Interruption penalty safeguard (doesn't hurt, but awards perfect focus bonus)
    if (this.interruptions === 0 && durationMin >= 25) {
      expEarned += 5;
      coinsEarned += 3;
    }

    // Save session in data store
    const sessionObj = {
      id: 'sess_' + Date.now(),
      subject: this.selectedSubject,
      durationMin: durationMin,
      date: new Date().toISOString().split('T')[0],
      mode: this.mode,
      exp: expEarned,
      coins: coinsEarned,
      interruptions: this.interruptions
    };

    this.store.state.sessions.unshift(sessionObj);
    this.store.state.user.todayMinutes = (this.store.state.user.todayMinutes || 0) + durationMin;

    // Check Streak
    const todayStr = new Date().toISOString().split('T')[0];
    if (this.store.state.user.lastStudyDate !== todayStr) {
      this.store.state.user.streak = (this.store.state.user.streak || 0) + 1;
      this.store.state.user.lastStudyDate = todayStr;
      if (this.store.state.user.streak > (this.store.state.user.bestStreak || 0)) {
        this.store.state.user.bestStreak = this.store.state.user.streak;
      }
    }

    // Add rewards to wallet & pet
    this.store.addRewards(expEarned, coinsEarned, `Focus Session: ${this.selectedSubject} (${durationMin}m)`);
    if (window.petManager) {
      window.petManager.completeFocusSession(expEarned);
    }

    // Show completion modal
    this.showCompletionModal(durationMin, expEarned, coinsEarned);
    this.resetTimer();

    if (window.app) window.app.renderAll();
  }

  showCompletionModal(minutes, exp, coins) {
    const modal = document.getElementById('session-complete-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-card" style="text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 8px;">🎉 ✨ 🐾</div>
        <h2 style="color: var(--color-forest-dark); font-size: 1.6rem;">Focus Session Completed!</h2>
        <p style="color: var(--color-muted-text); margin-bottom: 20px;">
          Splendid work! You dedicated <strong>${minutes} minutes</strong> to <strong>${this.selectedSubject}</strong>.
          ${this.interruptions === 0 ? '<br><span style="color: #38A169; font-weight:700;">🌟 Flawless Focus Bonus Earned! (0 interruptions)</span>' : ''}
        </p>

        <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 24px;">
          <div style="background: var(--color-sage-soft); padding: 14px 20px; border-radius: var(--radius-md); border: 1.5px solid var(--color-sage);">
            <div style="font-size: 1.4rem; font-weight: 800; color: var(--color-forest); font-family: var(--font-heading);">+${exp} EXP</div>
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--color-forest-dark);">Pet Experience</div>
          </div>
          <div style="background: var(--color-pastel-yellow-light); padding: 14px 20px; border-radius: var(--radius-md); border: 1.5px solid var(--color-pastel-yellow);">
            <div style="font-size: 1.4rem; font-weight: 800; color: #B7791F; font-family: var(--font-mono);">+${coins} 🪙</div>
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--color-forest-dark);">Study Coins</div>
          </div>
        </div>

        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-gold btn-lg" onclick="document.getElementById('session-complete-modal').classList.remove('active'); window.app.showCoffeeMiniGame();">
            Take a 5-Min Break & Brew Drink ☕
          </button>
          <button class="btn btn-primary btn-lg" onclick="document.getElementById('session-complete-modal').classList.remove('active'); window.petManager.petCreature();">
            Collect Rewards & Pet Companion 🌿
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  toggleFocusLock() {
    const overlay = document.getElementById('focus-lock-overlay');
    if (!overlay) return;

    const isActive = overlay.classList.toggle('active');
    document.body.classList.toggle('focus-lock-active', isActive);

    if (isActive) {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      this.syncFocusLockView();
    } else {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  syncFocusLockView() {
    const lockDigits = document.getElementById('lock-timer-digits');
    const lockSubject = document.getElementById('lock-subject-label');
    const lockPetBox = document.getElementById('lock-pet-companion');

    if (lockDigits) lockDigits.textContent = document.getElementById('timer-digits')?.textContent || '25:00';
    if (lockSubject) lockSubject.textContent = `Focusing on: ${this.selectedSubject}`;
    if (lockPetBox && window.petManager) {
      lockPetBox.innerHTML = window.petManager.renderPetSVG();
    }
  }
}

// Global Timer Instance
const studyTimer = new StudyTimer();
window.studyTimer = studyTimer;

