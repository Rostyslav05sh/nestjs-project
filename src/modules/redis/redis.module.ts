import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import Redis from 'ioredis';

import { Config, redisConfig } from '../../configs/config.type';
import { REDIS_CLIENT } from './redis.constants';
import { RedisService } from './redis.service';

const redisProvider: Provider = {
  useFactory: (configService: ConfigService<Config>): Redis => {
    const redisConfig = configService.get<redisConfig>('redis');

    return new Redis({
      port: redisConfig.port,
      host: redisConfig.host,
      password: redisConfig.password,
    });
  },
  provide: REDIS_CLIENT,
  inject: [ConfigService],
};
@Module({
  providers: [RedisService, redisProvider],
  exports: [RedisService, redisProvider],
})
export class RedisModule {}
