import { Module } from '@nestjs/common';

import { FileUploadModule } from '../file-upload/file-upload.module';
import { PostController } from './post.controller';
import { PostService } from './services/post.service';

@Module({
  imports: [FileUploadModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
