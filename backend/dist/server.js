"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const models_1 = require("./models");
const startServer = async () => {
    try {
        (0, models_1.initModels)();
        await database_1.sequelize.authenticate();
        await database_1.sequelize.sync();
        app_1.app.listen(env_1.env.port, () => {
            console.log(`Server running on port ${env_1.env.port}`);
        });
    }
    catch (error) {
        console.error('Failed to start server', error);
        process.exit(1);
    }
};
void startServer();
