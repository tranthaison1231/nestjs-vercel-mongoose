import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateCatDto {
  @ApiProperty({ example: 'Tom' })
  @IsString()
  readonly name: string;

  @IsInt()
  @ApiProperty({ example: 1 })
  readonly age: number;

  @ApiProperty({ example: 'Jerry' })
  @IsString()
  readonly breed: string;
}
