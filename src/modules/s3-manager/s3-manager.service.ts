import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';

@Injectable()
export class S3ManagerService {
  constructor(
    @InjectAwsService(S3) private readonly s3: S3,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<S3.ManagedUpload.SendData> {
    const uploadResult = await this.s3
      .upload({
        ContentType: file.mimetype,
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Body: file.buffer,
        Key: `${new Date().getTime()}.${file.originalname.split('.').pop()}`,
      })
      .promise();
    return uploadResult;
  }
}
