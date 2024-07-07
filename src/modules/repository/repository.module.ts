import { Global, Module } from '@nestjs/common';

import { ActionTokenRepository } from './services/action-token.repository';
import { BrandRepository } from './services/brand.repository';
import { CommentRepository } from './services/comment.repository';
import { FollowRepository } from './services/follow.repository';
import { LikeRepository } from './services/like.repository';
import { ModelRepository } from './services/model.repository';
import { PostRepository } from './services/post.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { UserRepository } from './services/user.repository';

const repositories = [
  UserRepository,
  RefreshTokenRepository,
  ActionTokenRepository,
  PostRepository,
  ModelRepository,
  LikeRepository,
  FollowRepository,
  CommentRepository,
  BrandRepository,
];

@Global()
@Module({
  providers: [...repositories],
  exports: [...repositories],
})
export class RepositoryModule {}
