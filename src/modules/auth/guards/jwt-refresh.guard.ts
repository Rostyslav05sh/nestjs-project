import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { TokenTypeEnum } from '../enums/token-type.enum';
import { AuthMapper } from '../services/auth.mapper';
import { AuthCacheService } from '../services/auth-cache.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const refreshToken = request.get('Authorization')?.split('Bearer ')[1];
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const payload = await this.tokenService.verifyToken(
      refreshToken,
      TokenTypeEnum.REFRESH,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }

    const findTokenInRedis =
      await this.refreshTokenRepository.isRefreshTokenExist(refreshToken);
    if (!findTokenInRedis) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneBy({ id: payload.userId });
    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = AuthMapper.toUserDataDTO(user);

    return true;
  }
}
