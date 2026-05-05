import { brand } from "../data/brand.es";

export const form = {
  contact: {
    name: {
      label: "Name",
      placeholder: "Your name",
      required: "Name is required",
      minLength: "Minimum 2 characters",
    },
    email: {
      label: "Email",
      placeholder: "you@email.com",
      required: "Email is required",
      invalid: "Invalid email",
    },
    message: {
      label: "Message",
      placeholder: "Your message...",
      required: "Message is required",
      minLength: "Minimum 10 characters",
    },
    submit: "Send message",
    submitting: "Sending...",
    success: {
      title: "Message sent!",
      description:
        "Thank you for contacting us. We will get back to you shortly.",
      button: "Send another message",
    },
    notifications: {
      success: "Message sent successfully!",
      error: "Error sending message",
      network: "Connection error",
    },
    whatsappTemplate: (name: string, email: string, message: string) =>
      `👋 *Hi ${name}, thanks for contacting us!*

We have received your message through our contact form.

*Registered information:*
• *Name:* ${name}
• *Email:* ${email}
• *Message:* ${message}

We will get back to you shortly. In the meantime, you can check out our products in our store.

*Business hours:* Monday to Friday from 9:00 AM to 6:00 PM

Best regards,
*${brand.name}*`,
  },
};
