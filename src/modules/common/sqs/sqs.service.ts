import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectAws } from 'aws-sdk-v3-nest';

@Injectable()
export class SQSManagerService {
  constructor(
    @InjectAws(SQSClient) private readonly sqs: SQSClient,
    private readonly configService: ConfigService,
  ) {}

  async sendEmailMessage(
    messageBody: {
      type: string;
      data: any;
    },
    delaySeconds?: number,
  ) {
    try {
      const command = new SendMessageCommand({
        QueueUrl: this.configService.get<string>('SQS_QUEUE_URL'),
        MessageBody: JSON.stringify(messageBody),
        DelaySeconds: delaySeconds,
      });
      const response = await this.sqs.send(command);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
