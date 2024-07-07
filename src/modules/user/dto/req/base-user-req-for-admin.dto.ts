import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { AccountTypeEnum } from '../../../../database/entity/enums/accountType.enum';
import { AdministratorsRoleEnum } from '../../../../database/entity/enums/administrators-role.enum';

export class BaseUserReqForAdminDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  bio?: string;

  @IsOptional()
  @IsString()
  @Length(0, 3000)
  image?: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsString()
  @Length(0, 300)
  @Matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)
  email: string;

  @ApiProperty({ example: '123qwe!@#QWE' })
  @IsString()
  @Length(0, 300)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  password: string;

  @ApiProperty({ example: '+380999999999' })
  @IsOptional()
  @IsString()
  @Length(0, 300)
  @Matches(
    /^[\+]?3?[\s]?8?[\s]?\(?0\d{2}?\)?[\s]?\d{3}[\s|-]?\d{2}[\s|-]?\d{2}$/,
  )
  phone?: string;

  @ApiProperty({ example: 'admin' })
  @IsEnum(AdministratorsRoleEnum)
  role: AdministratorsRoleEnum;

  @ApiProperty({ example: 'basic' })
  accountType: AccountTypeEnum;

  @ApiProperty({ example: false })
  isDeleted: boolean;

  @ApiProperty({ example: true })
  isVerified: boolean;
}
