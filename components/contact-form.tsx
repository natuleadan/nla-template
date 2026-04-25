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

interface ContactFormData {
  nombre: string
  email: string
  mensaje: string
}

interface ContactFormProps {
  className?: string
}

export function ContactForm({ className }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<ContactFormData>({
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
        notificationService.success("Mensaje enviado correctamente!")
        setSubmitted(true)
        form.reset()
      } else {
        notificationService.error("Error al enviar el mensaje")
      }
    } catch (e) {
      console.error("Error al enviar formulario:", e)
      notificationService.error("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="p-6 text-center">
        <p className="text-lg font-medium">¡Mensaje enviado!</p>
        <p className="mt-2 text-muted-foreground">
          Gracias por contactarnos. Te responderemos en breve.
        </p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => setSubmitted(false)}
        >
          Enviar otro mensaje
        </Button>
      </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="nombre"
            rules={{ required: "Nombre es requerido", minLength: { value: 2, message: "Mínimo 2 caracteres" } }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Tu nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            rules={{ 
              required: "Email es requerido",
              pattern: { value: /^[^s@]+@[^s@]+.[^s@]+$/, message: "Email inválido" }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="tu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mensaje"
            rules={{ required: "Mensaje es requerido", minLength: { value: 10, message: "Mínimo 10 caracteres" } }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensaje</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tu mensaje..." rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar mensaje"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
