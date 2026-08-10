import type {
  CreateOrderRequestDto,
  ListOrdersResponseDto,
  OrderDto,
} from '@retail/contracts'
import { getApi, postApi } from '../lib/http'

export function listOrders(
  accessToken: string,
  signal?: AbortSignal,
): Promise<ListOrdersResponseDto> {
  return getApi<ListOrdersResponseDto>('/api/v1/orders', {
    signal,
    accessToken,
  })
}

export function createOrder(
  accessToken: string,
  data: CreateOrderRequestDto,
  signal?: AbortSignal,
): Promise<OrderDto> {
  return postApi<OrderDto>('/api/v1/orders', data, {
    signal,
    accessToken,
  })
}
