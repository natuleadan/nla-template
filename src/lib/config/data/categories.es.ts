export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export const categoryBadge: Record<string, string> = {
  escritura: "Escritura",
  papeleria: "Papeler\u00eda",
  herramientas: "Herramientas",
};

export const productCategories: CategoryData[] = [
  { id: "p1", name: "Escritura", slug: "escritura", icon: "pencil" },
  { id: "p2", name: "Papeler\u00eda", slug: "papeleria", icon: "file" },
  { id: "p3", name: "Herramientas", slug: "herramientas", icon: "tools" },
];

export const blogCategories: CategoryData[] = [
  { id: "b1", name: "Nutrici\u00f3n", slug: "nutricion", icon: "apple" },
  { id: "b2", name: "Productividad", slug: "productividad", icon: "briefcase" },
  { id: "b3", name: "Salud", slug: "salud", icon: "heart" },
];

export const pageCategories: CategoryData[] = [
  { id: "l1", name: "Legal", slug: "legal", icon: "scale" },
  { id: "l2", name: "Pol\u00edticas", slug: "politicas", icon: "file-text" },
];

export const categoriesData: CategoryData[] = [
  ...productCategories,
  ...blogCategories,
  ...pageCategories,
];
