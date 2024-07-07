import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { UserEntity } from './user.entity';

@Entity({ name: TableNameEnum.ACTION_TOKENS })
export class ActionTokenEntity extends BaseModel {
  @Column('text')
  actionToken: string;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.actionTokens)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
