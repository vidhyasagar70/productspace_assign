import crypto from 'crypto';
import { sequelize } from '../config/database';
import { initModels } from '../models';
import { User } from '../models/user.model';
import { Op } from 'sequelize';
import { hashPassword } from '../utils/password';

const backfill = async (): Promise<void> => {
  try {
    initModels();
    await sequelize.authenticate();

    const users = await User.findAll({ where: { passwordHash: { [Op.is]: null } } as any });
    console.log(`Found ${users.length} users with null passwordHash`);

    for (const user of users) {
      const raw = crypto.randomBytes(16).toString('hex');
      const hashed = await hashPassword(raw);
      // eslint-disable-next-line no-await-in-loop
      await user.update({ passwordHash: hashed });
      console.log(`Updated passwordHash for user ${user.id}`);
    }

    console.log('Password backfill complete');
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('Password backfill failed', err);
    process.exit(1);
  }
};

void backfill();
