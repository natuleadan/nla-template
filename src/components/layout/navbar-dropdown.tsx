"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getAllProducts } from "@/lib/modules/products";
import { getAllPosts } from "@/lib/modules/blog";
import { getWeekDays } from "@/lib/modules/agenda";
import { getAllPaginas } from "@/lib/modules/paginas";
import { getUpcomingSlots } from "@/lib/agenda-utils";
import { ui } from "@/lib/config/site";
import { IconHome, IconBuildingStore, IconNews, IconCalendar, IconFiles, IconMail } from "@tabler/icons-react";

type DropdownType = "products" | "posts" | "agenda" | "pages";

interface NavLink {
  href: string;
  label: string;
}

interface NavDropdownProps {
  label: string;
  href: string;
  type: DropdownType;
  variant?: "dropdown" | "accordion";
  onNav?: () => void;
  icon?: string;
  compact?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  home: IconHome,
  store: IconBuildingStore,
  news: IconNews,
  calendar: IconCalendar,
  files: IconFiles,
  mail: IconMail,
};

function shuffleArray<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function loadItems(type: DropdownType): Promise<NavLink[]> {
  switch (type) {
    case "products": {
      const products = await getAllProducts();
      return shuffleArray(products).slice(0, 5).map((p) => ({
        href: `/tienda/${p.slug}`,
        label: p.name,
      }));
    }
    case "posts": {
      const posts = await getAllPosts();
      return posts
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 5)
        .map((post) => ({ href: `/blog/${post.slug}`, label: post.title }));
    }
    case "agenda": {
      const days = await getWeekDays();
      return getUpcomingSlots(days, 5).map((s) => ({
        href: `/agenda?dia=${encodeURIComponent(s.dayName)}&hora=${encodeURIComponent(s.time)}&tipo=${encodeURIComponent(s.type)}`,
        label: `${s.dayName} ${s.dayNumber} ${s.time} ${s.type}`,
      }));
    }
    case "pages": {
      const pages = await getAllPaginas();
      return pages.slice(0, 5).map((page) => ({
        href: `/paginas/${page.slug}`,
        label: page.title,
      }));
    }
  }
}

function DesktopDropdown({ label, href, type, icon, compact }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NavLink[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const IconComp = icon ? iconMap[icon] : null;

  useEffect(() => {
    let cancelled = false;
    loadItems(type).then((result) => {
      if (!cancelled) setItems(result);
    });
    return () => { cancelled = true; };
  }, [type]);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className={`relative ${compact ? "group" : ""}`} onMouseEnter={show} onMouseLeave={hide}>
      <Link
        href={href}
        className={`px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors inline-flex items-center ${compact ? "gap-1" : "gap-1.5"}`}
      >
        {IconComp && <IconComp className="size-4" />}
        {compact ? (
          <span className="max-w-0 group-hover:max-w-40 overflow-hidden transition-all duration-200 whitespace-nowrap inline-flex items-center gap-1">
            <span className="pl-1">{label}</span>
            <svg className="size-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        ) : (
          <>
            {label}
            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </>
        )}
      </Link>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 min-w-max rounded-lg border bg-popover p-1.5 shadow-lg z-50"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {items.length > 0 ? (
            items.map((item, i) => (
              <Link
                key={`${item.href}-${i}`}
                href={item.href}
                className="block px-3 py-1.5 text-sm rounded-md hover:bg-muted transition-colors line-clamp-1"
              >
                {item.label}
              </Link>
            ))
          ) : (
            <p className="px-3 py-1.5 text-sm text-muted-foreground">{ui.dropdown.noSlots}</p>
          )}
        </div>
      )}
    </div>
  );
}

function MobileAccordion({ label, href, type, onNav, icon }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NavLink[]>([]);
  const IconComp = icon ? iconMap[icon] : null;

  useEffect(() => {
    let cancelled = false;
    loadItems(type).then((result) => {
      if (!cancelled) setItems(result);
    });
    return () => { cancelled = true; };
  }, [type]);

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={href}
          onClick={onNav}
          className="flex-1 px-4 py-3 text-base font-medium rounded-l-lg hover:bg-muted transition-colors inline-flex items-center gap-2"
        >
          {IconComp && <IconComp className="size-5" />}
          {label}
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="px-3 py-3 text-base font-medium rounded-r-lg hover:bg-muted transition-colors"
          aria-label={open ? "Cerrar" : "Abrir"}
        >
          <svg
            className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="ml-4 border-l pl-2 space-y-0.5">
          {items.length > 0 ? (
            items.map((item, i) => (
              <Link
                key={`${item.href}-${i}`}
                href={item.href}
                onClick={onNav}
                className="block px-4 py-2 text-sm rounded-md hover:bg-muted transition-colors line-clamp-1"
              >
                {item.label}
              </Link>
            ))
          ) : (
            <p className="px-4 py-2 text-sm text-muted-foreground">{ui.dropdown.noSlots}</p>
          )}
        </div>
      )}
    </div>
  );
}

export function NavDropdown(props: NavDropdownProps) {
  if (props.variant === "accordion") {
    return <MobileAccordion {...props} />;
  }
  return <DesktopDropdown {...props} />;
}
