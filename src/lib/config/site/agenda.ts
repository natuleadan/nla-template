import { brand } from "../data/brand";

const dayNames: Record<string, number> = {
  Domingo: 0, Lunes: 1, Martes: 2, Miércoles: 3, Jueves: 4, Viernes: 5, Sábado: 6,
};

const dayList = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export { dayNames, dayList };

export const agenda = {
  page: {
    title: "Agenda",
    description: "Consulta nuestros horarios disponibles y agenda tu cita",
    metaTitle: (count: number) => `Agenda (${count} citas) | ${brand.name}`,
    metaDescription: (count: number) =>
      count > 0
        ? `Revisa nuestros ${count} horarios disponibles y agenda tu cita.`
        : "Revisa los horarios disponibles y agenda tu cita.",
  },
  calendar: {
    weekOf: (date: string) => `Semana del ${date}`,
    previousWeek: "Semana anterior",
    nextWeek: "Semana siguiente",
    closed: "Cerrado",
  },
  slot: {
    slotUnavailable: "No puedes agendar en un horario que ya pasó",
    dialogTitle: "Consultar disponibilidad",
    dialogDescription:
      "¿Desea consultar disponibilidad de cita?",
    confirm: "Consultar",
    cancel: "Cancelar",
    typeLabel: "Tipo de cita",
    typePlaceholder: "Seleccionar tipo de cita",
    timeDescription: "Selecciona un horario disponible",
    noSlots: "No hay horarios disponibles",
    changeSlot: "Cambiar horario",
    productPlaceholder: "Seleccionar producto (opcional)",
    productInterest: "Producto de interés",
    messagePlaceholder: "Escribe tu mensaje o consulta...",
    share: "Compartir",
    consult: "Consultar",
    whatsappTemplate: (
      fullDate: string,
      time: string,
      type?: string,
    ) =>
      `¡Hola! Quisiera consultar disponibilidad para una cita el ${fullDate} a las ${time} horas${type ? ` (${type})` : ""}.`,
  },
  slotButton: {
    unavailable: " — no disponible",
  },
  jsonld: {
    citaDe: (type: string, businessName: string) => `Cita de ${type} - ${businessName}`,
    cita: (businessName: string) => `Cita - ${businessName}`,
    citaDisponible: "Cita disponible",
  },
};
