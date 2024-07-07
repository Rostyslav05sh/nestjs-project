import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RefreshTokensEntity } from '../../../database/entity/refresh-tokens.entity';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshTokensEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RefreshTokensEntity, dataSource.manager);
  }

  public async isRefreshTokenExist(refreshToken: string): Promise<boolean> {
    return await this.exists({ where: { refreshToken } });
  }
}
