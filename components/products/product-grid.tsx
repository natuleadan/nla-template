import { ProductCard } from "./product-card";

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: "suplemento" | "comida";
  image?: string;
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}