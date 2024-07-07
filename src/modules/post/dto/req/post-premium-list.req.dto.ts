import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class PostPremiumListReqDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;

  @IsOptional()
  @IsString()
  @Transform(TransformHelper.toLowerCase)
  @Transform(TransformHelper.trim)
  brand?: string;

  @IsOptional()
  @IsString()
  @Transform(TransformHelper.toLowerCase)
  @Transform(TransformHelper.trim)
  model?: string;

  @IsOptional()
  @IsString()
  @Transform(TransformHelper.toLowerCase)
  @Transform(TransformHelper.trim)
  region?: string;

  @IsOptional()
  @IsString()
  @Transform(TransformHelper.toLowerCase)
  @Transform(TransformHelper.trim)
  search?: string;
}
