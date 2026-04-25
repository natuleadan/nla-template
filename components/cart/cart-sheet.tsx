"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { IconShoppingCart, IconPlus, IconMinus, IconTrash } from "@tabler/icons-react"
import { getWhatsappNumber } from "@/lib/config/env"
import notificationService from "@/lib/modules/notification"

const WHATSAPP_NUMBER = getWhatsappNumber()

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartSheetProps {
  children?: React.ReactNode
}

export function CartSheet({ children }: CartSheetProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [open, setOpen] = useState(false)

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    notificationService.success(`${item.name} añadido al carrito`)
  }

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id))
  }

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) {
      removeFromCart(id)
      return
    }
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: newQty } : i))
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) return
    
    const itemsList = cartItems.map(item => `- ${item.name} x${item.quantity}: $${(item.price * item.quantity).toFixed(2)}`).join("\n")
    
    const mensaje = `🛒 *NUEVO PEDIDO - Acme Inc*\n\n*Items:*\n${itemsList}\n\n*Total:* $${total.toFixed(2)}\n\n¡Confirmar pedido!`
    
    const urlWhatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
    
    notificationService.info("Abriendo WhatsApp...")
    window.open(urlWhatsapp, "_blank")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="icon" className="relative">
            <IconShoppingCart className="size-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 size-5 p-0 flex items-center justify-center">
                {totalItems}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
          <SheetDescription>
            {cartItems.length > 0 
              ? `${totalItems} producto${totalItems > 1 ? "s" : ""} en tu carrito`
              : "Tu carrito está vacío"}
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <IconShoppingCart className="size-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} c/u</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="size-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <IconMinus className="size-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="size-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <IconPlus className="size-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">
                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive h-8 px-2"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <IconTrash className="size-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="text-xl font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <SheetFooter>
            <Button size="lg" className="w-full gap-2" onClick={handleWhatsAppOrder}>
              <IconShoppingCart className="size-5" />
              Pedir por WhatsApp
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default CartSheet
