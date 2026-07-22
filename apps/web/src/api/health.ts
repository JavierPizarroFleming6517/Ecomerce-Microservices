import type { PingResponseDto } from '@retail/contracts'
import { getApi } from '../lib/http'
import type { ServiceProbe, ServiceStatus } from '../types/health'

interface GatewayHealthResponse {
  status: 'ok'
  service: 'api-gateway'
  timestamp: string
}

export const serviceProbes: ServiceProbe[] = [
  {
    id: 'gateway',
    name: 'API Gateway',
    description: 'Entrada principal de la plataforma',
    endpoint: '/api/v1/health',
  },
  {
    id: 'catalog',
    name: 'Catálogo',
    description: 'Productos, categorías y disponibilidad',
    endpoint: '/api/v1/catalog/ping',
  },
  {
    id: 'users',
    name: 'Usuarios',
    description: 'Perfiles y cuentas de clientes',
    endpoint: '/api/v1/users/ping',
  },
  {
    id: 'recommendations',
    name: 'Recomendaciones',
    description: 'Sugerencias personalizadas',
    endpoint: '/api/v1/recommendations/ping',
  },
]

async function checkService(
  probe: ServiceProbe,
  signal?: AbortSignal,
): Promise<ServiceStatus> {
  const startedAt = performance.now()

  try {
    const response = await getApi<PingResponseDto | GatewayHealthResponse>(
      probe.endpoint,
      signal,
    )

    if (!response || response.status !== 'ok') {
      throw new Error('El servicio devolvió una respuesta inesperada.')
    }

    return {
      ...probe,
      state: 'online',
      latencyMs: Math.round(performance.now() - startedAt),
      checkedAt: new Date().toISOString(),
    }
  } catch (error) {
    return {
      ...probe,
      state: 'offline',
      latencyMs: Math.round(performance.now() - startedAt),
      checkedAt: new Date().toISOString(),
      detail:
        error instanceof Error
          ? error.message
          : 'No fue posible consultar el servicio.',
    }
  }
}

export function getSystemStatus(signal?: AbortSignal): Promise<ServiceStatus[]> {
  return Promise.all(serviceProbes.map((probe) => checkService(probe, signal)))
}
