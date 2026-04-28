"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const sequelize_1 = require("sequelize");
const http_error_1 = require("../utils/http-error");
const notFoundHandler = (_req, _res, next) => {
    next(new http_error_1.HttpError(404, 'Route not found'));
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof http_error_1.HttpError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }
    if (err instanceof sequelize_1.ValidationError) {
        res.status(400).json({ message: err.message });
        return;
    }
    if (err instanceof Error) {
        res.status(500).json({ message: err.message });
        return;
    }
    res.status(500).json({ message: 'Unexpected server error' });
};
exports.errorHandler = errorHandler;
