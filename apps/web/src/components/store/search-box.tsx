import type { ProductSummaryDto } from '@retail/contracts'
import { Search, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProductsPage } from '../../api/catalog'

const PREVIEW_LIMIT = 5

export function SearchBox() {
  const listId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [catalog, setCatalog] = useState<ProductSummaryDto[] | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const term = query.trim().toLowerCase()
  const matches = catalog ? catalog.filter((product) => productMatches(product, term)) : []
  const visibleMatches = showAll ? matches : matches.slice(0, PREVIEW_LIMIT)

  useEffect(() => {
    if (!isOpen || catalog) {
      return
    }

    const controller = new AbortController()
    setIsLoading(true)

    void getProductsPage(50, 1, null, controller.signal)
      .then((response) => {
        if (!controller.signal.aborted) {
          setCatalog(response.items)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setCatalog([])
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [catalog, isOpen])

  useEffect(() => {
    function closeOnPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnPointerDown)
    return () => document.removeEventListener('pointerdown', closeOnPointerDown)
  }, [])

  function openProduct(product: ProductSummaryDto) {
    setIsOpen(false)
    setQuery('')
    navigate(`/producto/${encodeURIComponent(product.sku)}`)
  }

  return (
    <div ref={containerRef} className="relative w-full sm:max-w-xl sm:flex-1">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault()
          const first = matches[0]
          if (first) {
            openProduct(first)
          }
        }}
      >
        <label className="flex items-center rounded-lg border border-white/10 bg-white/5 text-white focus-within:border-white/30">
          <span className="sr-only">Buscar productos</span>
          <input
            type="search"
            value={query}
            role="combobox"
            aria-expanded={isOpen && term.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            onChange={(event) => {
              setQuery(event.target.value)
              setShowAll(false)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setIsOpen(false)
              }
            }}
            placeholder="Busca productos…"
            className="w-full bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-neutral-500 [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query ? (
            <button
              type="button"
              aria-label="Borrar búsqueda"
              onClick={() => {
                setQuery('')
                setShowAll(false)
                setIsOpen(false)
              }}
              className="grid size-8 place-items-center text-neutral-400 hover:text-white"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
          <span className="grid size-9 place-items-center text-neutral-400" aria-hidden="true">
            <Search className="size-4" />
          </span>
        </label>
      </form>

      {isOpen && term.length > 0 ? (
        <div
          id={listId}
          onMouseDown={(event) => event.preventDefault()}
          className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-40 overflow-hidden rounded-lg border border-white/10 bg-neutral-900 text-neutral-100 shadow-2xl"
        >
          {isLoading || !catalog ? (
            <p className="px-4 py-4 text-sm text-neutral-400">Buscando…</p>
          ) : visibleMatches.length === 0 ? (
            <p className="px-4 py-4 text-sm text-neutral-400">
              No hay productos que coincidan.
            </p>
          ) : (
            <div className="py-2">
              <ul>
                {visibleMatches.map((product) => (
                  <li key={product.sku}>
                    <Link
                      to={`/producto/${encodeURIComponent(product.sku)}`}
                      onClick={() => {
                        setIsOpen(false)
                        setQuery('')
                      }}
                      className="block truncate px-4 py-2 text-sm font-medium text-neutral-100 hover:bg-white/10"
                    >
                      {product.name}
                    </Link>
                  </li>
                ))}
              </ul>
              {matches.length > PREVIEW_LIMIT && !showAll ? (
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="mt-1 block w-full px-4 py-2 text-right text-sm text-sky-300 hover:bg-white/10"
                >
                  Ver todos los resultados
                </button>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

function productMatches(product: ProductSummaryDto, term: string) {
  if (!term) {
    return false
  }

  const haystack = [product.name, product.brand, product.sku, product.category, product.description]
    .filter((value): value is string => Boolean(value))
    .join(' ')
    .toLowerCase()

  return term.split(/\s+/).every((token) => haystack.includes(token))
}
