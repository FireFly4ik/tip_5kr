const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getStatistics
} = require('../controllers/tasksController');

router.get('/', getAllTasks);

router.get('/statistics', getStatistics);

router.get('/:id', getTaskById);

router.post('/', createTask);

router.put('/:id', updateTask);

router.delete('/:id', deleteTask);

module.exports = router;
