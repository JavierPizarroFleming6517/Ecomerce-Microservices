import { useCallback, useEffect, useState } from 'react'
import { getSystemStatus } from '../../api/health'
import type { ServiceStatus } from '../../types/health'

async function fetchServices(
  setServices: (services: ServiceStatus[]) => void,
  setIsLoading: (isLoading: boolean) => void,
  signal?: AbortSignal,
) {
  const nextServices = await getSystemStatus(signal)

  if (!signal?.aborted) {
    setServices(nextServices)
    setIsLoading(false)
  }
}

export function useSystemStatus() {
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(
    (signal?: AbortSignal) => fetchServices(setServices, setIsLoading, signal),
    [],
  )

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    await fetchServices(setServices, setIsLoading, signal)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)

    return () => controller.abort()
  }, [load])

  return { services, isLoading, refresh }
}
