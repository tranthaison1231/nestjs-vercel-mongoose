import { S3ManagerService } from './../s3-manager/s3-manager.service';
import { EXPIRES_IN } from '@/shared/constants /config';
import { hashPassword } from '@/shared/utils/password';
import { MailerService } from '@nest-modules/mailer';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.shema';
import { UsersService } from '../users/users.service';
import { CreateToken } from './auth.interface';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  SignInDto,
  SignUpDto,
} from './dto/auth-credentials.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { MAIL_QUEUE } from '@/shared/constants /jobs';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly s3ManagerService: S3ManagerService,
    private mailerService: MailerService,
    @InjectQueue(MAIL_QUEUE)
    private readonly mailQueue: Queue,
  ) {}

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('Email is not exists!');
    }
    const token = await this.createToken({ userId: String(user._id) });
    const emailTemplate = await this.s3ManagerService.getFile(
      'emails/forgot-password.html',
      'nest-basic',
    );
    await this.mailQueue.add('sendMailForgotPassword', {
      user: user,
      link: `${this.configService.get('WEB_URL')}/reset-password?token=${
        token.accessToken
      }`,
      emailTemplate,
    });
    return true;
  }

  async changePassword(
    user: UserDocument,
    { password, newPassword }: ChangePasswordDto,
  ) {
    const isPasswordValid = await this.usersService.compareWithCurrentPassword(
      password,
      user.email,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is not correct!');
    }
    return this.resetPassword(user, newPassword);
  }

  async resetPassword(user: UserDocument, newPassword: string): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await hashPassword(newPassword, salt);
    user.salt = salt;
    user.password = hashedPassword;
    await user.save();
    return user.toJSON();
  }

  async verify(user: UserDocument) {
    const token = await this.createToken({ userId: String(user._id) });
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to my website',
      template: './verify-user',
      context: {
        name: user.name,
        link: `${this.configService.get('WEB_URL')}/forgot-password?token=${
          token.accessToken
        }`,
      },
    });
  }

  async confirmVerified(token: string) {
    const data = this.jwtService.decode(token) as { userId: string };
    if (!data.userId) {
      throw new UnauthorizedException('Invalid token');
    }
    const user = await this.usersService.findOneById(data.userId);
    if (user.isVerified) {
      throw new ConflictException('User is verified!');
    }
    user.isVerified = true;
    await user.save();
    return user;
  }

  async validateUser(userId: string): Promise<User> {
    return this.usersService.findOneById(userId);
  }

  async createToken({ userId }: CreateToken): Promise<TokenPayloadDto> {
    const accessToken = await this.jwtService.sign({ userId });
    console.log(
      `Generated JWT Token with payload ${JSON.stringify({ userId })}`,
    );
    return new TokenPayloadDto({
      tokenType: 'Bearer',
      expiresIn: EXPIRES_IN,
      accessToken,
    });
  }

  async signUp(signUpDto: SignUpDto): Promise<TokenPayloadDto> {
    const userId = await this.usersService.signUp(signUpDto);
    return this.createToken({ userId });
  }

  async signIn(signInDto: SignInDto): Promise<TokenPayloadDto> {
    const userId = await this.usersService.validateUserPassword(signInDto);
    if (!userId) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createToken({ userId });
  }
}
