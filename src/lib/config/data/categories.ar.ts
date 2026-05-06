export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export const categoryBadge: Record<string, string> = {
  escritura: "كتابة",
  papeleria: "قرطاسية",
  herramientas: "أدوات",
};

export const productCategories: CategoryData[] = [
  { id: "p1", name: "كتابة", slug: "escritura", icon: "pencil" },
  { id: "p2", name: "قرطاسية", slug: "papeleria", icon: "file" },
  { id: "p3", name: "أدوات", slug: "herramientas", icon: "tools" },
];

export const blogCategories: CategoryData[] = [
  { id: "b1", name: "تغذية", slug: "nutricion", icon: "apple" },
  { id: "b2", name: "إنتاجية", slug: "productividad", icon: "briefcase" },
  { id: "b3", name: "صحة", slug: "salud", icon: "heart" },
];

export const pageCategories: CategoryData[] = [
  { id: "l1", name: "قانوني", slug: "legal", icon: "scale" },
  { id: "l2", name: "سياسات", slug: "politicas", icon: "file-text" },
];

export const categoriesData: CategoryData[] = [
  ...productCategories,
  ...blogCategories,
  ...pageCategories,
];
