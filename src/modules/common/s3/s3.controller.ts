import { JwtAuthGuard } from '@/shared/guards/jwt.guard';
import {
  Body,
  Controller,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { PresignedUrlDto } from './dto/s3-payload.dto';
import { S3ManagerService } from './s3.service';

@UseGuards(JwtAuthGuard)
@ApiTags('S3')
@Controller()
@UseGuards(JwtAuthGuard)
export class S3ManagerController {
  constructor(private readonly s3ManagerService: S3ManagerService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const uploadedFile = await this.s3ManagerService.uploadFile(file);
    return uploadedFile;
  }

  @Put('/presigned-url')
  async edit(@Body() presignedUrlDto: PresignedUrlDto) {
    return this.s3ManagerService.presignedUrlS3(presignedUrlDto);
  }
}
