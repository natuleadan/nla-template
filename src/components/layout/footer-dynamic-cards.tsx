"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllProducts, type Product } from "@/lib/modules/products";
import { getAllPosts, type BlogPost } from "@/lib/modules/blog";
import { getWeekDays } from "@/lib/modules/agenda";
import { getAllPaginas, type PaginaPost } from "@/lib/modules/paginas";
import { getNextAvailableDaySlots, type AgendaSlotInfo } from "@/lib/agenda-utils";
import { useLang } from "@/lib/locale/context";
import { getConfig } from "@/lib/locale/config";

function shuffleArray<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FooterDynamicCards() {
  const lang = useLang();
  const cfg = getConfig(lang);
  const { nav, ui, agenda } = cfg;
  const l = (href: string) => (href === "/" ? `/${lang}` : `/${lang}${href}`);

  const [randomProducts, setRandomProducts] = useState<Product[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [agendaState, setAgendaState] = useState<{ slots: AgendaSlotInfo[]; title: string }>({ slots: [], title: agenda.page.title });
  const [paginas, setPaginas] = useState<PaginaPost[]>([]);

  useEffect(() => {
    getAllProducts(lang).then((products) => {
      setRandomProducts(shuffleArray(products).slice(0, 3));
    });
    getAllPosts(lang).then((posts) => {
      setRecentPosts(posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 3));
    });
    getWeekDays(lang).then((days) => {
      setAgendaState(getNextAvailableDaySlots(days, 3, undefined, lang));
    });
    getAllPaginas(lang).then((p) => setPaginas(p.slice(0, 3)));
  }, [lang]);

  const tiendaCol = nav.footer.columns.find((c) => c.title === "Store" || c.title === "Tienda");
  const blogCol = nav.footer.columns.find((c) => c.title === "Blog");
  const pagesCol = nav.footer.columns.find((c) => c.title === "Legal");

  return (
    <>
      {randomProducts.length > 0 && (
        <nav aria-label={tiendaCol?.title || "Store"}>
          <h3 className="mb-4 font-semibold">
            <Link href={l("/tienda")} className="hover:underline">{tiendaCol?.title || "Store"}</Link>
          </h3>
          <ul className="space-y-2">
            {randomProducts.map((p) => (
              <li key={p.slug}>
                <Link href={l(`/tienda/${p.slug}`)} className="text-sm text-muted-foreground hover:text-foreground transition-colors line-clamp-1">{p.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {recentPosts.length > 0 && (
        <nav aria-label={blogCol?.title || "Blog"}>
          <h3 className="mb-4 font-semibold">
            <Link href={l("/blog")} className="hover:underline">{blogCol?.title || "Blog"}</Link>
          </h3>
          <ul className="space-y-2">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link href={l(`/blog/${post.slug}`)} className="text-sm text-muted-foreground hover:text-foreground transition-colors line-clamp-1">{post.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <nav aria-label={agenda.page.title}>
        <h3 className="mb-4 font-semibold">
          <Link href={l("/agenda")} className="hover:underline">{agendaState.title}</Link>
        </h3>
        {agendaState.slots.length > 0 ? (
          <ul className="space-y-2">
            {agendaState.slots.map((slot, i) => (
              <li key={i}>
                <Link href={l(`/agenda?dia=${encodeURIComponent(slot.dayName)}&hora=${encodeURIComponent(slot.time)}&tipo=${encodeURIComponent(slot.type)}`)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors line-clamp-1">
                  {slot.time} {slot.type}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">{ui.footer.noSlots}</p>
        )}
      </nav>

      {paginas.length > 0 && (
        <nav aria-label={pagesCol?.title || "Legal"}>
          <h3 className="mb-4 font-semibold">
            <Link href={l("/paginas")} className="hover:underline">{pagesCol?.title || "Legal"}</Link>
          </h3>
          <ul className="space-y-2">
            {paginas.map((page) => (
              <li key={page.slug}>
                <Link href={l(`/paginas/${page.slug}`)} className="text-sm text-muted-foreground hover:text-foreground transition-colors line-clamp-1">{page.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
