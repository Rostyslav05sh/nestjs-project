import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AccountTypeEnum } from '../../../database/entity/enums/accountType.enum';
import { BrandsEnum } from '../../../database/entity/enums/brands.enum';
import {
  ModelsBMWEnum,
  ModelsDaewooEnum,
} from '../../../database/entity/enums/modelsEnum';
import { PostEntity } from '../../../database/entity/post.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { ContentTypeEnum } from '../../file-upload/models/enum/content-type.enum';
import { FileUploadService } from '../../file-upload/services/file-upload.service';
import { LikeRepository } from '../../repository/services/like.repository';
import { PostRepository } from '../../repository/services/post.repository';
import { PostViewRepository } from '../../repository/services/post-view.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { bannedWords } from '../bannedWords/banned-words-list';
import { CreatePostReqDto } from '../dto/req/create-post.req.dto';
import { PostListReqDto } from '../dto/req/post-list.req.dto';
import { PostPremiumListReqDto } from '../dto/req/post-premium-list.req.dto';
import { UpdatePostReqDto } from '../dto/req/update-post.req.dto';
import { PostResDto } from '../dto/res/post.res.dto';
import { PostListResDto } from '../dto/res/post-list.res.dto';
import { PostMapper } from './post.mapper';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postViewRepository: PostViewRepository,
    private readonly userRepository: UserRepository,
    private readonly likeRepository: LikeRepository,
    private readonly fileUploadService: FileUploadService,
  ) {}

  public async create(
    userData: IUserData,
    dto: CreatePostReqDto,
  ): Promise<PostResDto> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.accountType === AccountTypeEnum.BASIC) {
      const userPostsCount = await this.postRepository.countUserPosts(user.id);
      if (userPostsCount >= 1) {
        throw new BadRequestException(
          'Basic account users can only create one post, upgrade to premium',
        );
      }
    }

    if (!Object.values(BrandsEnum).includes(dto.brand)) {
      throw new BadRequestException();
    }
    const models = await this.modelTypeByBrand(dto.brand);
    if (!models.includes(dto.model)) {
      throw new Error('Invalid car model for the selected brand');
    }

    if (
      this.containsBannedWords(dto.title) ||
      this.containsBannedWords(dto.description) ||
      this.containsBannedWords(dto.body)
    ) {
      throw new BadRequestException('Post contains banned words');
    }

    const post = await this.postRepository.save(
      this.postRepository.create({
        ...dto,
        user: { id: userData.userId },
      }),
    );

    return PostMapper.toResponseDTO(post);
  }

  public async uploadPostImages(
    userData: IUserData,
    postId: string,
    postImages: Express.Multer.File[],
  ): Promise<void> {
    if (!postImages || postImages.length === 0) {
      throw new BadRequestException('No images provided');
    }

    const post = await this.postRepository.findPostById(userData, postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const images = await Promise.all(
      postImages.map((image) =>
        this.fileUploadService.uploadFile(
          image,
          ContentTypeEnum.CAR_IMAGES,
          post.user.id,
        ),
      ),
    );

    await this.postRepository.update(postId, { images });
  }

  public async getById(
    userData: IUserData,
    postId: string,
  ): Promise<PostResDto> {
    const post = await this.postRepository.findPostById(userData, postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    await this.trackView(postId);

    return PostMapper.toResponseDTO(post);
  }

  public async update(
    userData: IUserData,
    postId: string,
    dto: UpdatePostReqDto,
  ): Promise<PostResDto> {
    const post = await this.findPostOrThrow(userData.userId, postId);
    await this.postRepository.save({ ...post, ...dto });
    const updatedPost = await this.postRepository.findPostById(
      userData,
      postId,
    );
    return PostMapper.toResponseDTO(updatedPost);
  }
  public async delete(userData: IUserData, postId: string): Promise<void> {
    const post = await this.postRepository.findPostById(userData, postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.postRepository.remove(post);
  }

  public async getList(
    userData: IUserData,
    query: PostListReqDto,
  ): Promise<PostListResDto> {
    const [post, total] = await this.postRepository.getList(userData, query);

    return PostMapper.toListResponseDTO(post, total, query);
  }

  public async getStatistic(
    query: PostPremiumListReqDto,
  ): Promise<PostListResDto> {
    const [posts, total] = await this.postRepository.getStatistic(query);

    const averagePrice = await this.postRepository.calculateAveragePrice(query);

    return PostMapper.toListResponseDTO(posts, total, query, averagePrice);
  }

  public async getViewsByPeriod(
    postId: string,
    period: string,
  ): Promise<number> {
    const viewCount = await this.postRepository.getViewsByPeriod(
      postId,
      period,
    );
    return viewCount;
  }

  public async like(userData: IUserData, postId: string): Promise<void> {
    const post = await this.postRepository.findPostById(userData, postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const like = await this.likeRepository.findOneBy({
      post_id: postId,
      user_id: userData.userId,
    });
    if (like) {
      throw new ForbiddenException('Already liked');
    }

    await this.likeRepository.save(
      this.likeRepository.create({
        post_id: postId,
        user_id: userData.userId,
      }),
    );
  }
  public async unlike(userData: IUserData, postId: string): Promise<void> {
    const post = await this.postRepository.findPostById(userData, postId);
    if (!post) {
      throw new NotFoundException('Not found post');
    }

    const like = await this.likeRepository.findOneBy({
      post_id: postId,
      user_id: userData.userId,
    });
    if (!like) {
      throw new NotFoundException('Like not found');
    }

    await this.likeRepository.remove(like);
  }

  public async getListForAdministrator(
    userData: IUserData,
    query: PostListReqDto,
  ): Promise<PostListResDto> {
    const [post, total] = await this.postRepository.getListForAdministrator(
      userData,
      query,
    );

    return PostMapper.toListResponseDTO(post, total, query);
  }

  public async updateByAdministrator(
    postId: string,
    dto: UpdatePostReqDto,
  ): Promise<PostResDto> {
    const post = await this.findArticleOrThrowForAdministrator(postId);
    await this.postRepository.save({ ...post, ...dto });
    const updatedPost =
      await this.postRepository.findPostByIdForAdministrator(postId);
    return PostMapper.toResponseDTO(updatedPost);
  }

  public async deleteByAdministrator(postId: string): Promise<void> {
    const post = await this.postRepository.findPostByIdForAdministrator(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.likeRepository.delete({ post_id: postId });

    await this.postRepository.remove(post);
  }

  private async trackView(postId: string): Promise<void> {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.postViewRepository.save(
      this.postViewRepository.create({
        post,
      }),
    );
  }

  private async modelTypeByBrand(brand: BrandsEnum) {
    let models: string[];
    switch (brand) {
      case BrandsEnum.BMW: {
        models = Object.values(ModelsBMWEnum);
        break;
      }
      case BrandsEnum.DAEWOO: {
        models = Object.values(ModelsDaewooEnum);
        break;
      }
      default: {
        throw new Error('Unknown brand type');
      }
    }
    return models;
  }

  private async findPostOrThrow(
    userId: string,
    postId: string,
  ): Promise<PostEntity> {
    const post = await this.postRepository.findOneBy({
      id: postId,
      status: true,
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.user_id !== userId) {
      throw new ForbiddenException();
    }
    return post;
  }
  private async findArticleOrThrowForAdministrator(
    postId: string,
  ): Promise<PostEntity> {
    const post = await this.postRepository.findOneBy({
      id: postId,
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
  private containsBannedWords(text: string): boolean {
    const lowerCaseText = text.toLowerCase();
    return bannedWords.some((word) => lowerCaseText.includes(word));
  }
}
