import { EmailCombinedPayloadType } from './email-combined-payload-type';
import { EmailTypeEnum } from './email-type.enum';

export type EmailTypeToPayloadType = {
  [EmailTypeEnum.WELCOME]: Pick<
    EmailCombinedPayloadType,
    'name' | 'frontURL' | 'actionToken'
  >;
  [EmailTypeEnum.FORGOT_PASSWORD]: Pick<
    EmailCombinedPayloadType,
    'frontURL' | 'actionToken'
  >;
  [EmailTypeEnum.RETURN_PLEASE]: Pick<
    EmailCombinedPayloadType,
    'name' | 'frontURL'
  >;
  [EmailTypeEnum.DELETE_ACCOUNT]: Pick<EmailCombinedPayloadType, 'frontURL'>;
};
