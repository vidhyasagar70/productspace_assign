"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const models_1 = require("../models");
const user_model_1 = require("../models/user.model");
const sequelize_1 = require("sequelize");
const backfill = async () => {
    try {
        (0, models_1.initModels)();
        await database_1.sequelize.authenticate();
        const users = await user_model_1.User.findAll({ where: { name: { [sequelize_1.Op.is]: null } } });
        console.log(`Found ${users.length} users with null name`);
        for (const user of users) {
            const email = user.email || '';
            const local = email.split('@')[0] || `user${user.id}`;
            const newName = local || `user${user.id}`;
            // Use a simple backfill: local part of email or fallback to user id
            // eslint-disable-next-line no-await-in-loop
            await user.update({ name: newName });
            console.log(`Updated user ${user.id} name -> ${newName}`);
        }
        console.log('Backfill complete');
        await database_1.sequelize.close();
        process.exit(0);
    }
    catch (err) {
        console.error('Backfill failed', err);
        process.exit(1);
    }
};
void backfill();
