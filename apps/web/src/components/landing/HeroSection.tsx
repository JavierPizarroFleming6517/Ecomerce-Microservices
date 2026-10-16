import type { CategorySummaryDto, ProductSummaryDto } from '@retail/contracts'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/format-price'

interface HeroSectionProps {
  products: ProductSummaryDto[]
  isLoading: boolean
  categories: CategorySummaryDto[]
  categoriesLoading: boolean
  selectedCategory: string | null
  onSelectCategory: (slug: string | null) => void
}

export function HeroSection({
  products,
  isLoading,
  categories,
  categoriesLoading,
  selectedCategory,
  onSelectCategory,
}: HeroSectionProps) {
  const slides = pairProducts(products.slice(0, 6))
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()
  const slide = slides[index]
  const left = slide?.[0]
  const right = slide?.[1]

  useEffect(() => {
    if (reduceMotion || slides.length < 2) {
      return
    }

    const timeoutId = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 7000)

    return () => window.clearInterval(timeoutId)
  }, [reduceMotion, slides.length])

  function goTo(next: number) {
    if (slides.length === 0) {
      return
    }

    const total = slides.length
    setIndex((next + total) % total)
  }

  return (
    <div>
      <nav
        aria-label="Categorías"
        className="border-b border-white/10 bg-neutral-950"
      >
        <div className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-5 sm:px-8">
          <CategoryLink
            active={selectedCategory === null}
            onClick={() => onSelectCategory(null)}
          >
            Todas
          </CategoryLink>
          {categoriesLoading
            ? Array.from({ length: 4 }, (_, item) => (
                <span
                  key={item}
                  className="my-3 h-5 w-24 shrink-0 animate-pulse rounded bg-white/10"
                />
              ))
            : categories.map((category) => (
                <CategoryLink
                  key={category.slug}
                  active={selectedCategory === category.slug}
                  onClick={() => onSelectCategory(category.slug)}
                >
                  {category.name}
                </CategoryLink>
              ))}
        </div>
      </nav>

      <section className="mx-auto w-full max-w-6xl px-5 py-5 sm:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-900 to-sky-950 text-neutral-100">
          {isLoading ? (
            <div className="h-72 animate-pulse bg-white/5 sm:h-80" />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={left?.sku ?? 'empty'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="grid items-center gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:py-10"
              >
                {left ? <PromoProduct product={left} align="left" /> : <div />}
                <div className="mx-auto max-w-xs text-center">
                  <p className="text-2xl font-semibold tracking-tight text-sky-300">
                    Retail
                  </p>
                  <p className="mt-1 text-sm text-sky-200/70">
                    Componentes para armar tu equipo
                  </p>
                  <p className="mt-4 text-4xl font-semibold leading-none tracking-tight text-white sm:text-5xl">
                    Envío gratis
                  </p>
                  <p className="mt-2 text-sm text-neutral-400">
                    Sobre $50.000 · Pago con Webpay
                  </p>
                  <a
                    href="#catalogo"
                    className="mt-5 inline-flex rounded-md border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-neutral-950"
                  >
                    Ver productos
                  </a>
                </div>
                {right ? <PromoProduct product={right} align="right" /> : <div />}
              </motion.div>
            </AnimatePresence>
          )}

          {slides.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Banner anterior"
                onClick={() => goTo(index - 1)}
                className="absolute left-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-neutral-950/80 text-white"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Banner siguiente"
                onClick={() => goTo(index + 1)}
                className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-neutral-950/80 text-white"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </>
          ) : null}
        </div>
      </section>
    </div>
  )
}

function PromoProduct({
  product,
  align,
}: {
  product: ProductSummaryDto
  align: 'left' | 'right'
}) {
  return (
    <Link
      to={`/producto/${encodeURIComponent(product.sku)}`}
      className={`flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3 transition hover:bg-white/10 ${align === 'right' ? 'lg:flex-row-reverse lg:text-right' : ''}`}
    >
      <img
        src={product.imageUrl}
        alt=""
        className="size-28 shrink-0 object-contain sm:size-36"
      />
      <span>
        {product.brand ? (
          <span className="block text-xs font-medium uppercase tracking-wide text-neutral-400">
            {product.brand}
          </span>
        ) : null}
        <span className="mt-1 block text-sm font-semibold leading-snug">
          {product.name}
        </span>
        <span className="mt-2 block text-xl font-semibold text-sky-300">
          {formatPrice(product.price, product.currency)}
        </span>
      </span>
    </Link>
  )
}

function CategoryLink({
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
          ? 'shrink-0 border-b-2 border-white px-3 py-3 text-sm font-semibold text-white'
          : 'shrink-0 border-b-2 border-transparent px-3 py-3 text-sm font-medium text-neutral-300 transition hover:text-white'
      }
    >
      {children}
    </button>
  )
}

function pairProducts(products: ProductSummaryDto[]): ProductSummaryDto[][] {
  const pairs: ProductSummaryDto[][] = []

  for (let index = 0; index < products.length; index += 2) {
    const pair = products.slice(index, index + 2)
    if (pair.length > 0) {
      pairs.push(pair)
    }
  }

  return pairs
}
