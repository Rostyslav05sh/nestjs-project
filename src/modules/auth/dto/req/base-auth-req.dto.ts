import { PickType } from '@nestjs/swagger';

import { BaseUserReqDto } from '../../../user/dto/req/base-user-req.dto';

export class BaseAuthReqDto extends PickType(BaseUserReqDto, [
  'name',
  'password',
  'email',
  'phone',
  'bio',
  'image',
]) {}
