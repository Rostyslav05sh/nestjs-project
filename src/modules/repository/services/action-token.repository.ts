import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ActionTokenEntity } from '../../../database/entity/action-token.entity';

@Injectable()
export class ActionTokenRepository extends Repository<ActionTokenEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ActionTokenEntity, dataSource.manager);
  }
  async findByParams(
    params: Partial<ActionTokenEntity>,
  ): Promise<ActionTokenEntity | undefined> {
    return await this.findOne({ where: params });
  }
}
