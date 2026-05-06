import { brand } from "../data/brand.ar";

export const paginas = {
  page: {
    title: "صفحات",
    description: "مستندات قانونية وسياسات ولوائح الشركة",
    empty: "لا توجد صفحات متاحة",
    metaTitle: (count: number) => `صفحات (${count}) | ${brand.name}`,
    metaDescription: (count: number) =>
      count > 0
        ? `راجع ${count} صفحات قانونية وسياسات.`
        : "راجع صفحاتنا القانونية والسياسات.",
  },
  toolbar: {
    searchPlaceholder: "ابحث عن صفحات...",
    filterLabel: "تصفية حسب الفئة",
    allCategories: "جميع الفئات",
    showing: (total: number) => `عرض ${total} صفحات`,
  },
  detail: {
    back: "العودة إلى الصفحات",
    updatedAt: (date: string) => `حُدث في ${date}`,
    attachmentsLabel: "المرفقات",
  },
  category: {
    legal: "قانوني",
    politicas: "سياسات",
  },
  og: {
    fallbackTitle: "صفحة",
  },
};
