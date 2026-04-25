"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import notificationService from "@/lib/modules/notification"
import { form } from "@/lib/config/site"

interface ContactFormData {
  nombre: string
  email: string
  mensaje: string
}

interface ContactFormProps {
  className?: string
}

const t = form.contact

export function ContactForm({ className }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const contactForm = useForm<ContactFormData>({
    defaultValues: {
      nombre: "",
      email: "",
      mensaje: "",
    },
  })

  async function onSubmit(values: ContactFormData) {
    setLoading(true)
    
    try {
      const res = await fetch("/api/v1/formulario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (res.ok) {
        notificationService.success(t.notifications.success)
        setSubmitted(true)
        contactForm.reset()
      } else {
        notificationService.error(t.notifications.error)
      }
    } catch (e) {
      console.error("Error al enviar formulario:", e)
      notificationService.error(t.notifications.network)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="p-6 text-center">
        <p className="text-lg font-medium">{t.success.title}</p>
        <p className="mt-2 text-muted-foreground">
          {t.success.description}
        </p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => setSubmitted(false)}
        >
          {t.success.button}
        </Button>
      </Card>
    )
  }

  return (
    <Form {...contactForm}>
      <form onSubmit={contactForm.handleSubmit(onSubmit)} className={className}>
        <div className="space-y-4">
          <FormField
            control={contactForm.control}
            name="nombre"
            rules={{ required: t.name.required, minLength: { value: 2, message: t.name.minLength } }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.name.label}</FormLabel>
                <FormControl>
                  <Input placeholder={t.name.placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={contactForm.control}
            name="email"
            rules={{ 
              required: t.email.required,
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t.email.invalid }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.email.label}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder={t.email.placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={contactForm.control}
            name="mensaje"
            rules={{ required: t.message.required, minLength: { value: 10, message: t.message.minLength } }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.message.label}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t.message.placeholder} rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t.submitting : t.submit}
          </Button>
        </div>
      </form>
    </Form>
  )
}
