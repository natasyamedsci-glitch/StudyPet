/**
 * STUDYPET — Analytics & Productivity Statistics
 * Interactive SVG Charts, 30-Day Activity Heatmap, Subject Distribution & Session Logs
 */

class StatsManager {
  constructor() {
    this.store = window.dataStore;
  }

  get sessions() {
    return this.store.state.sessions || [];
  }

  getTotalHours() {
    const totalMinutes = this.sessions.reduce((acc, s) => acc + (s.durationMin || 0), 0);
    return (totalMinutes / 60).toFixed(1);
  }

  getSubjectDistribution() {
    const dist = {};
    this.sessions.forEach(s => {
      const subj = s.subject || 'General';
      dist[subj] = (dist[subj] || 0) + (s.durationMin || 0);
    });
    return dist;
  }

  // 7-day Daily Activity Bar Chart (SVG)
  renderActivityChartSVG() {
    const days = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dayMinutes = this.sessions
        .filter(s => s.date === dateStr)
        .reduce((acc, s) => acc + (s.durationMin || 0), 0);

      days.push({ date: dateStr, label: dayLabel, minutes: dayMinutes });
    }

    const maxMinutes = Math.max(60, ...days.map(d => d.minutes));
    const chartHeight = 160;
    const chartWidth = 520;
    const barWidth = 44;
    const gap = 30;

    let barsHtml = '';
    days.forEach((day, idx) => {
      const x = 30 + idx * (barWidth + gap);
      const barH = Math.max(6, (day.minutes / maxMinutes) * chartHeight);
      const y = chartHeight - barH + 20;

      barsHtml += `
        <g class="chart-bar-group">
          <!-- Background track -->
          <rect x="${x}" y="20" width="${barWidth}" height="${chartHeight}" rx="6" fill="#F0E6D6" opacity="0.4"/>
          <!-- Active Bar -->
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="6" fill="url(#barGradient)">
            <title>${day.label}: ${day.minutes} mins</title>
          </rect>
          <!-- Minutes label -->
          <text x="${x + barWidth / 2}" y="${y - 6}" font-family="var(--font-mono)" font-size="11" font-weight="700" fill="#526B55" text-anchor="middle">
            ${day.minutes > 0 ? day.minutes + 'm' : ''}
          </text>
          <!-- Day label -->
          <text x="${x + barWidth / 2}" y="${chartHeight + 38}" font-family="var(--font-heading)" font-size="12" font-weight="700" fill="#73675E" text-anchor="middle">
            ${day.label}
          </text>
        </g>
      `;
    });

    return `
      <svg viewBox="0 0 ${chartWidth} 210" style="width: 100%; height: auto;">
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#526B55" />
            <stop offset="100%" stop-color="#A8B99A" />
          </linearGradient>
        </defs>
        ${barsHtml}
      </svg>
    `;
  }

  // 30-Day Productivity Heatmap
  renderHeatmapGrid() {
    const cells = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const dayMins = this.sessions
        .filter(s => s.date === dateStr)
        .reduce((acc, s) => acc + (s.durationMin || 0), 0);

      let level = '0';
      if (dayMins >= 60) level = '4';
      else if (dayMins >= 45) level = '3';
      else if (dayMins >= 25) level = '2';
      else if (dayMins > 0) level = '1';

      cells.push(`
        <div class="heatmap-cell level-${level}" title="${dateStr}: ${dayMins} mins studied"></div>
      `);
    }

    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-weight: 700; font-size: 0.85rem; color: var(--color-muted-text);">Activity Over Past 30 Days</span>
          <div style="display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: var(--color-muted-text);">
            <span>Less</span>
            <div class="heatmap-cell level-0" style="width: 10px; height: 10px;"></div>
            <div class="heatmap-cell level-1" style="width: 10px; height: 10px;"></div>
            <div class="heatmap-cell level-2" style="width: 10px; height: 10px;"></div>
            <div class="heatmap-cell level-3" style="width: 10px; height: 10px;"></div>
            <div class="heatmap-cell level-4" style="width: 10px; height: 10px;"></div>
            <span>More</span>
          </div>
        </div>
        <div class="heatmap-grid">
          ${cells.join('')}
        </div>
      </div>
    `;
  }

  // Session Log Table
  renderSessionLogs() {
    if (this.sessions.length === 0) {
      return '<p class="empty-state">No focus sessions recorded yet.</p>';
    }

    return `
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
          <thead>
            <tr style="border-bottom: 1.5px solid var(--color-border); text-align: left; color: var(--color-muted-text); font-family: var(--font-heading);">
              <th style="padding: 10px;">Date</th>
              <th style="padding: 10px;">Subject</th>
              <th style="padding: 10px;">Mode</th>
              <th style="padding: 10px;">Duration</th>
              <th style="padding: 10px;">Rewards</th>
              <th style="padding: 10px;">Interruptions</th>
            </tr>
          </thead>
          <tbody>
            ${this.sessions.slice(0, 8).map(s => `
              <tr style="border-bottom: 1px solid var(--color-border-subtle);">
                <td style="padding: 10px; font-family: var(--font-mono); font-size: 0.8rem;">${s.date}</td>
                <td style="padding: 10px; font-weight: 700; color: var(--color-forest-dark);">${s.subject}</td>
                <td style="padding: 10px; text-transform: capitalize;">${s.mode}</td>
                <td style="padding: 10px; font-family: var(--font-mono); font-weight: 700;">${s.durationMin} mins</td>
                <td style="padding: 10px; color: #B7791F; font-weight: 700;">+${s.coins} 🪙 / +${s.exp} EXP</td>
                <td style="padding: 10px;">${s.interruptions > 0 ? `<span style="color:#C53030;">⚠️ ${s.interruptions}</span>` : '<span style="color:#38A169;">Flawless ✨</span>'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}

// Global Stats Manager Instance
const statsManager = new StatsManager();
window.statsManager = statsManager;

