import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { CatsModule } from './modules/cats/cats.module';
import { UsersModule } from './modules/users/users.module';
import { BullModule } from '@nestjs/bull';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { S3ManagerModule } from './modules/s3-manager/s3-manager.module';

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
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
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
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        useFactory: async (configService: ConfigService) => ({
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          },
          region: configService.get('AWS_REGION'),
        }),
        imports: [ConfigModule],
        inject: [ConfigService],
      },
      services: [S3],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
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
    S3ManagerModule,
  ],
})
export class AppModule {}
