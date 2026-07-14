export type ProbeState = 'online' | 'offline'

export interface ServiceProbe {
  id: string
  name: string
  description: string
  endpoint: string
}

export interface ServiceStatus extends ServiceProbe {
  state: ProbeState
  latencyMs: number
  checkedAt: string
  detail?: string
}
