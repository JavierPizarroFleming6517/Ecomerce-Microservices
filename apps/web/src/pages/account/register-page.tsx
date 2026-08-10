import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { StorefrontHeader } from '../../components/store/storefront-header'
import { useAuth } from '../../states/auth/use-auth'

export function RegisterPage() {
  const { register, isAuthenticated, isBootstrapping } = useAuth()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isBootstrapping && isAuthenticated) {
    return <Navigate to="/cuenta" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await register({
        email,
        password,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      })
      void navigate('/cuenta')
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo crear la cuenta. Intenta nuevamente.',
      )
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <StorefrontHeader />

      <main className="mx-auto flex w-full max-w-6xl justify-center px-5 py-10 sm:px-8">
        <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Crear cuenta
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Regístrate para guardar tu sesión y seguir comprando.
          </p>

          <form className="mt-8 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2 text-sm">
                <span className="font-medium text-neutral-300">Nombre</span>
                <input
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-neutral-500 focus:border-white/30 focus:outline-none"
                  placeholder="Opcional"
                />
              </label>
              <label className="block space-y-2 text-sm">
                <span className="font-medium text-neutral-300">Apellido</span>
                <input
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-neutral-500 focus:border-white/30 focus:outline-none"
                  placeholder="Opcional"
                />
              </label>
            </div>

            <label className="block space-y-2 text-sm">
              <span className="font-medium text-neutral-300">Correo</span>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-neutral-500 focus:border-white/30 focus:outline-none"
                placeholder="tu@correo.com"
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="font-medium text-neutral-300">Contraseña</span>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-neutral-500 focus:border-white/30 focus:outline-none"
                placeholder="Mínimo 8 caracteres"
              />
            </label>

            {error ? <p className="text-sm text-rose-400">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Creando cuenta…' : 'Registrarme'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-400">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/iniciar-sesion"
              className="font-semibold text-white underline-offset-4 hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>
        </section>
      </main>
    </div>
  )
}
