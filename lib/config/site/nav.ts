export const nav = {
  items: [
    { href: "/", label: "Inicio" },
    { href: "/tienda", label: "Tienda" },
    { href: "/blog", label: "Blog" },
    { href: "/agenda", label: "Agenda" },
    { href: "/paginas", label: "P\u00e1ginas" },
    { href: "/contacto", label: "Contacto" },
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
          { href: "/tienda?cat=suplemento", label: "Suplementos" },
          { href: "/tienda?cat=comida", label: "Alimentos" },
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
