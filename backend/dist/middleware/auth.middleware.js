"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const http_error_1 = require("../utils/http-error");
const jwt_1 = require("../utils/jwt");
const requireAuth = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        throw new http_error_1.HttpError(401, 'Authorization token missing or invalid');
    }
    const token = authHeader.split(' ')[1];
    const payload = (0, jwt_1.verifyToken)(token);
    req.user = payload;
    next();
};
exports.requireAuth = requireAuth;
