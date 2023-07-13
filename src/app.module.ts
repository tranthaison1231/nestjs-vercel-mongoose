import { S3Client } from '@aws-sdk/client-s3';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsSdkModule } from 'aws-sdk-v3-nest';
import * as Joi from 'joi';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { S3ManagerModule } from './modules/common/s3/s3.module';
import { SQSManagerModule } from './modules/common/sqs/sqs.module';
import { UsersModule } from './modules/users/users.module';
import { SQSClient } from '@aws-sdk/client-sqs';
import { EventsModule } from './modules/events/events.module';

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
    AwsSdkModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      clientType: S3Client,
      useFactory: async (configService: ConfigService) => {
        return new S3Client({
          region: configService.get('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          },
        });
      },
      inject: [ConfigService],
    }),
    AwsSdkModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      clientType: SQSClient,
      useFactory: async (configService: ConfigService) => {
        return new SQSClient({
          region: configService.get('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          },
        });
      },
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
    UsersModule,
    EventsModule,
    AuthModule,
    S3ManagerModule,
    SQSManagerModule,
  ],
})
export class AppModule {}
