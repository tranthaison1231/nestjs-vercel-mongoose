import { MailerService } from '@nest-modules/mailer';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EXPIRES_IN } from '../../shared/constants /config';
import { User, UserDocument } from '../users/schemas/user.shema';
import { UsersService } from '../users/users.service';
import { CreateToken } from './auth.interface';
import { SignInDto, SignUpDto } from './dto/auth-credentials.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private readonly configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async verify(user: UserDocument) {
    const token = await this.createToken({ userId: String(user._id) });
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to my website',
      template: './verify-user',
      context: {
        name: user.name,
        link: `${this.configService.get('WEB_URL')}/confirm-verified?token=${
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
    const user = await this.usersService.findOne(data.userId);
    if (user.isVerified) {
      throw new ConflictException('User is verified!');
    }
    user.isVerified = true;
    await user.save();
    return user;
  }

  async validateUser(userId: string): Promise<User> {
    return this.usersService.findOne(userId);
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
