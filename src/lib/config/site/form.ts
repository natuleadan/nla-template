export const form = {
  contact: {
    name: {
      label: "Nombre",
      placeholder: "Tu nombre",
      required: "Nombre es requerido",
      minLength: "M\u00ednimo 2 caracteres",
    },
    email: {
      label: "Correo electr\u00f3nico",
      placeholder: "tu@email.com",
      required: "Email es requerido",
      invalid: "Email inv\u00e1lido",
    },
    message: {
      label: "Mensaje",
      placeholder: "Tu mensaje...",
      required: "Mensaje es requerido",
      minLength: "M\u00ednimo 10 caracteres",
    },
    submit: "Enviar mensaje",
    submitting: "Enviando...",
    success: {
      title: "\u00a1Mensaje enviado!",
      description: "Gracias por contactarnos. Te responderemos en breve.",
      button: "Enviar otro mensaje",
    },
    notifications: {
      success: "Mensaje enviado correctamente!",
      error: "Error al enviar el mensaje",
      network: "Error de conexi\u00f3n",
    },
    whatsappTemplate: (name: string, email: string, message: string) =>
      `\u00a1Hola! Soy ${name} (${email}). ${message}`,
  },
};
