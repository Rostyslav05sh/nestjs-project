import {
  Body,
  Controller,
  Post,
  Put,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAdminAccountAccessGuard } from '../../guards/role-guards/jwt-admin-account-access.guard';
import { UserResDto } from '../user/dto/res/user-res.dto';
import { JwtPayload } from './decorators/action-token.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { ForgotPasswordReqDto } from './dto/req/forgot-password.req.dto';
import { SetForgotPasswordReqDto } from './dto/req/set-forgot-password.req.dto';
import { SignInReqDto } from './dto/req/sign-in-req.dto';
import { SignUpReqDto } from './dto/req/sign-up.req.dto';
import { SignUpByAdminReqDto } from './dto/req/sign-up-by-admin.req.dto';
import { AuthResDto } from './dto/res/auth-res.dto';
import { TokenResDto } from './dto/res/token-res.dto';
import { TokenTypeEnum } from './enums/token-type.enum';
import { JwtActionGuard } from './guards/jwt-action.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { IJWTPayload } from './interfaces/jwt-payload.interface';
import { IUserData } from './interfaces/user-data.interface';
import { AuthService } from './services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @ApiOperation({ summary: 'Sign up' })
  @Post('sign-up')
  public async signUp(@Body() dto: SignUpReqDto): Promise<AuthResDto> {
    return await this.authService.signUp(dto);
  }
  @SkipAuth()
  @ApiOperation({ summary: 'Sign up by admin' })
  @Post('sign-up/by/admin')
  public async signUpByAdmin(
    @Body() dto: SignUpByAdminReqDto,
  ): Promise<AuthResDto> {
    return await this.authService.signUpByAdmin(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminAccountAccessGuard)
  @ApiOperation({ summary: 'Create account by admin' })
  @Post('create/account/by/admin')
  public async createAccountByAdmin(
    @Body() dto: SignUpByAdminReqDto,
  ): Promise<AuthResDto> {
    return await this.authService.signUpByAdmin(dto);
  }
  @SkipAuth()
  @ApiOperation({ summary: 'Sign in' })
  @Post('sign-in')
  public async signIn(@Body() dto: SignInReqDto): Promise<AuthResDto> {
    return await this.authService.signIn(dto);
  }
  @SkipAuth()
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Refresh token pair' })
  @Post('refresh')
  public async refresh(
    @CurrentUser() userData: IUserData,
  ): Promise<TokenResDto> {
    return await this.authService.refresh(userData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign out' })
  @Post('sign-out')
  public async signOut(@CurrentUser() userData: IUserData): Promise<void> {
    return await this.authService.signOut(userData);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Verifying' })
  @UseGuards(JwtActionGuard)
  @SetMetadata('type', TokenTypeEnum.VERIFY)
  @Put('isVerified')
  public async isVerified(
    @Query('token') token: string,
    @JwtPayload() jwtPayload: IJWTPayload,
  ): Promise<UserResDto> {
    return await this.authService.isVerified(jwtPayload);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Forgot password' })
  @Post('forgot-password')
  public async forgotPassword(
    @Body() dto: ForgotPasswordReqDto,
  ): Promise<void> {
    await this.authService.forgotPassword(dto);
  }

  @SkipAuth()
  @UseGuards(JwtActionGuard)
  @ApiOperation({ summary: 'Set forgot password' })
  @SetMetadata('type', TokenTypeEnum.FORGOT)
  @Put('set-forgot-password')
  public async setForgotPassword(
    @Query('token') token: string,
    @JwtPayload() jwtPayload: IJWTPayload,
    @Body() dto: SetForgotPasswordReqDto,
  ): Promise<void> {
    try {
      await this.authService.setForgotPassword(jwtPayload, dto);
    } catch (e) {
      throw new Error(e);
    }
  }
}
