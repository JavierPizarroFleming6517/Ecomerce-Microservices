import { ServiceStatusCard } from '../features/health/service-status-card'
import { useSystemStatus } from '../features/health/use-system-status'
import { API_BASE_URL } from '../lib/env'

export function StatusPage() {
  const { services, isLoading, refresh } = useSystemStatus()
  const onlineCount = services.filter(
    (service) => service.state === 'online',
  ).length
  const allOnline = services.length > 0 && onlineCount === services.length
  const lastCheck = services.at(0)?.checkedAt

  return (
    <section>
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            Monitoreo en tiempo real
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Estado de la plataforma
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Verifica la disponibilidad del gateway y de los servicios
            conectados.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60"
        >
          {isLoading ? 'Consultando…' : 'Actualizar estado'}
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={
              allOnline
                ? 'size-3 rounded-full bg-emerald-500 shadow-[0_0_0_6px] shadow-emerald-100'
                : 'size-3 rounded-full bg-amber-500 shadow-[0_0_0_6px] shadow-amber-100'
            }
          />
          <div>
            <p className="font-semibold text-slate-900">
              {isLoading && services.length === 0
                ? 'Comprobando servicios'
                : allOnline
                  ? 'Todos los sistemas operativos'
                  : `${onlineCount} de ${services.length} servicios operativos`}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {lastCheck
                ? `Última consulta: ${new Intl.DateTimeFormat('es', {
                    dateStyle: 'short',
                    timeStyle: 'medium',
                  }).format(new Date(lastCheck))}`
                : 'Iniciando la primera consulta'}
            </p>
          </div>
        </div>
        <code className="max-w-full truncate rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500">
          {API_BASE_URL || 'Mismo origen'}
        </code>
      </div>

      {isLoading && services.length === 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <ServiceStatusCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </section>
  )
}
