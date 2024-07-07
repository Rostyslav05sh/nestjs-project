import { PickType } from '@nestjs/swagger';

import { BaseUserReqForAdminDto } from '../../../user/dto/req/base-user-req-for-admin.dto';

export class SignUpByAdminReqDto extends PickType(BaseUserReqForAdminDto, [
  'name',
  'email',
  'password',
  'bio',
  'phone',
  'role',
]) {}
