import type { Category } from "@/lib/modules/categories";

export const categoryBadge: Record<string, string> = {
  suplemento: "Suplemento",
  comida: "Alimento",
  nutricion: "Nutrición",
  servicio: "Servicio",
};

export const categoriesData: Category[] = [
  { id: "1", name: "Suplementos", slug: "suplemento", icon: "dumbbell" },
  { id: "2", name: "Alimentos", slug: "comida", icon: "apple" },
  { id: "3", name: "Nutrici\u00f3n", slug: "nutricion", icon: "apple" },
  { id: "4", name: "Entrenamiento", slug: "entrenamiento", icon: "dumbbell" },
  { id: "5", name: "Salud y Bienestar", slug: "salud", icon: "heart" },
  { id: "6", name: "Servicios", slug: "servicio", icon: "dumbbell" },
];
