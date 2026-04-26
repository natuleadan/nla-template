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
  type: "product" | "post" | "slot";
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
      const [productsRes, postsRes, agendaRes] = await Promise.all([
        fetch("/api/v1/products?limit=100"),
        fetch("/api/v1/blog?limit=100"),
        fetch("/api/v1/agenda"),
      ]);
      const productsData = await productsRes.json();
      const postsData = await postsRes.json();
      const agendaData = await agendaRes.json();

      const today = new Date().getDay();
      const todayDay = agendaData.days?.find((d: { dayOfWeek: number }) => d.dayOfWeek === today);
      const todaySlots: SearchItem[] = (todayDay?.slots || [])
        .filter((s: { available: boolean }) => s.available)
        .map((s: { time: string; type?: string }, i: number) => ({
          id: `slot-${i}`,
          title: `${todayDay.name} ${s.time}${s.type ? ` — ${s.type}` : ""}`,
          slug: "",
          type: "slot" as const,
          slotDay: todayDay.name,
          slotTime: s.time,
        }));

      const searchItems: SearchItem[] = [
        ...todaySlots,
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
        description="Busca productos y artículos"
      >
        <Command>
          <CommandInput placeholder="Buscar productos o artículos..." />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            {items.filter((i) => i.type === "slot").length > 0 && (
              <CommandGroup heading="Citas hoy">
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
