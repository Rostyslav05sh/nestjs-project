export type Config = {
  app: AppConfig;
  dataBase: dataBaseConfig;
  redis: redisConfig;
  sentry: sentryConfig;
  jwt: JWTConfig;
  aws: AWSConfig;
  sendGrid: SendGridConfig;
};

export type AppConfig = {
  port: number;
  host: string;
};

export type dataBaseConfig = {
  port: number;
  host: string;
  user: string;
  password: string;
  dbName: string;
};

export type redisConfig = {
  port: number;
  host: string;
  password: string;
};

export type sentryConfig = {
  dns: string;
  environment: string;
  debug: boolean;
};

export type JWTConfig = {
  accesSecret: string;
  accesExpiresIn: number;
  refreshSecret: string;
  refreshExpiresIn: number;
  actionForgotSecret: string;
  actionForgotExpiresIn: number;
  actionVerifySecret: string;
  actionVerifyExpiresIn: number;
};

export type AWSConfig = {
  region: string;
  accessKey: string;
  secretKey: string;
  bucketName: string;
  bucketUrl: string;
  endpoint: string;
};

export type SendGridConfig = {
  apiKey: string;
  fromWhoEmail: string;
};
