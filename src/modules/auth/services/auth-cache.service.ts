import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';

import { JWTConfig } from '../../../configs/config.type';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class AuthCacheService {
  private readonly jwtConfig: JWTConfig;
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.jwtConfig = configService.get<JWTConfig>('jwt');
  }

  public async saveToken(token: string, userId: string) {
    const key = this.getKey(userId);

    await this.redisService.deleteByKey(key);
    await this.redisService.addOneToSet(key, token);
    await this.redisService.expire(key, this.jwtConfig.accesExpiresIn);
  }

  public async isAccessTokenExist(
    token: string,
    userId: string,
  ): Promise<boolean> {
    const key = this.getKey(userId);
    const net = await this.redisService.sMembers(key);
    return net.includes(token);
  }

  public async deleteAccessToken(userId: string): Promise<void> {
    const key = this.getKey(userId);
    await this.redisService.deleteByKey(key);
  }

  private getKey(userId: string): string {
    return `ACCCESS_TOKEN:${userId}`;
  }
}
