import type { ApiExamples } from "./types";
import { getProducts } from "@/lib/modules/products";
import { getProductCategories } from "@/lib/modules/categories";
import { getApprovedReviews } from "@/lib/modules/reviews";
import { getAllPosts } from "@/lib/modules/blog";
import { getWeekDays } from "@/lib/modules/agenda";
import { getAllPaginas } from "@/lib/modules/paginas";

export async function getApiExamples(): Promise<ApiExamples> {
  const [result, categories] = await Promise.all([
    getProducts(1, 25),
    getProductCategories(),
  ]);

  const exampleProducts = result.products.slice(0, 2);
  const exampleSlug = exampleProducts[0]?.slug || "example-product";

  const [reviews, posts, days, pages] = await Promise.all([
    getApprovedReviews(exampleSlug),
    getAllPosts(),
    getWeekDays(),
    getAllPaginas(),
  ]);

  return {
    products: exampleProducts,
    categories,
    reviews,
    posts,
    days,
    pages,
  };
}
