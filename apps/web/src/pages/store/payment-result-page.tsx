import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { CommitPaymentTransactionResponseDto } from '@retail/contracts'
import { createOrder } from '../../api/orders'
import { commitPaymentTransaction } from '../../api/payments'
import { StorefrontHeader } from '../../components/store/storefront-header'
import { useAuth } from '../../states/auth/use-auth'
import { useCart } from '../../states/cart/use-cart'
import {
  clearPendingCheckout,
  readPendingCheckout,
} from '../../states/orders/pending-checkout'
import { formatPrice } from '../../utils/format-price'

export function PaymentResultPage() {
  const [params] = useSearchParams()
  const { clearCart } = useCart()
  const { accessToken, isAuthenticated } = useAuth()
  const tokenWs = params.get('token_ws')
  const cancelled = params.get('cancelled') === '1'
  const timeout = params.get('timeout') === '1'
  const earlyError = cancelled
    ? 'Cancelaste el pago en Webpay.'
    : timeout
      ? 'La sesión de pago expiró. Intenta nuevamente.'
      : !tokenWs
        ? 'No recibimos el token de Webpay.'
        : null

  const [result, setResult] =
    useState<CommitPaymentTransactionResponseDto | null>(null)
  const [commitError, setCommitError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(!earlyError)

  useEffect(() => {
    if (earlyError || !tokenWs) {
      return
    }

    const controller = new AbortController()

    void commitPaymentTransaction(tokenWs, controller.signal)
      .then(async (response) => {
        if (controller.signal.aborted) {
          return
        }

        if (response.status === 'authorized') {
          const pending = readPendingCheckout()
          if (pending && isAuthenticated && accessToken) {
            try {
              await createOrder(
                accessToken,
                {
                  buyOrder: response.buyOrder,
                  amount: response.amount,
                  currency: pending.currency || 'CLP',
                  status: 'paid',
                  authorizationCode: response.authorizationCode,
                  items: pending.items.map((item) => ({
                    sku: item.sku,
                    name: item.name,
                    unitPrice: Math.round(item.price),
                    quantity: item.quantity,
                    imageUrl: item.imageUrl,
                  })),
                },
                controller.signal,
              )
            } catch {
              // Payment already authorized; order sync can be retried later.
            }
          }

          clearPendingCheckout()
          clearCart()
        }

        if (!controller.signal.aborted) {
          setResult(response)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) {
          return
        }
        setCommitError(
          err instanceof Error
            ? err.message
            : 'No se pudo confirmar el pago con Transbank.',
        )
        setIsLoading(false)
      })

    return () => controller.abort()
  }, [accessToken, clearCart, earlyError, isAuthenticated, tokenWs])

  const error = earlyError ?? commitError
  const approved = result?.status === 'authorized'

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <StorefrontHeader />

      <main className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Resultado del pago
        </h1>

        {isLoading ? (
          <p className="mt-6 text-sm text-neutral-400">
            Confirmando la transacción con Transbank…
          </p>
        ) : error ? (
          <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-6">
            <p className="font-semibold text-rose-200">Pago no completado</p>
            <p className="mt-2 text-sm text-rose-100/80">{error}</p>
          </div>
        ) : approved && result ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
            <p className="font-semibold text-emerald-200">Pago aprobado</p>
            <dl className="mt-4 space-y-2 text-sm text-emerald-50/90">
              <div className="flex justify-between gap-4">
                <dt>Orden</dt>
                <dd>{result.buyOrder}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Monto</dt>
                <dd>{formatPrice(result.amount, 'CLP')}</dd>
              </div>
              {result.authorizationCode ? (
                <div className="flex justify-between gap-4">
                  <dt>Autorización</dt>
                  <dd>{result.authorizationCode}</dd>
                </div>
              ) : null}
            </dl>
            {isAuthenticated ? (
              <p className="mt-4 text-sm text-emerald-100/80">
                Puedes ver este pedido en{' '}
                <Link to="/cuenta" className="font-semibold underline">
                  Mi cuenta
                </Link>
                .
              </p>
            ) : null}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-6">
            <p className="font-semibold text-amber-100">
              El pago no fue autorizado
            </p>
            <p className="mt-2 text-sm text-amber-50/80">
              Estado: {result?.status ?? 'desconocido'}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950"
          >
            Volver al inicio
          </Link>
          <Link
            to="/carrito"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white"
          >
            Ver carrito
          </Link>
        </div>
      </main>
    </div>
  )
}
