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
import { useLang } from "@/hooks/use-lang";
import { getConfig } from "@/lib/locale/config";

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
  const lang = useLang();
  const cfg = getConfig(lang);
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
        fetch(`/api/v1/products?limit=10&locale=${lang}`),
        fetch(`/api/v1/blog?limit=10&locale=${lang}`),
        fetch(`/api/v1/agenda?locale=${lang}`),
        fetch(`/api/v1/paginas?limit=10&locale=${lang}`),
      ]);
      const productsData = await productsRes.json();
      const postsData = await postsRes.json();
      const agendaData = await agendaRes.json();
      const pagesData = await pagesRes.json();

      const { getUpcomingSlots } = await import("@/lib/agenda-utils");
      const upcomingSlots = getUpcomingSlots(agendaData.days || [], 5);
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
        ...(productsData.products || []).map(
          (p: {
            id: string;
            name: string;
            slug: string;
            category: string;
          }) => ({
            id: p.id,
            title: p.name,
            slug: p.slug,
            type: "product" as const,
            category: p.category,
          }),
        ),
        ...(postsData.posts || []).map(
          (p: {
            id: string;
            title: string;
            slug: string;
            category: string;
          }) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            type: "post" as const,
            category: p.category,
          }),
        ),
        ...(pagesData.pages || []).map(
          (p: {
            id: string;
            title: string;
            slug: string;
            category: string;
          }) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            type: "page" as const,
            category: p.category,
          }),
        ),
      ];
      setItems(searchItems);
      setLoaded(true);
    } catch {
      // Silently fail
    }
  }, [loaded, lang]);

  const handleSelect = (item: SearchItem) => {
    setOpen(false);
    if (item.type === "product") {
      router.push(`/${lang}/store/${item.slug}`);
    } else if (item.type === "slot") {
      router.push(
        `/${lang}/schedule?dia=${encodeURIComponent(item.slotDay!)}&hora=${encodeURIComponent(item.slotTime!)}`,
      );
    } else if (item.type === "page") {
      router.push(`/${lang}/pages/${item.slug}`);
    } else {
      router.push(`/${lang}/news/${item.slug}`);
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
        aria-label={cfg.ui.search.ariaLabel}
      >
        <IconSearch className="size-5" />
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (v) loadData();
        }}
        title={cfg.ui.search.title}
        description={cfg.ui.search.description}
      >
        <Command>
          <CommandInput name="global-search" placeholder={cfg.ui.search.placeholder} aria-label={cfg.ui.search.placeholder} />
          <CommandList>
            <CommandEmpty>{cfg.ui.search.empty}</CommandEmpty>
            {items.filter((i) => i.type === "slot").length > 0 && (
              <CommandGroup heading={cfg.ui.search.headings.slots}>
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
              <CommandGroup heading={cfg.ui.search.headings.products}>
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
              <CommandGroup heading={cfg.ui.search.headings.pages}>
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
              <CommandGroup heading={cfg.ui.search.headings.posts}>
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
