import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useSimilarProducts } from '../../hooks/catalog/use-similar-products'
import { ProductCard } from '../catalog/ProductCard'
import { fadeUp, stagger, viewport } from './motion'

interface RecommendationGridProps {
  seedSku: string | undefined
  seedName: string | undefined
}

export function RecommendationGrid({
  seedSku,
  seedName,
}: RecommendationGridProps) {
  const { related, isLoading } = useSimilarProducts(seedSku)
  const fromGraph = related.coPurchase.slice(0, 4)
  const fromCategory = related.byCategory.slice(0, 4)
  const items = fromGraph.length > 0 ? fromGraph : fromCategory
  const fromCoPurchase = fromGraph.length > 0

  return (
    <section
      id="recomendaciones"
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-5 py-10 sm:px-8"
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mb-6"
      >
        <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-violet-200">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Recomendado para ti
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {fromCoPurchase
            ? 'Quienes compraron esto también compraron'
            : 'Más piezas de la misma categoría'}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-400">
          {seedName
            ? `A partir de ${seedName}.`
            : 'Cuando el catálogo cargue, te sugerimos piezas que combinan con lo que estás viendo.'}
        </p>
      </motion.div>

      {!seedSku ? (
        <p className="text-sm text-neutral-500">
          Las sugerencias aparecen cuando el catálogo tiene productos.
        </p>
      ) : isLoading ? (
        <p className="text-sm text-neutral-500">Buscando sugerencias…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Todavía no hay sugerencias para esta pieza.
        </p>
      ) : (
        <motion.div
          key={seedSku}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {items.map((product) => (
            <motion.div
              key={product.sku}
              variants={fadeUp}
              className="[perspective:900px]"
            >
              <div className="relative">
                <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-violet-300/30 bg-neutral-950/70 px-2.5 py-1 text-[11px] font-medium text-violet-100 backdrop-blur-md">
                  <Sparkles className="size-3" aria-hidden="true" />
                  Recomendado para ti
                </span>
                <ProductCard product={product} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  )
}
