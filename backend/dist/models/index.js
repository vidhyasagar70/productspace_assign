"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = exports.User = exports.initModels = void 0;
const database_1 = require("../config/database");
const task_model_1 = require("./task.model");
Object.defineProperty(exports, "Task", { enumerable: true, get: function () { return task_model_1.Task; } });
const user_model_1 = require("./user.model");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_model_1.User; } });
const initModels = () => {
    (0, user_model_1.initUserModel)(database_1.sequelize);
    (0, task_model_1.initTaskModel)(database_1.sequelize);
    user_model_1.User.hasMany(task_model_1.Task, {
        foreignKey: 'userId',
        as: 'tasks',
        onDelete: 'CASCADE',
    });
    task_model_1.Task.belongsTo(user_model_1.User, {
        foreignKey: 'userId',
        as: 'user',
    });
};
exports.initModels = initModels;
