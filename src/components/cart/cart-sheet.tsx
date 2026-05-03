"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  IconShoppingCart,
  IconPlus,
  IconMinus,
  IconTrash,
} from "@tabler/icons-react";
import { useLang } from "@/lib/locale/context";
import { getConfig } from "@/lib/locale/config";
import { useWhatsApp } from "@/components/whatsapp-provider";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartSheetProps {
  children?: React.ReactNode;
}

export function CartSheet({ children }: CartSheetProps) {
  const lang = useLang();
  const cfg = getConfig(lang);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const { openWhatsApp } = useWhatsApp();

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i)),
    );
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) return;

    const itemsList = cartItems
      .map(
        (item) =>
          `- ${item.name} x${item.quantity}: $${(item.price * item.quantity).toFixed(2)}`,
      )
      .join("\n");

    const mensaje = cfg.store.cart.whatsappTemplate(itemsList, total);
    openWhatsApp({
      message: mensaje,
      title: cfg.store.cart.title,
      productName: "carrito",
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="icon"
            className="relative"
            aria-label={cfg.store.cart.openAriaLabel}
          >
            <IconShoppingCart className="size-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 min-w-5 h-5 px-1 flex items-center justify-center text-[10px]">
                {totalItems}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{cfg.store.cart.title}</SheetTitle>
          <SheetDescription>
            {cartItems.length > 0
              ? cfg.store.cart.itemsCount(totalItems)
              : cfg.store.cart.empty}
          </SheetDescription>
        </SheetHeader>

        <div className="py-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8" role="status" aria-live="polite">
              <IconShoppingCart className="size-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">{cfg.store.cart.empty}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {cfg.store.cart.perUnit(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          aria-label={cfg.store.cart.decreaseAriaLabel(
                            item.name,
                          )}
                        >
                          <IconMinus className="size-4" />
                        </Button>
                        <span
                          className="w-10 text-center font-medium"
                          aria-live="polite"
                        >
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          aria-label={cfg.store.cart.increaseAriaLabel(
                            item.name,
                          )}
                        >
                          <IconPlus className="size-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">
                        {cfg.store.cart.subtotal(item.price * item.quantity)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={cfg.store.cart.removeAriaLabel(item.name)}
                      >
                        <IconTrash className="size-4 mr-1" />
                        {cfg.store.cart.delete}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-medium">{cfg.store.cart.total}</span>
                <span className="text-xl font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <SheetFooter>
            <Button
              size="lg"
              className="w-full gap-2"
              onClick={handleWhatsAppOrder}
            >
              <IconShoppingCart className="size-5" />
              {cfg.store.cart.orderWhatsApp}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CartSheet;
