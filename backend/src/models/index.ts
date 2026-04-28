import { sequelize } from '../config/database';
import { initTaskModel, Task } from './task.model';
import { initUserModel, User } from './user.model';

export const initModels = (): void => {
  initUserModel(sequelize);
  initTaskModel(sequelize);

  User.hasMany(Task, {
    foreignKey: 'userId',
    as: 'tasks',
    onDelete: 'CASCADE',
  });

  Task.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
};

export { User, Task };
