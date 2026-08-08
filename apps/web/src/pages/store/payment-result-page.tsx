import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { CommitPaymentTransactionResponseDto } from '@retail/contracts'
import { commitPaymentTransaction } from '../../api/payments'
import { StorefrontHeader } from '../../components/store/storefront-header'
import { useCart } from '../../states/cart/use-cart'
import { formatPrice } from '../../utils/format-price'

export function PaymentResultPage() {
  const [params] = useSearchParams()
  const { clearCart } = useCart()
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
      .then((response) => {
        if (controller.signal.aborted) {
          return
        }
        setResult(response)
        if (response.status === 'authorized') {
          clearCart()
        }
        setIsLoading(false)
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
  }, [clearCart, earlyError, tokenWs])

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
