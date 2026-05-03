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
import { PostCard } from "./post-card";
import { Spinner } from "@/components/ui/spinner";
import { useLang } from "@/lib/locale/context";
import { getConfig } from "@/lib/locale/config";
import { isDev } from "@/lib/env";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  category: string;
  tags?: string[];
  publishedAt: string;
  readingTime: number;
}

interface Category {
  slug: string;
  name: string;
}

interface BlogToolbarProps {
  initialPosts: BlogPost[];
  total: number;
  initialHasMore: boolean;
  categories: Category[];
}

export function BlogToolbar({
  initialPosts,
  total,
  initialHasMore,
  categories,
}: BlogToolbarProps) {
  const lang = useLang();
  const cfg = getConfig(lang);
  const [allLoaded, setAllLoaded] = useState<BlogPost[]>(initialPosts);
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
      const res = await fetch(`/api/v1/blog?page=${page + 1}&limit=6&locale=${lang}`);
      const data = await res.json();
      setAllLoaded((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (e) {
      if (isDev) console.error("Error loading more posts", e);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, lang]);

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

  const filteredPosts = allLoaded.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder={cfg.blog.toolbar.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
          aria-label={cfg.blog.toolbar.searchPlaceholder}
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="sm:max-w-xs ml-auto">
            <SelectValue placeholder={cfg.blog.toolbar.filterLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{cfg.blog.toolbar.allCategories}</SelectItem>
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
            {filteredPosts.map((post) => (
              <PostCard key={post.id} {...post} />
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
              {cfg.blog.toolbar.showing(total)}
            </p>
          )}
        </>
      ) : (
        <p className="text-center text-muted-foreground py-12" role="status" aria-live="polite">
          {cfg.blog.page.empty}
        </p>
      )}
    </div>
  );
}
