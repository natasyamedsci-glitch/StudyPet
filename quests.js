/**
 * STUDYPET — Quests & Achievements Engine
 * Daily Challenges, Weekly Milestones, Badges Gallery & Reward Economy
 */

class QuestManager {
  constructor() {
    this.store = window.dataStore;
  }

  get quests() {
    return this.store.state.quests;
  }

  get achievements() {
    return this.store.state.achievements;
  }

  claimQuest(type, questId) {
    const list = type === 'daily' ? this.quests.daily : this.quests.weekly;
    const quest = list.find(q => q.id === questId);
    if (!quest || quest.claimed || quest.current < quest.target) return;

    quest.claimed = true;
    const coins = quest.rewardCoins || 10;
    const exp = quest.rewardExp || 20;

    this.store.addRewards(exp, coins, `Claimed Quest: ${quest.title}`);
    if (window.petManager) window.petManager.processExpGain(exp);

    this.store.saveState();
    if (window.soundEngine) {
      window.soundEngine.playCoin();
      setTimeout(() => window.soundEngine.playSparkle(), 200);
    }
    if (window.app) {
      window.app.showToast('Quest Claimed! 🌟', `+${coins} Coins, +${exp} EXP`, 'coin');
      window.app.renderAll();
    }
  }

  checkAchievements() {
    const user = this.store.state.user;
    const pet = this.store.state.pet;

    this.achievements.forEach(ach => {
      if (ach.unlocked) return;

      let shouldUnlock = false;

      if (ach.id === 'ach_4' && user.streak >= 7) shouldUnlock = true;
      if (ach.id === 'ach_6' && (user.todayCompletedTasks || 0) >= 5) shouldUnlock = true;
      if (ach.id === 'ach_10' && pet.stage === 'mythical') shouldUnlock = true;

      if (shouldUnlock) {
        ach.unlocked = true;
        ach.unlockedDate = new Date().toLocaleDateString();
        this.store.addRewards(ach.reward * 2, ach.reward, `Achievement Unlocked: ${ach.title}`);
        if (window.soundEngine) window.soundEngine.playLevelUp();
        if (window.app) {
          window.app.showToast(`Achievement: ${ach.title}! 🏆`, `Reward: +${ach.reward} 🪙`, 'achievement');
        }
      }
    });

    this.store.saveState();
  }

  renderDailyQuests() {
    return this.quests.daily.map(q => {
      const isComplete = q.current >= q.target;
      const progressPercent = Math.min(100, Math.round((q.current / q.target) * 100));

      return `
        <div class="quest-item-card">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-weight: 700; color: var(--color-forest-dark); font-size: 0.95rem;">${q.title}</span>
              <span style="font-size: 0.8rem; font-family: var(--font-mono); font-weight: 700; color: var(--color-muted-text);">${q.current} / ${q.target} ${q.unit}</span>
            </div>
            <div class="quest-progress-track">
              <div class="quest-progress-bar" style="width: ${progressPercent}%;"></div>
            </div>
            <div style="font-size: 0.75rem; color: #B7791F; margin-top: 4px; font-weight: 600;">
              Reward: +${q.rewardCoins} 🪙 & +${q.rewardExp} EXP
            </div>
          </div>
          <div>
            ${q.claimed ? `
              <button class="btn btn-sm btn-outline" disabled style="opacity: 0.6;">Claimed ✓</button>
            ` : isComplete ? `
              <button class="btn btn-sm btn-gold" onclick="window.questManager.claimQuest('daily', '${q.id}')">Claim Reward! ✨</button>
            ` : `
              <button class="btn btn-sm btn-secondary" disabled style="opacity: 0.5;">In Progress</button>
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  renderWeeklyQuests() {
    return this.quests.weekly.map(q => {
      const isComplete = q.current >= q.target;
      const progressPercent = Math.min(100, Math.round((q.current / q.target) * 100));

      return `
        <div class="quest-item-card">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-weight: 700; color: var(--color-forest-dark); font-size: 0.95rem;">${q.title}</span>
              <span style="font-size: 0.8rem; font-family: var(--font-mono); font-weight: 700; color: var(--color-muted-text);">${q.current} / ${q.target} ${q.unit}</span>
            </div>
            <div class="quest-progress-track">
              <div class="quest-progress-bar" style="width: ${progressPercent}%;"></div>
            </div>
            <div style="font-size: 0.75rem; color: #B7791F; margin-top: 4px; font-weight: 600;">
              Reward: +${q.rewardCoins} 🪙 & +${q.rewardExp} EXP
            </div>
          </div>
          <div>
            ${q.claimed ? `
              <button class="btn btn-sm btn-outline" disabled style="opacity: 0.6;">Claimed ✓</button>
            ` : isComplete ? `
              <button class="btn btn-sm btn-gold" onclick="window.questManager.claimQuest('weekly', '${q.id}')">Claim Reward! ✨</button>
            ` : `
              <button class="btn btn-sm btn-secondary" disabled style="opacity: 0.5;">In Progress</button>
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  renderAchievementsGallery() {
    return this.achievements.map(ach => `
      <div class="achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}">
        <div class="achievement-icon-box">${ach.icon}</div>
        <div style="flex: 1;">
          <div class="achievement-title">${ach.title}</div>
          <div class="achievement-desc">${ach.desc}</div>
          <div style="margin-top: 6px; font-size: 0.75rem; font-weight: 700; color: ${ach.unlocked ? 'var(--color-forest)' : 'var(--color-muted-text)'};">
            ${ach.unlocked ? `Unlocked on ${ach.unlockedDate}` : `Reward: +${ach.reward} 🪙`}
          </div>
        </div>
      </div>
    `).join('');
  }
}

// Global Quest Manager Instance
const questManager = new QuestManager();
window.questManager = questManager;

