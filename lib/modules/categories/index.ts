import { cacheLife, cacheTag } from "next/cache"

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
}

const categories: Category[] = [
  { id: "1", name: "Suplementos", slug: "suplemento", icon: "dumbbell" },
  { id: "2", name: "Alimentos", slug: "comida", icon: "apple" },
]

export async function getCategories(): Promise<Category[]> {
  'use cache'
  cacheLife('days')
  cacheTag('categories')
  return categories
}

export function addCategory(category: Omit<Category, "id">): Category {
  const newCategory: Category = {
    id: Date.now().toString(),
    ...category,
  }
  categories.push(newCategory)
  return newCategory
}

export function updateCategories(data: Partial<Category>[]): Category[] {
  return categories
}

export function deleteCategories(): void {
  categories.length = 0
}
