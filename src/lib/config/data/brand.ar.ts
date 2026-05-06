export const brand = {
  name: "أكمل Inc",
  description: "متجرك الإلكتروني الموثوق. منتجات مختارة لمنزلك ومكتبك.",
  email: "contacto@ejemplo.com",
  phone: "+1 (234) 567-890",
  address: "الشارع الرئيسي 123",
  addressCountry: "SA",
  socialEmail: "contacto@acme.com",
  socialInstagram: "acmestore",
  socialFacebook: "acmestore",
  socialTwitter: "acmestore",
  socialYoutube: "@acmestore",
  whatsappMessage: (name: string) => `👋 *مرحباً! شكراً لتواصلك معنا*

شكراً لتواصلك مع *${name}*. نحن منتبهون لاستفسارك وسنرد عليك قريباً.

*ساعات العمل:* الإثنين إلى الجمعة من 9:00 صباحاً إلى 6:00 مساءً

كيف يمكننا مساعدتك؟`,
  metadata: {
    titleSuffix: (name: string) => `${name} | متجر إلكتروني`,
    keywords: ["متجر", "إلكتروني", "منتجات", "مكتب", "منزل"],
  },
};
