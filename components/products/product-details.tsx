"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { IconBrandWhatsapp, IconArrowLeft, IconStar, IconSend, IconLoader2, IconMapPin } from "@tabler/icons-react";
import { createReview, type Review } from "@/lib/modules/reviews";
import { type InventoryItem } from "@/lib/modules/inventory";
import { getWhatsappNumber } from "@/lib/config/env";
import notificationService from "@/lib/modules/notification";
import { store, ui } from "@/lib/config/site";

const FALLBACK_IMAGE = "/design/fallback.svg";

interface ProductReview {
  id: string;
  name: string;
  comment: string;
  rating: number;
  createdAt: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  category: "suplemento" | "comida";
  image?: string;
  images?: string[];
  quantity: number;
  unit: string;
  reviews: Review[];
}

interface ProductDetailsProps {
  product: Product;
  initialInventory: InventoryItem[];
}

function StarRating({ rating, setRating }: { rating: number; setRating?: (r: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating?.(star)}
          className={`${star <= rating ? "text-yellow-500" : "text-muted"} hover:scale-110 transition`}
        >
          <IconStar className="size-5 fill-current" />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{review.name}</span>
        <StarRating rating={review.rating} />
      </div>
      <p className="text-muted-foreground text-sm">{review.comment}</p>
      <span className="text-xs text-muted-foreground">{date}</span>
    </div>
  );
}

export function ProductDetails({ product: initialProduct, initialInventory }: ProductDetailsProps) {
  const [product, setProduct] = useState(initialProduct);
  const [inventory] = useState(initialInventory);
  const [newReview, setNewReview] = useState({ name: "", comment: "", rating: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  const reviews = product.reviews || [];
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const totalInventory = inventory.reduce((sum, loc) => sum + loc.available, 0);

  const handlePedir = () => {
    notificationService.info(ui.openingWhatsApp);
    
    const mensaje = store.product.whatsappTemplate(product);
    const urlWhatsapp = `https://wa.me/${getWhatsappNumber()}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsapp, "_blank");
  };

  const handleSubmitReview = async () => {
    if (!newReview.name || !newReview.comment || newReview.rating === 0) {
      notificationService.warning(store.reviews.validation);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const savedReview = await createReview(product.slug, newReview);
      setProduct(prev => ({
        ...prev,
        reviews: [...prev.reviews, savedReview],
      }));
      setNewReview({ name: "", comment: "", rating: 0 });
      notificationService.success(store.reviews.success);
    } catch (error) {
      console.error("Error submitting review:", error);
      notificationService.error(store.reviews.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <Link href="/tienda">
          <Button variant="ghost" size="sm" className="gap-1">
            <IconArrowLeft className="size-4" />
            {store.product.back}
          </Button>
        </Link>
      </div>
      
      {product.description && (
        <p className="text-muted-foreground mb-4">{product.description}</p>
      )}
      
      <div className="grid gap-8 md:grid-cols-2 mt-8">
        <div className="rounded-lg bg-muted overflow-hidden">
          {(product.images && product.images.length > 1) ? (
            <Carousel className="w-full">
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
            </Carousel>
          ) : (
            <div className="relative h-80 md:h-96">
              <Image
                src={fallbackUsed ? FALLBACK_IMAGE : (product.image || FALLBACK_IMAGE)}
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
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Badge variant={product.category === "suplemento" ? "default" : "secondary"}>
              {store.product.badge(product.category)}
            </Badge>
          </div>
          
          <div>
            <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            <p className="text-sm text-muted-foreground">{store.product.priceLabel}</p>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{store.product.contentLabel}</span>
            <span className="font-medium">{product.quantity} {product.unit}</span>
          </div>
          
          {inventory.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2">
                <IconMapPin className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{store.product.availabilityLabel}</span>
                <Badge variant={totalInventory > 10 ? "default" : "destructive"}>
                  {totalInventory > 10 ? store.product.inStock : store.product.lowStock}
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
            <p className="text-muted-foreground mt-2">{product.longDescription}</p>
          )}
          
          <Button onClick={handlePedir} size="lg" className="gap-2 mt-4">
            <IconBrandWhatsapp className="size-5" />
            {store.product.orderWhatsApp}
          </Button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">{store.reviews.title(product.reviews.length)}</h2>
        
        {product.reviews.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={Math.round(avgRating)} />
            <span className="text-sm text-muted-foreground">
              {store.reviews.summary(avgRating, product.reviews.length)}
            </span>
          </div>
        )}
        
        <div className="grid gap-4 md:grid-cols-2">
          {product.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
        
        <div className="border rounded-lg p-4 space-y-4 mt-6">
          <h3 className="font-medium">{store.reviews.writeTitle}</h3>
          
          <div className="flex gap-4">
            <Input
              placeholder={store.reviews.namePlaceholder}
              value={newReview.name}
              onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
              className="max-w-xs"
            />
            <StarRating rating={newReview.rating} setRating={(r) => setNewReview({ ...newReview, rating: r })} />
          </div>
          
          <Textarea
            placeholder={store.reviews.commentPlaceholder}
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            rows={3}
          />
          
          <Button onClick={handleSubmitReview} disabled={isSubmitting || !newReview.name || !newReview.comment || newReview.rating === 0}>
            {isSubmitting ? <IconLoader2 className="size-4 mr-2 animate-spin" /> : <IconSend className="size-4 mr-2" />}
            {isSubmitting ? store.reviews.submitting : store.reviews.submit}
          </Button>
        </div>
      </div>
    </div>
  );
}