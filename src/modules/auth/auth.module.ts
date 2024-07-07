import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { PostModule } from '../post/post.module';
import { RedisModule } from '../redis/redis.module';
import { SendGridModule } from '../send-grid/send-grid.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthService } from './services/auth.service';
import { AuthCacheService } from './services/auth-cache.service';
import { TokenService } from './services/token.service';

@Module({
  imports: [
    JwtModule,
    UserModule,
    PostModule,
    RedisModule,
    forwardRef(() => SendGridModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    AuthCacheService,
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    JwtRefreshGuard,
  ],
  exports: [],
})
export class AuthModule {}
