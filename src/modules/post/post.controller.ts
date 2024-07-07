import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAccountTypeGuard } from '../../guards/account-type-guards/jwt-account-type-guard';
import { JwtAdministratorAccountAccessGuard } from '../../guards/role-guards/jwt-administrator-account-access.guard';
import { JwtCustomerAccountAccessGuard } from '../../guards/role-guards/jwt-customer-account-access.guard';
import { JwtSellerAccountAccessGuard } from '../../guards/role-guards/jwt-seller-account-access.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { ApiFile } from '../file-upload/decorators/api-file.decorator';
import { CreatePostReqDto } from './dto/req/create-post.req.dto';
import { PostListReqDto } from './dto/req/post-list.req.dto';
import { PostPremiumListReqDto } from './dto/req/post-premium-list.req.dto';
import { PostPremiumViewPeriodReq } from './dto/req/post-premium-view-period.req';
import { UpdatePostReqDto } from './dto/req/update-post.req.dto';
import { PostResDto } from './dto/res/post.res.dto';
import { PostListResDto } from './dto/res/post-list.res.dto';
import { PostService } from './services/post.service';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtSellerAccountAccessGuard)
  @ApiOperation({ summary: 'Create post' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post('create')
  public async create(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreatePostReqDto,
  ): Promise<PostResDto> {
    return await this.postService.create(userData, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload images to post' })
  @UseGuards(JwtSellerAccountAccessGuard)
  @ApiConsumes('multipart/form-data')
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseInterceptors(FilesInterceptor('images', 25))
  @ApiFile('images', true)
  @Post(':postId/images')
  public async uploadPostImages(
    @CurrentUser() userData: IUserData,
    @Param('postId', ParseUUIDPipe) postId: string,
    @UploadedFiles() postImages: Express.Multer.File[],
  ): Promise<void> {
    await this.postService.uploadPostImages(userData, postId, postImages);
  }

  @UseGuards(JwtCustomerAccountAccessGuard)
  @ApiOperation({ summary: 'Get post by id' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':postId')
  public async getById(
    @CurrentUser() userData: IUserData,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<PostResDto> {
    return await this.postService.getById(userData, postId);
  }

  @UseGuards(JwtSellerAccountAccessGuard)
  @ApiOperation({ summary: 'Update post by id' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Put(':postId')
  public async update(
    @CurrentUser() userData: IUserData,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: UpdatePostReqDto,
  ): Promise<PostResDto> {
    return await this.postService.update(userData, postId, dto);
  }

  @ApiOperation({ summary: 'Delete post by id' })
  @UseGuards(JwtSellerAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete(':postId')
  public async delete(
    @CurrentUser() userData: IUserData,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<void> {
    return await this.postService.delete(userData, postId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of posts' })
  @UseGuards(JwtCustomerAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('posts/list')
  public async getList(
    @CurrentUser() userData: IUserData,
    @Query() query: PostListReqDto,
  ): Promise<PostListResDto> {
    return await this.postService.getList(userData, query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of posts for premium users' })
  @UseGuards(JwtAccountTypeGuard, JwtCustomerAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('posts/list/premium')
  public async getStatistic(
    @Query() query: PostPremiumListReqDto,
  ): Promise<PostListResDto> {
    return await this.postService.getStatistic(query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get views of post by id for premium users' })
  @UseGuards(JwtAccountTypeGuard, JwtCustomerAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('post/views/premium/:postId')
  public async getViewsByPeriod(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() query: PostPremiumViewPeriodReq,
  ): Promise<number> {
    return await this.postService.getViewsByPeriod(postId, query.period);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like post by id' })
  @UseGuards(JwtCustomerAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post(':postId/like')
  public async like(
    @CurrentUser() userData: IUserData,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<void> {
    await this.postService.like(userData, postId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unlike post by id' })
  @UseGuards(JwtCustomerAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete(':postId/like')
  public async unlike(
    @CurrentUser() userData: IUserData,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<void> {
    await this.postService.unlike(userData, postId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of posts for administrator' })
  @UseGuards(JwtCustomerAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('posts/list/forAdministrator')
  public async getListForAdministrator(
    @CurrentUser() userData: IUserData,
    @Query() query: PostListReqDto,
  ): Promise<PostListResDto> {
    return await this.postService.getListForAdministrator(userData, query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update post by id by administrator' })
  @UseGuards(JwtAdministratorAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Put(':postId/updateByAdministrator')
  public async updateByAdministrator(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: UpdatePostReqDto,
  ): Promise<PostResDto> {
    return await this.postService.updateByAdministrator(postId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete post by id by administrator' })
  @UseGuards(JwtAdministratorAccountAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete(':postId/deleteByAdministrator')
  public async deleteByAdministrator(
    @CurrentUser() userData: IUserData,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<void> {
    return await this.postService.deleteByAdministrator(postId);
  }
}
