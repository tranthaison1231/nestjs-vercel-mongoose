import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { comparePassword, hashPassword } from '@/shared/utils/password';
import { SignInDto, SignUpDto } from '@/modules/auth/dto/auth-credentials.dto';
import { User, UserDocument } from './schemas/users.schema';
import { ERROR_CODE } from '@/shared/constants /error-code';
import { UpdatedUserDto } from './dto/users-payload.dto';

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

  async signUp({ username, password, email }: SignUpDto): Promise<string> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await hashPassword(password, salt);
      const user = await this.userModel.create({
        email: email,
        name: username,
        password: hashedPassword,
        salt: salt,
      });
      return user.id;
    } catch (error) {
      if (error.code === ERROR_CODE.CONFLICT) {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select(['-password', '-salt']).exec();
  }

  async findOneById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).select(['-password', '-salt']).exec();
  }

  async compareWithCurrentPassword(password, mail): Promise<boolean> {
    const user = await this.userModel.findOne({ email: mail }).exec();
    return comparePassword(password, user.password);
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    return this.userModel
      .findOne({
        email: email,
      })
      .select(['-password', '-salt'])
      .exec();
  }

  async confirmVerified(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (user.isVerified) {
      throw new ConflictException('User is verified');
    }
    user.isVerified = true;
    await user.save();
    return user;
  }

  async update(id: string, updatedUser: UpdatedUserDto) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new ConflictException('User is not exist');
    }
    if (updatedUser.name) {
      user.name = updatedUser.name;
    }
    if (updatedUser.avatarURL) {
      user.avatarURL = updatedUser.avatarURL;
    }
    await user.save();
    return user;
  }
}
