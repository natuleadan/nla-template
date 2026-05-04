export const nav = {
  items: [
    { href: "/", label: "Inicio", icon: "home" },
    { href: "/store", label: "Tienda", icon: "store", type: "products" },
    { href: "/news", label: "Blog", icon: "news", type: "posts" },
    { href: "/schedule", label: "Agenda", icon: "calendar", type: "agenda" },
    { href: "/pages", label: "P\u00e1ginas", icon: "files", type: "pages" },
    { href: "/contact", label: "Contacto", icon: "mail" },
  ] as const,
  buttons: {
    whatsappDesktop: "Escríbenos",
    whatsappMobile: "Escríbenos",
  },
  footer: {
    columns: [
      {
        title: "Tienda",
        links: [{ href: "/store", label: "Todos los productos" }],
      },
      {
        title: "Blog",
        links: [{ href: "/news", label: "Últimos artículos" }],
      },
      {
        title: "Agenda",
        links: [{ href: "/schedule", label: "Agendar cita" }],
      },
      {
        title: "Empresa",
        links: [{ href: "/contact", label: "Contacto" }],
      },
      {
        title: "Legal",
        links: [
          { href: "/pages/terminos", label: "T\u00e9rminos" },
          { href: "/pages/privacidad", label: "Privacidad" },
          { href: "/pages/datos", label: "Datos" },
        ],
      },
    ],
  },
};
