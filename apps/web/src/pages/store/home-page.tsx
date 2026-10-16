import { MotionConfig } from 'framer-motion'
import { useState } from 'react'
import { HeroSection } from '../../components/landing/HeroSection'
import { ProductCatalog } from '../../components/landing/ProductCatalog'
import { RecommendationGrid } from '../../components/landing/RecommendationGrid'
import { StorefrontFooter } from '../../components/store/storefront-footer'
import { StorefrontHeader } from '../../components/store/storefront-header'
import { useCategories } from '../../hooks/catalog/use-categories'
import { useFeaturedProducts } from '../../hooks/catalog/use-featured-products'

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const { categories, isLoading: categoriesLoading } = useCategories()
  const { products: promoProducts, isLoading: promoLoading } =
    useFeaturedProducts(null, 1)
  const {
    products,
    totalPages,
    total,
    isLoading: productsLoading,
    error: productsError,
  } = useFeaturedProducts(selectedCategory, page)
  const selectedCategoryName = selectedCategory
    ? (categories.find((category) => category.slug === selectedCategory)?.name ??
      null)
    : null

  const seed = products[0]

  function selectCategory(slug: string | null) {
    setSelectedCategory(slug)
    setPage(1)
    document
      .getElementById('catalogo')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <StorefrontHeader showSearch />

        <main>
          <HeroSection
            products={promoProducts}
            isLoading={promoLoading}
            categories={categories}
            categoriesLoading={categoriesLoading}
            selectedCategory={selectedCategory}
            onSelectCategory={selectCategory}
          />
          <ProductCatalog
            categories={categories}
            categoriesLoading={categoriesLoading}
            selectedCategory={selectedCategory}
            selectedCategoryName={selectedCategoryName}
            onSelectCategory={selectCategory}
            products={products}
            visibleProducts={products}
            searchTerm=""
            isLoading={productsLoading}
            error={productsError}
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={(nextPage) => {
              setPage(nextPage)
              document
                .getElementById('catalogo')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          />
          <RecommendationGrid seedSku={seed?.sku} seedName={seed?.name} />
        </main>

        <StorefrontFooter />
      </div>
    </MotionConfig>
  )
}
