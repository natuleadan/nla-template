import { cacheLife, cacheTag } from "next/cache";
import { pagesData } from "@/lib/config/data/pages";

export interface PageContent {
  title: string;
  description: string;
  content: Array<{ type: string; [key: string]: unknown }>;
}

const pages = new Map<string, PageContent>(pagesData);

const DANGEROUS_PROPS = new Set(["__proto__", "constructor", "prototype"]);

function isValidPageName(name: string): boolean {
  return (
    !DANGEROUS_PROPS.has(name) &&
    typeof name === "string" &&
    name.length > 0 &&
    name.length <= 50
  );
}

export async function getPageContent(
  pageName: string,
): Promise<PageContent | undefined> {
  "use cache";
  cacheLife("days");
  cacheTag("pages", pageName);
  if (!isValidPageName(pageName)) return undefined;
  return pages.get(pageName);
}

export function getAllPages(): Record<string, PageContent> {
  return Object.fromEntries(pages);
}

export function createPage(
  pageName: string,
  content: Omit<PageContent, "description">,
): PageContent {
  if (!isValidPageName(pageName)) {
    throw new Error("Invalid page name");
  }
  const newPage: PageContent = {
    ...content,
    description: content.description || "Página creada",
  };
  pages.set(pageName, newPage);
  return newPage;
}

export function updatePages(
  data: Partial<PageContent>[],
): Record<string, PageContent> {
  return Object.fromEntries(pages);
}

export function deletePages(): void {
  pages.clear();
}
