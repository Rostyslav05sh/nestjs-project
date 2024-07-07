import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UserService } from '../../user/services/user.service';
import { SignInReqDto } from '../dto/req/sign-in-req.dto';
import { SignUpReqDto } from '../dto/req/sign-up.req.dto';
import { AuthResDto } from '../dto/res/auth-res.dto';
import { TokenResDto } from '../dto/res/token-res.dto';
import { IUserData } from '../interfaces/user-data.interface';
import { AuthMapper } from './auth.mapper';
import { AuthCacheService } from './auth-cache.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly authCacheService: AuthCacheService,
  ) {}

  public async signUp(dto: SignUpReqDto): Promise<AuthResDto> {
    await this.userService.isEmailExist(dto.email);

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password: hashedPassword }),
    );

    const tokenPair = await this.tokenService.generateTokens({
      userId: user.id,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        user_id: user.id,
      }),
      this.authCacheService.deleteAccessToken(user.id),
    ]);

    await Promise.all([
      await this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: user.id,
          refreshToken: tokenPair.refreshToken,
        }),
      ),
      this.authCacheService.saveToken(tokenPair.accessToken, user.id),
    ]);

    return AuthMapper.toResponseDTO(user, tokenPair);
  }

  public async signIn(dto: SignInReqDto): Promise<AuthResDto> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { password: true, id: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const tokenPair = await this.tokenService.generateTokens({
      userId: user.id,
    });
    await Promise.all([
      this.refreshTokenRepository.delete({
        user_id: user.id,
      }),
      this.authCacheService.deleteAccessToken(user.id),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: user.id,
          refreshToken: tokenPair.refreshToken,
        }),
      ),
      this.authCacheService.saveToken(tokenPair.accessToken, user.id),
    ]);
    const userEntity = await this.userRepository.findOneBy({ id: user.id });
    return AuthMapper.toResponseDTO(userEntity, tokenPair);
  }

  public async refresh(dto: IUserData): Promise<TokenResDto> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        user_id: dto.userId,
      }),
      this.authCacheService.deleteAccessToken(dto.userId),
    ]);

    const tokenPair = await this.tokenService.generateTokens({
      userId: dto.userId,
    });

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: dto.userId,
          refreshToken: tokenPair.refreshToken,
        }),
      ),
      this.authCacheService.saveToken(tokenPair.accessToken, dto.userId),
    ]);
    return AuthMapper.toRefreshDTO(tokenPair);
  }

  public async signOut(userData: IUserData): Promise<void> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        user_id: userData.userId,
      }),
      this.authCacheService.deleteAccessToken(userData.userId),
    ]);
  }
}
