import { PickType } from '@nestjs/swagger';

import { BasePostReqDto } from './base-post.req.dto';

export class CreatePostReqDto extends PickType(BasePostReqDto, [
  'title',
  'body',
  'description',
  'brand',
  'model',
  'year',
  'price',
  'currency',
  'region',
]) {}
