import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import { Config, sentryConfig } from '../../configs/config.type';

@Injectable()
export class LoggerService {
  private isLocal: boolean;
  private readonly logger = new Logger();

  constructor(private readonly configService: ConfigService<Config>) {
    const sentryConfig = configService.get<sentryConfig>('sentry');
    this.isLocal = sentryConfig.environment === 'local';

    Sentry.init({
      dsn: sentryConfig.dns,
      debug: sentryConfig.debug,
      environment: sentryConfig.environment,
      integrations: [
        nodeProfilingIntegration(),
        Sentry.anrIntegration({ captureStackTrace: true }),
      ],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
    });
  }

  public log(message: string): void {
    if (this.isLocal) {
      this.logger.log(message);
    } else {
      Sentry.captureMessage(message, 'log');
    }
  }

  public info(message: string): void {
    if (this.isLocal) {
      this.logger.log(message);
    } else {
      Sentry.captureMessage(message, 'info');
    }
  }

  public warn(message: string): void {
    if (this.isLocal) {
      this.logger.log(message);
    } else {
      Sentry.captureMessage(message, 'warning');
    }
  }

  public error(error: any): void {
    if (this.isLocal) {
      this.logger.error(error, error.stack);
    } else {
      Sentry.captureException(error, { level: 'error' });
    }
  }
}
