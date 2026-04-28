"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTaskStatus = exports.getMyTasks = exports.createTask = void 0;
const models_1 = require("../models");
const http_error_1 = require("../utils/http-error");
const createTask = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new http_error_1.HttpError(401, 'Unauthorized');
        }
        const { title, description } = req.body;
        const task = await models_1.Task.create({
            title,
            description: description ?? null,
            userId,
        });
        res.status(201).json({ task });
    }
    catch (error) {
        next(error);
    }
};
exports.createTask = createTask;
const getMyTasks = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new http_error_1.HttpError(401, 'Unauthorized');
        }
        const tasks = await models_1.Task.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({ tasks });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyTasks = getMyTasks;
const updateTaskStatus = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new http_error_1.HttpError(401, 'Unauthorized');
        }
        const taskId = Number(req.params.id);
        const { status } = req.body;
        const task = await models_1.Task.findOne({ where: { id: taskId, userId } });
        if (!task) {
            throw new http_error_1.HttpError(404, 'Task not found');
        }
        task.status = status;
        await task.save();
        res.status(200).json({ task });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTaskStatus = updateTaskStatus;
const deleteTask = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new http_error_1.HttpError(401, 'Unauthorized');
        }
        const taskId = Number(req.params.id);
        const task = await models_1.Task.findOne({ where: { id: taskId, userId } });
        if (!task) {
            throw new http_error_1.HttpError(404, 'Task not found');
        }
        await task.destroy();
        res.status(200).json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTask = deleteTask;
