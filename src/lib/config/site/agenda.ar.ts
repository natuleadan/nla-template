import { brand } from "../data/brand.ar";

const dayNames: Record<string, number> = {
  الأحد: 0,
  الاثنين: 1,
  الثلاثاء: 2,
  الأربعاء: 3,
  الخميس: 4,
  الجمعة: 5,
  السبت: 6,
};

const dayList = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

export { dayNames, dayList };

export const agenda = {
  page: {
    title: "المواعيد",
    description: "راجع أوقاتنا المتاحة واحجز موعدك",
    metaTitle: (count: number) => `المواعيد (${count} مواعيد) | ${brand.name}`,
    metaDescription: (count: number) =>
      count > 0
        ? `راجع ${count} أوقات متاحة واحجز موعدك.`
        : "راجع الأوقات المتاحة واحجز موعدك.",
  },
  calendar: {
    weekOf: (date: string) => `أسبوع ${date}`,
    previousWeek: "الأسبوع السابق",
    nextWeek: "الأسبوع التالي",
    closed: "مغلق",
  },
  slot: {
    slotUnavailable: "هذا الموعد لم يعد متاحاً",
    dialogTitle: "استشر التوفر",
    dialogDescription: "هل ترغب في استشارة توفر الموعد؟",
    confirm: "استشر",
    cancel: "إلغاء",
    typeLabel: "نوع الموعد",
    typePlaceholder: "اختر نوع الموعد",
    timeDescription: "اختر وقتاً متاحاً",
    noSlots: "لا توجد أوقات متاحة",
    changeSlot: "تغيير الموعد",
    productPlaceholder: "اختر منتجاً (اختياري)",
    productInterest: "منتج مهم",
    messagePlaceholder: "اكتب رسالتك أو استفسارك...",
    share: "مشاركة",
    consult: "استشر",
    whatsappTemplate: (
      fullDate: string,
      time: string,
      type?: string,
      message?: string,
      product?: { name: string; price: number },
    ) =>
      `👋 *مرحباً! شكراً لحجزك مع ${brand.name}*

لقد تلقينا طلب موعدك:

• *التاريخ:* ${fullDate}
• *الوقت:* ${time} ساعة${type ? `\n• *النوع:* ${type}` : ""}${message ? `\n• *تعليقك:* ${message}` : ""}${product ? `\n• *منتج مهم:* ${product.name} ($${product.price.toFixed(2)})` : ""}

نحن نراجع التوفر لهذا التاريخ والوقت. سنؤكد لك قريباً.

*ساعات العمل:* الإثنين إلى الجمعة من 9:00 صباحاً إلى 6:00 مساءً

مع التحية،
*${brand.name}*`,
  },
  slotButton: {
    unavailable: " — غير متاح",
  },
  jsonld: {
    citaDe: (type: string, businessName: string) =>
      `موعد ${type} - ${businessName}`,
    cita: (businessName: string) => `موعد - ${businessName}`,
    citaDisponible: "موعد متاح",
  },
};
