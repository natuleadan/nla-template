import {
  productCategories as productCatEs,
  blogCategories as blogCatEs,
  pageCategories as pageCatEs,
} from "@/lib/config/data/categories.es";
import {
  productCategories as productCatEn,
  blogCategories as blogCatEn,
  pageCategories as pageCatEn,
} from "@/lib/config/data/categories.en";
import {
  productCategories as productCatAr,
  blogCategories as blogCatAr,
  pageCategories as pageCatAr,
} from "@/lib/config/data/categories.ar";
import { CategorySchema } from "./schemas";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

const productCats = {
  es: CategorySchema.array().parse([...productCatEs]),
  en: CategorySchema.array().parse([...productCatEn]),
  ar: CategorySchema.array().parse([...productCatAr]),
};

const blogCats = {
  es: CategorySchema.array().parse([...blogCatEs]),
  en: CategorySchema.array().parse([...blogCatEn]),
  ar: CategorySchema.array().parse([...blogCatAr]),
};

const pageCats = {
  es: CategorySchema.array().parse([...pageCatEs]),
  en: CategorySchema.array().parse([...pageCatEn]),
  ar: CategorySchema.array().parse([...pageCatAr]),
};

export async function getProductCategories(locale = "es"): Promise<Category[]> {
  return productCats[locale as keyof typeof productCats] || productCats.es;
}

export async function getBlogCategories(locale = "es"): Promise<Category[]> {
  return blogCats[locale as keyof typeof blogCats] || blogCats.es;
}

export async function getPageCategories(locale = "es"): Promise<Category[]> {
  return pageCats[locale as keyof typeof pageCats] || pageCats.es;
}
