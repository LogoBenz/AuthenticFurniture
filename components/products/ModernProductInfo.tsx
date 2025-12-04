"use client";

import { useState, useCallback } from "react";
import { ShoppingCart, Zap, MapPin, Truck, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { Product } from "@/types";
import { QuantitySelector } from "./QuantitySelector";
import { formatPrice } from "@/lib/products-client";

interface ModernProductInfoProps {
  product: Product;
}

export function ModernProductInfo({ product }: ModernProductInfoProps) {
  const { addToCart, removeFromCart, isInCart, isLoaded } = useEnquiryCart();
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const isProductInCart = isLoaded ? isInCart(product.id) : false;

  // Calculate pricing
  const originalPrice = (product as any).original_price || product.price;
  const discountPercent = (product as any).discount_percent || 0;
  const hasDiscount = discountPercent > 0;
  const currentPrice = hasDiscount
    ? originalPrice * (1 - discountPercent / 100)
    : originalPrice;

  const handleAddToCart = useCallback(async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoaded || !product.inStock || isProcessing) {
      return;
    }

    // Flying Animation Logic
    if (e) {
      const button = e.currentTarget;
      const cartIcon = document.querySelector('[aria-label="Cart"]'); // Ensure your cart icon has this aria-label

      if (cartIcon) {
        const buttonRect = button.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();

        const flyingItem = document.createElement('div');
        flyingItem.style.position = 'fixed';
        flyingItem.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
        flyingItem.style.top = `${buttonRect.top + buttonRect.height / 2}px`;
        flyingItem.style.width = '20px';
        flyingItem.style.height = '20px';
        flyingItem.style.backgroundColor = '#2563eb'; // Blue-600
        flyingItem.style.borderRadius = '50%';
        flyingItem.style.zIndex = '9999';
        flyingItem.style.pointerEvents = 'none';
        flyingItem.style.transition = 'all 0.8s cubic-bezier(0.2, 1, 0.3, 1)';

        document.body.appendChild(flyingItem);

        // Force reflow
        flyingItem.getBoundingClientRect();

        // Animate to cart
        flyingItem.style.left = `${cartRect.left + cartRect.width / 2}px`;
        flyingItem.style.top = `${cartRect.top + cartRect.height / 2}px`;
        flyingItem.style.opacity = '0';
        flyingItem.style.transform = 'scale(0.5)';

        setTimeout(() => {
          document.body.removeChild(flyingItem);
        }, 800);
      }
    }

    setIsProcessing(true);

    try {
      if (isProductInCart) {
        removeFromCart(product.id);
      } else {
        // Add multiple items based on quantity
        for (let i = 0; i < quantity; i++) {
          addToCart(product);
        }
      }

      setTimeout(() => {
        setIsProcessing(false);
      }, 300);
    } catch (error) {
      console.error("Error updating cart:", error);
      setIsProcessing(false);
    }
  }, [addToCart, removeFromCart, product, isLoaded, isProductInCart, isProcessing, quantity]);

  const handleBuyNow = () => {
    // For now, just add to cart and show a message
    if (!isProductInCart) {
      handleAddToCart();
    }
    // You could implement a direct checkout flow here
  };

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in the ${product.name} from your website.\n\nProduct: ${product.name}\nCategory: ${product.category}\nPrice: ${formatPrice(currentPrice)}\nQuantity: ${quantity}\nLink: ${window.location.href}\n\nPlease provide more details about availability, pricing, and delivery options.`;

    const phoneNumber = "2348012345678";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Product Title and SKU */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
          {product.name}
        </h1>
        {(product as any).modelNo && (
          <p className="text-sm text-muted-foreground">
            SKU: {(product as any).modelNo}
          </p>
        )}
      </div>

      {/* Pricing */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {formatPrice(currentPrice)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
              <Badge variant="destructive" className="text-xs">
                -{discountPercent}%
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className={`text-sm font-medium ${product.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      {/* Availability Per Store */}
      {(product as any).warehouseLocation && (
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          Check availability at stores
        </button>
      )}

      {/* Quantity Selector */}
      {product.inStock && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Quantity</label>
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={99}
            disabled={!product.inStock}
          />
        </div>
      )}

      {/* CTA Buttons */}
      <div className="space-y-3">
        {product.inStock ? (
          <>
            <Button
              onClick={handleAddToCart}
              disabled={!isLoaded || isProcessing}
              variant="outline"
              size="lg"
              className="w-full h-12"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                  {isProductInCart ? 'Removing...' : 'Adding...'}
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isProductInCart ? 'Remove from Cart' : 'Add to Cart'}
                </>
              )}
            </Button>

            <Button
              onClick={handleBuyNow}
              disabled={!isLoaded || isProcessing}
              size="lg"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Buy Now
            </Button>
          </>
        ) : (
          <Button
            onClick={handleWhatsApp}
            variant="outline"
            size="lg"
            className="w-full h-12"
          >
            Ask About Availability
          </Button>
        )}
      </div>

      {/* Info Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Truck className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Free Shipping</p>
            <p className="text-xs text-muted-foreground">On orders over ₦10,000</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Delivery</p>
            <p className="text-xs text-muted-foreground">In 3–5 working days</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Warranty</p>
            <p className="text-xs text-muted-foreground">2 years warranty</p>
          </div>
        </div>
      </div>

      {/* Cart Success Message */}
      {isProductInCart && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center text-green-800 dark:text-green-200">
            <ShoppingCart className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              Added to enquiry cart! View your cart to send a bulk enquiry.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
