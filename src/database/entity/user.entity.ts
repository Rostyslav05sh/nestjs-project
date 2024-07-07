import { Column, Entity, OneToMany } from 'typeorm';

import { ActionTokenEntity } from './action-token.entity';
import { CommentEntity } from './comment.entity';
import { AccountTypeEnum } from './enums/accountType.enum';
import { RoleEnum } from './enums/role.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { FollowEntity } from './follow.entity';
import { LikeEntity } from './like.entity';
import { BaseModel } from './models/base.model';
import { PostEntity } from './post.entity';
import { RefreshTokensEntity } from './refresh-tokens.entity';

@Entity({ name: TableNameEnum.USERS })
export class UserEntity extends BaseModel {
  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('text', { nullable: true })
  bio?: string;

  @Column('text', { nullable: true })
  image?: string;

  @Column('text')
  phone: string;

  @Column({ type: 'enum', enum: RoleEnum })
  role: RoleEnum;

  @Column({ type: 'enum', enum: AccountTypeEnum })
  accountType: AccountTypeEnum;

  @Column('boolean')
  isDeleted: boolean;

  @Column('boolean')
  isVerified: boolean;

  @OneToMany(() => PostEntity, (entity) => entity.user)
  posts?: PostEntity[];

  @OneToMany(() => RefreshTokensEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokensEntity[];

  @OneToMany(() => ActionTokenEntity, (entity) => entity.user)
  actionTokens?: ActionTokenEntity[];

  @OneToMany(() => LikeEntity, (entity) => entity.user)
  likes?: LikeEntity[];

  @OneToMany(() => CommentEntity, (entity) => entity.user)
  comments?: CommentEntity[];

  @OneToMany(() => FollowEntity, (entity) => entity.follower)
  followers?: FollowEntity[];

  @OneToMany(() => FollowEntity, (entity) => entity.following)
  following?: FollowEntity[];
}
