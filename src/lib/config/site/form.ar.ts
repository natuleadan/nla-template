import { brand } from "../data/brand.ar";

export const form = {
  contact: {
    name: {
      label: "الاسم",
      placeholder: "اسمك",
      required: "الاسم مطلوب",
      minLength: "الحد الأدنى حرفان",
    },
    email: {
      label: "البريد الإلكتروني",
      placeholder: "بريدك@example.com",
      required: "البريد الإلكتروني مطلوب",
      invalid: "بريد إلكتروني غير صالح",
    },
    message: {
      label: "الرسالة",
      placeholder: "رسالتك...",
      required: "الرسالة مطلوبة",
      minLength: "الحد الأدنى 10 أحرف",
    },
    submit: "إرسال الرسالة",
    submitting: "جاري الإرسال...",
    success: {
      title: "تم إرسال الرسالة!",
      description: "شكراً لتواصلك معنا. سنرد عليك قريباً.",
      button: "إرسال رسالة أخرى",
    },
    notifications: {
      success: "تم إرسال الرسالة بنجاح!",
      error: "خطأ في إرسال الرسالة",
      network: "خطأ في الاتصال",
    },
    whatsappTemplate: (name: string, email: string, message: string) =>
      `👋 *مرحباً ${name}، شكراً لتواصلك معنا!*

لقد تلقينا رسالتك عبر نموذج الاتصال.

*البيانات المسجلة:*
• *الاسم:* ${name}
• *البريد الإلكتروني:* ${email}
• *الرسالة:* ${message}

سنرد عليك قريباً. في هذه الأثناء، يمكنك تصفح منتجاتنا في متجرنا.

*ساعات العمل:* الإثنين إلى الجمعة من 9:00 صباحاً إلى 6:00 مساءً

مع التحية،
*${brand.name}*`,
  },
};
