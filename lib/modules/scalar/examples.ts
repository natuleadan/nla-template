import type { ApiExamples } from "./types";
import { getProducts } from "@/lib/modules/products";
import { getCategories } from "@/lib/modules/categories";
import { getReviews } from "@/lib/modules/reviews";
import { getInventory } from "@/lib/modules/inventory";
import { getFormMessages } from "@/lib/modules/form";
import { getOrders } from "@/lib/modules/orders";
import { getPageContent } from "@/lib/modules/pages";
import { getAllPosts } from "@/lib/modules/blog";
import { getWeekDays } from "@/lib/modules/agenda";
import { getAllPaginas } from "@/lib/modules/paginas";

export async function getApiExamples(): Promise<ApiExamples> {
  const [result, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const exampleProducts = result.products.slice(0, 2);
  const exampleSlug = exampleProducts[0]?.slug || "example-product";

  const [reviews, inventory, messages, orders, page, posts, days, pages] =
    await Promise.all([
      getReviews(exampleSlug),
      getInventory(exampleSlug),
      getFormMessages(),
      getOrders(),
      getPageContent("inicio"),
      getAllPosts(),
      getWeekDays(),
      getAllPaginas(),
    ]);

  return {
    products: exampleProducts,
    categories,
    reviews,
    inventory,
    messages,
    orders,
    page,
    posts,
    days,
    pages,
  };
}
