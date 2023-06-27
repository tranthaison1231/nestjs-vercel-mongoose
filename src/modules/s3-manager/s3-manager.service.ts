import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
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
}
