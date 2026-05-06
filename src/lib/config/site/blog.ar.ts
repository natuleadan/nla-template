import { brand } from "../data/brand.ar";

export const blog = {
  page: {
    title: "الأخبار",
    description: "مقالات حول التغذية والتدريب والصحة",
    empty: "لا توجد مقالات متاحة",
    metaTitle: (count: number) => `الأخبار (${count} مقالات) | ${brand.name}`,
    metaDescription: (count: number) =>
      count > 0
        ? `اقرأ ${count} مقالات حول التغذية والتدريب والصحة.`
        : "اقرأ مقالاتنا حول التغذية والتدريب والصحة.",
  },
  toolbar: {
    searchPlaceholder: "ابحث عن مقالات...",
    filterLabel: "تصفية حسب الفئة",
    allCategories: "جميع الفئات",
    showing: (total: number) => `عرض ${total} مقالات`,
  },
  post: {
    readingTime: (min: number) => `${min} دقائق قراءة`,
    publishedAt: (date: string) => `نُشر في ${date}`,
    by: (author: string) => `بواسطة ${author}`,
    back: "العودة إلى الأخبار",
    readMore: "اقرأ المزيد",
    attachmentsLabel: "المرفقات",
  },
  comments: {
    title: (count: number) => `التعليقات (${count})`,
    writeTitle: "اترك تعليقاً",
    namePlaceholder: "اسمك",
    commentPlaceholder: "تعليقك...",
    submit: "إرسال التعليق",
    submitting: "جاري الإرسال...",
    success: "تم إرسال التعليق للمراجعة",
    error: "خطأ في إرسال التعليق",
    validation: "أكمل جميع الحقول",
    pending: "قيد الانتظار",
    whatsappTitle: "تعليق جديد",
    submitWhatsappTemplate: (name: string, comment: string, postSlug: string) =>
      `أرغب في التعليق على المقال "${postSlug}": ${name} - ${comment}`,
    whatsappTemplate: (
      name: string,
      comment: string,
      postSlug: string,
      baseUrl: string,
    ) =>
      `👋 *مرحباً ${name}، شكراً لتعليقك!*

لقد تلقينا مشاركتك في مدونتنا:

• *المقال:* ${baseUrl}/news/${postSlug}
• *التعليق:* "${comment}"

سيتم مراجعة تعليقك ونشره قريباً. شكراً لكونك جزءاً من مجتمعنا!

*${brand.name}*`,
  },
  og: {
    fallbackTitle: "أخبار",
  },
};
