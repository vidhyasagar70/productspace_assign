import { sequelize } from '../config/database';
import { initModels } from '../models';
import { User } from '../models/user.model';
import { Op } from 'sequelize';

const backfill = async (): Promise<void> => {
  try {
    initModels();
    await sequelize.authenticate();

    const users = await User.findAll({ where: { name: { [Op.is]: null } } as any });
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
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('Backfill failed', err);
    process.exit(1);
  }
};

void backfill();
