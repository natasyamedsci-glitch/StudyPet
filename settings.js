/**
 * STUDYPET — User Settings & Preferences
 * Profile, Goals, Timer defaults, Themes, Data Export/Import & Supabase Sync
 */

class SettingsManager {
  constructor() {
    this.store = window.dataStore;
  }

  get user() {
    return this.store.state.user;
  }

  updateProfile(data) {
    Object.assign(this.user, data);
    this.store.saveState();

    if (window.soundEngine) window.soundEngine.playSparkle();
    if (window.app) {
      window.app.showToast('Profile Saved! 🌿', 'Preferences updated successfully.', 'exp');
      window.app.renderAll();
    }
  }

  setTheme(themeName) {
    this.user.theme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    this.store.saveState();
  }

  exportDataFile() {
    const jsonStr = this.store.exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studypet_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.app) window.app.showToast('Backup Exported 💾', 'Saved data to JSON file.', 'coin');
  }

  importDataFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const success = this.store.importJSON(e.target.result);
      if (success) {
        if (window.soundEngine) window.soundEngine.playLevelUp();
        if (window.app) {
          window.app.showToast('Data Restored! 🎉', 'All tasks, pet progress, and records restored.', 'achievement');
          window.app.renderAll();
        }
      } else {
        alert('Invalid file format. Please upload a valid STUDYPET backup JSON.');
      }
    };
    reader.readAsText(file);
  }

  confirmResetDemo() {
    if (confirm('Are you sure you want to reset STUDYPET to the initial demo data? Your current state will be replaced.')) {
      this.store.resetToDemo();
      if (window.soundEngine) window.soundEngine.playGong();
      if (window.app) {
        window.app.showToast('Reset Complete', 'Loaded fresh demo dataset.', 'default');
        window.app.renderAll();
      }
    }
  }
}

// Global Settings Manager Instance
const settingsManager = new SettingsManager();
window.settingsManager = settingsManager;

