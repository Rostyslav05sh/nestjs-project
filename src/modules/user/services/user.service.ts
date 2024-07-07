import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { AccountTypeEnum } from '../../../database/entity/enums/accountType.enum';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { ContentTypeEnum } from '../../file-upload/models/enum/content-type.enum';
import { FileUploadService } from '../../file-upload/services/file-upload.service';
import { FollowRepository } from '../../repository/services/follow.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { FollowListReqDto } from '../dto/req/follow-list-req.dto';
import { UpdateUserReqDto } from '../dto/req/update-user-req.dto';
import { FollowListResDto } from '../dto/res/follow-list-res.dto';
import { UserResDto } from '../dto/res/user-res.dto';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly followRepository: FollowRepository,
    private readonly fileUploadService: FileUploadService,
  ) {}

  public async getMe(userData: IUserData): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({
      id: userData.userId,
      isDeleted: false,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return UserMapper.toResponseDTO(user);
  }

  public async update(
    userData: IUserData,
    dto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({
      id: userData.userId,
      isDeleted: false,
    });
    if (!user) {
      throw new NotFoundException();
    }

    const updatedUser = await this.userRepository.save({ ...user, ...dto });

    return UserMapper.toResponseDTO(updatedUser);
  }
  public async upgradeAccountType(userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({
      id: userData.userId,
      isDeleted: false,
    });
    if (!user) {
      throw new NotFoundException();
    }

    await this.userRepository.update(userData.userId, {
      accountType: AccountTypeEnum.PREMIUM,
    });
  }

  public async updateByAdministrator(
    dto: UpdateUserReqDto,
    userId: string,
  ): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({
      id: userId,
      isDeleted: false,
    });
    if (!user) {
      throw new NotFoundException();
    }

    const updatedUser = await this.userRepository.save({ ...user, ...dto });

    return UserMapper.toResponseDTO(updatedUser);
  }

  public async deleteByAdministrator(userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({
      id: userId,
      isDeleted: false,
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    await this.userRepository.update(user.id, { isDeleted: true });
  }

  public async delete(userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({
      id: userData.userId,
      isDeleted: false,
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    await this.userRepository.update(user.id, { isDeleted: true });
  }

  public async getById(userId: string): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({
      id: userId,
      isDeleted: false,
    });
    if (!user) {
      throw new NotFoundException();
    }

    return UserMapper.toResponseDTO(user);
  }

  public async follow(userData: IUserData, userId: string): Promise<void> {
    if (userData.userId === userId) {
      throw new ConflictException('You can not follow yourself');
    }
    const user = await this.userRepository.findOneBy({
      id: userId,
      isDeleted: false,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const follow = await this.followRepository.findOneBy({
      follower_id: userData.userId,
      following_id: userId,
    });

    if (follow) {
      throw new ConflictException('You are already following this user');
    }

    await this.followRepository.save(
      this.followRepository.create({
        follower_id: userData.userId,
        following_id: userId,
      }),
    );
  }

  public async unfollow(userData: IUserData, userId: string): Promise<void> {
    if (userData.userId === userId) {
      throw new ConflictException('You can not unfollow yourself');
    }
    const user = await this.userRepository.findOneBy({
      id: userId,
      isDeleted: false,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const follow = await this.followRepository.findOneBy({
      follower_id: userData.userId,
      following_id: userId,
    });

    if (!follow) {
      throw new ConflictException('You are not already following this user');
    }

    await this.followRepository.remove(follow);
  }

  public async followList(
    userData: IUserData,
    query: FollowListReqDto,
  ): Promise<FollowListResDto> {
    const [followers, total] = await this.userRepository.getList(
      userData,
      query,
    );

    return UserMapper.toFollowersListResponseDTO(followers, total, query);
  }

  public async uploadAvatar(
    userData: IUserData,
    avatar: Express.Multer.File,
  ): Promise<void> {
    const image = await this.fileUploadService.uploadFile(
      avatar,
      ContentTypeEnum.AVATAR,
      userData.userId,
    );

    await this.userRepository.update(userData.userId, { image });
  }

  public async deleteAvatar(userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });

    if (user) {
      await this.userRepository.save(
        await this.userRepository.merge(user, { image: null }),
      );
    }
  }

  public async isEmailExist(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('Email is already taken');
    }
  }
}
