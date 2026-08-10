import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type {
  HybridRelatedProductsDto,
  ProductDetailDto,
  ProductSummaryDto,
} from '@retail/contracts'
import { ProductCard } from '../../components/catalog/ProductCard'
import { StorefrontFooter } from '../../components/store/storefront-footer'
import { StorefrontHeader } from '../../components/store/storefront-header'
import { useProduct } from '../../hooks/catalog/use-product'
import { useSimilarProducts } from '../../hooks/catalog/use-similar-products'
import { useCart } from '../../states/cart/use-cart'
import { formatPrice } from '../../utils/format-price'

type DetailTab = 'descripcion' | 'especificaciones'

function stockLabel(stockOnline: number): { text: string; available: boolean } {
  if (stockOnline <= 0) {
    return { text: 'No disponible', available: false }
  }
  if (stockOnline > 20) {
    return { text: 'Más de 20 unidades', available: true }
  }
  return { text: `${stockOnline} unidades`, available: true }
}

function RelatedProductsGrid({ products }: { products: ProductSummaryDto[] }) {
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.slice(0, 4).map((item) => (
        <ProductCard key={item.sku} product={item} />
      ))}
    </div>
  )
}

function ProductDetailContent({
  product,
  related,
  relatedLoading,
}: {
  product: ProductDetailDto
  related: HybridRelatedProductsDto
  relatedLoading: boolean
}) {
  const { addItem } = useCart()
  const [activeImage, setActiveImage] = useState(0)
  const [tab, setTab] = useState<DetailTab>('descripcion')

  const images = product.images.length
    ? product.images
    : product.imageUrl
      ? [product.imageUrl]
      : []
  const selectedImage =
    images[Math.min(activeImage, Math.max(images.length - 1, 0))]
  const stock = stockLabel(product.stockOnline)

  return (
    <>
      <section className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="flex gap-3">
          {images.length > 1 ? (
            <div className="flex w-16 shrink-0 flex-col gap-2">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={
                    index === activeImage
                      ? 'overflow-hidden rounded-lg border-2 border-sky-400'
                      : 'overflow-hidden rounded-lg border border-white/15 opacity-70 transition hover:opacity-100'
                  }
                >
                  <img
                    src={image}
                    alt=""
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}

          <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <img
              src={selectedImage}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">
            {product.brand}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            SKU: {product.sku}
            {product.category ? ` · ${product.category}` : ''}
          </p>

          <p className="mt-6 text-3xl font-semibold text-white">
            {formatPrice(product.price, product.currency)}
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            Pago con Webpay / tarjetas
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => addItem(product)}
              className="rounded-lg border border-white/25 bg-transparent px-5 py-3 text-sm font-semibold text-white transition duration-100 hover:bg-white/10 active:scale-[0.96]"
            >
              Agregar al carro
            </button>
            <Link
              to="/carrito"
              onClick={() => addItem(product)}
              className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition duration-100 hover:bg-neutral-200 active:scale-[0.96] active:bg-neutral-300"
            >
              Comprar ahora
            </Link>
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <p>
              <span className="text-neutral-400">Stock online: </span>
              <span
                className={
                  stock.available ? 'text-emerald-300' : 'text-neutral-500'
                }
              >
                {stock.text}
              </span>
            </p>
            <p>
              <span className="text-neutral-400">Stock en tienda: </span>
              <span className="text-neutral-500">Consultar en local</span>
            </p>
          </div>

          <ul className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm text-neutral-300">
            <li>Despacho a domicilio disponible según cobertura.</li>
            <li>Retiro gratis en tienda / punto de retiro.</li>
            <li>Pago seguro con Webpay (Transbank).</li>
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex gap-6 border-b border-white/10">
          <button
            type="button"
            onClick={() => setTab('descripcion')}
            className={
              tab === 'descripcion'
                ? 'border-b-2 border-sky-400 pb-3 text-sm font-semibold text-sky-300'
                : 'pb-3 text-sm font-medium text-neutral-400 transition hover:text-white'
            }
          >
            Descripción
          </button>
          <button
            type="button"
            onClick={() => setTab('especificaciones')}
            className={
              tab === 'especificaciones'
                ? 'border-b-2 border-sky-400 pb-3 text-sm font-semibold text-sky-300'
                : 'pb-3 text-sm font-medium text-neutral-400 transition hover:text-white'
            }
          >
            Especificaciones
          </button>
        </div>

        {tab === 'descripcion' ? (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">{product.name}</h2>
              <dl className="mt-3 grid gap-2 text-sm text-neutral-400 sm:grid-cols-2">
                <div>
                  <span className="text-neutral-500">SKU: </span>
                  {product.sku}
                </div>
                <div>
                  <span className="text-neutral-500">Marca: </span>
                  {product.brand}
                </div>
                <div>
                  <span className="text-neutral-500">Categoría: </span>
                  {product.category || 'General'}
                </div>
              </dl>
            </div>

            <p className="max-w-3xl text-sm leading-relaxed text-neutral-300">
              {product.longDescription}
            </p>

            {product.highlights.length > 0 ? (
              <div>
                <h3 className="text-base font-semibold text-white">
                  Aspectos destacados
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-300">
                  {product.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-6">
            <h3 className="text-base font-semibold text-white">
              Especificaciones técnicas
            </h3>
            {product.specs.length === 0 ? (
              <p className="mt-3 text-sm text-neutral-500">
                Sin especificaciones registradas.
              </p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {product.specs.map((spec) => (
                      <tr
                        key={`${spec.label}-${spec.value}`}
                        className="border-b border-white/10 last:border-b-0"
                      >
                        <th className="w-1/3 bg-white/[0.03] px-4 py-3 font-semibold text-neutral-200">
                          {spec.label}
                        </th>
                        <td className="px-4 py-3 text-neutral-300">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Sección híbrida: co-compra (Neo4j) + misma categoría (catálogo) */}
      <section className="mt-14 space-y-14">
        {relatedLoading ? (
          <p className="text-center text-sm text-neutral-500">
            Cargando productos relacionados…
          </p>
        ) : (
          <>
            {/* Enfoque CO-COMPRA */}
            <div>
              <h2 className="text-center text-2xl font-semibold text-white">
                Quienes compraron esto también compraron
              </h2>
              <div className="mx-auto mt-2 h-0.5 w-12 rounded-full bg-sky-400" />
              <p className="mt-3 text-center text-sm text-neutral-500">
                Recomendaciones por historial de compras compartidas (co-compra)
              </p>

              {related.coPurchase.length === 0 ? (
                <p className="mt-8 text-center text-sm text-neutral-500">
                  Aún no hay suficientes compras para recomendar por co-compra.
                </p>
              ) : (
                <RelatedProductsGrid products={related.coPurchase} />
              )}
            </div>

            {/* Enfoque POR CATEGORÍA */}
            <div>
              <h2 className="text-center text-2xl font-semibold text-white">
                Te puede interesar
              </h2>
              <div className="mx-auto mt-2 h-0.5 w-12 rounded-full bg-sky-400" />
              <p className="mt-3 text-center text-sm text-neutral-500">
                Más productos de la misma categoría
              </p>

              {related.byCategory.length === 0 ? (
                <p className="mt-8 text-center text-sm text-neutral-500">
                  No hay otros productos en esta categoría por ahora.
                </p>
              ) : (
                <RelatedProductsGrid products={related.byCategory} />
              )}
            </div>
          </>
        )}
      </section>
    </>
  )
}

export function ProductDetailPage() {
  const { sku } = useParams<{ sku: string }>()
  const { product, isLoading, error } = useProduct(sku)
  const { related, isLoading: relatedLoading } = useSimilarProducts(sku)

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <StorefrontHeader />

      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <p className="text-sm text-neutral-500">
          <Link to="/" className="transition hover:text-white">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-300">Producto</span>
        </p>

        {isLoading ? (
          <p className="mt-8 text-sm text-neutral-500">Cargando producto…</p>
        ) : error || !product ? (
          <p className="mt-8 text-sm text-rose-400">
            {error ?? 'Producto no encontrado'}
          </p>
        ) : (
          <ProductDetailContent
            key={product.sku}
            product={product}
            related={related}
            relatedLoading={relatedLoading}
          />
        )}
      </main>

      <StorefrontFooter />
    </div>
  )
}
