import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import type { OrderDto } from '@retail/contracts'
import { listOrders } from '../../api/orders'
import { StorefrontHeader } from '../../components/store/storefront-header'
import { useAuth } from '../../states/auth/use-auth'
import { formatPrice } from '../../utils/format-price'

type AccountSection = 'compras' | 'datos' | 'password'

const MENU_ITEMS: Array<{ id: AccountSection; label: string }> = [
  { id: 'compras', label: 'Compras' },
  { id: 'datos', label: 'Datos personales' },
  { id: 'password', label: 'Contraseña' },
]

function statusLabel(status: string): string {
  switch (status) {
    case 'paid':
      return 'Pagado'
    case 'failed':
      return 'Fallido'
    case 'cancelled':
      return 'Cancelado'
    default:
      return status
  }
}

function statusClass(status: string): string {
  switch (status) {
    case 'paid':
      return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
    case 'failed':
      return 'border-rose-400/30 bg-rose-400/10 text-rose-200'
    case 'cancelled':
      return 'border-amber-400/30 bg-amber-400/10 text-amber-100'
    default:
      return 'border-white/15 bg-white/5 text-neutral-300'
  }
}

export function AccountPage() {
  const { user, accessToken, isAuthenticated, isBootstrapping, logout } =
    useAuth()
  const [section, setSection] = useState<AccountSection>('compras')
  const [orders, setOrders] = useState<OrderDto[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken || section !== 'compras') {
      return
    }

    const controller = new AbortController()

    void listOrders(accessToken, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) {
          return
        }
        setOrders(response.items)
        setOrdersError(null)
        setOrdersLoading(false)
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }
        setOrdersError(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar tus compras.',
        )
        setOrdersLoading(false)
      })

    return () => controller.abort()
  }, [accessToken, section])

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <StorefrontHeader />
        <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
          <p className="text-sm text-neutral-400">Cargando tu sesión…</p>
        </main>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/iniciar-sesion" replace />
  }

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <StorefrontHeader />

      <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
        <p className="text-sm text-neutral-500">
          <Link to="/" className="transition hover:text-white">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-300">Mi cuenta</span>
        </p>

        <h1 className="mt-4 flex items-center gap-3 text-3xl font-semibold tracking-tight text-white">
          <span className="h-8 w-1 rounded-sm bg-sky-400" aria-hidden="true" />
          Mi cuenta
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Hola, {displayName}. Revisa tus compras y datos de perfil.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-2">
            {MENU_ITEMS.map((item) => {
              const active = section === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={
                    active
                      ? 'block w-full rounded-xl bg-white px-4 py-3 text-left text-sm font-semibold text-neutral-950'
                      : 'block w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm font-medium text-neutral-200 transition hover:border-white/20 hover:bg-white/[0.06]'
                  }
                >
                  {item.label}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => void logout()}
              className="mt-4 block w-full rounded-xl border border-white/10 px-4 py-3 text-left text-sm font-medium text-neutral-300 transition hover:border-white/25 hover:text-white"
            >
              Cerrar sesión
            </button>
          </aside>

          <section className="min-h-80 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            {section === 'compras' ? (
              <>
                <h2 className="text-xl font-semibold text-white">Compras</h2>
                <p className="mt-1 text-sm text-neutral-400">
                  Historial de pedidos asociados a tu sesión.
                </p>

                {ordersLoading ? (
                  <p className="mt-8 text-sm text-neutral-500">
                    Cargando compras…
                  </p>
                ) : ordersError ? (
                  <p className="mt-8 text-sm text-rose-400">{ordersError}</p>
                ) : orders.length === 0 ? (
                  <div className="mt-8 rounded-xl border border-dashed border-white/15 px-5 py-10 text-center">
                    <p className="text-sm text-neutral-300">
                      Aún no tienes compras registradas.
                    </p>
                    <Link
                      to="/"
                      className="mt-4 inline-block text-sm font-semibold text-white underline-offset-4 hover:underline"
                    >
                      Ir al catálogo
                    </Link>
                  </div>
                ) : (
                  <ul className="mt-6 space-y-4">
                    {orders.map((order) => (
                      <li
                        key={order.id}
                        className="rounded-xl border border-white/10 bg-neutral-950/40 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-white">
                              Pedido {order.buyOrder}
                            </p>
                            <p className="mt-1 text-xs text-neutral-500">
                              {new Date(order.createdAt).toLocaleString('es-CL')}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(order.status)}`}
                            >
                              {statusLabel(order.status)}
                            </span>
                            <p className="mt-2 text-sm font-semibold text-white">
                              {formatPrice(order.amount, order.currency)}
                            </p>
                          </div>
                        </div>

                        <ul className="mt-4 space-y-3 border-t border-white/10 pt-4">
                          {order.items.map((item) => (
                            <li
                              key={item.id}
                              className="flex items-center gap-3 text-sm"
                            >
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt=""
                                  className="size-12 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="size-12 rounded-lg bg-white/5" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-neutral-100">
                                  {item.name}
                                </p>
                                <p className="text-xs text-neutral-500">
                                  {item.quantity} ×{' '}
                                  {formatPrice(item.unitPrice, order.currency)}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>

                        {order.authorizationCode ? (
                          <p className="mt-3 text-xs text-neutral-500">
                            Autorización: {order.authorizationCode}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : null}

            {section === 'datos' ? (
              <>
                <h2 className="text-xl font-semibold text-white">
                  Datos personales
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  Información asociada a tu cuenta Retail.
                </p>
                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-neutral-950/40 p-4">
                    <dt className="text-xs uppercase tracking-wide text-neutral-500">
                      Nombre
                    </dt>
                    <dd className="mt-1 text-sm text-white">{displayName}</dd>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-neutral-950/40 p-4">
                    <dt className="text-xs uppercase tracking-wide text-neutral-500">
                      Correo
                    </dt>
                    <dd className="mt-1 text-sm text-white">{user.email}</dd>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-neutral-950/40 p-4">
                    <dt className="text-xs uppercase tracking-wide text-neutral-500">
                      ID de usuario
                    </dt>
                    <dd className="mt-1 truncate text-sm text-neutral-300">
                      {user.id}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-neutral-950/40 p-4">
                    <dt className="text-xs uppercase tracking-wide text-neutral-500">
                      Correo verificado
                    </dt>
                    <dd className="mt-1 text-sm text-white">
                      {user.emailVerifiedAt
                        ? new Date(user.emailVerifiedAt).toLocaleDateString(
                            'es-CL',
                          )
                        : 'Pendiente'}
                    </dd>
                  </div>
                </dl>
              </>
            ) : null}

            {section === 'password' ? (
              <>
                <h2 className="text-xl font-semibold text-white">Contraseña</h2>
                <p className="mt-1 text-sm text-neutral-400">
                  El cambio de contraseña desde la cuenta estará disponible
                  pronto.
                </p>
                <div className="mt-6 rounded-xl border border-dashed border-white/15 px-5 py-8 text-sm text-neutral-400">
                  Por seguridad, tu sesión usa JWT de acceso y refresh. Si
                  olvidaste tu clave, contacta soporte o crea una cuenta nueva
                  mientras habilitando este flujo.
                </div>
              </>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  )
}
