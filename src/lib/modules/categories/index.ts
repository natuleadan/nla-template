import { categoriesData } from "@/lib/config/data/categories";
import { CategorySchema } from "./schemas";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

const categories: Category[] = CategorySchema.array().parse([...categoriesData]);

export async function getCategories(): Promise<Category[]> {
  return categories;
}
