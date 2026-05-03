import { brand } from "../data/brand";

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
      `👋 *Hola ${name}, gracias por contactarnos!*

Hemos recibido tu mensaje a través de nuestro formulario de contacto.

*Datos registrados:*
• *Nombre:* ${name}
• *Email:* ${email}
• *Mensaje:* ${message}

Te responderemos a la brevedad. Mientras tanto, puedes revisar nuestros productos en nuestra tienda.

*Horario de atención:* Lunes a Viernes de 9:00 a 18:00

¡Saludos,
*${brand.name}*`,

  },
};
