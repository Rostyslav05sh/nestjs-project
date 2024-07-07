import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AdministratorsRoleEnum } from '../database/entity/enums/administrators-role.enum';
import { UsersRoleEnum } from '../database/entity/enums/users-role.enum';
import { UserRepository } from '../modules/repository/services/user.repository';

@Injectable()
export class JwtSellerAccountAccessGuard implements CanActivate {
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

    const roleType = user.role;
    switch (roleType) {
      case UsersRoleEnum.SELLER: {
        return true;
      }
      case AdministratorsRoleEnum.MANAGER: {
        return true;
      }
      case AdministratorsRoleEnum.ADMIN: {
        return true;
      }
      default:
        throw new ConflictException(
          "Your account doesn't have access to do this",
        );
    }
  }
}
