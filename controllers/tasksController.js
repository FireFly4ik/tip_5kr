let tasks = [
  {
    id: 1,
    day: 'Понедельник',
    title: 'Утренняя зарядка',
    time: '07:00',
    completed: false
  },
  {
    id: 2,
    day: 'Понедельник',
    title: 'Работа над проектом',
    time: '10:00',
    completed: false
  },
  {
    id: 3,
    day: 'Вторник',
    title: 'Встреча с командой',
    time: '14:00',
    completed: false
  },
  {
    id: 4,
    day: 'Среда',
    title: 'Йога',
    time: '18:00',
    completed: true
  }
];

let nextId = 5;

const getAllTasks = (req, res) => {
  const { day } = req.query;
  
  if (day) {
    const filteredTasks = tasks.filter(task => 
      task.day.toLowerCase() === day.toLowerCase()
    );
    return res.json({
      success: true,
      count: filteredTasks.length,
      data: filteredTasks
    });
  }
  
  res.json({
    success: true,
    count: tasks.length,
    data: tasks
  });
};

const getTaskById = (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      error: `Задача с ID ${taskId} не найдена`
    });
  }
  
  res.json({
    success: true,
    data: task
  });
};

const createTask = (req, res) => {
  const { day, title, time, completed } = req.body;

  if (!day || !title) {
    return res.status(400).json({
      success: false,
      error: 'Поля day и title обязательны'
    });
  }
  
  const newTask = {
    id: nextId++,
    day,
    title,
    time: time || '00:00',
    completed: completed || false
  };
  
  tasks.push(newTask);
  
  res.status(201).json({
    success: true,
    message: 'Задача успешно создана',
    data: newTask
  });
};

const updateTask = (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Задача с ID ${taskId} не найдена`
    });
  }
  
  const { day, title, time, completed } = req.body;

  if (day !== undefined) tasks[taskIndex].day = day;
  if (title !== undefined) tasks[taskIndex].title = title;
  if (time !== undefined) tasks[taskIndex].time = time;
  if (completed !== undefined) tasks[taskIndex].completed = completed;
  
  res.json({
    success: true,
    message: 'Задача успешно обновлена',
    data: tasks[taskIndex]
  });
};

const deleteTask = (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Задача с ID ${taskId} не найдена`
    });
  }
  
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Задача успешно удалена',
    data: deletedTask
  });
};

const getStatistics = (req, res) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const tasksByDay = tasks.reduce((acc, task) => {
    acc[task.day] = (acc[task.day] || 0) + 1;
    return acc;
  }, {});
  
  res.json({
    success: true,
    statistics: {
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      byDay: tasksByDay
    }
  });
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getStatistics
};
