const brandName = "Acme Inc";

export const agenda = {
  page: {
    title: "Agenda",
    description: "Consulta nuestros horarios disponibles y agenda tu cita",
    empty: "No hay horarios disponibles esta semana",
    metaTitle: (count: number) => `Agenda (${count} citas) | ${brandName}`,
    metaDescription: (count: number) =>
      count > 0
        ? `Revisa nuestros ${count} horarios disponibles y agenda tu cita por WhatsApp.`
        : "Revisa los horarios disponibles y agenda tu cita por WhatsApp.",
  },
  calendar: {
    loading: "Cargando agenda...",
    weekOf: (date: string) => `Semana del ${date}`,
    previousWeek: "Semana anterior",
    nextWeek: "Semana siguiente",
    closed: "Cerrado",
    noSlots: "Sin horarios",
  },
  slot: {
    available: "Disponible",
    unavailable: "No disponible",
    slotUnavailable: "No puedes agendar en un horario que ya pasó",
    dialogTitle: "Consultar disponibilidad",
    dialogDescription:
      "¿Desea consultar disponibilidad de cita?",
    confirm: "Consultar por WhatsApp",
    cancel: "Cancelar",
    whatsappTemplate: (
      fullDate: string,
      time: string,
      type?: string,
    ) =>
      `¡Hola! Quisiera consultar disponibilidad para una cita el ${fullDate} a las ${time} horas${type ? ` (${type})` : ""}.`,
  },
};
