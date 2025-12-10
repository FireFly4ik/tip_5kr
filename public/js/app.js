const API_URL = '/api/tasks';

const addTaskForm = document.getElementById('addTaskForm');
const tasksContainer = document.getElementById('tasksContainer');
const filterDay = document.getElementById('filterDay');

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  loadStatistics();

  addTaskForm.addEventListener('submit', handleAddTask);

  filterDay.addEventListener('change', handleFilter);
});

async function loadTasks(day = '') {
  try {
    const url = day ? `${API_URL}?day=${encodeURIComponent(day)}` : API_URL;
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      displayTasks(result.data);
    } else {
      console.error('Ошибка загрузки задач:', result.error);
    }
  } catch (error) {
    console.error('Ошибка при загрузке задач:', error);
    showError('Не удалось загрузить задачи');
  }
}

function displayTasks(tasks) {
  if (tasks.length === 0) {
    tasksContainer.innerHTML = `
      <div class="empty-state">
        <h3>📝 Задач пока нет</h3>
        <p>Добавьте первую задачу, используя форму выше</p>
      </div>
    `;
    return;
  }

  const tasksByDay = groupTasksByDay(tasks);
  
  tasksContainer.innerHTML = Object.entries(tasksByDay)
    .map(([day, dayTasks]) => `
      <div class="day-group">
        ${dayTasks.map(task => createTaskCard(task)).join('')}
      </div>
    `).join('');
}

function groupTasksByDay(tasks) {
  return tasks.reduce((acc, task) => {
    if (!acc[task.day]) {
      acc[task.day] = [];
    }
    acc[task.day].push(task);
    return acc;
  }, {});
}

function createTaskCard(task) {
  return `
    <div class="task-card ${task.completed ? 'completed' : ''}" data-id="${task.id}">
      <input 
        type="checkbox" 
        class="task-checkbox" 
        ${task.completed ? 'checked' : ''}
        onchange="toggleTaskCompletion(${task.id}, this.checked)"
      >
      <div class="task-info">
        <span class="task-day">${task.day}</span>
        <div class="task-title">${escapeHtml(task.title)}</div>
        <div class="task-time">⏰ ${task.time}</div>
      </div>
      <div class="task-actions">
        <button class="btn btn-danger btn-small" onclick="deleteTask(${task.id})">
          Удалить
        </button>
      </div>
    </div>
  `;
}

async function handleAddTask(e) {
  e.preventDefault();
  
  const taskData = {
    day: document.getElementById('taskDay').value,
    title: document.getElementById('taskTitle').value,
    time: document.getElementById('taskTime').value,
    completed: false
  };
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      addTaskForm.reset();
      document.getElementById('taskTime').value = '09:00';

      loadTasks(filterDay.value);
      loadStatistics();
      
      showSuccess('Задача успешно добавлена!');
    } else {
      showError(result.error);
    }
  } catch (error) {
    console.error('Ошибка при добавлении задачи:', error);
    showError('Не удалось добавить задачу');
  }
}

async function toggleTaskCompletion(taskId, completed) {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed })
    });
    
    const result = await response.json();
    
    if (result.success) {
      loadTasks(filterDay.value);
      loadStatistics();
    } else {
      showError(result.error);
    }
  } catch (error) {
    console.error('Ошибка при обновлении задачи:', error);
    showError('Не удалось обновить задачу');
  }
}

async function deleteTask(taskId) {
  if (!confirm('Вы уверены, что хотите удалить эту задачу?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.success) {
      loadTasks(filterDay.value);
      loadStatistics();
      showSuccess('Задача удалена');
    } else {
      showError(result.error);
    }
  } catch (error) {
    console.error('Ошибка при удалении задачи:', error);
    showError('Не удалось удалить задачу');
  }
}

function handleFilter() {
  const selectedDay = filterDay.value;
  loadTasks(selectedDay);
}

async function loadStatistics() {
  try {
    const response = await fetch(`${API_URL}/statistics`);
    const result = await response.json();
    
    if (result.success) {
      const stats = result.statistics;
      document.getElementById('totalTasks').textContent = stats.total;
      document.getElementById('completedTasks').textContent = stats.completed;
      document.getElementById('pendingTasks').textContent = stats.pending;
      document.getElementById('completionRate').textContent = `${stats.completionRate}%`;
    }
  } catch (error) {
    console.error('Ошибка при загрузке статистики:', error);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showSuccess(message) {
  alert('✅ ' + message);
}

function showError(message) {
  alert('❌ ' + message);
}
