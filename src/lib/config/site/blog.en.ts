import { brand } from "../data/brand";

export const blog = {
  page: {
    title: "Blog",
    description: "Articles about nutrition, training and health",
    empty: "No articles available",
    metaTitle: (count: number) => `Blog (${count} articles) | ${brand.name}`,
    metaDescription: (count: number) =>
      count > 0
        ? `Read our ${count} articles about nutrition, training and health.`
        : "Read our articles about nutrition, training and health.",
  },
  toolbar: {
    searchPlaceholder: "Search articles...",
    filterLabel: "Filter by category",
    allCategories: "All categories",
    showing: (total: number) => `Showing ${total} articles`,
  },
  post: {
    readingTime: (min: number) => `${min} min read`,
    publishedAt: (date: string) => `Published on ${date}`,
    by: (author: string) => `By ${author}`,
    back: "Back to blog",
    readMore: "Read more",
  },
  comments: {
    title: (count: number) => `Comments (${count})`,
    writeTitle: "Leave a comment",
    namePlaceholder: "Your name",
    commentPlaceholder: "Your comment...",
    submit: "Submit comment",
    submitting: "Submitting...",
    success: "Submitting comment for review",
    error: "Error submitting comment",
    validation: "Please fill in all fields",
    pending: "Pending",
    whatsappTitle: "New comment",
    whatsappTemplate: (name: string, comment: string, postSlug: string, baseUrl: string) =>
      `👋 *Hi ${name}, thanks for your comment!*

We have received your contribution on our blog:

• *Article:* ${baseUrl}/blog/${postSlug}
• *Comment:* "${comment}"

Your comment will be reviewed and published soon. Thank you for being part of our community!

*${brand.name}*`,
  },
  og: {
    fallbackTitle: "Blog",
  },
};
