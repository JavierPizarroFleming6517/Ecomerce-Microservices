import type { ProductSummaryDto } from '@retail/contracts'

interface ProductCardProps {
  product: ProductSummaryDto
}

function formatPrice(price: number, currency: string): string {
  try {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency,
    }).format(price)
  } catch {
    return `${price.toFixed(2)} ${currency}`
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-white/20 hover:bg-white/[0.06]">
      <div className="aspect-square overflow-hidden bg-white/5">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
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
    </article>
  )
}
