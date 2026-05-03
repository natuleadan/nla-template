import { brand } from "../data/brand";
import { categoryBadge } from "../data/categories.en";

export { categoryBadge };

export const store = {
  page: {
    title: "Our Store",
    description: "Find the best products for your home and office",
    empty: "No products available",
    metaTitle: (count: number) => `Store (${count} products) | ${brand.name}`,
    metaDescription: (count: number) =>
      count > 0
        ? `Explore our selection of ${count} products.`
        : "Explore our selection of products.",
  },
  toolbar: {
    searchPlaceholder: "Search products...",
    filterLabel: "Filter by category",
    allCategories: "All categories",
    showing: (total: number) => `Showing ${total} products`,
  },
  product: {
    badge: (category: string) =>
      categoryBadge[category] || category,
    priceLabel: "Tax included",
    pedir: "Order",
    ver: "Details",
    back: "Back to store",
    contentLabel: "Content:",
    availabilityLabel: "Availability:",
    inStock: "In stock",
    lowStock: "Limited stock",
    orderWhatsApp: "Order via WhatsApp",
    agendaService: "Schedule this service",
    separateProduct: "Reserve this product",
    whatsappTemplate: (p: {
      name: string;
      price: number;
      category: string;
      quantity: number;
      unit: string;
    }) =>
      `👋 *Hi! Thanks for your interest in ${brand.name}*

We have received your inquiry about the following product:

• *Product:* ${p.name}
• *Price:* $${p.price.toFixed(2)}
• *Presentation:* ${p.quantity} ${p.unit}

How can we help you? Let us know if you need more details or would like to place your order.

*Business hours:* Monday to Friday from 9:00 AM to 6:00 PM

Best regards,
*${brand.name}*`,
    whatsappCompact: (name: string, price: number) =>
      `👋 *Thanks for your interest in ${brand.name}!*

We received your inquiry about:

• *Product:* ${name}
• *Price:* $${price.toFixed(2)}

Would you like more information or proceed with your order? Write to us and we'll assist you.

Best regards,
*${brand.name}*`,
    starAriaLabel: (star: number) => `${star} stars`,
  },
  reviews: {
    title: (count: number) => `Reviews (${count})`,
    summary: (avg: number, count: number) =>
      `${avg.toFixed(1)} out of 5 (${count} reviews)`,
    writeTitle: "Write a review",
    namePlaceholder: "Your name",
    commentPlaceholder: "Your comment...",
    submit: "Submit review",
    submitting: "Submitting...",
    success: "Submitting review for approval",
    error: "Error submitting review",
    validation: "Please fill in all fields",
    pending: "Pending",
    whatsappTitle: "New review",
    whatsappTemplate: (name: string, comment: string, rating: number, productSlug: string, baseUrl: string) =>
      `👋 *Hi ${name}, thanks for your review!*

We have received your rating for the product:

• *Product:* ${baseUrl}/store/${productSlug}
• *Rating:* ${"⭐".repeat(rating)} ${rating}/5
• *Comment:* "${comment}"

Your review will be reviewed and published soon. Thank you for helping us improve!

*${brand.name}*`,
  },
  cart: {
    title: "Shopping Cart",
    empty: "Your cart is empty",
    itemsCount: (count: number) =>
      `${count} item${count > 1 ? "s" : ""} in your cart`,
    perUnit: (price: number) => `$${price.toFixed(2)} each`,
    subtotal: (price: number) => `Subtotal: $${price.toFixed(2)}`,
    delete: "Remove",
    total: "Total:",
    orderWhatsApp: "Order via WhatsApp",
    openAriaLabel: "Open cart",
    decreaseAriaLabel: (name: string) => `Decrease quantity of ${name}`,
    increaseAriaLabel: (name: string) => `Increase quantity of ${name}`,
    removeAriaLabel: (name: string) => `Remove ${name} from cart`,
    whatsappTemplate: (items: string, total: number) =>
      `🛒 *Hi! Thanks for your order at ${brand.name}*

We have received your request with the following products:

*Items:*\n${items}

*Total:* $${total.toFixed(2)}

Do you confirm this order? We'll get back to you to coordinate payment and delivery.

*Business hours:* Monday to Friday from 9:00 AM to 6:00 PM

Best regards,
*${brand.name}*`,
  },
};
