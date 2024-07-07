import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Column } from 'typeorm';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { BrandsEnum } from '../../../../database/entity/enums/brands.enum';
import { CurrencyEnum } from '../../../../database/entity/enums/currency.enum';

export class BasePostReqDto {
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  @ApiProperty({
    example: 'Post Title',
    description: 'Post Title',
  })
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  @ApiProperty({
    example: 'Post Description',
    description: 'Post Description',
  })
  description?: string;

  @IsOptional()
  @IsString()
  @Length(0, 3000)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  @ApiProperty({
    example: 'Post Body',
    description: 'Post Body',
  })
  body?: string;

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

  @IsEnum(CurrencyEnum)
  @Type(() => String)
  @ApiProperty({
    example: 'usd',
    description: 'Currency',
  })
  currency: CurrencyEnum;

  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    example: '5000',
    description: 'Price of car',
  })
  price: string;

  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    example: '2008',
    description: 'Year of car',
  })
  year: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(3, 300, { each: true })
  @ArrayMaxSize(25)
  @Transform(TransformHelper.trimArray)
  @Transform(TransformHelper.uniqueItems)
  @Transform(TransformHelper.toLowerCaseArray)
  @ApiProperty({
    example: ['img1, img2'],
    description: 'Post images',
  })
  images?: string[];

  @IsString()
  @Length(0, 3000)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  @ApiProperty({
    example: 'Lviv',
    description: 'Your region',
  })
  region: string;

  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({
    example: true,
    description: 'If post is active',
  })
  status: boolean;
}
