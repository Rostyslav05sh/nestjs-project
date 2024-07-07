import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import * as SendGrid from '@sendgrid/mail';

import { EmailTemplateConstant } from '../enums/email-template-constant.enum';
import { EmailTypeEnum } from '../enums/email-type.enum';
import { EmailTypeToPayloadType } from '../enums/email-type-to-payload-type';

@Injectable()
export class SendGridService {
  private readonly apiKey: string;
  private readonly fromWhoEmail: string;
  private readonly frontURL: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    this.fromWhoEmail = this.configService.get<string>('SENDGRID_FROM_EMAIL');
    this.frontURL = this.configService.get<string>('FRONT_URL');
    SendGrid.setApiKey(this.apiKey);
  }

  public async sendByType<T extends EmailTypeEnum>(
    to: string,
    type: T,
    dynamicTemplateData: EmailTypeToPayloadType[T],
  ): Promise<void> {
    try {
      const templateId = EmailTemplateConstant[type].templateId;

      await this.sendEmail({
        from: this.fromWhoEmail,
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
