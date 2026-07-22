import type { CategorySummaryDto } from '@retail/contracts'

interface CategoryNavProps {
  categories: CategorySummaryDto[]
  isLoading: boolean
  selected: string | null
  onSelect: (slug: string | null) => void
}

const baseItemClass =
  'flex-none whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition'
const activeItemClass = `${baseItemClass} border-white text-white`
const inactiveItemClass = `${baseItemClass} border-transparent text-neutral-400 hover:text-white`

export function CategoryNav({
  categories,
  isLoading,
  selected,
  onSelect,
}: CategoryNavProps) {
  return (
    <nav
      aria-label="Categorías del catálogo"
      className="border-b border-white/10 bg-white/[0.02]"
    >
      <div className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-5 sm:px-8">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={selected === null ? activeItemClass : inactiveItemClass}
        >
          Todos
        </button>

        {isLoading ? (
          Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="my-2.5 h-6 w-24 flex-none animate-pulse rounded-md bg-white/5"
            />
          ))
        ) : (
          categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => onSelect(category.slug)}
              className={
                selected === category.slug ? activeItemClass : inactiveItemClass
              }
            >
              {category.name}
            </button>
          ))
        )}
      </div>
    </nav>
  )
}
