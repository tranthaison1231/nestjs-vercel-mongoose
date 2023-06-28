import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectAws } from 'aws-sdk-v3-nest';

@Injectable()
export class S3ManagerService {
  constructor(
    @InjectAws(S3Client) private readonly s3: S3Client,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    const uploadResult = await this.s3.send(
      new PutObjectCommand({
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        ContentType: file.mimetype,
        Body: file.buffer,
        Key: `${new Date().getTime()}.${file.originalname.split('.').pop()}`,
      }),
    );
    return uploadResult;
  }

  async getFile(key: string, bucket: string) {
    try {
      const response = await this.s3.send(
        new GetObjectCommand({ Key: key, Bucket: bucket }),
      );
      const str = await response.Body.transformToString();

      return str;
    } catch (error) {
      console.error('Error getting file with S3: ', error);
      throw new Error(error);
    }
  }
}
