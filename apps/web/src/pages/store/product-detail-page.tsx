import { Link, useParams } from 'react-router-dom'
import { StorefrontHeader } from '../../components/store/storefront-header'
import { useProduct } from '../../hooks/catalog/use-product'
import { useCart } from '../../states/cart/use-cart'
import { formatPrice } from '../../utils/format-price'

export function ProductDetailPage() {
  const { sku } = useParams<{ sku: string }>()
  const { product, isLoading, error } = useProduct(sku)
  const { addItem } = useCart()

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <StorefrontHeader />

      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <Link
          to="/"
          className="text-sm font-medium text-neutral-400 transition hover:text-white"
        >
          ← Volver al catálogo
        </Link>

        {isLoading ? (
          <p className="mt-8 text-sm text-neutral-500">Cargando producto…</p>
        ) : error || !product ? (
          <p className="mt-8 text-sm text-rose-400">
            {error ?? 'Producto no encontrado'}
          </p>
        ) : (
          <section className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            </div>

            <div>
              {product.category ? (
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {product.category}
                </p>
              ) : null}
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                {product.name}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-neutral-300">
                {product.description}
              </p>
              <p className="mt-6 text-3xl font-semibold text-white">
                {formatPrice(product.price, product.currency)}
              </p>
              <p className="mt-2 text-xs text-neutral-500">SKU: {product.sku}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => addItem(product)}
                  className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
                >
                  Agregar al carrito
                </button>
                <Link
                  to="/carrito"
                  onClick={() => addItem(product)}
                  className="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40"
                >
                  Comprar ahora
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
