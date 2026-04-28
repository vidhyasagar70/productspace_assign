"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.signup = void 0;
const models_1 = require("../models");
const http_error_1 = require("../utils/http-error");
const jwt_1 = require("../utils/jwt");
const password_1 = require("../utils/password");
const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await models_1.User.findOne({ where: { email } });
        if (existingUser) {
            throw new http_error_1.HttpError(409, 'Email is already registered');
        }
        const passwordHash = await (0, password_1.hashPassword)(password);
        const user = await models_1.User.create({ name, email, passwordHash });
        const token = (0, jwt_1.signToken)({ userId: user.id, email: user.email });
        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.signup = signup;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await models_1.User.findOne({ where: { email } });
        if (!user) {
            throw new http_error_1.HttpError(401, 'Invalid email or password');
        }
        const isMatch = await (0, password_1.comparePassword)(password, user.passwordHash);
        if (!isMatch) {
            throw new http_error_1.HttpError(401, 'Invalid email or password');
        }
        const token = (0, jwt_1.signToken)({ userId: user.id, email: user.email });
        res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const me = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new http_error_1.HttpError(401, 'Unauthorized');
        }
        const user = await models_1.User.findByPk(userId);
        if (!user) {
            throw new http_error_1.HttpError(404, 'User not found');
        }
        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.me = me;
