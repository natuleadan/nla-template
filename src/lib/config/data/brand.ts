export const brand = {
  name: "Acme Inc",
  description:
    "Tu tienda de confianza para suplementos nutricionales y alimentos saludables para el gym.",
  email: "contacto@ejemplo.com",
  phone: "+1 (234) 567-890",
  address: "Calle Principal 123",
  addressCountry: "EC",
  socialEmail: "contacto@natuleadan.com",
  socialInstagram: "natuleadan",
  socialFacebook: "natuleadan",
  socialTwitter: "natuleadan",
  socialYoutube: "@natuleadan",
  whatsappMessage: (name: string) => `👋 *Hola! Gracias por escribirnos*

Gracias por comunicarte con *${name}*. Quedamos atentos a tu consulta y te responderemos a la brevedad.

*Horario de atención:* Lunes a Viernes de 9:00 a 18:00

¿En qué podemos ayudarte?`,
  whatsappProductId: "consulta-header",
  whatsappProductName: "Consulta desde header",
  metadata: {
    titleSuffix: (name: string) => `${name} | Tienda de Suplementos y Alimentos`,
    keywords: ["tienda", "suplementos", "alimentos", "gym", "entrenamiento"],
  },
};
