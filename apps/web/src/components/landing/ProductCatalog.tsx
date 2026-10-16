import type { CategorySummaryDto, ProductSummaryDto } from '@retail/contracts'
import { motion } from 'framer-motion'
import { ProductCard } from '../catalog/ProductCard'
import { fadeUp, stagger, viewport } from './motion'

interface ProductCatalogProps {
  categories: CategorySummaryDto[]
  categoriesLoading: boolean
  selectedCategory: string | null
  selectedCategoryName: string | null
  onSelectCategory: (slug: string | null) => void
  products: ProductSummaryDto[]
  visibleProducts: ProductSummaryDto[]
  searchTerm: string
  isLoading: boolean
  error: string | null
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}

export function ProductCatalog({
  categories,
  categoriesLoading,
  selectedCategory,
  selectedCategoryName,
  onSelectCategory,
  products,
  visibleProducts,
  searchTerm,
  isLoading,
  error,
  page,
  totalPages,
  total,
  onPageChange,
}: ProductCatalogProps) {
  return (
    <section
      id="catalogo"
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-5 py-10 sm:px-8"
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mb-6 flex flex-col gap-4"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-sky-300/90">
            Catálogo
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {selectedCategoryName ?? 'Productos destacados'}
          </h2>
        </div>

        <div
          className="flex gap-2 overflow-x-auto pb-1"
          aria-label="Filtrar por categoría"
        >
          <FilterChip
            active={selectedCategory === null}
            onClick={() => onSelectCategory(null)}
          >
            Todos
          </FilterChip>
          {categoriesLoading
            ? Array.from({ length: 4 }, (_, index) => (
                <span
                  key={index}
                  className="h-9 w-24 flex-none animate-pulse rounded-full bg-white/10"
                />
              ))
            : categories.map((category) => (
                <FilterChip
                  key={category.slug}
                  active={selectedCategory === category.slug}
                  onClick={() => onSelectCategory(category.slug)}
                >
                  {category.name}
                </FilterChip>
              ))}
        </div>
      </motion.div>

      {isLoading ? (
        <p className="text-sm text-neutral-500">Cargando productos…</p>
      ) : error ? (
        <p className="text-sm text-rose-400">
          No fue posible cargar los productos: {error}
        </p>
      ) : products.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No hay productos en esta categoría todavía.
        </p>
      ) : visibleProducts.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No encontramos productos que coincidan con &ldquo;{searchTerm}&rdquo;.
        </p>
      ) : (
        <>
          <motion.div
            key={`${selectedCategory ?? 'all'}-${page}-${searchTerm}`}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {visibleProducts.map((product) => (
              <motion.div
                key={product.sku}
                variants={fadeUp}
                className="[perspective:900px]"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {totalPages > 1 && !searchTerm.trim() ? (
            <div className="mt-8 flex items-center justify-center gap-4">
              <PageButton
                label="Página anterior"
                disabled={page <= 1 || isLoading}
                onClick={() => onPageChange(Math.max(1, page - 1))}
                direction="prev"
              />
              <p className="min-w-28 text-center text-sm text-neutral-300">
                Página {page} de {totalPages}
                <span className="mt-0.5 block text-xs text-neutral-500">
                  {total} productos
                </span>
              </p>
              <PageButton
                label="Página siguiente"
                disabled={page >= totalPages || isLoading}
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                direction="next"
              />
            </div>
          ) : null}
        </>
      )}
    </section>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'flex-none rounded-full bg-white px-3 py-1.5 text-sm font-medium text-neutral-950'
          : 'flex-none rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-neutral-300 backdrop-blur-md transition hover:border-white/30 hover:text-white'
      }
    >
      {children}
    </button>
  )
}

function PageButton({
  label,
  disabled,
  onClick,
  direction,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  direction: 'prev' | 'next'
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-10 place-items-center rounded-full border border-white/15 text-white backdrop-blur-md transition hover:border-white/30 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
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
          d={direction === 'prev' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'}
        />
      </svg>
    </button>
  )
}
