import type { CategorySummaryDto } from '@retail/contracts'
import { useCallback, useEffect, useState } from 'react'
import { getCategories } from '../../api/catalog'

async function fetchCategories(
  setCategories: (categories: CategorySummaryDto[]) => void,
  setIsLoading: (isLoading: boolean) => void,
  signal?: AbortSignal,
) {
  try {
    const nextCategories = await getCategories(signal)

    if (!signal?.aborted) {
      setCategories(nextCategories)
      setIsLoading(false)
    }
  } catch {
    if (!signal?.aborted) {
      setIsLoading(false)
    }
  }
}

export function useCategories() {
  const [categories, setCategories] = useState<CategorySummaryDto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(
    (signal?: AbortSignal) =>
      fetchCategories(setCategories, setIsLoading, signal),
    [],
  )

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)

    return () => controller.abort()
  }, [load])

  return { categories, isLoading }
}
