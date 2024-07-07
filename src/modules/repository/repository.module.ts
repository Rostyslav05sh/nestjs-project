import { Global, Module } from '@nestjs/common';

import { ActionTokenRepository } from './services/action-token.repository';
import { FollowRepository } from './services/follow.repository';
import { LikeRepository } from './services/like.repository';
import { PostRepository } from './services/post.repository';
import { PostViewRepository } from './services/post-view.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { UserRepository } from './services/user.repository';

const repositories = [
  UserRepository,
  RefreshTokenRepository,
  ActionTokenRepository,
  PostRepository,
  PostViewRepository,
  LikeRepository,
  FollowRepository,
];

@Global()
@Module({
  providers: [...repositories],
  exports: [...repositories],
})
export class RepositoryModule {}
