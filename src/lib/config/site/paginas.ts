import { brand } from "../data/brand";

export const paginas = {
  page: {
    title: "Páginas",
    description: "Documentos legales, políticas y normativas de la empresa",
    empty: "No hay páginas disponibles",
    metaTitle: (count: number) =>
      `Páginas (${count}) | ${brand.name}`,
    metaDescription: (count: number) =>
      count > 0
        ? `Revisa nuestras ${count} páginas legales y políticas.`
        : "Revisa nuestras páginas legales y políticas.",
  },
  toolbar: {
    searchPlaceholder: "Buscar páginas...",
    filterLabel: "Filtrar por categoría",
    allCategories: "Todas las categorías",
    showing: (total: number) => `Mostrando ${total} páginas`,
  },
  detail: {
    back: "Volver a páginas",
    updatedAt: (date: string) => `Actualizado el ${date}`,
  },
  category: {
    legal: "Legal",
    politicas: "Políticas",
  },
  og: {
    fallbackTitle: "Página",
  },
};
