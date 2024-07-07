import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { FollowEntity } from '../../../database/entity/follow.entity';
import { UserEntity } from '../../../database/entity/user.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { FollowListReqDto } from '../../user/dto/req/follow-list-req.dto';

@Injectable()
export class FollowRepository extends Repository<FollowEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(FollowEntity, dataSource.manager);
  }

  public async followList(
    userData: IUserData,
    dto: FollowListReqDto,
  ): Promise<[UserEntity[], number]> {
    const qb = this.createQueryBuilder('follow');
    qb.leftJoinAndSelect('follow.following', 'following');
    qb.where('follow.follower_id = :followerId', {
      followerId: userData.userId,
    });
    qb.andWhere('following.isDeleted = false');
    qb.skip((dto.page - 1) * dto.limit);
    qb.take(dto.limit);
    qb.orderBy(`following.${dto.sortBy}`, dto.sortOrder);

    qb.where('follow.follower_id = :followerId', {
      followerId: userData.userId,
    });
    qb.andWhere('following.isDeleted = false');
    qb.getCount();

    const [follows, total] = await qb.getManyAndCount();

    return [follows.map((follow) => follow.following), total];
  }
}
