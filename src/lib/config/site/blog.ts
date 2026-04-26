const brandName = "Acme Inc";

export const blog = {
  page: {
    title: "Blog",
    description: "Artículos sobre nutrición, entrenamiento y salud",
    empty: "No hay artículos disponibles",
    metaTitle: (count: number) => `Blog (${count} artículos) - ${brandName}`,
    metaDescription: (count: number) =>
      count > 0
        ? `Lee nuestros ${count} artículos sobre nutrición, entrenamiento y salud.`
        : "Lee nuestros artículos sobre nutrición, entrenamiento y salud.",
  },
  toolbar: {
    searchPlaceholder: "Buscar artículos...",
    filterLabel: "Filtrar por categoría",
    allCategories: "Todas las categorías",
    showing: (total: number) => `Mostrando ${total} artículos`,
  },
  post: {
    readingTime: (min: number) => `${min} min de lectura`,
    publishedAt: (date: string) => `Publicado el ${date}`,
    by: (author: string) => `Por ${author}`,
    back: "Volver al blog",
    readMore: "Leer más",
  },
  comments: {
    title: (count: number) => `Comentarios (${count})`,
    writeTitle: "Deja un comentario",
    namePlaceholder: "Tu nombre",
    commentPlaceholder: "Tu comentario...",
    submit: "Enviar comentario",
    submitting: "Enviando...",
    success: "El comentario se enviará por WhatsApp para publicarlo",
    error: "Error al enviar comentario",
    validation: "Completa todos los campos",
    whatsappTemplate: (name: string, comment: string, postSlug: string, baseUrl: string) =>
      `💬 *NUEVO COMENTARIO - ${brandName}*\n\n*Artículo:* ${baseUrl}/blog/${postSlug}\n*Nombre:* ${name}\n*Comentario:* ${comment}\n\n¿Publicar este comentario?`,
  },
};
