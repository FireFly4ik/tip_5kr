// Подключаем Express
const express = require('express');
const path = require('path');
const tasksRoutes = require('./routes/tasks');
const requestLogger = require('./middlewares/requestLogger');

// Создаем приложение
const app = express();

// Определяем порт
const PORT = process.env.PORT || 3000;

// Middleware для парсинга JSON
app.use(express.json());

// Middleware для парсинга данных из форм
app.use(express.urlencoded({ extended: true }));

// Подключаем кастомный middleware для логирования запросов
app.use(requestLogger);

// Раздача статических файлов из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Подключаем роуты для работы с задачами
app.use('/api/tasks', tasksRoutes);

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обработка несуществующих маршрутов (404)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Маршрут не найден',
    path: req.path 
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка:', err.stack);
  res.status(500).json({ 
    error: 'Внутренняя ошибка сервера',
    message: err.message 
  });
});

// Запускаем сервер
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📝 Открой браузер и перейди по адресу выше`);
});
