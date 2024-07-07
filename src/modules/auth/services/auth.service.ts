import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { ActionTokenRepository } from '../../repository/services/action-token.repository';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { EmailTypeEnum } from '../../send-grid/enums/email-type.enum';
import { SendGridService } from '../../send-grid/services/send-grid.service';
import { UserResDto } from '../../user/dto/res/user-res.dto';
import { UserMapper } from '../../user/services/user.mapper';
import { UserService } from '../../user/services/user.service';
import { ForgotPasswordReqDto } from '../dto/req/forgot-password.req.dto';
import { SetForgotPasswordReqDto } from '../dto/req/set-forgot-password.req.dto';
import { SignInReqDto } from '../dto/req/sign-in-req.dto';
import { SignUpReqDto } from '../dto/req/sign-up.req.dto';
import { SignUpByAdminReqDto } from '../dto/req/sign-up-by-admin.req.dto';
import { AuthResDto } from '../dto/res/auth-res.dto';
import { TokenResDto } from '../dto/res/token-res.dto';
import { TokenTypeEnum } from '../enums/token-type.enum';
import { IJWTPayload } from '../interfaces/jwt-payload.interface';
import { IUserData } from '../interfaces/user-data.interface';
import { AuthMapper } from './auth.mapper';
import { AuthCacheService } from './auth-cache.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  private readonly frontURL: string;

  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly authCacheService: AuthCacheService,
    private readonly actionTokenRepository: ActionTokenRepository,
    private readonly sendGridService: SendGridService,
    private readonly configService: ConfigService,
  ) {
    this.frontURL = this.configService.get<string>('FRONT_URL');
  }

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

    const actionToken = await this.tokenService.generateActionToken(
      { userId: user.id },
      TokenTypeEnum.VERIFY,
    );

    await Promise.all([
      this.actionTokenRepository.delete({
        user_id: user.id,
      }),
    ]);

    await Promise.all([
      await this.actionTokenRepository.save(
        this.actionTokenRepository.create({
          user_id: user.id,
          actionToken: actionToken,
        }),
      ),
    ]);

    await Promise.all([
      this.sendGridService.sendByType(user.email, EmailTypeEnum.WELCOME, {
        name: dto.name as string,
        frontURL: this.frontURL as string,
        actionToken: actionToken as string,
      }),
    ]);

    return AuthMapper.toResponseDTO(user, tokenPair);
  }

  public async signUpByAdmin(dto: SignUpByAdminReqDto): Promise<AuthResDto> {
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

    const actionToken = await this.tokenService.generateActionToken(
      { userId: user.id },
      TokenTypeEnum.VERIFY,
    );

    await Promise.all([
      this.actionTokenRepository.delete({
        user_id: user.id,
      }),
    ]);

    await Promise.all([
      await this.actionTokenRepository.save(
        this.actionTokenRepository.create({
          user_id: user.id,
          actionToken: actionToken,
        }),
      ),
    ]);

    await Promise.all([
      this.sendGridService.sendByType(user.email, EmailTypeEnum.WELCOME, {
        name: dto.name as string,
        frontURL: this.frontURL as string,
        actionToken: actionToken as string,
      }),
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

  public async isVerified(jwtPayload: IJWTPayload): Promise<UserResDto> {
    await Promise.all([
      this.userRepository.update(jwtPayload.userId, { isVerified: true }),
      this.actionTokenRepository.delete({ user_id: jwtPayload.userId }),
    ]);

    const user = await this.userRepository.findOne({
      where: { id: jwtPayload.userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return UserMapper.toResponseDTO(user);
  }

  public async forgotPassword(dto: ForgotPasswordReqDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { password: true, id: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const actionToken = await this.tokenService.generateActionToken(
      { userId: user.id },
      TokenTypeEnum.FORGOT,
    );

    await Promise.all([
      this.actionTokenRepository.delete({
        user_id: user.id,
      }),
    ]);

    await Promise.all([
      await this.actionTokenRepository.save(
        this.actionTokenRepository.create({
          user_id: user.id,
          actionToken: actionToken,
        }),
      ),
    ]);

    const email = dto.email;

    await Promise.all([
      this.sendGridService.sendByType(email, EmailTypeEnum.FORGOT_PASSWORD, {
        frontURL: this.frontURL as string,
        actionToken: actionToken as string,
      }),
    ]);
  }

  public async setForgotPassword(
    jwtPayload: IJWTPayload,
    dto: SetForgotPasswordReqDto,
  ): Promise<void> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.userRepository.update(jwtPayload.userId, {
      password: hashedPassword,
    });
    await this.actionTokenRepository.delete({ user_id: jwtPayload.userId });

    const user = await this.userRepository.findOneBy({ id: jwtPayload.userId });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  }
}
