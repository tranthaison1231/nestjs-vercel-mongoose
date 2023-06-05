import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.shema';
import {
  AuthCredentialsDto,
  SignInDto,
} from '../auth/dto/auth-credentials.dto';
import { comparePassword, hashPassword } from 'src/shared/utils/password';
import { ERROR_CODE } from 'src/shared/constants /error-code';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async validateUserPassword({
    email,
    password,
  }: SignInDto): Promise<string | null> {
    const user = await this.userModel
      .findOne({
        email: email,
      })
      .exec();
    if (user && (await comparePassword(password, user.password))) {
      return user.id;
    }
    return null;
  }

  async signUp({
    username,
    password,
    email,
  }: AuthCredentialsDto): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await hashPassword(password, salt);
    const user = await this.userModel.create({
      email: email,
      name: username,
      password: hashedPassword,
      salt: salt,
    });
    return user.id;
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
}
