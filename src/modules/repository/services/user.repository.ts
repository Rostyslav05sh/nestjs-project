import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { FollowEntity } from '../../../database/entity/follow.entity';
import { UserEntity } from '../../../database/entity/user.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { FollowListReqDto } from '../../user/dto/req/follow-list-req.dto';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.manager);
  }

  public async getList(
    userData: IUserData,
    query: FollowListReqDto,
  ): Promise<[UserEntity[], number]> {
    const qb = this.createQueryBuilder('user');
    qb.innerJoin(FollowEntity, 'follow', 'follow.following_id = user.id');
    qb.where('follow.follower_id = :myId');
    qb.andWhere('user.id != :myId');

    qb.setParameter('myId', userData.userId);

    if (query.search) {
      qb.andWhere(
        'LOWER(user.name) LIKE :search OR LOWER(user.phone) LIKE :search OR LOWER(user.bio) LIKE :search',
        { search: `%${query.search.toLowerCase()}%` },
      );
    }

    qb.orderBy('user.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }
}
