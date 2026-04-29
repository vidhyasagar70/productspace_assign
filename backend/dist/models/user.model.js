"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUserModel = exports.User = void 0;
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
}
exports.User = User;
const initUserModel = (sequelize) => {
    User.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(80),
            // Temporarily allow null to let sequelize alter the table on deploy
            // without failing when existing rows have no name value.
            allowNull: true,
        },
        email: {
            type: sequelize_1.DataTypes.STRING(120),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        passwordHash: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        createdAt: sequelize_1.DataTypes.DATE,
        updatedAt: sequelize_1.DataTypes.DATE,
    }, {
        sequelize,
        tableName: 'users',
        modelName: 'User',
    });
};
exports.initUserModel = initUserModel;
