import { body, param } from 'express-validator';

export const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 2, max: 140 })
    .withMessage('Task title must be between 2 and 140 characters'),
  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
];

export const taskIdValidation = [
  param('id').isInt({ min: 1 }).withMessage('Task id must be a positive integer'),
];

export const updateTaskStatusValidation = [
  ...taskIdValidation,
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'completed'])
    .withMessage('Status must be pending or completed'),
];
