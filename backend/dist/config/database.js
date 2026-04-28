"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const env_1 = require("./env");
exports.sequelize = env_1.env.databaseUrl
    ? new sequelize_1.Sequelize(env_1.env.databaseUrl, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: env_1.env.dbSsl
            ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            }
            : {},
    })
    : new sequelize_1.Sequelize(env_1.env.dbName, env_1.env.dbUser, env_1.env.dbPassword, {
        host: env_1.env.dbHost,
        port: env_1.env.dbPort,
        dialect: 'postgres',
        logging: false,
        dialectOptions: env_1.env.dbSsl
            ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            }
            : {},
    });
