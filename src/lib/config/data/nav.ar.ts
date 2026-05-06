export const nav = {
  items: [
    { href: "/", label: "الرئيسية", icon: "home" },
    { href: "/store", label: "المتجر", icon: "store", type: "products" },
    { href: "/news", label: "الأخبار", icon: "news", type: "posts" },
    { href: "/schedule", label: "المواعيد", icon: "calendar", type: "agenda" },
    { href: "/pages", label: "صفحات", icon: "files", type: "pages" },
    { href: "/contact", label: "اتصل بنا", icon: "mail" },
  ] as const,
  buttons: {
    whatsappDesktop: "راسلنا",
    whatsappMobile: "راسلنا",
  },
  footer: {
    columns: [
      {
        title: "المتجر",
        links: [{ href: "/store", label: "جميع المنتجات" }],
      },
      {
        title: "المدونة",
        links: [{ href: "/news", label: "آخر المقالات" }],
      },
      {
        title: "المواعيد",
        links: [{ href: "/schedule", label: "حجز موعد" }],
      },
      {
        title: "الشركة",
        links: [
          { href: "/contact", label: "اتصل بنا" },
          { href: "/certificates", label: "الشهادات" },
        ],
      },
      {
        title: "قانوني",
        links: [
          { href: "/pages/terminos", label: "الشروط" },
          { href: "/pages/privacidad", label: "الخصوصية" },
          { href: "/pages/datos", label: "البيانات" },
        ],
      },
    ],
  },
};
