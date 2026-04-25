"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconBrandWhatsapp, IconArrowRight } from "@tabler/icons-react";

const FALLBACK_IMAGE = "/design/fallback.svg";
import { getWhatsappNumber } from "@/lib/config/env";
import notificationService from "@/lib/modules/notification";
import { store, ui } from "@/lib/config/site";

const WHATSAPP_NUMBER = getWhatsappNumber();

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

export function ProductCard({ id, slug, name, description, price, category, image }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(image || FALLBACK_IMAGE);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  const handlePedir = () => {
    notificationService.info(ui.openingWhatsApp);
    
    const mensaje = store.product.whatsappCompact(name, price, category);
    const urlWhatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsapp, "_blank");
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-1">{name}</CardTitle>
          <Badge variant={category === "suplemento" ? "default" : "secondary"}>
            {store.product.badge(category)}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Link href={`/tienda/${slug}`} className="block">
          <div className="relative h-40 w-full rounded-lg bg-muted overflow-hidden transition hover:opacity-90">
              <Image
                src={imgSrc}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => {
                  if (!fallbackUsed) {
                    setFallbackUsed(true);
                    setImgSrc(FALLBACK_IMAGE);
                  }
                }}
              />
          </div>
        </Link>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-lg font-bold">${price.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground">{store.product.priceLabel}</span>
        </div>
        <div className="flex gap-1">
          <Button onClick={handlePedir} size="sm" variant="secondary" className="gap-1">
            <IconBrandWhatsapp className="size-4" data-icon="inline-start" />
            {store.product.pedir}
          </Button>
          <Link href={`/tienda/${slug}`}>
            <Button size="sm" variant="outline" className="gap-1">
              <IconArrowRight className="size-4" data-icon="inline-start" />
              {store.product.ver}
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
