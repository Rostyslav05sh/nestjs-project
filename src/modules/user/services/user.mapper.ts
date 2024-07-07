import { ConfigStaticService } from '../../../configs/config.static';
import { UserEntity } from '../../../database/entity/user.entity';
import { FollowListReqDto } from '../dto/req/follow-list-req.dto';
import { FollowListResDto } from '../dto/res/follow-list-res.dto';
import { UserResDto } from '../dto/res/user-res.dto';

export class UserMapper {
  public static toResponseDTO(user: UserEntity): UserResDto {
    const awsConfig = ConfigStaticService.get().aws;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      phone: user.phone,
      image: user.image ? `${awsConfig.bucketUrl}/${user.image}` : null,
      role: user.role,
      accountType: user.accountType,
      isFollowed: user.following ? user.following.length > 0 : false,
      isVerified: user.isVerified,
      isDeleted: user.isDeleted,
    };
  }

  public static toFollowListResponseDTO(
    follows: UserEntity[],
    total: number,
    dto: FollowListReqDto,
  ): FollowListResDto {
    const followings = follows.map((follow) => this.toResponseDTO(follow));
    return {
      followings,
      meta: {
        page: dto.page,
        limit: dto.limit,
        total,
        sortBy: dto.sortBy,
        sortOrder: dto.sortOrder,
      },
    };
  }
}
