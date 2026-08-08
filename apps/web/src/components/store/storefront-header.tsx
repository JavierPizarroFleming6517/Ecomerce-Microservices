import { Link } from 'react-router-dom'
import { useCart } from '../../states/cart/use-cart'

interface StorefrontHeaderProps {
  searchTerm?: string
  onSearchChange?: (value: string) => void
  showSearch?: boolean
}

export function StorefrontHeader({
  searchTerm = '',
  onSearchChange,
  showSearch = false,
}: StorefrontHeaderProps) {
  const { itemCount } = useCart()

  return (
    <>
      <div className="bg-white/5 px-5 py-2 text-center text-xs font-medium text-neutral-300">
        Envío gratis en compras sobre $50.000 · Retiro gratis en tienda
      </div>

      <header className="bg-neutral-950">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-white text-sm font-bold text-neutral-950">
              R
            </span>
            Retail
          </Link>

          {showSearch ? (
            <label className="relative w-full sm:max-w-md sm:flex-1">
              <span className="sr-only">Buscar productos</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => onSearchChange?.(event.target.value)}
                placeholder="Busca productos…"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-white/30 focus:outline-none"
              />
            </label>
          ) : (
            <div className="hidden flex-1 sm:block" />
          )}

          <div className="flex items-center justify-end gap-5 text-sm text-neutral-300">
            <button type="button" className="transition hover:text-white">
              Iniciar sesión
            </button>
            <Link
              to="/carrito"
              className="relative transition hover:text-white"
            >
              Carrito
              {itemCount > 0 ? (
                <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-xs font-semibold text-neutral-950">
                  {itemCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
