"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blog } from "@/lib/config/site";
import { IconArrowRight, IconClock, IconUser, IconCalendar } from "@tabler/icons-react";

const FALLBACK_IMAGE = "/design/fallback.svg";

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  category: string;
  publishedAt: string;
  readingTime: number;
}

export function PostCard({
  slug,
  title,
  excerpt,
  image,
  author,
  category,
  publishedAt,
  readingTime,
}: PostCardProps) {
  const [imgSrc, setImgSrc] = useState(image || FALLBACK_IMAGE);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  return (
    <Card className="flex flex-col h-full overflow-hidden gap-0">
      <Link
        href={`/blog/${slug}`}
        className="block relative aspect-video overflow-hidden"
      >
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-cover transition-transform hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => {
            if (!fallbackUsed) {
              setFallbackUsed(true);
              setImgSrc(FALLBACK_IMAGE);
            }
          }}
        />
      </Link>
      <CardHeader className="pb-2 px-4 pt-4">
        <Badge variant="secondary" className="w-fit mb-2">
          {category}
        </Badge>
        <CardTitle className="text-lg line-clamp-2">
          <Link href={`/blog/${slug}`} className="hover:underline">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 px-4 pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {excerpt}
        </p>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-2 flex flex-col gap-3">
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground w-full">
          <span className="flex items-center gap-1">
            <IconUser className="size-3" />
            {blog.post.by(author)}
          </span>
          <span className="flex items-center gap-1">
            <IconCalendar className="size-3" />
            {publishedAt}
          </span>
          <span className="flex items-center gap-1">
            <IconClock className="size-3" />
            {blog.post.readingTime(readingTime)}
          </span>
        </div>
        <Link href={`/blog/${slug}`} className="w-full">
          <Button variant="outline" className="gap-2 w-full">
            {blog.post.readMore}
            <IconArrowRight className="size-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
