export const brand = {
  name: "Acme Inc",
  description:
    "Tu tienda online de confianza. Productos seleccionados para tu hogar y oficina.",
  email: "contacto@ejemplo.com",
  phone: "+1 (234) 567-890",
  address: "Calle Principal 123",
  addressCountry: "EC",
  socialEmail: "contacto@acme.com",
  socialInstagram: "acmestore",
  socialFacebook: "acmestore",
  socialTwitter: "acmestore",
  socialYoutube: "@acmestore",
  whatsappMessage: (name: string) => `👋 *Hola! Gracias por escribirnos*

Gracias por comunicarte con *${name}*. Quedamos atentos a tu consulta y te responderemos a la brevedad.

*Horario de atención:* Lunes a Viernes de 9:00 a 18:00

¿En qué podemos ayudarte?`,
  metadata: {
    titleSuffix: (name: string) => `${name} | Tienda Online`,
    keywords: ["tienda", "online", "productos", "oficina", "hogar"],
  },
};
