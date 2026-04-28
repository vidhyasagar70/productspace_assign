"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskStatusValidation = exports.taskIdValidation = exports.createTaskValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createTaskValidation = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Task title is required')
        .isLength({ min: 2, max: 140 })
        .withMessage('Task title must be between 2 and 140 characters'),
    (0, express_validator_1.body)('description')
        .optional({ nullable: true })
        .isString()
        .withMessage('Description must be a string')
        .isLength({ max: 2000 })
        .withMessage('Description must be less than 2000 characters'),
];
exports.taskIdValidation = [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Task id must be a positive integer'),
];
exports.updateTaskStatusValidation = [
    ...exports.taskIdValidation,
    (0, express_validator_1.body)('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['pending', 'completed'])
        .withMessage('Status must be pending or completed'),
];
