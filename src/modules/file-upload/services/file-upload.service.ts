import { randomUUID } from 'node:crypto';
import * as path from 'node:path';

import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';

import { AWSConfig, Config } from '../../../configs/config.type';
import { LoggerService } from '../../logger/logger.service';
import { ContentTypeEnum } from '../models/enum/content-type.enum';

@Injectable()
export class FileUploadService {
  private awsConfig: AWSConfig;
  private s3Client: S3Client;
  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly logger: LoggerService,
  ) {
    this.awsConfig = this.configService.get<AWSConfig>('aws');
    const params: S3ClientConfig = {
      region: this.awsConfig.region,
      credentials: {
        accessKeyId: this.awsConfig.accessKey,
        secretAccessKey: this.awsConfig.secretKey,
      },
    };
    if (this.awsConfig.endpoint) {
      params.forcePathStyle = true;
      params.endpoint = this.awsConfig.endpoint;
    }

    this.s3Client = new S3Client(params);
  }
  public async uploadFile(
    file: Express.Multer.File,
    type: ContentTypeEnum,
    itemId: string,
  ): Promise<string> {
    try {
      const filePath = await this.buildPath(type, itemId, file.originalname);

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.awsConfig.bucketName,
          Key: filePath,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        }),
      );
      return filePath;
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async buildPath(
    type: ContentTypeEnum,
    itemId: string,
    fileName: string,
  ): Promise<string> {
    return `${type}/${itemId}/${randomUUID()}${path.extname(fileName)}`; // use only  template string
  }
}
