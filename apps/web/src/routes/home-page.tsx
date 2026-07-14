import { Link } from 'react-router-dom'
import { getApiUrl } from '../lib/http'

const capabilities = [
  {
    title: 'Arquitectura modular',
    description:
      'Servicios especializados para catálogo, usuarios y recomendaciones.',
  },
  {
    title: 'Observabilidad simple',
    description:
      'Consulta el estado operativo de cada servicio desde un único lugar.',
  },
  {
    title: 'Experiencia consistente',
    description:
      'Una base preparada para construir flujos comerciales rápidos y claros.',
  },
]

export function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 text-white shadow-xl shadow-slate-950/10 sm:px-12 sm:py-20">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 size-80 rounded-full bg-indigo-500/20 blur-3xl"
        />
        <div className="relative max-w-2xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
            Comercio conectado
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Una plataforma preparada para crecer.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Centraliza la operación de Retail y mantén visibilidad sobre los
            servicios que impulsan cada experiencia de compra.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/estado"
              className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-400"
            >
              Ver estado del sistema
            </Link>
            <a
              href={getApiUrl('/api/v1/health')}
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Consultar API
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16" aria-labelledby="capabilities-title">
        <div className="mb-8 max-w-xl">
          <p className="text-sm font-semibold text-indigo-600">Plataforma</p>
          <h2
            id="capabilities-title"
            className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Una base clara para la operación diaria
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {capabilities.map((capability, index) => (
            <article
              key={capability.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5"
            >
              <span className="font-mono text-xs font-semibold text-indigo-600">
                0{index + 1}
              </span>
              <h3 className="mt-5 font-semibold">{capability.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {capability.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
