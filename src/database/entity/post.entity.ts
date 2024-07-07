import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { BrandsEntity } from './brands.entity';
import { CommentEntity } from './comment.entity';
import { CurrencyEnum } from './enums/currency.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { LikeEntity } from './like.entity';
import { BaseModel } from './models/base.model';
import { UserEntity } from './user.entity';

@Entity({ name: TableNameEnum.POSTS })
export class PostEntity extends BaseModel {
  @Column('text')
  body: string;

  @Column('text')
  description: string;

  @Column('boolean')
  status: boolean;

  @Column({ type: 'enum', enum: CurrencyEnum })
  currency: CurrencyEnum;

  @Column('text', { nullable: true })
  price: string;

  @Column('text', { nullable: true })
  year: string;

  @Column('text', { nullable: true })
  images?: string;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.posts)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToMany(() => LikeEntity, (entity) => entity.post)
  likes?: LikeEntity[];

  @OneToMany(() => CommentEntity, (entity) => entity.post)
  comments?: CommentEntity[];

  @OneToOne(() => BrandsEntity, (entity) => entity.post)
  brand?: BrandsEntity;
}
