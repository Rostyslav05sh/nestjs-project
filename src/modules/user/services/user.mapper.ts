import { ConfigStaticService } from '../../../configs/config.static';
import { AccountTypeEnum } from '../../../database/entity/enums/accountType.enum';
import { UsersRoleEnum } from '../../../database/entity/enums/users-role.enum';
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
      role: user.role as UsersRoleEnum,
      accountType: user.accountType || AccountTypeEnum.BASIC,
      isVerified: user.isVerified || false,
      isDeleted: user.isDeleted || false,
    };
  }

  public static toFollowersListResponseDTO(
    entity: UserEntity[],
    total: number,
    query: FollowListReqDto,
  ): FollowListResDto {
    return {
      data: entity.map(this.toResponseDTO),
      meta: {
        total,
        offset: query.offset,
        limit: query.limit,
      },
    };
  }
}
