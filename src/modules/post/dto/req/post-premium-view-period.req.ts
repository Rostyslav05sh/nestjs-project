import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PostViewPeriodReq {
  @IsOptional()
  @ApiProperty({
    enum: ['day', 'week', 'month'],
    description: 'The period for views count',
  })
  period?: 'day' | 'week' | 'month';
}
