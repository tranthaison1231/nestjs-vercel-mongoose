import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PresignedUrlDto {
  @IsString()
  readonly fileName: string;

  @IsString()
  readonly type: string;

  @IsString()
  @IsOptional()
  readonly folderPrefix: string;
}
