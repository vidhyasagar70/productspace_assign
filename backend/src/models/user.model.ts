import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize';
import type { Task } from './task.model';

export class User extends Model<
  InferAttributes<User, { omit: 'tasks' }>,
  InferCreationAttributes<User, { omit: 'id' | 'tasks' }>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare tasks?: NonAttribute<Task[]>;
}

export const initUserModel = (sequelize: Sequelize): void => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(80),
        // Temporarily allow null to let sequelize alter the table on deploy
        // without failing when existing rows have no name value.
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
    },
  );
};
