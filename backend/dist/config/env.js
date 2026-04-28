"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const parseBoolean = (value, fallback = false) => {
    if (value === undefined)
        return fallback;
    return value.toLowerCase() === 'true';
};
exports.env = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 5000),
    jwtSecret: process.env.JWT_SECRET ?? 'change_this_secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    dbHost: process.env.DB_HOST ?? 'localhost',
    dbPort: Number(process.env.DB_PORT ?? 5432),
    dbName: process.env.DB_NAME ?? 'task_saas',
    dbUser: process.env.DB_USER ?? 'postgres',
    dbPassword: process.env.DB_PASSWORD ?? 'postgres',
    dbSsl: parseBoolean(process.env.DB_SSL, false),
    databaseUrl: process.env.DATABASE_URL,
};
