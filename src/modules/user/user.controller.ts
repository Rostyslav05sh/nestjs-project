import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAdministratorAccountAccessGuard } from '../../guards/role-guards/jwt-administrator-account-access.guard';
import { JwtCustomerAccountAccessGuard } from '../../guards/role-guards/jwt-customer-account-access.guard';
import { JwtFullAccountAccessGuard } from '../../guards/role-guards/jwt-full-account-access.guard';
import { JwtSellerAccountAccessGuard } from '../../guards/role-guards/jwt-seller-account-access.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { ApiFile } from '../file-upload/decorators/api-file.decorator';
import { FollowListReqDto } from './dto/req/follow-list-req.dto';
import { UpdateUserReqDto } from './dto/req/update-user-req.dto';
import { FollowListResDto } from './dto/res/follow-list-res.dto';
import { UserResDto } from './dto/res/user-res.dto';
import { UserService } from './services/user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @UseGuards(JwtFullAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('me')
  public async getMe(@CurrentUser() userData: IUserData): Promise<UserResDto> {
    return await this.userService.getMe(userData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user' })
  @UseGuards(JwtFullAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Patch('me')
  public async update(
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    return await this.userService.update(userData, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete current user' })
  @UseGuards(JwtFullAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete('me')
  public async delete(@CurrentUser() userData: IUserData): Promise<void> {
    await this.userService.delete(userData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload avatar of current user' })
  @UseGuards(JwtFullAccountAccessGuard)
  @ApiConsumes('multipart/form-data')
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiFile('avatar', false)
  @Post('me/avatar')
  public async uploadAvatar(
    @CurrentUser() userData: IUserData,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<void> {
    await this.userService.uploadAvatar(userData, avatar);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete avatar of current user' })
  @UseGuards(JwtFullAccountAccessGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete('me/avatar')
  public async deleteAvatar(@CurrentUser() userData: IUserData): Promise<void> {
    await this.userService.deleteAvatar(userData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upgrade account type of current user to premium' })
  @UseGuards(JwtSellerAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Patch('me/upgrade')
  public async upgradeAccountType(
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    await this.userService.upgradeAccountType(userData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by id' })
  @UseGuards(JwtCustomerAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':userId')
  public async getById(
    @Param('userId', ParseUUIDPipe)
    userId: string,
  ): Promise<UserResDto> {
    return await this.userService.getById(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow user by id' })
  @UseGuards(JwtCustomerAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post(':userId/follow')
  public async follow(
    @CurrentUser() userData: IUserData,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.userService.follow(userData, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfollow user by id' })
  @UseGuards(JwtCustomerAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post(':userId/unfollow')
  public async unfollow(
    @CurrentUser() userData: IUserData,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.userService.unfollow(userData, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of followed users' })
  @UseGuards(JwtCustomerAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post('follow/list')
  public async followList(
    @CurrentUser() userData: IUserData,
    @Query() query: FollowListReqDto,
  ): Promise<FollowListResDto> {
    return await this.userService.followList(userData, query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user by id by administrator' })
  @UseGuards(JwtAdministratorAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Patch(':userId/updateByAdministrator')
  public async updateByAdministrator(
    @Body() dto: UpdateUserReqDto,
    @Param('userId', ParseUUIDPipe)
    userId: string,
  ): Promise<UserResDto> {
    return await this.userService.updateByAdministrator(dto, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user by id by administrator' })
  @UseGuards(JwtAdministratorAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete(':userId/deleteByAdministrator')
  public async deleteByAdministrator(
    @Param('userId', ParseUUIDPipe)
    userId: string,
  ): Promise<void> {
    await this.userService.deleteByAdministrator(userId);
  }
}
