export const brand = {
  name: "Acme Inc",
  description:
    "Your trusted online store. Curated products for your home and office.",
  email: "contacto@ejemplo.com",
  phone: "+1 (234) 567-890",
  address: "Calle Principal 123",
  addressCountry: "EC",
  socialEmail: "contacto@acme.com",
  socialInstagram: "acmestore",
  socialFacebook: "acmestore",
  socialTwitter: "acmestore",
  socialYoutube: "@acmestore",
  whatsappMessage: (name: string) => `👋 *Hello! Thank you for writing to us*

Thank you for contacting *${name}*. We are attentive to your inquiry and will respond shortly.

*Business hours:* Monday to Friday from 9:00 AM to 6:00 PM

How can we help you?`,
  metadata: {
    titleSuffix: (name: string) => `${name} | Online Store`,
    keywords: ["store", "online", "products", "office", "home"],
  },
};
