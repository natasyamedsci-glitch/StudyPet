/**
 * STUDYPET — Future Me Letters System
 * Digital Time Capsule, Wax Sealed Envelopes, Strict Unlock Enforcement & Opening Ceremony
 */

class FutureMeManager {
  constructor() {
    this.store = window.dataStore;
  }

  get letters() {
    return this.store.state.futureLetters || [];
  }

  createLetter(data) {
    const newLetter = {
      id: 'letter_' + Date.now(),
      title: data.title.trim(),
      unlockDate: data.unlockDate,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      feelingEmoji: data.feelingEmoji || '🌱',
      feelingText: data.feelingText || 'Hopeful & Focused',
      goalsText: data.goalsText || '',
      content: data.content.trim(),
      isOpened: false
    };

    this.store.state.futureLetters.unshift(newLetter);
    this.store.saveState();

    if (window.soundEngine) window.soundEngine.playSparkle();
    if (window.app) {
      window.app.showToast('Time Capsule Sealed! 📜', `Your letter is locked until ${data.unlockDate}.`, 'achievement');
      window.app.renderAll();
    }
  }

  getCountdownText(unlockDateStr) {
    const now = new Date().getTime();
    const target = new Date(unlockDateStr + 'T00:00:00').getTime();
    const diff = target - now;

    if (diff <= 0) return 'Ready to Open! 🔓';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `Unlocks in ${days}d ${hours}h`;
    } else {
      return `Unlocks in ${hours} hours`;
    }
  }

  isUnlocked(unlockDateStr) {
    const now = new Date().getTime();
    const target = new Date(unlockDateStr + 'T00:00:00').getTime();
    return now >= target;
  }

  openLetter(letterId) {
    const letter = this.letters.find(l => l.id === letterId);
    if (!letter) return;

    if (!this.isUnlocked(letter.unlockDate)) {
      if (window.app) {
        window.app.showToast('Patience, Scholar! 🔒', `This letter is strictly sealed until ${letter.unlockDate}.`, 'default');
      }
      return;
    }

    letter.isOpened = true;
    this.store.saveState();

    if (window.soundEngine) window.soundEngine.playLevelUp();
    this.showLetterReadingModal(letter);
  }

  showLetterReadingModal(letter) {
    const modal = document.getElementById('letter-read-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-card" style="background: var(--color-parchment); border: 2px solid #D6C29E; max-width: 600px;">
        <div style="text-align: center; margin-bottom: 16px;">
          <div style="font-size: 2.2rem;">📜 💌</div>
          <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: var(--color-terracotta); font-weight: 700;">
            Sealed on ${letter.createdAt} • Unlocked on ${letter.unlockDate}
          </span>
          <h2 style="font-size: 1.6rem; color: var(--color-forest-dark); margin-top: 6px;">${letter.title}</h2>
          <div style="font-size: 0.85rem; color: var(--color-muted-text); margin-top: 4px;">
            Feelings at the time: ${letter.feelingEmoji} <em>"${letter.feelingText}"</em>
          </div>
        </div>

        ${letter.goalsText ? `
          <div style="background: rgba(255,255,255,0.6); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px dashed #D6C29E; margin-bottom: 18px;">
            <div style="font-weight: 700; font-size: 0.82rem; color: var(--color-forest);">Past Goals & Aspirations:</div>
            <div style="font-size: 0.9rem; color: var(--color-dark-text);">${letter.goalsText}</div>
          </div>
        ` : ''}

        <div style="font-family: var(--font-body); font-size: 1.05rem; line-height: 1.7; color: #2D2723; white-space: pre-wrap; padding: 12px 0; border-top: 1px solid #E8DCC8; border-bottom: 1px solid #E8DCC8;">${letter.content}</div>

        <div style="margin-top: 22px; display: flex; justify-content: flex-end;">
          <button class="btn btn-primary" onclick="document.getElementById('letter-read-modal').classList.remove('active'); if(window.app) window.app.renderAll();">
            Keep in Memories Archive 🌿
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  renderLettersGrid() {
    return this.letters.map(letter => {
      const unlocked = this.isUnlocked(letter.unlockDate);
      const countdown = this.getCountdownText(letter.unlockDate);

      return `
        <div class="envelope-card">
          <div>
            <div class="envelope-wax-seal">
              ${letter.isOpened ? '📜' : unlocked ? '🔓' : '🔒'}
            </div>
            <div class="envelope-title">${letter.title}</div>
            <div class="envelope-countdown">${letter.isOpened ? 'Opened Archive' : countdown}</div>
            <p style="font-size: 0.82rem; color: var(--color-muted-text); text-align: center;">
              Written on ${letter.createdAt} (${letter.feelingEmoji} ${letter.feelingText})
            </p>
          </div>

          <div style="margin-top: 18px; width: 100%;">
            ${letter.isOpened ? `
              <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="window.futureMeManager.showLetterReadingModal(window.futureMeManager.letters.find(l => l.id === '${letter.id}'))">
                Read Again 📖
              </button>
            ` : unlocked ? `
              <button class="btn btn-terracotta btn-sm" style="width: 100%;" onclick="window.futureMeManager.openLetter('${letter.id}')">
                Break Wax Seal & Open! 💌
              </button>
            ` : `
              <button class="btn btn-outline btn-sm" style="width: 100%; opacity: 0.6; cursor: not-allowed;" onclick="window.futureMeManager.openLetter('${letter.id}')">
                Sealed with Wax 🔒
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  showComposeModal() {
    const modal = document.getElementById('compose-letter-modal');
    if (!modal) return;

    // Default unlock date: 14 days in future
    const futureDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 620px;">
        <div class="modal-header">
          <h3>Write a Letter to Future You 💌</h3>
          <button class="modal-close-btn" onclick="document.getElementById('compose-letter-modal').classList.remove('active');">✕</button>
        </div>
        <form onsubmit="event.preventDefault(); window.futureMeManager.handleComposeSubmit(this);">
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Letter Title</label>
              <input type="text" name="title" required placeholder="e.g. For the day I finish my final thesis defense..." style="width: 100%; margin-top: 4px;">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Seal Until Date (Strict Unlock)</label>
                <input type="date" name="unlockDate" required value="${futureDate}" style="width: 100%; margin-top: 4px;">
              </div>
              <div>
                <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Current Feeling</label>
                <select name="feelingText" style="width: 100%; margin-top: 4px;">
                  <option value="Determined & Inspired 🌱">Determined & Inspired 🌱</option>
                  <option value="A Bit Stressed, But Pushing Forward ☕">A Bit Stressed, But Pushing Forward ☕</option>
                  <option value="Curious & Creative ✨">Curious & Creative ✨</option>
                  <option value="Peaceful & Grateful 🌿">Peaceful & Grateful 🌿</option>
                  <option value="Excited for What's Ahead 🚀">Excited for What's Ahead 🚀</option>
                </select>
              </div>
            </div>

            <div>
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Current Goals & Predictions</label>
              <input type="text" name="goalsText" placeholder="What do you hope to have mastered or achieved by then?" style="width: 100%; margin-top: 4px;">
            </div>

            <div>
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Your Message</label>
              <textarea name="content" required rows="6" placeholder="Dear Future Self, Right now I am sitting at my desk with Sprout..." style="width: 100%; margin-top: 4px; resize: vertical;"></textarea>
            </div>

            <button type="submit" class="btn btn-terracotta" style="margin-top: 8px;">
              Seal Letter with Wax ✉️
            </button>
          </div>
        </form>
      </div>
    `;

    modal.classList.add('active');
  }

  handleComposeSubmit(form) {
    const formData = new FormData(form);
    this.createLetter({
      title: formData.get('title'),
      unlockDate: formData.get('unlockDate'),
      feelingText: formData.get('feelingText'),
      feelingEmoji: '💌',
      goalsText: formData.get('goalsText'),
      content: formData.get('content')
    });
    document.getElementById('compose-letter-modal').classList.remove('active');
  }
}

// Global Future Me Instance
const futureMeManager = new FutureMeManager();
window.futureMeManager = futureMeManager;

