"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("../config/database");
const models_1 = require("../models");
const user_model_1 = require("../models/user.model");
const sequelize_1 = require("sequelize");
const password_1 = require("../utils/password");
const backfill = async () => {
    try {
        (0, models_1.initModels)();
        await database_1.sequelize.authenticate();
        const users = await user_model_1.User.findAll({ where: { passwordHash: { [sequelize_1.Op.is]: null } } });
        console.log(`Found ${users.length} users with null passwordHash`);
        for (const user of users) {
            const raw = crypto_1.default.randomBytes(16).toString('hex');
            const hashed = await (0, password_1.hashPassword)(raw);
            // eslint-disable-next-line no-await-in-loop
            await user.update({ passwordHash: hashed });
            console.log(`Updated passwordHash for user ${user.id}`);
        }
        console.log('Password backfill complete');
        await database_1.sequelize.close();
        process.exit(0);
    }
    catch (err) {
        console.error('Password backfill failed', err);
        process.exit(1);
    }
};
void backfill();
