import type { Params } from 'nestjs-pino';

const DEFAULT_REDACT_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'res.headers["set-cookie"]',
] as const;

export interface NestPinoOptions {
  serviceName: string;
  level?: string;
  autoLogging?: boolean;
  redact?: readonly string[];
}

export function createNestPinoOptions(options: NestPinoOptions): Params {
  return {
    pinoHttp: {
      level: options.level ?? process.env.LOG_LEVEL ?? 'info',
      base: {
        service: options.serviceName,
      },
      autoLogging: options.autoLogging ?? true,
      quietReqLogger: true,
      redact: [...(options.redact ?? DEFAULT_REDACT_PATHS)],
    },
  };
}
