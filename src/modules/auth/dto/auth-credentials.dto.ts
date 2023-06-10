import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @MinLength(8)
  @MaxLength(20)
  @IsStrongPassword()
  newPassword: string;
}

export class SignInDto extends ForgotPasswordDto {
  @ApiProperty()
  @MinLength(8)
  @MaxLength(20)
  @IsStrongPassword()
  password: string;
}

export class SignUpDto extends SignInDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
}
