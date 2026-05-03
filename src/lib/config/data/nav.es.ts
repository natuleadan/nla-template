export const nav = {
  items: [
    { href: "/", label: "Inicio", icon: "home" },
    { href: "/tienda", label: "Tienda", icon: "store", type: "products" },
    { href: "/blog", label: "Blog", icon: "news", type: "posts" },
    { href: "/agenda", label: "Agenda", icon: "calendar", type: "agenda" },
    { href: "/paginas", label: "P\u00e1ginas", icon: "files", type: "pages" },
    { href: "/contacto", label: "Contacto", icon: "mail" },
  ] as const,
  buttons: {
    whatsappDesktop: "Escríbenos",
    whatsappMobile: "Escríbenos",
  },
  footer: {
    columns: [
      {
        title: "Tienda",
        links: [
          { href: "/tienda", label: "Todos los productos" },
        ],
      },
      {
        title: "Blog",
        links: [{ href: "/blog", label: "Últimos artículos" }],
      },
      {
        title: "Agenda",
        links: [{ href: "/agenda", label: "Agendar cita" }],
      },
      {
        title: "Empresa",
        links: [{ href: "/contacto", label: "Contacto" }],
      },
      {
        title: "Legal",
        links: [
          { href: "/paginas/terminos", label: "T\u00e9rminos" },
          { href: "/paginas/privacidad", label: "Privacidad" },
          { href: "/paginas/datos", label: "Datos" },
        ],
      },
    ],
  },
};
