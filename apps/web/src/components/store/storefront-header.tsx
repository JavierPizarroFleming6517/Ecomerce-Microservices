import { Link } from 'react-router-dom'
import { useAuth } from '../../states/auth/use-auth'
import { useCart } from '../../states/cart/use-cart'

interface StorefrontHeaderProps {
  searchTerm?: string
  onSearchChange?: (value: string) => void
  showSearch?: boolean
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-7 shrink-0"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.25" />
      <path
        strokeLinecap="round"
        d="M5.5 19.25c1.4-3.1 3.7-4.65 6.5-4.65s5.1 1.55 6.5 4.65"
      />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-7"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.5 5h1.7l1.4 10.2a1.5 1.5 0 0 0 1.5 1.3h8.6a1.5 1.5 0 0 0 1.5-1.25L19.5 8H7"
      />
      <circle cx="9.5" cy="20" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="20" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function StorefrontHeader({
  searchTerm = '',
  onSearchChange,
  showSearch = false,
}: StorefrontHeaderProps) {
  const { itemCount } = useCart()
  const { user, isAuthenticated } = useAuth()

  const accountSubtitle = isAuthenticated
    ? user?.firstName?.trim() ||
      user?.email?.split('@')[0] ||
      'Mi cuenta'
    : 'Inicia sesión'

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

          <div className="flex items-center justify-end gap-4 text-white">
            <Link
              to={isAuthenticated ? '/cuenta' : '/iniciar-sesion'}
              className="flex items-center gap-2.5 transition hover:opacity-85"
            >
              <UserIcon />
              <span className="leading-tight">
                <span className="block text-sm font-normal">Hola!</span>
                <span className="block text-sm font-bold">{accountSubtitle}</span>
              </span>
            </Link>

            <span className="h-8 w-px bg-white/70" aria-hidden="true" />

            <Link
              to="/carrito"
              className="relative transition hover:opacity-85"
              aria-label={
                itemCount > 0
                  ? `Carrito con ${itemCount} productos`
                  : 'Carrito'
              }
            >
              <CartIcon />
              {itemCount > 0 ? (
                <span className="absolute -right-2 -top-1.5 inline-flex min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold leading-4 text-neutral-950">
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
