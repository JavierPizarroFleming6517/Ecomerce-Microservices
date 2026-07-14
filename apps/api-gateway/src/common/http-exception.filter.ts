import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { CORRELATION_ID_HEADER } from './correlation-id.interceptor';

type CorrelatedRequest = Request & { correlationId?: string };

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<CorrelatedRequest>();
    const response = context.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const details =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse ?? { message: 'Internal server error' });
    const correlationId =
      request.correlationId ??
      request.header(CORRELATION_ID_HEADER) ??
      response.getHeader(CORRELATION_ID_HEADER);

    response.status(status).json({
      ...(typeof details === 'object' ? details : { message: details }),
      statusCode: status,
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  }
}
