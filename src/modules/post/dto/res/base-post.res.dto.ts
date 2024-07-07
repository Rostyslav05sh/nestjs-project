import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Column } from 'typeorm';

import { BrandsEnum } from '../../../../database/entity/enums/brands.enum';
import { CurrencyEnum } from '../../../../database/entity/enums/currency.enum';
import { BaseModel } from '../../../../database/entity/models/base.model';
import { UserResDto } from '../../../user/dto/res/user-res.dto';

export class BasePostResDto extends BaseModel {
  @ApiProperty({
    example: 'Post Title',
    description: 'Post Title',
  })
  title: string;

  @ApiProperty({
    example: 'Post Description',
    description: 'Post Description',
  })
  description: string;

  @ApiProperty({
    example: 'Post Body',
    description: 'Post Body',
  })
  body: string;

  @IsEnum(BrandsEnum)
  @Column({ type: 'enum', enum: BrandsEnum })
  @ApiProperty({
    example: 'bmw',
    description: 'Car brand',
  })
  brand: BrandsEnum;

  @Column()
  @ApiProperty({
    example: 'x5',
    description: 'Car model',
  })
  model: string;

  @ApiProperty({
    example: true,
    description: 'If post is active',
  })
  status: boolean;

  @ApiProperty({
    example: 'usd',
    description: 'Currency',
  })
  currency: CurrencyEnum;

  @ApiProperty({
    example: '5000',
    description: 'Price of car',
  })
  price: string;

  @ApiProperty({
    example: '2008',
    description: 'Year of car',
  })
  year: string;

  @ApiProperty({
    example: ['img1, img2'],
    description: 'Post images',
  })
  images?: string[];

  @ApiProperty({
    example: 'Lviv',
    description: 'Your region',
  })
  region: string;

  @ApiProperty({
    example: true,
    description: 'Is liked',
  })
  liked: boolean;

  user?: UserResDto;
}
