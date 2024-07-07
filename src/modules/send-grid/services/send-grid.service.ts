import { Injectable } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import SendGrid from '@sendgrid/mail';

import { SendGridConfig } from '../../../configs/config.type';
import { EmailTemplateConstant } from '../enums/email-template-constant.enum';
import { EmailTypeEnum } from '../enums/email-type.enum';
import { EmailTypeToPayloadType } from '../enums/email-type-to-payload-type';

@Injectable()
export class SendGridService {
  constructor(private readonly sendGridConfig: SendGridConfig) {
    SendGrid.setApiKey(this.sendGridConfig.apiKey);
  }

  public async sendByType<T extends EmailTypeEnum>(
    to: string,
    type: T,
    dynamicTemplateData: EmailTypeToPayloadType[T],
  ): Promise<void> {
    try {
      const templateId = EmailTemplateConstant[type].templateId;

      await this.sendEmail({
        from: this.sendGridConfig.fromWhoEmail,
        to,
        templateId,
        dynamicTemplateData,
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  private async sendEmail(email: MailDataRequired) {
    try {
      await SendGrid.send(email);
    } catch (e) {
      throw new Error(e);
    }
  }
}
