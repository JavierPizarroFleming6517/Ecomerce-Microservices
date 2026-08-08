import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  createPaymentTransaction,
  redirectToWebpay,
} from '../../api/payments'
import { StorefrontHeader } from '../../components/store/storefront-header'
import { useCart } from '../../states/cart/use-cart'
import { formatPrice } from '../../utils/format-price'

export function CartPage() {
  const { items, subtotal, currency, setQuantity, removeItem, itemCount } =
    useCart()
  const [isPaying, setIsPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePay() {
    if (items.length === 0 || isPaying) {
      return
    }

    setIsPaying(true)
    setError(null)

    try {
      const amount = Math.round(subtotal)
      if (amount < 1) {
        throw new Error('El monto del pedido debe ser mayor a 0.')
      }

      const transaction = await createPaymentTransaction(amount)
      redirectToWebpay(transaction.url, transaction.token)
    } catch (err: unknown) {
      setIsPaying(false)
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo iniciar el pago con Webpay.',
      )
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <StorefrontHeader />

      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <Link
          to="/"
          className="text-sm font-medium text-neutral-400 transition hover:text-white"
        >
          ← Seguir comprando
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white">
          Tu pedido
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Revisa el detalle antes de continuar al pago con Webpay.
        </p>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="text-neutral-300">Tu carrito está vacío.</p>
            <Link
              to="/"
              className="mt-4 inline-block text-sm font-semibold text-white underline-offset-4 hover:underline"
            >
              Volver al catálogo
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <section className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.sku}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="size-24 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-semibold text-white">{item.name}</h2>
                        <p className="mt-1 line-clamp-2 text-sm text-neutral-400">
                          {item.description}
                        </p>
                      </div>
                      <p className="whitespace-nowrap font-semibold text-white">
                        {formatPrice(item.price * item.quantity, item.currency)}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-neutral-300">
                        Cantidad
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(event) =>
                            setQuantity(item.sku, Number(event.target.value))
                          }
                          className="w-16 rounded-md border border-white/15 bg-transparent px-2 py-1 text-white"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removeItem(item.sku)}
                        className="text-sm text-rose-300 transition hover:text-rose-200"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-lg font-semibold text-white">
                Resumen del pedido
              </h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-neutral-300">
                  <dt>Productos</dt>
                  <dd>{itemCount}</dd>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(subtotal, currency)}</dd>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
                  <dt>Total a pagar</dt>
                  <dd>{formatPrice(subtotal, currency)}</dd>
                </div>
              </dl>

              {error ? (
                <p className="mt-4 text-sm text-rose-400">{error}</p>
              ) : null}

              <button
                type="button"
                disabled={isPaying}
                onClick={() => void handlePay()}
                className="mt-6 w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPaying ? 'Redirigiendo a Webpay…' : 'Pagar con Webpay'}
              </button>
              <p className="mt-3 text-xs text-neutral-500">
                Serás enviado al formulario seguro de Transbank para completar el
                pago.
              </p>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}
