import { brand } from "../data/brand";
import { categoryBadge } from "../data/categories";

export { categoryBadge };

export const store = {
  page: {
    title: "Nuestra Tienda",
    description: "Encuentra los mejores productos para tu entrenamiento",
    empty: "No hay productos disponibles",
    metaTitle: (count: number) => `Tienda (${count} productos) | ${brand.name}`,
    metaDescription: (count: number) =>
      count > 0
        ? `Explora nuestra selecci\u00f3n de ${count} suplementos y alimentos para el gym.`
        : "Explora nuestra selecci\u00f3n de suplementos y alimentos para el gym.",
  },
  toolbar: {
    searchPlaceholder: "Buscar productos...",
    filterLabel: "Filtrar por categor\u00eda",
    allCategories: "Todas las categor\u00edas",
    showing: (total: number) => `Mostrando ${total} productos`,
  },
  product: {
    badge: (category: string) =>
      categoryBadge[category] || category,
    priceLabel: "IVA incluido",
    pedir: "Pedir",
    ver: "Detalles",
    back: "Volver a la tienda",
    contentLabel: "Contenido:",
    availabilityLabel: "Disponibilidad:",
    inStock: "Disponible",
    lowStock: "Stock limitado",
    orderWhatsApp: "Pedir por WhatsApp",
    agendaService: "Agenda este servicio",
    separateProduct: "Separa este producto",
    whatsappTemplate: (p: {
      name: string;
      price: number;
      category: string;
      quantity: number;
      unit: string;
    }) =>
      `👋 *Hola! Gracias por tu inter\u00e9s en ${brand.name}*

Hemos recibido tu solicitud de informaci\u00f3n sobre el siguiente producto:

• *Producto:* ${p.name}
• *Precio:* $${p.price.toFixed(2)}
• *Categor\u00eda:* ${p.category === "suplemento" ? "Suplemento" : "Alimento"}
• *Presentaci\u00f3n:* ${p.quantity} ${p.unit}

¿En qué podemos ayudarte? Cuéntanos si deseas más detalles o realizar tu pedido.

*Horario de atención:* Lunes a Viernes de 9:00 a 18:00

¡Saludos,
*${brand.name}*`,
    whatsappCompact: (name: string, price: number, category: string) =>
      `👋 *Gracias por tu inter\u00e9s en ${brand.name}!*

Recibimos tu consulta sobre:

• *Producto:* ${name}
• *Precio:* $${price.toFixed(2)}
• *Categor\u00eda:* ${category === "suplemento" ? "Suplemento" : "Alimento"}

¿Deseas más información o proceder con tu pedido? Escríbenos y te atenderemos.

¡Saludos,
*${brand.name}*`,
    starAriaLabel: (star: number) => `${star} estrellas`,
  },
  reviews: {
    title: (count: number) => `Rese\u00f1as (${count})`,
    summary: (avg: number, count: number) =>
      `${avg.toFixed(1)} de 5 (${count} rese\u00f1as)`,
    writeTitle: "Escribe una rese\u00f1a",
    namePlaceholder: "Tu nombre",
    commentPlaceholder: "Tu comentario...",
    submit: "Enviar rese\u00f1a",
    submitting: "Enviando...",
    success: "Enviando rese\u00f1a para revisarla",
    error: "Error al enviar rese\u00f1a",
    validation: "Completa todos los campos",
    pending: "Pendiente",
    whatsappTitle: "Nueva rese\u00f1a",
    whatsappTemplate: (name: string, comment: string, rating: number, productSlug: string, baseUrl: string) =>
      `👋 *Hola ${name}, gracias por tu rese\u00f1a!*

Hemos recibido tu valoraci\u00f3n para el producto:

• *Producto:* ${baseUrl}/tienda/${productSlug}
• *Valoraci\u00f3n:* ${"⭐".repeat(rating)} ${rating}/5
• *Comentario:* "${comment}"

Tu rese\u00f1a ser\u00e1 revisada y publicada pronto. ¡Gracias por ayudarnos a mejorar!

*${brand.name}*`,
  },
  cart: {
    title: "Carrito de Compras",
    empty: "Tu carrito est\u00e1 vac\u00edo",
    itemsCount: (count: number) =>
      `${count} producto${count > 1 ? "s" : ""} en tu carrito`,
    perUnit: (price: number) => `$${price.toFixed(2)} c/u`,
    subtotal: (price: number) => `Subtotal: $${price.toFixed(2)}`,
    delete: "Eliminar",
    total: "Total:",
    orderWhatsApp: "Pedir por WhatsApp",
    openAriaLabel: "Abrir carrito",
    decreaseAriaLabel: (name: string) => `Disminuir cantidad de ${name}`,
    increaseAriaLabel: (name: string) => `Aumentar cantidad de ${name}`,
    removeAriaLabel: (name: string) => `Eliminar ${name} del carrito`,
    whatsappTemplate: (items: string, total: number) =>
      `🛒 *Hola! Gracias por tu pedido en ${brand.name}*

Hemos recibido tu solicitud con los siguientes productos:

*Items:*\n${items}

*Total:* $${total.toFixed(2)}

¿Confirmas este pedido? Te responderemos para coordinar el pago y la entrega.

*Horario de atención:* Lunes a Viernes de 9:00 a 18:00

¡Saludos,
*${brand.name}*`,
  },
};
