import { brand } from "../data/brand";

export const paginas = {
  page: {
    title: "Pages",
    description: "Legal documents, policies and company regulations",
    empty: "No pages available",
    metaTitle: (count: number) => `Pages (${count}) | ${brand.name}`,
    metaDescription: (count: number) =>
      count > 0
        ? `Review our ${count} legal pages and policies.`
        : "Review our legal pages and policies.",
  },
  toolbar: {
    searchPlaceholder: "Search pages...",
    filterLabel: "Filter by category",
    allCategories: "All categories",
    showing: (total: number) => `Showing ${total} pages`,
  },
  detail: {
    back: "Back to pages",
    updatedAt: (date: string) => `Updated on ${date}`,
    attachmentsLabel: "Attachments",
  },
  category: {
    legal: "Legal",
    politicas: "Policies",
  },
  og: {
    fallbackTitle: "Page",
  },
};
