export interface CreateOrderItemDto {
  sku: string
  name: string
  unitPrice: number
  quantity: number
  imageUrl?: string
}

export interface CreateOrderRequestDto {
  buyOrder: string
  amount: number
  currency: string
  status: 'paid' | 'failed' | 'cancelled'
  authorizationCode?: string
  items: CreateOrderItemDto[]
}

export interface OrderItemDto {
  id: string
  sku: string
  name: string
  unitPrice: number
  quantity: number
  imageUrl: string
}

export interface OrderDto {
  id: string
  buyOrder: string
  amount: number
  currency: string
  status: string
  authorizationCode: string | null
  createdAt: string
  items: OrderItemDto[]
}

export interface ListOrdersResponseDto {
  items: OrderDto[]
}
