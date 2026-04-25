const brandName = "Acme Inc"

export const store = {
  page: {
    title: "Nuestra Tienda",
    description: "Encuentra los mejores productos para tu entrenamiento",
    empty: "No hay productos disponibles",
    metaTitle: (count: number) => `Tienda (${count} productos) - ${brandName}`,
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
    badge: (category: string) => (category === "suplemento" ? "Suplemento" : "Alimento"),
    priceLabel: "IVA incluido",
    pedir: "Pedir",
    ver: "Ver",
    back: "Volver",
    contentLabel: "Contenido:",
    availabilityLabel: "Disponibilidad:",
    inStock: "Disponible",
    lowStock: "Stock limitado",
    orderWhatsApp: "Pedir por WhatsApp",
    whatsappTemplate: (p: {
      name: string
      price: number
      category: string
      quantity: number
      unit: string
    }) =>
      `\ud83e\udd1d *NUEVO PEDIDO*\n\n*Producto:* ${p.name}\n*Precio:* $${p.price.toFixed(2)}\n*Categor\u00eda:* ${p.category === "suplemento" ? "Suplemento" : "Alimento"}\n*Cantidad:* ${p.quantity} ${p.unit}\n\n\u00a1Quiero ordenar este producto!`,
    whatsappCompact: (name: string, price: number, category: string) =>
      `\ud83e\udd1d *NUEVO PEDIDO*\n\n*Producto:* ${name}\n*Precio:* $${price.toFixed(2)}\n*Categor\u00eda:* ${category === "suplemento" ? "Suplemento" : "Alimento"}\n\n\u00a1Quiero ordenar este producto!`,
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
    success: "\u00a1Rese\u00f1a publicada!",
    error: "Error al publicar la rese\u00f1a",
    validation: "Completa todos los campos",
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
    whatsappTemplate: (items: string, total: number) =>
      `\ud83d\uded2 *NUEVO PEDIDO - ${brandName}*\n\n*Items:*\n${items}\n\n*Total:* $${total.toFixed(2)}\n\n\u00a1Confirmar pedido!`,
  },
}
