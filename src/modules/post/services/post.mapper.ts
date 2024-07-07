import { ConfigStaticService } from '../../../configs/config.static';
import { PostEntity } from '../../../database/entity/post.entity';
import { UserMapper } from '../../user/services/user.mapper';
import { PostListReqDto } from '../dto/req/post-list.req.dto';
import { PostResDto } from '../dto/res/post.res.dto';
import { PostListResDto } from '../dto/res/post-list.res.dto';

export class PostMapper {
  public static toResponseDTO(entity: PostEntity): PostResDto {
    const awsConfig = ConfigStaticService.get().aws;
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      body: entity.body,
      brand: entity.brand,
      model: entity.model,
      price: entity.price,
      year: entity.year,
      currency: entity.currency,
      images: Array.isArray(entity.images)
        ? entity.images.map((image) => `${awsConfig.bucketUrl}/${image}`)
        : [],
      region: entity.region,
      liked: entity.likes ? entity.likes.length > 0 : false,
      created: entity.created,
      updated: entity.updated,
      status: entity.status || false,
      user: entity.user ? UserMapper.toResponseDTO(entity.user) : null,
    };
  }

  public static toListResponseDTO(
    entity: PostEntity[],
    total: number,
    query: PostListReqDto,
    averagePrice?: number,
  ): PostListResDto {
    return {
      data: entity.map(this.toResponseDTO),
      meta: {
        total,
        offset: query.offset,
        limit: query.limit,
        averagePrice: averagePrice ?? null,
      },
    };
  }
}
