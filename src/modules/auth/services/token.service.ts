import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Config, JWTConfig } from '../../../configs/config.type';
import { TokenTypeEnum } from '../enums/token-type.enum';
import { IJWTPayload } from '../interfaces/jwt-payload.interface';
import { ITokenPair } from '../interfaces/token-pair.interface';

@Injectable()
export class TokenService {
  private readonly jwtConfig: JWTConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.jwtConfig = configService.get<JWTConfig>('jwt');
  }

  public async generateTokens(payload: IJWTPayload): Promise<ITokenPair> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.accessSecret,
      expiresIn: this.jwtConfig.accessExpiresIn,
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
    try {
      const secret = this.getSecret(type);
      return await this.jwtService.verifyAsync(token, { secret });
    } catch (error) {
      throw new Error(error);
    }
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
    let secret: string;
    switch (type) {
      case TokenTypeEnum.ACCESS: {
        secret = this.jwtConfig.accessSecret;
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
