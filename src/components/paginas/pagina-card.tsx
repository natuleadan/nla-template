"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { PaginaPost } from "@/lib/modules/paginas";

interface PaginaCardProps {
  page: PaginaPost;
}

export function PaginaCard({ page }: PaginaCardProps) {
  return (
    <Link
      href={`/paginas/${page.slug}`}
      className="block p-4 rounded-lg border hover:border-primary transition-colors"
    >
      <div className="space-y-2">
        <Badge variant="secondary" className="text-xs">
          {page.category === "legal" ? "Legal" : "Políticas"}
        </Badge>
        <h3 className="font-semibold leading-tight">{page.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {page.excerpt}
        </p>
        <p className="text-xs text-muted-foreground">
          {page.updatedAt || page.publishedAt}
        </p>
      </div>
    </Link>
  );
}
