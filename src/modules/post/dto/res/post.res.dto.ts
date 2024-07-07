import { PickType } from '@nestjs/swagger';

import { BasePostResDto } from './base-post.res.dto';

export class PostResDto extends PickType(BasePostResDto, [
  'id',
  'title',
  'body',
  'description',
  'brand',
  'model',
  'year',
  'price',
  'currency',
  'images',
  'region',
  'status',
  'liked',
  'created',
  'updated',
  'user',
]) {}
