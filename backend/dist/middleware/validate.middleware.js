"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidation = void 0;
const express_validator_1 = require("express-validator");
const http_error_1 = require("../utils/http-error");
const handleValidation = (req, _res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new http_error_1.HttpError(400, errors.array().map((error) => error.msg).join(', '));
    }
    next();
};
exports.handleValidation = handleValidation;
