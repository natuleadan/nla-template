export const nav = {
  items: [
    { href: "/", label: "Home", icon: "home" },
    { href: "/tienda", label: "Store", icon: "store", type: "products" },
    { href: "/blog", label: "Blog", icon: "news", type: "posts" },
    { href: "/agenda", label: "Schedule", icon: "calendar", type: "agenda" },
    { href: "/paginas", label: "Pages", icon: "files", type: "pages" },
    { href: "/contacto", label: "Contact", icon: "mail" },
  ] as const,
  buttons: {
    whatsappDesktop: "Write us",
    whatsappMobile: "Write us",
  },
  footer: {
    columns: [
      {
        title: "Store",
        links: [{ href: "/tienda", label: "All products" }],
      },
      {
        title: "Blog",
        links: [{ href: "/blog", label: "Latest articles" }],
      },
      {
        title: "Schedule",
        links: [{ href: "/agenda", label: "Book an appointment" }],
      },
      {
        title: "Company",
        links: [{ href: "/contacto", label: "Contact" }],
      },
      {
        title: "Legal",
        links: [
          { href: "/paginas/terminos", label: "Terms" },
          { href: "/paginas/privacidad", label: "Privacy" },
          { href: "/paginas/datos", label: "Data" },
        ],
      },
    ],
  },
};
