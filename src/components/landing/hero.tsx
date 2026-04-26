import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconBarbell,
  IconBolt,
  IconShieldCheck,
  IconPackage,
  IconClock,
  IconHeadset,
} from "@tabler/icons-react";
import { home } from "@/lib/config/site";

const features = [
  { icon: IconBolt, ...home.features.items[0] },
  { icon: IconShieldCheck, ...home.features.items[1] },
  { icon: IconBarbell, ...home.features.items[2] },
];

const benefits = [
  { icon: IconPackage, ...home.benefits[0] },
  { icon: IconClock, ...home.benefits[1] },
  { icon: IconHeadset, ...home.benefits[2] },
];

export function Hero() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/30 to-muted/10 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {home.hero.title}
            </h1>
            <p className="mx-auto mt-6 text-lg text-muted-foreground md:text-xl">
              {home.hero.subtitle}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tienda">
                <Button size="lg">
                  {home.hero.cta.primary}
                  <IconArrowRight
                    className="ml-2 size-4"
                    data-icon="inline-end"
                  />
                </Button>
              </Link>
              <Link href="/contacto">
                <Button size="lg" variant="outline">
                  {home.hero.cta.secondary}
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
            <h2 className="text-3xl font-bold tracking-tight">
              {home.features.title}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {home.features.subtitle}
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
            <h2 className="text-3xl font-bold tracking-tight">
              {home.cta.title}
            </h2>
            <p className="mt-4 text-muted-foreground">{home.cta.description}</p>
            <div className="mt-8">
              <Link href="/tienda">
                <Button size="lg">
                  {home.cta.button}
                  <IconArrowRight
                    className="ml-2 size-4"
                    data-icon="inline-end"
                  />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
