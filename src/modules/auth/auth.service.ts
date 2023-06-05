import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto, SignInDto } from './dto/auth-credentials.dto';
import { UsersService } from '../users/users.service';
import { CreateToken } from './auth.interface';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { EXPIRES_IN } from '../../shared/constants /config';
import { User } from '../users/schemas/user.shema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

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

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<TokenPayloadDto> {
    const userId = await this.usersService.signUp(authCredentialsDto);
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
