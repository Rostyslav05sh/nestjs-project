import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BrandsEnum } from './enums/brands.enum';
import { CurrencyEnum } from './enums/currency.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { LikeEntity } from './like.entity';
import { BaseModel } from './models/base.model';
import { UserEntity } from './user.entity';
import { PostViewEntity } from './view.entity';

@Entity({ name: TableNameEnum.POSTS })
export class PostEntity extends BaseModel {
  @Column('text')
  title: string;

  @IsOptional()
  @Column('text')
  description?: string;

  @IsOptional()
  @Column('text')
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

  @IsOptional()
  @Column('boolean')
  status: boolean = false;

  @Column({ type: 'enum', enum: CurrencyEnum })
  currency: CurrencyEnum = CurrencyEnum.USD;

  @Column('int')
  price: string;

  @Column('text')
  year: string;

  @IsOptional()
  @Column('simple-array', { nullable: true })
  images?: string[];

  @Column('text')
  region: string;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.posts)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToMany(() => PostViewEntity, (view) => view.post)
  views: PostViewEntity[];

  @OneToMany(() => LikeEntity, (entity) => entity.post)
  likes?: LikeEntity[];
}
