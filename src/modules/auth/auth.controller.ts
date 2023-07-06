import { UserDocument } from '@/modules/users/schemas/users.schema';
import { GetUser } from '@/shared/decorators/user.decorator';
import { JwtAuthGuard } from '@/shared/guards/jwt.guard';
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
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './dto/auth-credentials.dto';
import { UpdatedUserDto } from '../users/dto/users-payload.dto';
import { UsersService } from '../users/users.service';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly userService: UsersService) {}

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

  @Post('/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @GetUser() user: UserDocument,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user, changePasswordDto);
  }

  @Put('/verified')
  @UseGuards(JwtAuthGuard)
  async verify(@GetUser() user: UserDocument) {
    return this.authService.verify(user);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser() user: UserDocument) {
    return user;
  }

  @Put('/profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @GetUser() user: UserDocument, 
    @Body(ValidationPipe) updatedUser: UpdatedUserDto) {
    return this.userService.update(user.id, updatedUser);
  }

  @Get('/confirm-verified')
  async confirmVerified(@Query() { token }: { token: string }) {
    return this.authService.confirmVerified(token);
  }
}
