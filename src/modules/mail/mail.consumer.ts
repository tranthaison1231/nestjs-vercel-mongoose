import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MAIL_QUEUE } from '@/shared/constants /jobs';
import { MailerService } from '@nest-modules/mailer';
import { UserDocument } from '../users/schemas/user.shema';
import template from 'lodash.template';

@Processor(MAIL_QUEUE)
export class MailConsumer {
  private readonly logger = new Logger(MailConsumer.name);

  constructor(private readonly mailService: MailerService) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processor:@OnQueueActive - Processing job ${job.id} of type ${
        job.name
      }. Data: ${JSON.stringify(job.data)}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    console.log(
      `Processor:@OnQueueCompleted - Completed job ${job.id} of type ${job.name}.`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<unknown>, error) {
    console.log(
      `Processor:@OnQueueFailed - Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process('sendMailForgotPassword')
  async sendMailForgotPassword(
    job: Job<{ user: UserDocument; link: string; emailTemplate: string }>,
  ) {
    try {
      const { user, link, emailTemplate } = job.data;
      const result = await this.mailService.sendMail({
        to: user.email,
        subject: 'Reset your password',
        html: template(emailTemplate)({
          link,
          name: user.name,
        }),
      });
      return result;
    } catch (error) {
      this.logger.error('Failed to send confirmation email.', error.stack);
      throw error;
    }
  }
}
