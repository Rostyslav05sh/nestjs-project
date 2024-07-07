import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { FollowEntity } from '../../../database/entity/follow.entity';

@Injectable()
export class FollowRepository extends Repository<FollowEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(FollowEntity, dataSource.manager);
  }

  // public async followList(
  //   userData: IUserData,
  //   dto: FollowListReqDto,
  // ): Promise<[UserEntity[], number]> {
  //   const qb = this.createQueryBuilder('follow')
  //     .leftJoinAndSelect('follow.following', 'following')
  //     .where('follow.follower_id = :followerId', {
  //       followerId: userData.userId,
  //     })
  //     .andWhere('following.isDeleted = false')
  //     .skip((dto.page - 1) * dto.limit)
  //     .take(dto.limit)
  //     .orderBy(`following.${dto.sortBy}`, dto.sortOrder);
  //
  //   const [follows, total] = await qb.getManyAndCount();
  //
  //   return [follows.map((follow) => follow.following), total];
  // }
}
