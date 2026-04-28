import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getMyTasks,
  updateTaskStatus,
} from '../controllers/task.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { handleValidation } from '../middleware/validate.middleware';
import {
  createTaskValidation,
  taskIdValidation,
  updateTaskStatusValidation,
} from '../validators/task.validator';

const taskRouter = Router();

taskRouter.use(requireAuth);

taskRouter.post('/', createTaskValidation, handleValidation, createTask);
taskRouter.get('/', getMyTasks);
taskRouter.patch(
  '/:id/status',
  updateTaskStatusValidation,
  handleValidation,
  updateTaskStatus,
);
taskRouter.delete('/:id', taskIdValidation, handleValidation, deleteTask);

export { taskRouter };
