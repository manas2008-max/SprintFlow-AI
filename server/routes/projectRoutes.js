const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateTaskStatus,
  deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.patch('/:id/tasks/:taskId', updateTaskStatus);
router.delete('/:id', deleteProject);

module.exports = router;
