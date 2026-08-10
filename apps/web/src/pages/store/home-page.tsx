import { useState } from 'react'
import { ProductCard } from '../../components/catalog/ProductCard'
import { StorefrontFooter } from '../../components/store/storefront-footer'
import { StorefrontHeader } from '../../components/store/storefront-header'
import { useCategories } from '../../hooks/catalog/use-categories'
import { useFeaturedProducts } from '../../hooks/catalog/use-featured-products'

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const { categories, isLoading: categoriesLoading } = useCategories()
  const {
    products,
    totalPages,
    total,
    isLoading: productsLoading,
    error: productsError,
  } = useFeaturedProducts(selectedCategory, page)

  const selectedCategoryName = selectedCategory
    ? categories.find((category) => category.slug === selectedCategory)?.name
    : null

  const search = searchTerm.trim().toLowerCase()
  const visibleProducts = search
    ? products.filter((product) => product.name.toLowerCase().includes(search))
    : products

  function selectCategory(slug: string | null) {
    setSelectedCategory(slug)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <StorefrontHeader
        showSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <nav
        aria-label="Categorías del catálogo"
        className="border-b border-white/10 bg-white/[0.02]"
      >
        <div className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-5 sm:px-8">
          <button
            type="button"
            onClick={() => selectCategory(null)}
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
                  onClick={() => selectCategory(category.slug)}
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
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.sku} product={product} />
                ))}
              </div>

              {totalPages > 1 && !search ? (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    aria-label="Página anterior"
                    disabled={page <= 1 || productsLoading}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="grid size-10 place-items-center rounded-lg border border-white/15 text-white transition hover:border-white/30 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="size-5"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 18l-6-6 6-6"
                      />
                    </svg>
                  </button>

                  <p className="min-w-28 text-center text-sm text-neutral-300">
                    Página {page} de {totalPages}
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      {total} productos
                    </span>
                  </p>

                  <button
                    type="button"
                    aria-label="Página siguiente"
                    disabled={page >= totalPages || productsLoading}
                    onClick={() =>
                      setPage((current) => Math.min(totalPages, current + 1))
                    }
                    className="grid size-10 place-items-center rounded-lg border border-white/15 text-white transition hover:border-white/30 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="size-5"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 18l6-6-6-6"
                      />
                    </svg>
                  </button>
                </div>
              ) : null}
            </>
          )}
        </section>
      </main>

      <StorefrontFooter />
    </div>
  )
}
