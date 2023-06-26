import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { CatsModule } from './modules/cats/cats.module';
import { UsersModule } from './modules/users/users.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URI: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        MAIL_TRANSPORT: Joi.string().required(),
        MAIL_FROM: Joi.string().required(),
        WEB_URL: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'),
        dbName: configService.get<string>('DATABASE_NAME'),
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: config.get('MAIL_TRANSPORT'),
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'templates/emails'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    CatsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
