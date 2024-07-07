import { PickType } from '@nestjs/swagger';

import { BaseUserReqDto } from '../../../user/dto/req/base-user-req.dto';

export class ForgotPasswordReqDto extends PickType(BaseUserReqDto, ['email']) {}
