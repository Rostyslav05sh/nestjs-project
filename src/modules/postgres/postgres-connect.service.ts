import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as path from 'path';

import { Config, dataBaseConfig } from '../../configs/config.type';

@Injectable()
export class PostgresConnectService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService<Config>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dataBaseConfig = this.configService.get<dataBaseConfig>('dataBase');

    return {
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
        path.join(
          process.cwd(),
          'dist',
          'src',
          'database',
          'migrations',
          '*.js',
        ),
      ],
      synchronize: false,
      migrationsRun: true,
    };
  }
}
