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
import { IconBrandWhatsapp, IconEye } from "@tabler/icons-react";

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
    <Card className="flex flex-col h-full overflow-hidden gap-3 sm:gap-4 py-3 sm:py-4">
      <CardHeader className="pb-2 px-3 sm:px-4">
        <CardTitle className="text-lg line-clamp-1">{name}</CardTitle>
        <CardDescription className="line-clamp-1">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative aspect-[3/4] lg:aspect-square">
        <Link href={`/tienda/${slug}`} className="block absolute inset-0">
              <Image
                src={imgSrc}
                alt={name}
                fill
                loading="eager"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => {
                  if (!fallbackUsed) {
                    setFallbackUsed(true);
                    setImgSrc(FALLBACK_IMAGE);
                  }
                }}
              />
        </Link>
        <div className="absolute top-2 left-2 z-10">
          <Badge variant={category === "suplemento" ? "default" : "secondary"}>
            {store.product.badge(category)}
          </Badge>
        </div>
        <div className="absolute bottom-0 right-0 z-10 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <span className="text-lg font-bold">${price.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground ml-1">{store.product.priceLabel}</span>
        </div>
      </CardContent>
      <CardFooter className="px-3 sm:px-4 py-2">
        <div className="flex gap-2 w-full">
          <div className="flex-1">
            <Button onClick={handlePedir} variant="outline" className="gap-1 w-full border-green-600 text-green-700 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950">
              <IconBrandWhatsapp className="size-4" data-icon="inline-start" />
              {store.product.pedir}
            </Button>
          </div>
          <Link href={`/tienda/${slug}`} className="flex-1">
            <Button variant="outline" className="gap-1 w-full">
              <IconEye className="size-4" data-icon="inline-start" />
              {store.product.ver}
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
