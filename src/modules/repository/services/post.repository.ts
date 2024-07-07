import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { PostEntity } from '../../../database/entity/post.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { PostListReqDto } from '../../post/dto/req/post-list.req.dto';
import { PostPremiumListReqDto } from '../../post/dto/req/post-premium-list.req.dto';

@Injectable()
export class PostRepository extends Repository<PostEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PostEntity, dataSource.manager);
  }

  public async findPostByIdForAdministrator(
    postId: string,
  ): Promise<PostEntity> {
    const qb = this.createQueryBuilder('post');
    qb.leftJoinAndSelect('post.likes', 'like');
    qb.leftJoinAndSelect('post.user', 'user');

    qb.where('post.id = :postId');
    qb.setParameter('postId', postId);

    return await qb.getOne();
  }
  public async findPostById(
    userData: IUserData,
    postId: string,
  ): Promise<PostEntity> {
    const qb = this.createQueryBuilder('post');
    qb.leftJoinAndSelect('post.likes', 'like', 'post.user_id = :myId');
    qb.leftJoinAndSelect('post.user', 'user');
    qb.leftJoinAndSelect(
      'user.following',
      'follow',
      'follow.follower_id = :myId',
    );

    qb.andWhere('post.id = :postId');
    qb.andWhere('post.status = true');
    qb.setParameter('postId', postId);
    qb.setParameter('myId', userData.userId);

    return await qb.getOne();
  }

  public async countUserPosts(userId: string): Promise<number> {
    return await this.createQueryBuilder('post')
      .where('post.user_id = :userId', { userId })
      .getCount();
  }

  public async getList(
    userData: IUserData,
    query: PostListReqDto,
  ): Promise<[PostEntity[], number]> {
    const qb = this.createQueryBuilder('post');
    qb.leftJoinAndSelect('post.likes', 'like', 'post.user_id = :myId');
    qb.leftJoinAndSelect('post.user', 'user');
    qb.leftJoinAndSelect(
      'user.following',
      'follow',
      'follow.follower_id = :myId',
    );

    qb.andWhere('post.status = true');
    qb.setParameter('myId', userData.userId);

    if (query.search) {
      qb.andWhere(
        'CONCAT(LOWER(post.title), LOWER(post.description), LOWER(post.body)) LIKE :search',
      );
      qb.setParameter('search', `%${query.search}%`);
    }

    qb.orderBy('post.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }
  public async getListForAdministrator(
    userData: IUserData,
    query: PostListReqDto,
  ): Promise<[PostEntity[], number]> {
    const qb = this.createQueryBuilder('post');
    qb.leftJoinAndSelect('post.likes', 'like', 'post.user_id = :myId');
    qb.leftJoinAndSelect('post.user', 'user');
    qb.leftJoinAndSelect(
      'user.following',
      'follow',
      'follow.follower_id = :myId',
    );
    qb.andWhere('post.status = false');

    qb.setParameter('myId', userData.userId);

    if (query.search) {
      qb.andWhere(
        'CONCAT(LOWER(post.title), LOWER(post.description), LOWER(post.body)) LIKE :search',
      );
      qb.setParameter('search', `%${query.search}%`);
    }

    qb.orderBy('post.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }

  public async getStatistic(
    query: PostPremiumListReqDto,
  ): Promise<[PostEntity[], number]> {
    const qb = this.createQueryBuilder('post');
    qb.leftJoinAndSelect('post.likes', 'like');
    qb.leftJoinAndSelect('post.user', 'user');
    qb.leftJoinAndSelect('user.following', 'follow');

    qb.andWhere('post.status = true');

    if (query.search) {
      qb.andWhere(
        'CONCAT(LOWER(post.title), LOWER(post.description), LOWER(post.body)) LIKE :search',
      );
      qb.setParameter('search', `%${query.search}%`);
    }

    if (query.brand) {
      qb.andWhere('post.brand = :brand', {
        brand: query.brand,
      });
    }

    if (query.model) {
      qb.andWhere('LOWER(post.model) = :model', { model: query.model });
    }

    if (query.region) {
      qb.andWhere('LOWER(post.region) = :region', { region: query.region });
    }

    qb.orderBy('post.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }

  public async calculateAveragePrice(
    query: PostPremiumListReqDto,
  ): Promise<number> {
    const qb = this.createQueryBuilder('post').select(
      'AVG(post.price)',
      'avgPrice',
    );

    qb.andWhere('post.status = true');

    if (query.brand) {
      qb.andWhere('post.brand = :brand', { brand: query.brand });
    }

    if (query.model) {
      qb.andWhere('LOWER(post.model) = :model', { model: query.model });
    }

    if (query.region) {
      qb.andWhere('LOWER(post.region) = :region', { region: query.region });
    }

    const result = await qb.getRawOne();
    return result ? parseFloat(result.avgPrice) : 0;
  }

  public async getViewsByPeriod(
    postId: string,
    period: string,
  ): Promise<number> {
    const currentDate = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 1);
        break;
      case 'week':
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1,
        );
        break;
      default:
        startDate = new Date();
    }

    const viewCounts = await this.createQueryBuilder('post')
      .leftJoin('post.views', 'view', 'view.postId = :postId')
      .andWhere('post.id = :postId', { postId })
      .andWhere('view.created >= :startDate', { startDate })
      .select('COUNT(view.id) as views')
      .getRawOne();

    if (viewCounts && viewCounts.views) {
      return parseInt(viewCounts.views);
    } else {
      return 0;
    }
  }
}
