import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { JwtService } from '@nestjs/jwt';

import { Config, JWTConfig } from '../../../configs/config.type';
import { TokenTypeEnum } from '../enums/token-type.enum';
import { IJWTPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
  private readonly jwtConfig: JWTConfig;

  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly jwtService: JwtService,
  ) {}

  public async generateTokens(payload: IJWTPayload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.accesSecret,
      expiresIn: this.jwtConfig.accesExpiresIn,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.refreshSecret,
      expiresIn: this.jwtConfig.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  public async verifyToken(
    token: string,
    type: TokenTypeEnum,
  ): Promise<IJWTPayload> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.getSecret(type),
    });
  }

  public async generateActionToken(
    payload: IJWTPayload,
    type: TokenTypeEnum,
  ): Promise<string> {
    let secret: string;
    let expiresIn: number;

    switch (type) {
      case TokenTypeEnum.FORGOT: {
        secret = this.jwtConfig.actionForgotSecret;
        expiresIn = this.jwtConfig.actionForgotExpiresIn;
        break;
      }
      case TokenTypeEnum.VERIFY: {
        secret = this.jwtConfig.actionVerifySecret;
        expiresIn = this.jwtConfig.actionVerifyExpiresIn;
        break;
      }
      default: {
        throw new Error('Invalid token type');
      }
    }
    return await this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  private getSecret(type: TokenTypeEnum): string {
    let secret;
    switch (type) {
      case TokenTypeEnum.ACCESS: {
        secret = this.jwtConfig.accesSecret;
        break;
      }
      case TokenTypeEnum.REFRESH: {
        secret = this.jwtConfig.refreshSecret;
        break;
      }
      case TokenTypeEnum.FORGOT: {
        secret = this.jwtConfig.actionForgotSecret;
        break;
      }
      case TokenTypeEnum.VERIFY: {
        secret = this.jwtConfig.actionVerifySecret;
        break;
      }
      default: {
        throw new Error('Unknown token type');
      }
    }
    return secret;
  }
}
