import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AccountTypeEnum } from '../../database/entity/enums/accountType.enum';
import { UserRepository } from '../../modules/repository/services/user.repository';

@Injectable()
export class JwtAccountTypeGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let user = request.user;

    user = await this.userRepository.findOneBy({ email: user.email });

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const accountType = user.accountType;

    switch (accountType) {
      case AccountTypeEnum.PREMIUM: {
        return true;
      }
      default:
        throw new ConflictException('Upgrade to premium');
    }
  }
}
