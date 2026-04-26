"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllProducts, type Product } from "@/lib/modules/products";
import { getAllPosts, type BlogPost } from "@/lib/modules/blog";
import { getWeekDays, type AgendaDay } from "@/lib/modules/agenda";
import { getAllPaginas, type PaginaPost } from "@/lib/modules/paginas";

function shuffleArray<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getTodaySlots(
  days: AgendaDay[],
): { slots: { time: string; type?: string }[]; title: string } {
  const now = new Date();
  const todayDayOfWeek = now.getDay();
  const today = days.find((d) => d.dayOfWeek === todayDayOfWeek);
  const cutoffMinutes = now.getHours() * 60 + now.getMinutes() + 30;

  if (today) {
    const slots = today.slots
      .filter((s) => {
        if (!s.available) return false;
        const [h, m] = s.time.split(":").map(Number);
        return h * 60 + m >= cutoffMinutes;
      })
      .slice(0, 3);
    if (slots.length > 0) return { slots, title: "Agenda" };
  }

  const nextDays = [1, 2, 3, 4, 5, 6]
    .map((offset) => {
      const d = new Date(now);
      d.setDate(d.getDate() + offset);
      return days.find((day) => day.dayOfWeek === d.getDay());
    })
    .filter(Boolean) as AgendaDay[];

  for (const day of nextDays) {
    const slots = day.slots.filter((s) => s.available).slice(0, 3);
    if (slots.length > 0) return { slots, title: `Agenda para ${day.name}` };
  }

  return { slots: [], title: "Agenda" };
}

export function FooterDynamicCards() {
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [agenda, setAgenda] = useState<{ slots: { time: string; type?: string }[]; title: string }>({ slots: [], title: "Agenda" });
  const [paginas, setPaginas] = useState<PaginaPost[]>([]);

  useEffect(() => {
    getAllProducts().then((products) => {
      setRandomProducts(shuffleArray(products).slice(0, 3));
    });
    getAllPosts().then((posts) => {
      setRecentPosts(
        posts
          .sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
          )
          .slice(0, 3),
      );
    });
    getWeekDays().then((days) => {
      setAgenda(getTodaySlots(days));
    });
    getAllPaginas().then((p) => {
      setPaginas(p.slice(0, 3));
    });
  }, []);

  return (
    <>
      {randomProducts.length > 0 && (
        <nav aria-label="Tienda">
          <h3 className="mb-4 font-semibold">
            <Link href="/tienda" className="hover:underline">
              Tienda
            </Link>
          </h3>
          <ul className="space-y-2">
            {randomProducts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/tienda/${p.slug}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors line-clamp-1"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {recentPosts.length > 0 && (
        <nav aria-label="Blog">
          <h3 className="mb-4 font-semibold">
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
          </h3>
          <ul className="space-y-2">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors line-clamp-1"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {agenda.slots.length > 0 && (
        <nav aria-label="Agenda">
          <h3 className="mb-4 font-semibold">
            <Link href="/agenda" className="hover:underline">
              {agenda.title}
            </Link>
          </h3>
          <ul className="space-y-2">
            {agenda.slots.map((slot, i) => (
              <li key={i}>
                <span className="text-sm text-muted-foreground">
                  {slot.time}
                  {slot.type ? ` - ${slot.type}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {paginas.length > 0 && (
        <nav aria-label="Páginas">
          <h3 className="mb-4 font-semibold">
            <Link href="/paginas" className="hover:underline">
              Páginas
            </Link>
          </h3>
          <ul className="space-y-2">
            {paginas.map((page) => (
              <li key={page.slug}>
                <Link
                  href={`/paginas/${page.slug}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors line-clamp-1"
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
