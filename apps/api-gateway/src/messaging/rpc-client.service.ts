import {
  BadGatewayException,
  GatewayTimeoutException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, TimeoutError, timeout } from 'rxjs';

import { RPC_TIMEOUT_MS } from './messaging.constants';

type RpcError = {
  message?: string;
  status?: number;
  statusCode?: number;
  error?: {
    message?: string;
    status?: number;
    statusCode?: number;
  };
};

@Injectable()
export class RpcClientService {
  async send<TResult>(
    client: ClientProxy,
    pattern: string,
    payload: unknown,
  ): Promise<TResult> {
    try {
      return await firstValueFrom(
        client.send<TResult, unknown>(pattern, payload).pipe(
          timeout(RPC_TIMEOUT_MS),
        ),
      );
    } catch (error: unknown) {
      if (error instanceof TimeoutError) {
        throw new GatewayTimeoutException('The downstream service timed out');
      }

      if (error instanceof HttpException) {
        throw error;
      }

      const rpcError = this.asRpcError(error);
      const status =
        rpcError?.status ??
        rpcError?.statusCode ??
        rpcError?.error?.status ??
        rpcError?.error?.statusCode;
      const message =
        rpcError?.message ??
        rpcError?.error?.message ??
        'The downstream service is unavailable';

      if (status && status >= 400 && status < 600) {
        throw new HttpException(message, status);
      }

      throw new BadGatewayException(message);
    }
  }

  private asRpcError(error: unknown): RpcError | undefined {
    return typeof error === 'object' && error !== null
      ? (error as RpcError)
      : undefined;
  }
}
