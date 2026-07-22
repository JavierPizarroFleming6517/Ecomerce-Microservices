import { useState } from 'react'
import { ProductCard } from '../components/catalog/ProductCard'
import { useCategories } from '../hooks/catalog/use-categories'
import { useFeaturedProducts } from '../hooks/catalog/use-featured-products'

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { categories, isLoading: categoriesLoading } = useCategories()
  const {
    products,
    isLoading: productsLoading,
    error: productsError,
  } = useFeaturedProducts(selectedCategory)

  const selectedCategoryName = selectedCategory
    ? categories.find((category) => category.slug === selectedCategory)?.name
    : null

  const search = searchTerm.trim().toLowerCase()
  const visibleProducts = search
    ? products.filter((product) => product.name.toLowerCase().includes(search))
    : products

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Barra de anuncio */}
      <div className="bg-white/5 px-5 py-2 text-center text-xs font-medium text-neutral-300">
        Envío gratis en compras sobre $50.000 · Retiro gratis en tienda
      </div>

      {/* Header: logo + buscador + acciones */}
      <header className="bg-neutral-950">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white">
            <span className="grid size-8 place-items-center rounded-lg bg-white text-sm font-bold text-neutral-950">
              R
            </span>
            Retail
          </div>

          <label className="relative w-full sm:max-w-md sm:flex-1">
            <span className="sr-only">Buscar productos</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Busca productos…"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-white/30 focus:outline-none"
            />
          </label>

          <div className="flex items-center justify-end gap-5 text-sm text-neutral-300">
            <button type="button" className="transition hover:text-white">
              Iniciar sesión
            </button>
            <button type="button" className="transition hover:text-white">
              Carrito
            </button>
          </div>
        </div>
      </header>

      {/* Nav de categorías */}
      <nav
        aria-label="Categorías del catálogo"
        className="border-b border-white/10 bg-white/[0.02]"
      >
        <div className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-5 sm:px-8">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={
              selectedCategory === null
                ? 'flex-none whitespace-nowrap border-b-2 border-white px-3 py-3 text-sm font-medium text-white'
                : 'flex-none whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm font-medium text-neutral-400 transition hover:text-white'
            }
          >
            Todos
          </button>

          {categoriesLoading
            ? Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="my-2.5 h-6 w-24 flex-none animate-pulse rounded-md bg-white/5"
                />
              ))
            : categories.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setSelectedCategory(category.slug)}
                  className={
                    selectedCategory === category.slug
                      ? 'flex-none whitespace-nowrap border-b-2 border-white px-3 py-3 text-sm font-medium text-white'
                      : 'flex-none whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm font-medium text-neutral-400 transition hover:text-white'
                  }
                >
                  {category.name}
                </button>
              ))}
        </div>
      </nav>

      {/* Catálogo de productos */}
      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <section id="catalogo">
          <h2 className="mb-6 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {selectedCategoryName ?? 'Productos destacados'}
          </h2>

          {productsLoading ? (
            <p className="text-sm text-neutral-500">Cargando productos…</p>
          ) : productsError ? (
            <p className="text-sm text-rose-400">
              No fue posible cargar los productos: {productsError}
            </p>
          ) : products.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No hay productos en esta categoría todavía.
            </p>
          ) : visibleProducts.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No encontramos productos que coincidan con &ldquo;{searchTerm}
              &rdquo;.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
