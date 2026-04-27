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
      `\ud83e\udd1d *NUEVO PEDIDO*\n\n*Producto:* ${p.name}\n*Precio:* $${p.price.toFixed(2)}\n*Categor\u00eda:* ${p.category === "suplemento" ? "Suplemento" : "Alimento"}\n*Cantidad:* ${p.quantity} ${p.unit}\n\n\u00a1Quiero ordenar este producto!`,
    whatsappCompact: (name: string, price: number, category: string) =>
      `\ud83e\udd1d *NUEVO PEDIDO*\n\n*Producto:* ${name}\n*Precio:* $${price.toFixed(2)}\n*Categor\u00eda:* ${category === "suplemento" ? "Suplemento" : "Alimento"}\n\n\u00a1Quiero ordenar este producto!`,
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
    whatsappTemplate: (name: string, comment: string, rating: number, productSlug: string, baseUrl: string) =>
      `\ud83d\udcdd *NUEVA RESE\u00d1A - ${brand.name}*\n\n*Producto:* ${baseUrl}/tienda/${productSlug}\n*Nombre:* ${name}\n*Comentario:* ${comment}\n*Valoraci\u00f3n:* ${rating}/5\n\n\u00bfPublicar esta rese\u00f1a?`,
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
      `\ud83d\uded2 *NUEVO PEDIDO - ${brand.name}*\n\n*Items:*\n${items}\n\n*Total:* $${total.toFixed(2)}\n\n\u00a1Confirmar pedido!`,
  },
};
