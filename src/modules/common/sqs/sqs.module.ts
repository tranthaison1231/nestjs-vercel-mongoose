import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQSManagerService } from './sqs.service';

@Module({
  imports: [],
  providers: [SQSManagerService, ConfigService],
  exports: [SQSManagerService],
})
export class SQSManagerModule {}
