import { Column, Entity, OneToMany } from 'typeorm';

import { ActionTokenEntity } from './action-token.entity';
import { AccountTypeEnum } from './enums/accountType.enum';
import { AdministratorsRoleEnum } from './enums/administrators-role.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { UsersRoleEnum } from './enums/users-role.enum';
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

  @Column({
    type: 'enum',
    enum: [
      ...Object.values(UsersRoleEnum),
      ...Object.values(AdministratorsRoleEnum),
    ],
    default: UsersRoleEnum.CUSTOMER,
  })
  role: UsersRoleEnum | AdministratorsRoleEnum = UsersRoleEnum.CUSTOMER;

  @Column({
    type: 'enum',
    enum: AccountTypeEnum,
    default: AccountTypeEnum.BASIC,
  })
  accountType: AccountTypeEnum = AccountTypeEnum.BASIC;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean = false;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean = false;

  @OneToMany(() => PostEntity, (entity) => entity.user)
  posts?: PostEntity[];

  @OneToMany(() => RefreshTokensEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokensEntity[];

  @OneToMany(() => ActionTokenEntity, (entity) => entity.user)
  actionTokens?: ActionTokenEntity[];

  @OneToMany(() => LikeEntity, (entity) => entity.user)
  likes?: LikeEntity[];

  @OneToMany(() => FollowEntity, (entity) => entity.follower)
  follower?: FollowEntity[];

  @OneToMany(() => FollowEntity, (entity) => entity.following)
  following?: FollowEntity[];
}
