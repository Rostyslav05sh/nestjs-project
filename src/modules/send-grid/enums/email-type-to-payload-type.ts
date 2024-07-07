import { PickKeysByType } from 'typeorm/common/PickKeysByType';

import { EmailCombinedPayloadType } from './email-combined-payload-type';
import { EmailTypeEnum } from './email-type.enum';

export type EmailTypeToPayloadType = {
  [EmailTypeEnum.WELCOME]: PickKeysByType<
    EmailCombinedPayloadType,
    'name' | 'frontURL' | 'actionToken'
  >;
  [EmailTypeEnum.FORGOT_PASSWORD]: PickKeysByType<
    EmailCombinedPayloadType,
    'frontURL' | 'actionToken'
  >;
  [EmailTypeEnum.RETURN_PLEASE]: PickKeysByType<
    EmailCombinedPayloadType,
    'name' | 'frontURL'
  >;
  [EmailTypeEnum.DELETE_ACCOUNT]: PickKeysByType<
    EmailCombinedPayloadType,
    'frontURL'
  >;
};
