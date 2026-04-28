import type { NextFunction, Request, Response } from 'express';
import { Task } from '../models';
import { HttpError } from '../utils/http-error';
import type { TaskStatus } from '../models/task.model';

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpError(401, 'Unauthorized');
    }

    const { title, description } = req.body as {
      title: string;
      description?: string;
    };

    const task = await Task.create({
      title,
      description: description ?? null,
      userId,
    });

    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
};

export const getMyTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpError(401, 'Unauthorized');
    }

    const tasks = await Task.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpError(401, 'Unauthorized');
    }

    const taskId = Number(req.params.id);
    const { status } = req.body as { status: TaskStatus };

    const task = await Task.findOne({ where: { id: taskId, userId } });
    if (!task) {
      throw new HttpError(404, 'Task not found');
    }

    task.status = status;
    await task.save();

    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpError(401, 'Unauthorized');
    }

    const taskId = Number(req.params.id);
    const task = await Task.findOne({ where: { id: taskId, userId } });
    if (!task) {
      throw new HttpError(404, 'Task not found');
    }

    await task.destroy();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
