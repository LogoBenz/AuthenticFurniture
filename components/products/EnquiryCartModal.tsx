"use client";

import { X, MessageCircle, Trash2, ShoppingCart, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { formatPrice } from "@/lib/products-client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface EnquiryCartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnquiryCartModal({ isOpen, onClose }: EnquiryCartModalProps) {
  const { cartItems, removeFromCart, clearCart, generateWhatsAppMessage, isLoaded } = useEnquiryCart();
  const [isSending, setIsSending] = useState(false);

  // Debug logging for modal renders
  useEffect(() => {
    console.log('🔄 EnquiryCartModal render:', {
      isOpen,
      cartItemsCount: cartItems.length,
      isLoaded,
      cartItems: cartItems.map(item => ({ id: item.product.id, name: item.product.name }))
    });
  }, [isOpen, cartItems, isLoaded]);

  const handleSendEnquiry = async () => {
    if (cartItems.length === 0) {
      console.warn('⚠️ Cannot send enquiry: cart is empty');
      return;
    }
    
    console.log('📱 Sending WhatsApp enquiry for', cartItems.length, 'items');
    setIsSending(true);
    
    try {
      const message = generateWhatsAppMessage();
      const phoneNumber = "2348012345678";
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      
      console.log('📱 Opening WhatsApp with message length:', message.length);
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      // Close modal after a brief delay
      setTimeout(() => {
        onClose();
        setIsSending(false);
      }, 1000);
    } catch (error) {
      console.error("❌ Error sending enquiry:", error);
      setIsSending(false);
      alert('Failed to open WhatsApp. Please try again.');
    }
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear all items from your enquiry cart?")) {
      console.log('🗑️ Clearing cart from modal');
      clearCart();
    }
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    console.log('🗑️ Removing item from modal:', productName);
    removeFromCart(productId);
  };

  const totalValue = cartItems.reduce((sum, item) => sum + item.product.price, 0);

  // Show loading state while cart is loading
  if (!isLoaded) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
            <span className="ml-3 text-muted-foreground">Loading cart...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <span>Enquiry Cart</span>
              <span className="text-sm text-muted-foreground">
                ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
              </span>
            </div>
            {cartItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Your enquiry cart is empty</h3>
                     <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                       Browse our furniture collection and add items you&apos;re interested in to get started with your enquiry.
                     </p>
              <Button onClick={onClose} asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/products">
                  <Plus className="h-4 w-4 mr-2" />
                  Browse Products
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3">
                {cartItems.map((item, index) => (
                  <div
                    key={`${item.product.id}-${index}`}
                    className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="relative w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/products/${item.product.slug}`}
                        onClick={onClose}
                        className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <h4 className="font-medium truncate">{item.product.name}</h4>
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.product.category}</p>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {formatPrice(item.product.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Added {item.addedAt.toLocaleDateString()}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 flex-shrink-0"
                      title="Remove from cart"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Total estimated value:</span>
                    <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                      {formatPrice(totalValue)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    * This is an enquiry cart. Final prices may vary based on customization, quantity, and current promotions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {cartItems.length > 0 && (
          <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSendEnquiry}
                disabled={isSending}
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
                size="lg"
              >
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Enquiry via WhatsApp
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={onClose} size="lg" disabled={isSending}>
                Continue Browsing
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}