import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconBarbell, IconBolt, IconShieldCheck, IconPackage, IconClock, IconHeadset } from "@tabler/icons-react";

const features = [
  {
    icon: IconBolt,
    title: "Entrega rápida",
    description: "Recibe tus productos en 24-48 horas",
  },
  {
    icon: IconShieldCheck,
    title: "Calidad garantizada",
    description: "Productos de las mejores marcas",
  },
  {
    icon: IconBarbell,
    title: "Profesional",
    description: "Asesoría personalizada para tu entrenamiento",
  },
];

const benefits = [
  {
    icon: IconPackage,
    title: "Envío gratis",
    description: "En pedidos mayores a $50",
  },
  {
    icon: IconClock,
    title: "Atención 24/7",
    description: "Estamos siempre disponibles",
  },
  {
    icon: IconHeadset,
    title: "Soporte técnico",
    description: "Te ayudamos con cualquier duda",
  },
];

export function Hero() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/30 to-muted/10 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Tienda en línea por WhatsApp
            </h1>
            <p className="mx-auto mt-6 text-lg text-muted-foreground md:text-xl">
              Productos de calidad para tu día a día. Compra fácil y rápido por WhatsApp.
              Entrega rápida y atención personalizada.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tienda">
                <Button size="lg">
                  Ver tienda
                  <IconArrowRight className="ml-2 size-4" data-icon="inline-end" />
                </Button>
              </Link>
              <Link href="/contacto">
                <Button size="lg" variant="outline">
                  Contactanos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-background"
              >
                <feature.icon className="size-10 text-primary mb-4" />
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">¿Por qué elegirnos?</h2>
            <p className="mt-2 text-muted-foreground">
              Nos diferenciamos por nuestro compromiso con tu éxito
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6"
              >
                <benefit.icon className="size-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg">{benefit.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">¿Listo para empezar?</h2>
            <p className="mt-4 text-muted-foreground">
              Explora nuestra tienda y encuentra los productos perfectos para tu entrenamiento.
            </p>
            <div className="mt-8">
              <Link href="/tienda">
                <Button size="lg">
                  Ver todos los productos
                  <IconArrowRight className="ml-2 size-4" data-icon="inline-end" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}