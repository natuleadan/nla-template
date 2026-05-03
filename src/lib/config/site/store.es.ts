import { brand } from "../data/brand";
import { categoryBadge } from "../data/categories";

export { categoryBadge };

export const store = {
  page: {
    title: "Nuestra Tienda",
    description: "Encuentra los mejores productos para tu hogar y oficina",
    empty: "No hay productos disponibles",
    metaTitle: (count: number) => `Tienda (${count} productos) | ${brand.name}`,
    metaDescription: (count: number) =>
      count > 0
        ? `Explora nuestra selección de ${count} productos.`
        : "Explora nuestra selección de productos.",
  },
  toolbar: {
    searchPlaceholder: "Buscar productos...",
    filterLabel: "Filtrar por categoría",
    allCategories: "Todas las categorías",
    showing: (total: number) => `Mostrando ${total} productos`,
  },
  product: {
    badge: (category: string) => categoryBadge[category] || category,
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
      `👋 *Hola! Gracias por tu interés en ${brand.name}*

Hemos recibido tu solicitud de información sobre el siguiente producto:

• *Producto:* ${p.name}
• *Precio:* $${p.price.toFixed(2)}
• *Presentación:* ${p.quantity} ${p.unit}

¿En qué podemos ayudarte? Cuéntanos si deseas más detalles o realizar tu pedido.

*Horario de atención:* Lunes a Viernes de 9:00 a 18:00

¡Saludos,
*${brand.name}*`,
    whatsappCompact: (name: string, price: number) =>
      `👋 *Gracias por tu interés en ${brand.name}!*

Recibimos tu consulta sobre:

• *Producto:* ${name}
• *Precio:* $${price.toFixed(2)}

¿Deseas más información o proceder con tu pedido? Escríbenos y te atenderemos.

¡Saludos,
*${brand.name}*`,
    starAriaLabel: (star: number) => `${star} estrellas`,
  },
  reviews: {
    title: (count: number) => `Reseñas (${count})`,
    summary: (avg: number, count: number) =>
      `${avg.toFixed(1)} de 5 (${count} reseñas)`,
    writeTitle: "Escribe una reseña",
    namePlaceholder: "Tu nombre",
    commentPlaceholder: "Tu comentario...",
    submit: "Enviar reseña",
    submitting: "Enviando...",
    success: "Enviando reseña para revisarla",
    error: "Error al enviar reseña",
    validation: "Completa todos los campos",
    pending: "Pendiente",
    whatsappTitle: "Nueva reseña",
    submitWhatsappTemplate: (
      name: string,
      rating: number,
      comment: string,
      productName: string,
    ) =>
      `Quiero dejar una reseña del producto *${productName}*: ${rating}★ - ${comment}`,
    whatsappTemplate: (
      name: string,
      comment: string,
      rating: number,
      productSlug: string,
      baseUrl: string,
    ) =>
      `👋 *Hola ${name}, gracias por tu reseña!*

Hemos recibido tu valoración para el producto:

• *Producto:* ${baseUrl}/tienda/${productSlug}
• *Valoración:* ${"⭐".repeat(rating)} ${rating}/5
• *Comentario:* "${comment}"

Tu reseña será revisada y publicada pronto. ¡Gracias por ayudarnos a mejorar!

*${brand.name}*`,
  },
  cart: {
    title: "Carrito de Compras",
    empty: "Tu carrito está vacío",
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
