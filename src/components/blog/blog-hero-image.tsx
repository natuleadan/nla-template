"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK_IMAGE = "/design/fallback.svg";

interface BlogHeroImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export function BlogHeroImage({ src, alt, priority }: BlogHeroImageProps) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover"
      priority={priority}
      sizes="(max-width: 1024px) 100vw, 896px"
      onError={() => {
        if (!fallbackUsed) {
          setFallbackUsed(true);
          setImgSrc(FALLBACK_IMAGE);
        }
      }}
    />
  );
}
