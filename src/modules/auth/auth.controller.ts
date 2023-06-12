import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/shared/guards/jwt.guard';
import { GetUser } from '@/shared/decorators/user.decorator';
import { UserDocument } from '@/modules/users/schemas/user.shema';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './dto/auth-credentials.dto';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body(ValidationPipe) signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/sign-in')
  async signIn(@Body(ValidationPipe) signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('/forgot-password')
  async forgotPassword(
    @Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('/reset-password')
  @UseGuards(JwtAuthGuard)
  async resetPassword(
    @GetUser() user: UserDocument,
    @Body(ValidationPipe) { newPassword }: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(user, newPassword);
  }

  @Put('/verified')
  @UseGuards(JwtAuthGuard)
  async verify(@GetUser() user: UserDocument) {
    return this.authService.verify(user);
  }

  @Get('/confirm-verified')
  async confirmVerified(@Query() { token }: { token: string }) {
    return this.authService.confirmVerified(token);
  }
}
