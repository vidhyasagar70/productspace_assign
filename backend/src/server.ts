import { app } from './app';
import { sequelize } from './config/database';
import { env } from './config/env';
import { initModels } from './models';

const startServer = async (): Promise<void> => {
  try {
    initModels();
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

void startServer();
