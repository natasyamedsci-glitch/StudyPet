/**
 * STUDYPET — Academic Planner & Task Engine
 * Comprehensive Task Management, Subtasks, Task Timeline & Gamified Rewards
 */

class TaskManager {
  constructor() {
    this.store = window.dataStore;
    this.statusFilter = 'all';
    this.priorityFilter = 'all';
    this.subjectFilter = 'all';
    this.searchQuery = '';
    this.sortBy = 'deadline';
  }

  get tasks() {
    return this.store.state.tasks || [];
  }

  getFilteredTasks() {
    return this.tasks.filter(task => {
      // Status filter
      if (this.statusFilter !== 'all') {
        if (this.statusFilter === 'overdue') {
          const isOverdue = new Date(task.deadline).getTime() < Date.now() && task.status !== 'completed';
          if (!isOverdue) return false;
        } else if (task.status !== this.statusFilter) {
          return false;
        }
      }

      // Priority filter
      if (this.priorityFilter !== 'all' && task.priority !== this.priorityFilter) {
        return false;
      }

      // Subject filter
      if (this.subjectFilter !== 'all' && task.subject !== this.subjectFilter) {
        return false;
      }

      // Search query
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesSubject = task.subject.toLowerCase().includes(q);
        const matchesDesc = (task.description || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesSubject && !matchesDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (this.sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (this.sortBy === 'priority') {
        const order = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (order[b.priority] || 0) - (order[a.priority] || 0);
      } else if (this.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }

  createTask(data) {
    const newTask = {
      id: 'task_' + Date.now(),
      title: data.title.trim(),
      subject: data.subject.trim() || 'General',
      category: data.category || 'Assignment',
      deadline: data.deadline,
      priority: data.priority || 'medium',
      status: 'not-started',
      estimatedMinutes: parseInt(data.estimatedMinutes || 60, 10),
      actualMinutes: 0,
      description: data.description || '',
      subtasks: data.subtasks || [],
      createdAt: new Date().toISOString(),
      timeline: [
        { text: 'Task created', time: 'Just now' }
      ]
    };

    this.store.state.tasks.unshift(newTask);

    // Also add to Calendar events automatically!
    if (data.deadline) {
      this.store.state.calendarEvents.push({
        id: 'cal_' + newTask.id,
        title: newTask.title,
        date: data.deadline.split('T')[0],
        category: newTask.category.toLowerCase(),
        time: data.deadline.split('T')[1] || '23:59',
        color: newTask.priority === 'urgent' ? '#D98D72' : '#526B55'
      });
    }

    this.store.saveState();
    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) {
      window.app.showToast('Task Created 📝', `"${newTask.title}" added to your planner.`, 'exp');
      window.app.renderAll();
    }
  }

  updateTask(taskId, updates) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    Object.assign(task, updates);
    this.store.saveState();
    if (window.app) window.app.renderAll();
  }

  deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this academic task?')) return;

    this.store.state.tasks = this.tasks.filter(t => t.id !== taskId);
    this.store.state.calendarEvents = this.store.state.calendarEvents.filter(c => c.id !== 'cal_' + taskId);
    this.store.saveState();

    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) {
      window.app.showToast('Task Deleted', 'Removed from planner.', 'default');
      window.app.renderAll();
    }
  }

  toggleTaskComplete(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.status === 'completed') {
      task.status = 'in-progress';
      task.timeline.push({ text: 'Task reopened', time: 'Just now' });
      this.store.saveState();
    } else {
      task.status = 'completed';
      // Mark all subtasks complete too
      if (task.subtasks) {
        task.subtasks.forEach(st => st.completed = true);
      }
      task.timeline.push({ text: 'Task completed! (+40 EXP, +25 Coins)', time: 'Just now' });

      // Academic Reward
      const expReward = 40;
      const coinReward = 25;
      this.store.addRewards(expReward, coinReward, `Completed Task: ${task.title}`);
      if (window.petManager) window.petManager.processExpGain(expReward);

      this.store.state.user.todayCompletedTasks = (this.store.state.user.todayCompletedTasks || 0) + 1;
      this.store.saveState();

      if (window.soundEngine) {
        window.soundEngine.playCoin();
        setTimeout(() => window.soundEngine.playSparkle(), 300);
      }

      if (window.app) {
        window.app.showToast('Task Master! 🎉', `Completed "${task.title}" (+${expReward} EXP, +${coinReward} 🪙)`, 'coin');
      }
    }

    if (window.app) window.app.renderAll();
  }

  toggleSubtask(taskId, subtaskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) return;

    const sub = task.subtasks.find(s => s.id === subtaskId);
    if (!sub) return;

    sub.completed = !sub.completed;
    task.timeline.push({
      text: `${sub.completed ? 'Checked off' : 'Unchecked'} subtask: "${sub.title}"`,
      time: 'Just now'
    });

    // Auto-progress status
    const allDone = task.subtasks.every(s => s.completed);
    if (allDone && task.status !== 'completed') {
      this.toggleTaskComplete(taskId);
      return;
    } else if (task.status === 'not-started') {
      task.status = 'in-progress';
    }

    this.store.saveState();
    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) window.app.renderAll();
  }

  studyTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (window.studyTimer) {
      window.studyTimer.selectedSubject = task.subject;
      window.studyTimer.selectedTaskId = task.id;
    }

    if (window.app) {
      window.app.navigateTo('study-room');
      window.app.showToast('Ready to Study! 📖', `Loaded ${task.title} into Focus Room.`, 'exp');
    }
  }

  // Open Task Timeline Modal
  showTaskTimeline(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    const modal = document.getElementById('task-timeline-modal');
    if (!modal) return;

    const timelineHtml = (task.timeline || []).map(item => `
      <div style="display: flex; gap: 14px; position: relative; padding-bottom: 20px;">
        <div style="width: 12px; height: 12px; border-radius: 50%; background: var(--color-forest); margin-top: 5px; flex-shrink: 0; box-shadow: 0 0 0 4px var(--color-sage-soft);"></div>
        <div>
          <div style="font-weight: 700; color: var(--color-forest-dark); font-size: 0.92rem;">${item.text}</div>
          <div style="font-size: 0.75rem; color: var(--color-muted-text); font-family: var(--font-mono);">${item.time}</div>
        </div>
      </div>
    `).join('');

    const subtasksHtml = (task.subtasks || []).map(st => `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
        <input type="checkbox" ${st.completed ? 'checked' : ''} onchange="window.taskManager.toggleSubtask('${task.id}', '${st.id}')">
        <span style="${st.completed ? 'text-decoration: line-through; opacity: 0.6;' : 'font-weight: 600;'}">${st.title}</span>
      </div>
    `).join('');

    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <span class="task-subject-tag">${task.subject}</span>
            <h3 style="margin-top: 6px; font-size: 1.3rem;">${task.title}</h3>
          </div>
          <button class="modal-close-btn" onclick="document.getElementById('task-timeline-modal').classList.remove('active');">✕</button>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 0.95rem; margin-bottom: 8px; color: var(--color-muted-text);">Subtasks & Progress</h4>
          ${subtasksHtml || '<p style="color: var(--color-muted-text); font-size: 0.85rem;">No subtasks added yet.</p>'}
        </div>

        <div>
          <h4 style="font-size: 0.95rem; margin-bottom: 14px; color: var(--color-muted-text);">Task History & Timeline</h4>
          <div style="border-left: 2px dashed var(--color-border); margin-left: 5px; padding-left: 12px;">
            ${timelineHtml}
          </div>
        </div>

        <div style="margin-top: 24px; display: flex; justify-content: flex-end; gap: 10px;">
          <button class="btn btn-primary" onclick="document.getElementById('task-timeline-modal').classList.remove('active'); window.taskManager.studyTask('${task.id}');">
            Start Focus Session on This Task ⏱️
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }
}

// Global Task Manager Instance
const taskManager = new TaskManager();
window.taskManager = taskManager;

