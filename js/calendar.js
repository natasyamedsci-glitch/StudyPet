/**
 * STUDYPET — Academic Calendar System
 * Interactive Month, Week, Day & Agenda Views, Category Color Coding & Deadlines
 */

class AcademicCalendar {
  constructor() {
    this.store = window.dataStore;
    this.currentDate = new Date();
    this.viewMode = 'month'; // 'month', 'week', 'agenda'
    this.selectedDate = new Date();
  }

  get events() {
    return this.store.state.calendarEvents || [];
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.render();
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.render();
  }

  today() {
    this.currentDate = new Date();
    this.render();
  }

  addEvent(eventData) {
    const newEvent = {
      id: 'cal_' + Date.now(),
      title: eventData.title.trim(),
      date: eventData.date,
      time: eventData.time || '12:00',
      category: eventData.category || 'assignment',
      color: this.getCategoryColor(eventData.category)
    };

    this.store.state.calendarEvents.push(newEvent);
    this.store.saveState();

    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) {
      window.app.showToast('Event Scheduled 📅', `Added "${newEvent.title}" to calendar.`, 'exp');
      window.app.renderAll();
    }
  }

  deleteEvent(eventId) {
    this.store.state.calendarEvents = this.events.filter(e => e.id !== eventId);
    this.store.saveState();
    if (window.app) window.app.renderAll();
  }

  getCategoryColor(category) {
    switch (category) {
      case 'exam': return '#E78895'; // Coral Pink
      case 'assignment': return '#D98D72'; // Terracotta
      case 'presentation': return '#526B55'; // Forest Green
      case 'project': return '#93B5C6'; // Soft Blue
      case 'study': return '#F3D58A'; // Pastel Yellow
      default: return '#A8B99A'; // Sage
    }
  }

  render() {
    const container = document.getElementById('calendar-container');
    if (!container) return;

    if (this.viewMode === 'month') {
      container.innerHTML = this.renderMonthView();
    } else if (this.viewMode === 'agenda') {
      container.innerHTML = this.renderAgendaView();
    }
  }

  renderMonthView() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const monthName = this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const labelHeaders = dayLabels.map(d => `<div class="calendar-day-label">${d}</div>`).join('');

    let cellsHtml = '';

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDate = daysInPrevMonth - i;
      cellsHtml += `<div class="calendar-cell other-month"><div class="calendar-date-number">${prevDate}</div></div>`;
    }

    // Current month cells
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

      const dayEvents = this.events.filter(e => e.date === dateStr);
      const eventsHtml = dayEvents.slice(0, 3).map(e => `
        <div class="calendar-event-pill" style="border-left: 3px solid ${e.color};" title="${e.title} (${e.time})">
          ${e.title}
        </div>
      `).join('');

      cellsHtml += `
        <div class="calendar-cell ${isToday ? 'today' : ''}" onclick="window.academicCalendar.showDayModal('${dateStr}')">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="calendar-date-number">${day}</span>
            ${dayEvents.length > 3 ? `<span style="font-size: 0.68rem; font-weight:700; color:var(--color-terracotta);">+${dayEvents.length - 3}</span>` : ''}
          </div>
          <div class="calendar-cell-events">
            ${eventsHtml}
          </div>
        </div>
      `;
    }

    return `
      <div>
        <div class="calendar-view-header">
          <div style="display: flex; align-items: center; gap: 14px;">
            <h3 style="font-size: 1.35rem; color: var(--color-forest-dark);">${monthName}</h3>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-outline btn-sm" onclick="window.academicCalendar.prevMonth()">◀</button>
              <button class="btn btn-outline btn-sm" onclick="window.academicCalendar.today()">Today</button>
              <button class="btn btn-outline btn-sm" onclick="window.academicCalendar.nextMonth()">▶</button>
            </div>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary btn-sm ${this.viewMode === 'month' ? 'active' : ''}" onclick="window.academicCalendar.viewMode = 'month'; window.academicCalendar.render();">Month</button>
            <button class="btn btn-secondary btn-sm ${this.viewMode === 'agenda' ? 'active' : ''}" onclick="window.academicCalendar.viewMode = 'agenda'; window.academicCalendar.render();">Agenda</button>
            <button class="btn btn-primary btn-sm" onclick="window.academicCalendar.showAddEventModal()">+ Add Event</button>
          </div>
        </div>

        <div class="calendar-month-grid">
          ${labelHeaders}
          ${cellsHtml}
        </div>
      </div>
    `;
  }

  renderAgendaView() {
    const sorted = [...this.events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const agendaItems = sorted.map(e => `
      <div class="card" style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; border-left: 5px solid ${e.color};">
        <div>
          <span class="badge" style="background: var(--color-warm-cream-alt);">${e.category.toUpperCase()}</span>
          <h4 style="margin: 4px 0 2px 0;">${e.title}</h4>
          <span style="font-size: 0.8rem; color: var(--color-muted-text); font-family: var(--font-mono);">📅 ${e.date} at ${e.time}</span>
        </div>
        <button class="btn btn-outline btn-sm" onclick="window.academicCalendar.deleteEvent('${e.id}')">✕</button>
      </div>
    `).join('');

    return `
      <div>
        <div class="calendar-view-header">
          <h3 style="font-size: 1.35rem;">Upcoming Agenda & Deadlines</h3>
          <button class="btn btn-secondary btn-sm" onclick="window.academicCalendar.viewMode = 'month'; window.academicCalendar.render();">Back to Month View</button>
        </div>
        <div style="margin-top: 16px;">
          ${agendaItems || '<p class="empty-state">No scheduled events found.</p>'}
        </div>
      </div>
    `;
  }

  showAddEventModal() {
    const modal = document.getElementById('add-event-modal');
    if (!modal) return;
    const todayStr = new Date().toISOString().split('T')[0];

    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3>Schedule Calendar Event 📅</h3>
          <button class="modal-close-btn" onclick="document.getElementById('add-event-modal').classList.remove('active');">✕</button>
        </div>
        <form onsubmit="event.preventDefault(); window.academicCalendar.handleSubmitNewEvent(this);">
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Event Title</label>
              <input type="text" name="title" required placeholder="e.g. Organic Chemistry Final Exam" style="width: 100%; margin-top: 4px;">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Date</label>
                <input type="date" name="date" required value="${todayStr}" style="width: 100%; margin-top: 4px;">
              </div>
              <div>
                <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Time</label>
                <input type="time" name="time" value="10:00" style="width: 100%; margin-top: 4px;">
              </div>
            </div>
            <div>
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--color-forest-dark);">Category</label>
              <select name="category" style="width: 100%; margin-top: 4px;">
                <option value="exam">Examination</option>
                <option value="assignment">Assignment / Due Date</option>
                <option value="presentation">Presentation / Defense</option>
                <option value="project">Project Milestone</option>
                <option value="study">Group Study / Review</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary" style="margin-top: 10px;">Save to Calendar 🌿</button>
          </div>
        </form>
      </div>
    `;

    modal.classList.add('active');
  }

  handleSubmitNewEvent(form) {
    const formData = new FormData(form);
    this.addEvent({
      title: formData.get('title'),
      date: formData.get('date'),
      time: formData.get('time'),
      category: formData.get('category')
    });
    document.getElementById('add-event-modal').classList.remove('active');
  }

  showDayModal(dateStr) {
    const modal = document.getElementById('day-agenda-modal');
    if (!modal) return;

    const dayEvents = this.events.filter(e => e.date === dateStr);
    const eventsList = dayEvents.map(e => `
      <div style="background: var(--color-warm-cream-alt); padding: 12px; border-radius: var(--radius-sm); border-left: 4px solid ${e.color}; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 700; color: var(--color-forest-dark);">${e.title}</div>
          <div style="font-size: 0.78rem; color: var(--color-muted-text); font-family: var(--font-mono);">${e.time} • ${e.category.toUpperCase()}</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="window.academicCalendar.deleteEvent('${e.id}'); document.getElementById('day-agenda-modal').classList.remove('active');">✕</button>
      </div>
    `).join('');

    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3>Schedule for ${dateStr}</h3>
          <button class="modal-close-btn" onclick="document.getElementById('day-agenda-modal').classList.remove('active');">✕</button>
        </div>
        <div>
          ${eventsList || '<p style="color: var(--color-muted-text); text-align: center; padding: 20px;">No events scheduled for this day yet.</p>'}
        </div>
        <button class="btn btn-primary" style="width: 100%; margin-top: 14px;" onclick="document.getElementById('day-agenda-modal').classList.remove('active'); window.academicCalendar.showAddEventModal();">
          + Add Event on this Date
        </button>
      </div>
    `;

    modal.classList.add('active');
  }
}

// Global Calendar Instance
const academicCalendar = new AcademicCalendar();
window.academicCalendar = academicCalendar;

