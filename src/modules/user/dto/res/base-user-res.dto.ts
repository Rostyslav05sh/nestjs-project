import { ApiProperty } from '@nestjs/swagger';

import { AccountTypeEnum } from '../../../../database/entity/enums/accountType.enum';
import { RoleEnum } from '../../../../database/entity/enums/role.enum';

export class BaseUserResDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The id of the User',
  })
  id: string;

  @ApiProperty({
    example: 'Rostyslav',
    description: 'The name of the User',
  })
  public readonly name: string;

  @ApiProperty({
    example: 'test@gmail.com',
    description: 'The email of the User',
  })
  public readonly email: string;

  @ApiProperty({
    example: 'Hi! My name Rostyslav and i am selling cars since 1999.',
    description: 'The bio of the User',
  })
  public readonly bio?: string;

  @ApiProperty({
    example: '+380999999999',
    description: 'The phone number of the User',
  })
  public readonly phone: string;

  @ApiProperty({
    example: 'https://www.example.com/avatar.jpg',
    description: 'The avatar of the User',
  })
  public readonly image?: string;

  @ApiProperty({
    description: 'If following true',
  })
  public readonly isFollowed?: boolean;

  @ApiProperty({
    example: 'customer',
    description: 'The role of the User',
  })
  public readonly role: RoleEnum;

  @ApiProperty({
    example: 'basic',
    description: 'The role of the User',
  })
  public readonly accountType: AccountTypeEnum;

  @ApiProperty({
    example: false,
    description: 'If User deleted true',
  })
  public readonly isDeleted: boolean;

  @ApiProperty({
    example: true,
    description: 'If User verified true',
  })
  public readonly isVerified: boolean;
}
