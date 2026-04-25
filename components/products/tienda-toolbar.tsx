"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductGrid } from "./product-grid";
import { Spinner } from "@/components/ui/spinner";
import { store } from "@/lib/config/site";

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

interface Category {
  slug: string;
  name: string;
}

interface TiendaToolbarProps {
  initialProducts: Product[];
  total: number;
  initialHasMore: boolean;
  categories: Category[];
}

export function TiendaToolbar({
  initialProducts,
  total,
  initialHasMore,
  categories,
}: TiendaToolbarProps) {
  const [allLoaded, setAllLoaded] = useState<Product[]>(initialProducts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/products?page=${page + 1}&limit=3`);
      const data = await res.json();
      setAllLoaded((prev) => [...prev, ...data.products]);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (e) {
      console.error("Error loading more products", e);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 },
    );
    const el = observerRef.current;
    if (el && hasMore) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [loadMore, hasMore]);

  const filteredProducts = allLoaded.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder={store.toolbar.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="sm:max-w-xs ml-auto">
            <SelectValue placeholder={store.toolbar.filterLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{store.toolbar.allCategories}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ProductGrid products={filteredProducts} />
      {loading && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
      {hasMore && !loading && <div ref={observerRef} className="h-10" />}
      {!hasMore && allLoaded.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          {store.toolbar.showing(total)}
        </p>
      )}
    </div>
  );
}
