import { Link } from 'react-router-dom'
import type { ProductSummaryDto } from '@retail/contracts'
import { useCart } from '../../states/cart/use-cart'
import { formatPrice } from '../../utils/format-price'

interface ProductCardProps {
  product: ProductSummaryDto
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-white/20 hover:bg-white/[0.06]">
      <Link to={`/producto/${encodeURIComponent(product.sku)}`} className="block">
        <div className="aspect-square overflow-hidden bg-white/5">
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4 pb-0">
          {product.category ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {product.category}
            </p>
          ) : null}
          <h3 className="mt-1 font-semibold text-white">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-neutral-400">
            {product.description}
          </p>
          <p className="mt-3 text-lg font-semibold text-white">
            {formatPrice(product.price, product.currency)}
          </p>
        </div>
      </Link>

      <div className="flex gap-2 p-4 pt-3">
        <Link
          to={`/producto/${encodeURIComponent(product.sku)}`}
          className="flex-1 rounded-lg border border-white/15 px-3 py-2 text-center text-sm font-medium text-neutral-200 transition hover:border-white/30 hover:text-white"
        >
          Ver detalle
        </Link>
        <button
          type="button"
          onClick={() => addItem(product)}
          className="flex-1 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
        >
          Agregar
        </button>
      </div>
    </article>
  )
}
