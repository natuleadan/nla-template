import { brand } from "../data/brand";

const dayNames: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
};

const dayList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export { dayNames, dayList };

export const agenda = {
  page: {
    title: "Schedule",
    description: "Check our available hours and book your appointment",
    metaTitle: (count: number) => `Schedule (${count} appointments) | ${brand.name}`,
    metaDescription: (count: number) =>
      count > 0
        ? `Check our ${count} available slots and book your appointment.`
        : "Check the available slots and book your appointment.",
  },
  calendar: {
    weekOf: (date: string) => `Week of ${date}`,
    previousWeek: "Previous week",
    nextWeek: "Next week",
    closed: "Closed",
  },
  slot: {
    slotUnavailable: "This time slot is no longer available",
    dialogTitle: "Check availability",
    dialogDescription:
      "Would you like to check appointment availability?",
    confirm: "Check",
    cancel: "Cancel",
    typeLabel: "Appointment type",
    typePlaceholder: "Select appointment type",
    timeDescription: "Select an available time slot",
    noSlots: "No available time slots",
    changeSlot: "Change time slot",
    productPlaceholder: "Select product (optional)",
    productInterest: "Product of interest",
    messagePlaceholder: "Write your message or question...",
    share: "Share",
    consult: "Inquire",
    whatsappTemplate: (
      fullDate: string,
      time: string,
      type?: string,
      message?: string,
      product?: { name: string; price: number },
    ) =>
      `👋 *Hi! Thanks for scheduling with ${brand.name}*

We have received your appointment request:

• *Date:* ${fullDate}
• *Time:* ${time}${type ? `\n• *Type:* ${type}` : ""}${message ? `\n• *Your message:* ${message}` : ""}${product ? `\n• *Product of interest:* ${product.name} ($${product.price.toFixed(2)})` : ""}

We are checking availability for that date and time. We will confirm shortly.

*Business hours:* Monday to Friday from 9:00 AM to 6:00 PM

Best regards,
*${brand.name}*`,
  },
  slotButton: {
    unavailable: " — not available",
  },
  jsonld: {
    citaDe: (type: string, businessName: string) => `${type} Appointment - ${businessName}`,
    cita: (businessName: string) => `Appointment - ${businessName}`,
    citaDisponible: "Available appointment",
  },
};
