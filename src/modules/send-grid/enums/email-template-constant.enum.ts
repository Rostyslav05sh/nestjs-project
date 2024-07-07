import { EmailTypeEnum } from './email-type.enum';

export const EmailTemplateConstant = {
  [EmailTypeEnum.WELCOME]: {
    templateId: 'd-5dac87fa74e9461bb7cacf5777e6b24d',
  },
  [EmailTypeEnum.FORGOT_PASSWORD]: {
    templateId: 'd-f406b2201b65438fa417e071bfb4af18',
  },
  [EmailTypeEnum.RETURN_PLEASE]: {
    templateId: 'd-b3d846d818614fd5af610bf73611f7a1',
  },
  [EmailTypeEnum.DELETE_ACCOUNT]: {
    templateId: 'd-a78e0ee2959e40e0a267c3a2aea0dbb8',
  },
};
