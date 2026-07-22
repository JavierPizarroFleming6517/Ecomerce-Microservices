import { StatusCard } from '@retail/ui'
import type { ServiceStatus } from '../../types/health'

interface ServiceStatusCardProps {
  service: ServiceStatus
}

export function ServiceStatusCard({ service }: ServiceStatusCardProps) {
  return (
    <StatusCard
      className="rounded-2xl p-5 shadow-slate-950/5"
      title={service.name}
      value={`${service.latencyMs} ms`}
      status={service.state === 'online' ? 'operational' : 'down'}
      statusLabel={service.state === 'online' ? 'Operativo' : 'No disponible'}
      description={`${service.detail ?? service.description} · ${service.endpoint}`}
    />
  )
}
