import * as path from 'node:path';

import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import getter from './src/configs/config';

dotenv.config({ path: './environments/local.env' });

const dataBaseConfig = getter().dataBase;
export default new DataSource({
  type: 'postgres',
  port: dataBaseConfig.port,
  host: dataBaseConfig.host,
  username: dataBaseConfig.user,
  password: dataBaseConfig.password,
  database: dataBaseConfig.dbName,
  entities: [
    path.join(
      process.cwd(),
      'dist',
      'src',
      'database',
      'entity',
      '*.entity.js',
    ),
  ],
  migrations: [
    path.join(process.cwd(), 'dist', 'src', 'database', 'migrations', '*.js'),
  ],
  synchronize: false,
  migrationsRun: true,
});
