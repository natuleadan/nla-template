export const nav = {
  items: [
    { href: "/", label: "Inicio" },
    { href: "/tienda", label: "Tienda" },
    { href: "/terminos", label: "T\u00e9rminos" },
    { href: "/privacidad", label: "Privacidad" },
    { href: "/datos", label: "Datos" },
    { href: "/contacto", label: "Contacto" },
  ] as const,
  buttons: {
    whatsappDesktop: "Comprar por WhatsApp",
    whatsappMobile: "WhatsApp",
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
        title: "Empresa",
        links: [{ href: "/contacto", label: "Contacto" }],
      },
      {
        title: "Legal",
        links: [
          { href: "/terminos", label: "T\u00e9rminos" },
          { href: "/privacidad", label: "Privacidad" },
          { href: "/datos", label: "Datos" },
        ],
      },
    ],
  },
};
