export const nav = {
  items: [
    { href: "/", label: "Home", icon: "home" },
    { href: "/store", label: "Store", icon: "store", type: "products" },
    { href: "/news", label: "News", icon: "news", type: "posts" },
    { href: "/schedule", label: "Schedule", icon: "calendar", type: "agenda" },
    { href: "/pages", label: "Pages", icon: "files", type: "pages" },
    { href: "/contact", label: "Contact", icon: "mail" },
  ] as const,
  buttons: {
    whatsappDesktop: "Write us",
    whatsappMobile: "Write us",
  },
  footer: {
    columns: [
      {
        title: "Store",
        links: [{ href: "/store", label: "All products" }],
      },
      {
        title: "Blog",
        links: [{ href: "/news", label: "Latest articles" }],
      },
      {
        title: "Schedule",
        links: [{ href: "/schedule", label: "Book an appointment" }],
      },
      {
        title: "Company",
        links: [
          { href: "/contact", label: "Contact" },
          { href: "/certificates", label: "Certificates" },
        ],
      },
      {
        title: "Legal",
        links: [
          { href: "/pages/terminos", label: "Terms" },
          { href: "/pages/privacidad", label: "Privacy" },
          { href: "/pages/datos", label: "Data" },
        ],
      },
    ],
  },
};
