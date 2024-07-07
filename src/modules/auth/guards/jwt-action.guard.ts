import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TokenTypeEnum } from '../enums/token-type.enum';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtActionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const tokenType = this.reflector.get<TokenTypeEnum>(
      'type',
      context.getHandler(),
    );

    const tokenKey =
      this.reflector.get<string>('key', context.getHandler()) || 'token';

    const token = request.query[tokenKey];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.tokenService.verifyToken(token, tokenType);
      request.jwtPayload = payload;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
