export const SERVICE_NAMES = {
  USERS: 'users',
  CATALOG: 'catalog',
  RECOMMENDATIONS: 'recommendations',
  PAYMENTS: 'payments',
} as const;

export type ServiceName = (typeof SERVICE_NAMES)[keyof typeof SERVICE_NAMES];

export interface PingRequestDto {
  requestedAt?: string;
}

export interface PingResponseDto {
  service: ServiceName;
  status: 'ok';
  timestamp: string;
}
