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
import { useLang } from "@/lib/locale/context";
import { getConfig } from "@/lib/locale/config";
import { useWhatsApp } from "@/components/whatsapp-provider";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

export function ProductCard({
  id,
  slug,
  name,
  description,
  price,
  category,
  image,
}: ProductCardProps) {
  const lang = useLang();
  const cfg = getConfig(lang);
  const [imgSrc, setImgSrc] = useState(image || FALLBACK_IMAGE);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const { openWhatsApp } = useWhatsApp();

  const handlePedir = () => {
    const mensaje = cfg.store.product.whatsappCompact(name, price);
    openWhatsApp({ message: mensaje, title: name, productName: name });
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden gap-3 sm:gap-4 py-3 sm:py-4">
      <CardHeader className="pb-2 px-3 sm:px-4">
        <CardTitle className="text-lg line-clamp-1">{name}</CardTitle>
        <CardDescription className="line-clamp-1">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative aspect-[3/4] lg:aspect-square">
        <Link
          href={`/${lang}/store/${slug}`}
          className="block absolute inset-0"
        >
          <Image
            src={imgSrc}
            alt={name}
            fill
            loading="lazy"
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
          <Badge
            variant={
              category === "suplemento"
                ? "default"
                : category === "servicio"
                  ? "outline"
                  : "secondary"
            }
          >
            {cfg.store.product.badge(category)}
          </Badge>
        </div>
        <div className="absolute bottom-0 right-0 z-10 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <span className="text-lg font-bold">${price.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground ml-1">
            {cfg.store.product.priceLabel}
          </span>
        </div>
      </CardContent>
      <CardFooter className="px-3 sm:px-4 py-2">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1 gap-1 border-success text-success hover:bg-success/10"
            aria-label={`${cfg.store.product.pedir} ${name}`}
            onClick={handlePedir}
          >
            <IconBrandWhatsapp className="size-4" />
            {cfg.store.product.pedir}
          </Button>
          <Link href={`/${lang}/store/${slug}`} className="flex-1">
            <Button
              variant="outline"
              className="gap-1 w-full"
              aria-label={`${cfg.store.product.ver} ${name}`}
            >
              <IconEye className="size-4" />
              {cfg.store.product.ver}
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
