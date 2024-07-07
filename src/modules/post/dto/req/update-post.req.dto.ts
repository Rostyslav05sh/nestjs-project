import { PickType } from '@nestjs/swagger';

import { BasePostReqDto } from './base-post.req.dto';

export class UpdatePostReqDto extends PickType(BasePostReqDto, [
  'title',
  'body',
  'description',
  'price',
  'currency',
  'year',
]) {}
