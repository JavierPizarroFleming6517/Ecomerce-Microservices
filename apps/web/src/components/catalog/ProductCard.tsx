import type { ProductSummaryDto } from '@retail/contracts'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../states/cart/use-cart'
import { formatPrice } from '../../utils/format-price'

interface ProductCardProps {
  product: ProductSummaryDto
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const productPath = `/producto/${encodeURIComponent(product.sku)}`

  useEffect(() => {
    if (!added) {
      return
    }

    const timeoutId = window.setTimeout(() => setAdded(false), 1200)
    return () => window.clearTimeout(timeoutId)
  }, [added])

  return (
    <motion.article
      whileHover={{ scale: 1.03, rotateX: 3, rotateY: -4 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      style={{ transformStyle: 'preserve-3d' }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-md"
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/25 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />

      <Link to={productPath} className="relative block">
        <div className="aspect-square overflow-hidden bg-white/5">
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4 pb-0">
          {product.brand ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-300/90">
              {product.brand}
            </p>
          ) : product.category ? (
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

      <div className="relative flex gap-2 p-4 pt-3">
        <Link
          to={productPath}
          className="flex-1 rounded-lg border border-white/15 px-3 py-2 text-center text-sm font-medium text-neutral-200 transition hover:border-white/30 hover:text-white"
        >
          Ver detalle
        </Link>
        <button
          type="button"
          onClick={() => {
            addItem(product)
            setAdded(true)
          }}
          className="flex flex-1 items-center justify-center overflow-hidden rounded-lg bg-white px-3 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={added ? 'added' : 'idle'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="inline-flex items-center gap-1.5"
            >
              {added ? (
                <>
                  <Check className="size-3.5" aria-hidden="true" />
                  Listo
                </>
              ) : (
                'Agregar'
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </motion.article>
  )
}
