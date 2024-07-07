import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRepository } from '../../repository/services/user.repository';
import { SKIP_AUTH } from '../constants/skip-auth.constant';
import { TokenTypeEnum } from '../enums/token-type.enum';
import { AuthMapper } from '../services/auth.mapper';
import { AuthCacheService } from '../services/auth-cache.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly userRepository: UserRepository,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
    ]);
    if (skipAuth) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const accesToken = request.get('Authorization')?.split('Bearer ')[1];

    if (!accesToken) {
      throw new UnauthorizedException();
    }

    const payload = await this.tokenService.verifyToken(
      accesToken,
      TokenTypeEnum.ACCESS,
    );

    if (!payload) {
      throw new UnauthorizedException();
    }

    const findTokenInRedis = await this.authCacheService.isAccessTokenExist(
      accesToken,
      payload.userId,
    );
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
