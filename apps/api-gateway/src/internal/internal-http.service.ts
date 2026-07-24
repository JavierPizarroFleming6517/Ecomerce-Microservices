import {
  BadGatewayException,
  GatewayTimeoutException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom, TimeoutError, timeout } from 'rxjs';

const HTTP_TIMEOUT_MS = 5000;

@Injectable()
export class InternalHttpService {
  constructor(private readonly http: HttpService) {}

  async get<TResult>(
    baseUrl: string,
    path: string,
    options?: {
      params?: Record<string, string | number | undefined>;
      headers?: Record<string, string | undefined>;
    },
  ): Promise<TResult> {
    const url = this.joinUrl(baseUrl, path);

    const params = this.omitUndefined(options?.params);
    const headers = this.omitUndefined(options?.headers);
    const requestConfig = {
      ...(params ? { params } : {}),
      ...(headers ? { headers } : {}),
    };

    try {
      const response = await firstValueFrom(
        this.http
          .get<TResult>(url, requestConfig)
          .pipe(timeout(HTTP_TIMEOUT_MS)),
      );

      return response.data;
    } catch (error: unknown) {
      throw this.mapError(error);
    }
  }

  private joinUrl(baseUrl: string, path: string): string {
    const normalizedBase = baseUrl.replace(/\/+$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
  }

  private omitUndefined<T extends string | number>(
    values?: Record<string, T | undefined>,
  ): Record<string, T> | undefined {
    if (!values) {
      return undefined;
    }

    const entries = Object.entries(values).filter(
      (entry): entry is [string, T] => entry[1] !== undefined,
    );

    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }

  private mapError(error: unknown): HttpException {
    if (error instanceof TimeoutError) {
      return new GatewayTimeoutException('The downstream service timed out');
    }

    if (error instanceof HttpException) {
      return error;
    }

    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const data = error.response?.data;
      const messageFromBody =
        typeof data === 'object' && data !== null && 'message' in data
          ? (data as { message?: string | string[] }).message
          : undefined;
      const message = Array.isArray(messageFromBody)
        ? messageFromBody.join(', ')
        : (messageFromBody ??
          error.message ??
          'The downstream service is unavailable');

      if (status && status >= 400 && status < 600) {
        return new HttpException(message, status);
      }
    }

    return new BadGatewayException('The downstream service is unavailable');
  }
}
