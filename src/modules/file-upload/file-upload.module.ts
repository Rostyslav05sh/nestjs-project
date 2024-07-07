import { Module } from '@nestjs/common';

import { FileUploadService } from './services/file-upload.service';

@Module({
  imports: [],
  controllers: [],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
