import { brand } from "../data/brand.es";

export const blog = {
  page: {
    title: "Noticias",
    description: "Artículos sobre nutrición, entrenamiento y salud",
    empty: "No hay artículos disponibles",
    metaTitle: (count: number) => `Noticias (${count} artículos) | ${brand.name}`,
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
    back: "Volver a noticias",
    readMore: "Leer más",
    attachmentsLabel: "Adjuntos",
  },
  comments: {
    title: (count: number) => `Comentarios (${count})`,
    writeTitle: "Deja un comentario",
    namePlaceholder: "Tu nombre",
    commentPlaceholder: "Tu comentario...",
    submit: "Enviar comentario",
    submitting: "Enviando...",
    success: "Enviando comentario para revisarlo",
    error: "Error al enviar comentario",
    validation: "Completa todos los campos",
    pending: "Pendiente",
    whatsappTitle: "Nuevo comentario",
    submitWhatsappTemplate: (name: string, comment: string, postSlug: string) =>
      `Quiero comentar el artículo "${postSlug}": ${name} - ${comment}`,
    whatsappTemplate: (
      name: string,
      comment: string,
      postSlug: string,
      baseUrl: string,
    ) =>
      `👋 *Hola ${name}, gracias por tu comentario!*

Hemos recibido tu participaci\u00f3n en nuestro blog:

• *Art\u00edculo:* ${baseUrl}/news/${postSlug}
• *Comentario:* "${comment}"

Tu comentario ser\u00e1 revisado y publicado pronto. ¡Gracias por formar parte de nuestra comunidad!

*${brand.name}*`,
  },
  og: {
    fallbackTitle: "Noticias",
  },
};
