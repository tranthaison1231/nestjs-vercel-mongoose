import { Module } from '@nestjs/common';
import { S3ManagerService } from './s3-manager.service';
import { S3ManagerController } from './s3-manager.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  providers: [S3ManagerService, ConfigService],
  controllers: [S3ManagerController],
  exports: [S3ManagerService],
})
export class S3ManagerModule {}
