"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { IconSearch } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface SearchItem {
  id: string;
  title: string;
  slug: string;
  type: "product" | "post" | "slot" | "page";
  category?: string;
  slotDay?: string;
  slotTime?: string;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const loadData = useCallback(async () => {
    if (loaded) return;
    try {
      const [productsRes, postsRes, agendaRes, pagesRes] = await Promise.all([
        fetch("/api/v1/products?limit=100"),
        fetch("/api/v1/blog?limit=100"),
        fetch("/api/v1/agenda"),
        fetch("/api/v1/paginas?limit=100"),
      ]);
      const productsData = await productsRes.json();
      const postsData = await postsRes.json();
      const agendaData = await agendaRes.json();
      const pagesData = await pagesRes.json();

      const { getUpcomingSlots } = await import("@/lib/agenda-utils");
      const upcomingSlots = getUpcomingSlots(agendaData.days || [], 10);
      const slots: SearchItem[] = upcomingSlots.map((s, i) => ({
        id: `slot-${i}`,
        title: `${s.dayName} ${s.time}${s.type ? ` — ${s.type}` : ""}`,
        slug: "",
        type: "slot" as const,
        slotDay: s.dayName,
        slotTime: s.time,
      }));

      const searchItems: SearchItem[] = [
        ...slots,
        ...(productsData.products || []).map((p: { id: string; name: string; slug: string; category: string }) => ({
          id: p.id,
          title: p.name,
          slug: p.slug,
          type: "product" as const,
          category: p.category,
        })),
        ...(postsData.posts || []).map((p: { id: string; title: string; slug: string; category: string }) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          type: "post" as const,
          category: p.category,
        })),
        ...(pagesData.pages || []).map((p: { id: string; title: string; slug: string; category: string }) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          type: "page" as const,
          category: p.category,
        })),
      ];
      setItems(searchItems);
      setLoaded(true);
    } catch {
      // Silently fail
    }
  }, [loaded]);

  const handleSelect = (item: SearchItem) => {
    setOpen(false);
    if (item.type === "product") {
      router.push(`/tienda/${item.slug}`);
    } else if (item.type === "slot") {
      router.push(`/agenda?dia=${encodeURIComponent(item.slotDay!)}&hora=${encodeURIComponent(item.slotTime!)}`);
    } else if (item.type === "page") {
      router.push(`/paginas/${item.slug}`);
    } else {
      router.push(`/blog/${item.slug}`);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          loadData();
          setOpen(true);
        }}
        aria-label="Search"
      >
        <IconSearch className="size-5" />
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (v) loadData();
        }}
        title="Búsqueda global"
        description="Busca productos, artículos y páginas"
      >
        <Command>
          <CommandInput placeholder="Buscar productos, artículos o páginas..." />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            {items.filter((i) => i.type === "slot").length > 0 && (
              <CommandGroup heading="Próximas citas">
                {items
                  .filter((i) => i.type === "slot")
                  .map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.title}
                      onSelect={() => handleSelect(item)}
                    >
                      <span>{item.title}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}
            {items.filter((i) => i.type === "product").length > 0 && (
              <CommandGroup heading="Productos">
                {items
                  .filter((i) => i.type === "product")
                  .map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.title}
                      onSelect={() => handleSelect(item)}
                    >
                      <span>{item.title}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}
            {items.filter((i) => i.type === "page").length > 0 && (
              <CommandGroup heading="Páginas">
                {items
                  .filter((i) => i.type === "page")
                  .map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.title}
                      onSelect={() => handleSelect(item)}
                    >
                      <span>{item.title}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}
            {items.filter((i) => i.type === "post").length > 0 && (
              <CommandGroup heading="Blog">
                {items
                  .filter((i) => i.type === "post")
                  .map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.title}
                      onSelect={() => handleSelect(item)}
                    >
                      <span>{item.title}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
