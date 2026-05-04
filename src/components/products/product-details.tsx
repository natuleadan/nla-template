"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ShareDialog } from "@/components/ui/share-dialog";
import { PageHeader } from "@/components/layout/page-header";
import {
  IconBrandWhatsapp,
  IconArrowLeft,
  IconStar,
  IconMapPin,
  IconCalendar,
} from "@tabler/icons-react";
import { BlogAttachments } from "@/components/blog/blog-attachments";
import type { Review } from "@/lib/modules/reviews";
import type { InventoryItem } from "@/lib/config/data/inventory";
import { useLang } from "@/lib/locale/context";
import { getConfig, getDateLocale } from "@/lib/locale/config";
import { useWhatsApp } from "@/components/whatsapp-provider";

const FALLBACK_IMAGE = "/design/fallback.svg";

interface ProductReview {
  id: string;
  name: string;
  comment: string;
  rating: number;
  createdAt: string;
  status: "pending" | "published";
}

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  category: string;
  type?: "product" | "service";
  appointment?: boolean;
  image?: string;
  images?: string[];
  quantity: number;
  unit: string;
  reviews: Review[];
  attachments?: Array<{ name: string; url: string; size?: string }>;
}

interface ProductDetailsProps {
  product: Product;
  initialInventory: InventoryItem[];
}

function StarRating({
  rating,
  setRating,
}: {
  rating: number;
  setRating?: (r: number) => void;
}) {
  const lang = useLang();
  const cfg = getConfig(lang);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating?.(star)}
          className={`${star <= rating ? "text-yellow-500" : "text-muted"} hover:scale-110 transition p-1`}
          aria-label={cfg.store.product.starAriaLabel(star)}
        >
          <IconStar className="size-6 fill-current" />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const lang = useLang();
  const cfg = getConfig(lang);
  const dateLocale = getDateLocale(lang);
  const date = new Date(review.createdAt).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{review.name}</span>
        <div className="flex items-center gap-2">
          {review.status === "pending" && (
            <Badge variant="outline" className="text-xs">
              {cfg.store.reviews.pending}
            </Badge>
          )}
          <StarRating rating={review.rating} />
        </div>
      </div>
      <p className="text-muted-foreground text-sm">{review.comment}</p>
      <span className="text-xs text-muted-foreground">{date}</span>
    </div>
  );
}

export function ProductDetails({
  product: initialProduct,
  initialInventory,
}: ProductDetailsProps) {
  const lang = useLang();
  const cfg = getConfig(lang);
  const [product] = useState(initialProduct);
  const [inventory] = useState(initialInventory);
  const { openWhatsApp } = useWhatsApp();
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [currentImage, setCurrentImage] = useState(1);

  const reviews = product.reviews || [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const totalInventory = inventory.reduce((sum, loc) => sum + loc.available, 0);

  const handleCarouselApi = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCurrentImage(api.selectedScrollSnap() + 1);
    api.on("select", () => setCurrentImage(api.selectedScrollSnap() + 1));
  }, []);

  const handlePedir = () => {
    const mensaje = cfg.store.product.whatsappTemplate(product);
    openWhatsApp({
      message: mensaje,
      title: product.name,
      productId: product.slug,
      productName: product.name,
    });
  };

  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(0);

  const handleSubmitReview = () => {
    if (!reviewName || !reviewComment || reviewRating === 0) return;
    const msg = cfg.store.reviews.submitWhatsappTemplate(
      reviewName,
      reviewRating,
      reviewComment,
      product.name,
    );
    openWhatsApp({ message: msg, title: cfg.store.reviews.whatsappTitle });
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
        <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto shrink-0 sm:pt-1">
          <ShareDialog
            url={typeof window !== "undefined" ? window.location.href : ""}
            title={product.name}
            description={product.description}
            price={product.price}
          />
          <Link href={`/${lang}/store`} className="ml-auto sm:ml-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              aria-label={cfg.store.product.back}
            >
              <IconArrowLeft className="size-4" />
              {cfg.store.product.back}
            </Button>
          </Link>
        </div>
        <div className="order-2 sm:order-1 flex-1">
          <PageHeader title={product.name} description={product.description} />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mt-8">
        <div className="space-y-6">
          <div className="rounded-lg bg-muted overflow-hidden relative">
            {product.images && product.images.length > 1 ? (
              <Carousel className="w-full" setApi={handleCarouselApi}>
                <CarouselContent>
                  {product.images.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <div className="relative h-80 md:h-96">
                        <Image
                          src={fallbackUsed ? FALLBACK_IMAGE : img}
                          alt={product.name + " " + (idx + 1)}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          onError={() => {
                            if (!fallbackUsed) {
                              setFallbackUsed(true);
                            }
                          }}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
                <div className="absolute bottom-3 right-3">
                  <Badge variant="secondary" className="text-xs font-mono">
                    {currentImage}/{product.images.length}
                  </Badge>
                </div>
              </Carousel>
            ) : (
              <div className="relative h-80 md:h-96">
                <Image
                  src={
                    fallbackUsed
                      ? FALLBACK_IMAGE
                      : product.image || FALLBACK_IMAGE
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={() => {
                    if (!fallbackUsed) {
                      setFallbackUsed(true);
                    }
                  }}
                />
              </div>
            )}
          </div>
          {product.attachments && product.attachments.length > 0 && (
            <BlogAttachments attachments={product.attachments} />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Badge
              variant={
                product.category === "suplemento"
                  ? "default"
                  : product.category === "servicio"
                    ? "outline"
                    : "secondary"
              }
            >
              {cfg.store.product.badge(product.category)}
            </Badge>
          </div>

          <div>
            <span className="text-2xl font-bold">
              ${product.price.toFixed(2)}
            </span>
            <p className="text-sm text-muted-foreground">
              {cfg.store.product.priceLabel}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              {cfg.store.product.contentLabel}
            </span>
            <span className="font-medium">
              {product.quantity} {product.unit}
            </span>
          </div>

          {inventory.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2">
                <IconMapPin className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {cfg.store.product.availabilityLabel}
                </span>
                <Badge
                  variant={totalInventory > 10 ? "default" : "destructive"}
                >
                  {totalInventory > 10
                    ? cfg.store.product.inStock
                    : cfg.store.product.lowStock}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {inventory.map((loc, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {loc.location}: {loc.available}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {product.longDescription && (
            <p className="text-muted-foreground mt-2">
              {product.longDescription}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              onClick={handlePedir}
              className="gap-2"
              aria-label={`${cfg.store.product.orderWhatsApp} ${product.name}`}
            >
              <IconBrandWhatsapp className="size-5" />
              {cfg.store.product.orderWhatsApp}
            </Button>
            {(product.type === "service" || product.appointment) && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={() =>
                  (window.location.href = `/${lang}/schedule?producto=${product.slug}`)
                }
              >
                <IconCalendar className="size-5" />
                {product.type === "service"
                  ? cfg.store.product.agendaService
                  : cfg.store.product.separateProduct}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">
          {cfg.store.reviews.title(product.reviews.length)}
        </h2>

        {product.reviews.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={Math.round(avgRating)} />
            <span className="text-sm text-muted-foreground">
              {cfg.store.reviews.summary(avgRating, product.reviews.length)}
            </span>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {product.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        <div className="border rounded-lg p-4 space-y-4 mt-6">
          <h3 className="font-medium">{cfg.store.reviews.writeTitle}</h3>

          <div className="flex flex-col sm:flex-row gap-4">
            <Input name="review-name"
              placeholder={cfg.store.reviews.namePlaceholder}
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              className="w-full sm:max-w-xs"
              aria-label={cfg.store.reviews.namePlaceholder}
            />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className={`${star <= reviewRating ? "text-yellow-500" : "text-muted"} hover:scale-110 transition p-1`}
                  aria-label={cfg.store.product.starAriaLabel(star)}
                >
                  <IconStar className="size-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <Textarea name="review-comment"
            placeholder={cfg.store.reviews.commentPlaceholder}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            rows={3}
            aria-label={cfg.store.reviews.commentPlaceholder}
          />

          <Button
            onClick={handleSubmitReview}
            disabled={!reviewName || !reviewComment || reviewRating === 0}
          >
            <IconBrandWhatsapp className="size-4 mr-2" />
            {cfg.store.reviews.submit}
          </Button>
        </div>
      </div>
    </div>
  );
}
