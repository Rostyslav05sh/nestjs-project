import { Module } from '@nestjs/common';

import { FileUploadModule } from '../file-upload/file-upload.module';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [FileUploadModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
