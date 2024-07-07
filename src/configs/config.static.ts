import * as dotenv from 'dotenv';

import configuration from './config';
import { Config } from './config.type';

export class ConfigStatic {
  public get(): Config {
    return configuration();
  }
}

const environment = process.env.AWS_S3_BUCKET_URL || 'local';
dotenv.config({ path: `environments${environment}.env` });
const ConfigStaticService = new ConfigStatic();
export { ConfigStaticService };
