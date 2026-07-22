import { ProductCard } from './product-card'
import { useFeaturedProducts } from './use-featured-products'

interface ProductGridProps {
  categorySlug: string | null
  searchTerm?: string
}

export function ProductGrid({ categorySlug, searchTerm = '' }: ProductGridProps) {
  const { products, isLoading, error } = useFeaturedProducts(categorySlug)

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const visibleProducts = normalizedSearch
    ? products.filter((product) =>
        product.name.toLowerCase().includes(normalizedSearch),
      )
    : products

  if (isLoading) {
    return <p className="text-sm text-neutral-500">Cargando productos…</p>
  }

  if (error) {
    return (
      <p className="text-sm text-rose-400">
        No fue posible cargar los productos: {error}
      </p>
    )
  }

  if (products.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        No hay productos en esta categoría todavía. Ejecuta{' '}
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-neutral-300">
          pnpm --filter @retail/catalog-service db:seed
        </code>{' '}
        para cargar ejemplos.
      </p>
    )
  }

  if (visibleProducts.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        No encontramos productos que coincidan con &ldquo;{searchTerm}&rdquo;.
      </p>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {visibleProducts.map((product) => (
        <ProductCard key={product.sku} product={product} />
      ))}
    </div>
  )
}
