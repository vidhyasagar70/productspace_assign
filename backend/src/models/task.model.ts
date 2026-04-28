import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { User } from './user.model';

export type TaskStatus = 'pending' | 'completed';

export class Task extends Model<
  InferAttributes<Task>,
  InferCreationAttributes<Task, { omit: 'id' | 'status' | 'createdAt' | 'updatedAt' }>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string | null;
  declare status: CreationOptional<TaskStatus>;
  declare userId: ForeignKey<User['id']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initTaskModel = (sequelize: Sequelize): void => {
  Task.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(140),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'tasks',
      modelName: 'Task',
    },
  );
};
