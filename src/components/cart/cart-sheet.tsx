"use client";

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
import { Separator } from "@/components/ui/separator";
import {
  IconShoppingCart,
  IconPlus,
  IconMinus,
  IconTrash,
} from "@tabler/icons-react";
import { useLang } from "@/hooks/use-lang";
import { getConfig } from "@/lib/locale/config";
import { useWhatsApp } from "@/hooks/use-whatsapp";
import { useCartContext } from "@/components/cart/cart-context";
import { getProductMap } from "@/lib/modules/products";

interface CartSheetProps {
  children?: React.ReactNode;
}

export function CartSheet({ children }: CartSheetProps) {
  const lang = useLang();
  const cfg = getConfig(lang);
  const { items, removeItem, updateQuantity, clearCart } =
    useCartContext();
  const { openWhatsApp } = useWhatsApp();
  const productMap = getProductMap(lang);

  const product = (id: string) =>
    productMap[id] || { name: id, price: 0 };
  const itemTotal = (id: string, qty: number) =>
    product(id).price * qty;

  const totalSum = items.reduce((s, i) => s + itemTotal(i.id, i.quantity), 0);
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;

    const itemsList = items
      .map(
        (item) =>
          `- ${product(item.id).name} x${item.quantity}: $${itemTotal(item.id, item.quantity).toFixed(2)}`,
      )
      .join("\n");

    const mensaje = cfg.store.cart.whatsappTemplate(itemsList, totalSum);
    openWhatsApp({
      message: mensaje,
      title: cfg.store.cart.title,
    });
    clearCart();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            <IconShoppingCart className="size-5 inline-block align-text-bottom mr-1.5" />
            {lang === "es" ? "Carrito" : "Cart"}
          </SheetTitle>
          <SheetDescription>
            {items.length > 0
              ? cfg.store.cart.itemsCount(totalQty)
              : cfg.store.cart.empty}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <IconShoppingCart className="size-12 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">{cfg.store.cart.empty}</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="divide-y">
              {items.map((item) => {
                const p = product(item.id);
                return (
                  <div key={item.id} className="flex items-start gap-2 py-3 sm:items-center sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {cfg.store.cart.perUnit(p.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="outline"
                        size="icon-xs"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label={cfg.store.cart.decreaseAriaLabel(p.name)}
                      >
                        <IconMinus className="size-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium tabular-nums">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon-xs"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label={cfg.store.cart.increaseAriaLabel(p.name)}
                      >
                        <IconPlus className="size-3" />
                      </Button>
                    </div>
                    <div className="text-right shrink-0 min-w-[68px]">
                      <p className="text-sm font-medium tabular-nums">
                        ${itemTotal(item.id, item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-destructive hover:text-destructive/80 mt-0.5 inline-flex items-center gap-1"
                        aria-label={cfg.store.cart.removeAriaLabel(p.name)}
                      >
                        <IconTrash className="size-3" />
                        {cfg.store.cart.delete}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Subtotal</span>
              <span className="text-lg font-bold tabular-nums">
                ${totalSum.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              {cfg.store.cart.includesTax}<br />
              <span className="text-destructive/70">{cfg.store.cart.excludesShipping}</span>
            </p>
          </div>
        )}

        {items.length > 0 && (
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
