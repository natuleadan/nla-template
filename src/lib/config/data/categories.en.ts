export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export const categoryBadge: Record<string, string> = {
  escritura: "Writing",
  papeleria: "Stationery",
  herramientas: "Tools",
};

export const productCategories: CategoryData[] = [
  { id: "p1", name: "Writing", slug: "escritura", icon: "pencil" },
  { id: "p2", name: "Stationery", slug: "papeleria", icon: "file" },
  { id: "p3", name: "Tools", slug: "herramientas", icon: "tools" },
];

export const blogCategories: CategoryData[] = [
  { id: "b1", name: "Nutrition", slug: "nutricion", icon: "apple" },
  { id: "b2", name: "Productivity", slug: "productividad", icon: "briefcase" },
  { id: "b3", name: "Health", slug: "salud", icon: "heart" },
];

export const pageCategories: CategoryData[] = [
  { id: "l1", name: "Legal", slug: "legal", icon: "scale" },
  { id: "l2", name: "Policies", slug: "politicas", icon: "file-text" },
];

export const categoriesData: CategoryData[] = [...productCategories, ...blogCategories, ...pageCategories];
