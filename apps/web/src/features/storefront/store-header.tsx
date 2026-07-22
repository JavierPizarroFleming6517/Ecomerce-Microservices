interface StoreHeaderProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      className="size-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 4h2l.4 2M7 13h10l3-7H6.4M7 13l-1.6-7M7 13l-1.2 4.8A1 1 0 0 0 6.8 19H18M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      />
    </svg>
  )
}

export function StoreHeader({ searchTerm, onSearchChange }: StoreHeaderProps) {
  return (
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
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Busca productos…"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-white/30 focus:outline-none"
          />
        </label>

        <div className="flex items-center justify-end gap-5 text-sm text-neutral-300">
          <button type="button" className="transition hover:text-white">
            Iniciar sesión
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 transition hover:text-white"
          >
            <CartIcon />
            Carrito
          </button>
        </div>
      </div>
    </header>
  )
}
