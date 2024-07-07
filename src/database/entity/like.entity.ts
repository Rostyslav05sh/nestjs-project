import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';

@Entity({ name: TableNameEnum.LIKES })
export class LikeEntity extends BaseModel {
  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.likes)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column()
  post_id: string;
  @ManyToOne(() => PostEntity, (entity) => entity.likes)
  @JoinColumn({ name: 'post_id' })
  post?: PostEntity;
}
