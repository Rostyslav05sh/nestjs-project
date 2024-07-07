import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

import { TokenTypeEnum } from '../enums/token-type.enum';

export const CheckActionToken = (
  type: TokenTypeEnum,
  key: string = 'token',
) => {
  return SetMetadata('type', type) && SetMetadata('key', key);
};

export const JwtPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.jwtPayload;
  },
);
