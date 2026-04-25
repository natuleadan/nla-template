import { Suspense } from "react";
import { cacheLife } from "next/cache";
import type { Metadata } from "next";
import { TiendaToolbar } from "@/components/products/tienda-toolbar";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { getAllProducts, getProducts } from "@/lib/modules/products";
import { getCategories } from "@/lib/modules/categories";

async function getInitialData() {
  'use cache'
  cacheLife('hours')
  const [allProductsResult, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);
  const initial = await getProducts(1, 3);
  return { products: allProductsResult, categories, initialProducts: initial.products, total: initial.total, hasMore: initial.hasMore };
}

export async function generateMetadata(): Promise<Metadata> {
  const { products } = await getInitialData();
  return {
    title: `Tienda (${products.length} productos) - Acme Inc`,
    description: products.length > 0 
      ? `Explora nuestra selección de ${products.length} suplementos y alimentos para el gym.`
      : "Explora nuestra selección de suplementos y alimentos para el gym.",
  };
}

export default async function TiendaPage() {
  const { categories, initialProducts, total, hasMore } = await getInitialData();

  return (
    <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
      <PageHeader 
        title="Nuestra Tienda" 
        description="Encuentra los mejores productos para tu entrenamiento"
      />
      <Suspense fallback={<Skeleton className="h-64" />}>
        {total > 0 ? (
          <TiendaToolbar initialProducts={initialProducts} total={total} initialHasMore={hasMore} categories={categories} />
        ) : (
          <Empty className="py-12">
            <p className="text-muted-foreground">No hay productos disponibles</p>
          </Empty>
        )}
      </Suspense>
    </div>
  );
}