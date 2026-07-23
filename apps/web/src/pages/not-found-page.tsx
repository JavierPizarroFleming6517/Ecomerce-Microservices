import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-lg py-20 text-center">
      <p className="font-mono text-sm font-semibold text-indigo-600">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Página no encontrada
      </h1>
      <p className="mt-4 text-sm leading-6 text-slate-500">
        La dirección que buscas no existe o fue movida.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
      >
        Volver al inicio
      </Link>
    </section>
  )
}
