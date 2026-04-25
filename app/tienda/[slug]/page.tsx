import { Suspense } from "react";
import { ProductDetailsSkeleton } from "./product-details-skeleton";
import { ProductoContent } from "./producto-content";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export default async function ProductoPage({ params }: RouteParams) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductoContent params={params} />
    </Suspense>
  );
}
