import { JwtAuthGuard } from '@/shared/guards/jwt.guard';
import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { S3ManagerService } from './s3-manager.service';
import { Express } from 'express';

@UseGuards(JwtAuthGuard)
@ApiTags('upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
export class S3ManagerController {
  constructor(private readonly s3ManagerService: S3ManagerService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const uploadedFile = await this.s3ManagerService.uploadFile(file);
    console.log(uploadedFile);
  }
}
