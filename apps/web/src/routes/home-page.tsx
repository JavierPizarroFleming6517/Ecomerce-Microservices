import { useState } from 'react'
import { CategoryNav } from '../features/catalog/category-nav'
import { ProductGrid } from '../features/catalog/product-grid'
import { useCategories } from '../features/catalog/use-categories'
import { AnnouncementBar } from '../features/storefront/announcement-bar'
import { StoreHeader } from '../features/storefront/store-header'

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { categories, isLoading: categoriesLoading } = useCategories()

  const selectedCategoryName = selectedCategory
    ? categories.find((category) => category.slug === selectedCategory)?.name
    : null

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <AnnouncementBar />
      <StoreHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <CategoryNav
        categories={categories}
        isLoading={categoriesLoading}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <section id="catalogo">
          <h2 className="mb-6 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {selectedCategoryName ?? 'Productos destacados'}
          </h2>
          <ProductGrid categorySlug={selectedCategory} searchTerm={searchTerm} />
        </section>
      </main>
    </div>
  )
}
