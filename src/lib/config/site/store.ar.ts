import { brand } from "../data/brand.ar";
import { categoryBadge } from "../data/categories.ar";

export { categoryBadge };

export const store = {
  page: {
    title: "متجرنا",
    description: "اعثر على أفضل المنتجات لمنزلك ومكتبك",
    empty: "لا توجد منتجات متاحة",
    metaTitle: (count: number) => `المتجر (${count} منتجات) | ${brand.name}`,
    metaDescription: (count: number) =>
      count > 0
        ? `تصفح مجموعتنا المختارة من ${count} منتجات.`
        : "تصفح مجموعتنا المختارة من المنتجات.",
  },
  toolbar: {
    searchPlaceholder: "ابحث عن منتجات...",
    filterLabel: "تصفية حسب الفئة",
    allCategories: "جميع الفئات",
    showing: (total: number) => `عرض ${total} منتجات`,
  },
  product: {
    badge: (category: string) => categoryBadge[category] || category,
    priceLabel: "شامل ضريبة القيمة المضافة",
    pedir: "اطلب",
    ver: "تفاصيل",
    back: "العودة إلى المتجر",
    contentLabel: "المحتوى:",
    availabilityLabel: "التوفر:",
    inStock: "متوفر",
    lowStock: "مخزون محدود",
    orderWhatsApp: "اطلب عبر واتساب",
    agendaService: "احجز هذه الخدمة",
    separateProduct: "احجز هذا المنتج",
    whatsappTemplate: (p: {
      name: string;
      price: number;
      category: string;
      quantity: number;
      unit: string;
    }) =>
      `👋 *مرحباً! شكراً لاهتمامك بـ ${brand.name}*

لقد تلقينا طلب معلوماتك حول المنتج التالي:

• *المنتج:* ${p.name}
• *السعر:* $${p.price.toFixed(2)}
• *العرض:* ${p.quantity} ${p.unit}

كيف يمكننا مساعدتك؟ أخبرنا إذا كنت ترغب في مزيد من التفاصيل أو تقديم طلبك.

*ساعات العمل:* الإثنين إلى الجمعة من 9:00 صباحاً إلى 6:00 مساءً

مع التحية،
*${brand.name}*`,
    whatsappCompact: (name: string, price: number) =>
      `👋 *شكراً لاهتمامك بـ ${brand.name}!*

تلقينا استفسارك حول:

• *المنتج:* ${name}
• *السعر:* $${price.toFixed(2)}

هل ترغب في مزيد من المعلومات أو متابعة طلبك؟ راسلنا وسنقوم بخدمتك.

مع التحية،
*${brand.name}*`,
    starAriaLabel: (star: number) => `${star} نجوم`,
    attachmentsLabel: "المرفقات",
    inventorySummary: (total: number, locations: number) =>
      `${total} وحدة في ${locations} ${locations === 1 ? "موقع" : "مواقع"}`,
    addToCart: "السلة",
    addedToCart: "أضيف إلى السلة",
  },
  reviews: {
    title: (count: number) => `التقييمات (${count})`,
    summary: (avg: number, count: number) =>
      `${avg.toFixed(1)} من 5 (${count} تقييمات)`,
    writeTitle: "اكتب تقييماً",
    namePlaceholder: "اسمك",
    commentPlaceholder: "تعليقك...",
    submit: "إرسال التقييم",
    submitting: "جاري الإرسال...",
    success: "تم إرسال التقييم للمراجعة",
    error: "خطأ في إرسال التقييم",
    validation: "أكمل جميع الحقول",
    pending: "قيد الانتظار",
    whatsappTitle: "تقييم جديد",
    submitWhatsappTemplate: (
      name: string,
      rating: number,
      comment: string,
      productName: string,
    ) =>
      `أرغب في ترك تقييم للمنتج *${productName}*: ${rating}★ - ${comment}`,
    whatsappTemplate: (
      name: string,
      comment: string,
      rating: number,
      productSlug: string,
      baseUrl: string,
    ) =>
      `👋 *مرحباً ${name}، شكراً لتقييمك!*

لقد تلقينا تقييمك للمنتج:

• *المنتج:* ${baseUrl}/store/${productSlug}
• *التقييم:* ${"⭐".repeat(rating)} ${rating}/5
• *التعليق:* "${comment}"

سيتم مراجعة تقييمك ونشره قريباً. شكراً لمساعدتنا في التحسين!

*${brand.name}*`,
  },
  cart: {
    title: "سلة التسوق",
    empty: "سلتك فارغة",
    itemsCount: (count: number) =>
      `${count} ${count > 1 ? "منتجات" : "منتج"} في سلتك`,
    perUnit: (price: number) => `$${price.toFixed(2)} للوحدة`,
    subtotal: (price: number) => `المجموع الفرعي: $${price.toFixed(2)}`,
    delete: "حذف",
    includesTax: "شامل ضريبة القيمة المضافة",
    excludesShipping: "لا يشمل الشحن",
    total: "الإجمالي:",
    orderWhatsApp: "اطلب عبر واتساب",
    openAriaLabel: "فتح السلة",
    decreaseAriaLabel: (name: string) => `تقليل كمية ${name}`,
    increaseAriaLabel: (name: string) => `زيادة كمية ${name}`,
    removeAriaLabel: (name: string) => `إزالة ${name} من السلة`,
    whatsappTemplate: (items: string, total: number) =>
      `🛒 *مرحباً! شكراً لطلبك من ${brand.name}*

لقد تلقينا طلبك بالمنتجات التالية:

*العناصر:*\n${items}

*الإجمالي:* $${total.toFixed(2)}

هل تؤكد هذا الطلب؟ سنرد عليك لتنسيق الدفع والتوصيل.

*ساعات العمل:* الإثنين إلى الجمعة من 9:00 صباحاً إلى 6:00 مساءً

مع التحية،
*${brand.name}*`,
  },
};
