import { Injectable } from '@nestjs/common';

import { UserEntity } from '../../../database/entity/user.entity';
import { UserMapper } from '../../user/services/user.mapper';
import { AuthResDto } from '../dto/res/auth-res.dto';
import { TokenResDto } from '../dto/res/token-res.dto';
import { ITokenPair } from '../interfaces/token-pair.interface';
import { IUserData } from '../interfaces/user-data.interface';

@Injectable()
export class AuthMapper {
  public static toResponseDTO(
    user: UserEntity,
    tokens: ITokenPair,
  ): AuthResDto {
    return {
      user: UserMapper.toResponseDTO(user),
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  }

  public static toUserDataDTO(user: UserEntity): IUserData {
    return {
      userId: user.id,
      email: user.email,
    };
  }
  public static toRefreshDTO(tokenPair: ITokenPair): TokenResDto {
    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }
}
