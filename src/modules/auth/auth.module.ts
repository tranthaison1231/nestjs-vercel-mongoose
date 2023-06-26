import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { EXPIRES_IN } from '@/shared/constants /config';
import { User, UserSchema } from '../users/schemas/user.shema';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { MAIL_QUEUE } from '@/shared/constants /jobs';
import { MailConsumer } from '../mail/mail.consumer';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          secret: config.get('JWT_SECRET'),
          signOptions: {
            expiresIn: EXPIRES_IN,
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: MAIL_QUEUE,
    }),
    UsersModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ConfigService, MailConsumer],
})
export class AuthModule {}
