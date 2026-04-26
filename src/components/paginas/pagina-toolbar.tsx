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
import { PaginaCard } from "./pagina-card";
import { Spinner } from "@/components/ui/spinner";
import { paginas } from "@/lib/config/site";

interface PaginaPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
}

interface Category {
  slug: string;
  name: string;
}

interface PaginaToolbarProps {
  initialPages: PaginaPost[];
  total: number;
  initialHasMore: boolean;
  categories: Category[];
}

export function PaginaToolbar({
  initialPages,
  total,
  initialHasMore,
  categories,
}: PaginaToolbarProps) {
  const [allLoaded, setAllLoaded] = useState<PaginaPost[]>(initialPages);
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
      const res = await fetch(`/api/v1/paginas?page=${page + 1}&limit=6`);
      const data = await res.json();
      setAllLoaded((prev) => [...prev, ...data.pages]);
      setHasMore(data.hasMore);
      setPage((p) => p + 1);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const filteredPosts = allLoaded.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder={paginas.toolbar.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
          aria-label={paginas.toolbar.searchPlaceholder}
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="sm:max-w-xs ml-auto">
            <SelectValue placeholder={paginas.toolbar.filterLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{paginas.toolbar.allCategories}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {filteredPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((p) => (
              <PaginaCard key={p.id} page={p} />
            ))}
          </div>
          {loading && (
            <div className="flex justify-center py-4" role="status" aria-live="polite">
              <Spinner />
            </div>
          )}
          {hasMore && !loading && <div ref={observerRef} className="h-10" aria-hidden="true" />}
          {!hasMore && allLoaded.length > 0 && (
            <p className="text-center text-sm text-muted-foreground py-4" role="status" aria-live="polite">
              {paginas.toolbar.showing(total)}
            </p>
          )}
        </>
      ) : (
        <p className="text-center text-muted-foreground py-12" role="status" aria-live="polite">
          {paginas.page.empty}
        </p>
      )}
    </div>
  );
}
