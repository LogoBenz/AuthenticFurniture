"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  MessageCircle, 
  Share2, 
  Truck, 
  Shield, 
  Clock,
  Star,
  Users,
  Package,
  Zap,
  Heart,
  Facebook,
  Instagram,
  Twitter
} from "lucide-react";
import { formatPrice } from "@/lib/products";
import { Product } from "@/types";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface EnhancedProductInfoProps {
  product: Product;
}

export function EnhancedProductInfo({ product }: EnhancedProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedBulkTier, setSelectedBulkTier] = useState<number | null>(null);
  const { addToCart, removeFromCart, isInCart } = useEnquiryCart();
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState<number>(4);

  // Calculate pricing
  const originalPrice = product.original_price || product.price;
  const discountPercent = product.discount_percent || 0;
  const currentPrice = discountPercent > 0 ? originalPrice * (1 - discountPercent / 100) : originalPrice;
  
  // Bulk pricing calculation
  const bulkPrice = selectedBulkTier !== null && product.bulk_pricing_tiers 
    ? product.bulk_pricing_tiers[selectedBulkTier]?.price || currentPrice
    : currentPrice;

  const totalPrice = bulkPrice * quantity;

  // Delivery estimation
  const getDeliveryEstimate = () => "Same day (Lagos) / 1-7 days outside Lagos";

  // WhatsApp message
  const generateWhatsAppMessage = () => {
    const message = `Hi! I'm interested in the ${product.name}. 

Product: ${product.name}
Price: ${formatPrice(currentPrice)}
Quantity: ${quantity}
Total: ${formatPrice(totalPrice)}

Can you provide more details and availability?`;
    return encodeURIComponent(message);
  };

  // Social sharing
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out this ${product.name} from Authentic Furniture!`;

  const handleAddToCart = () => {
    if (isInCart(product.id)) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  const handleWhatsAppEnquiry = () => {
    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/2348123456789?text=${message}`, '_blank');
  };

  const handleSocialShare = (platform: string) => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(shareText);
    
    let shareUrl_platform = '';
    switch (platform) {
      case 'facebook':
        shareUrl_platform = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl_platform = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing, so we'll copy to clipboard
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard! You can now share it on Instagram.');
        return;
    }
    
    if (shareUrl_platform) {
      window.open(shareUrl_platform, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Badges */}
      {product.badges && product.badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.badges.map((badge, index) => (
            <Badge 
              key={index} 
              variant={badge === 'Best Seller' ? 'default' : 'secondary'}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {badge}
            </Badge>
          ))}
        </div>
      )}

      {/* Product Title */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          {product.name}
        </h1>
        {product.modelNo && (
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Model: {product.modelNo}
          </p>
        )}
      </div>

      {/* Pricing Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-bold text-slate-900 dark:text-white">
            {formatPrice(bulkPrice)}
          </span>
          {discountPercent > 0 && (
            <>
              <span className="text-xl text-slate-500 line-through">
                {formatPrice(originalPrice)}
              </span>
              <Badge variant="destructive" className="bg-red-600 text-white">
                -{discountPercent}% OFF
              </Badge>
            </>
          )}
        </div>

        {/* Limited Time Deal */}
        {product.limited_time_deal?.enabled && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-red-600" />
              <span className="text-red-800 dark:text-red-200 font-semibold">
                Limited Time Deal: {product.limited_time_deal.discount_percent}% OFF
              </span>
            </div>
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">
              Ends {new Date(product.limited_time_deal.end_date).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Stock Counter */}
        {product.stock_count !== undefined && (
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {product.stock_count > 10 
                ? `${product.stock_count} in stock` 
                : product.stock_count > 0 
                  ? `Only ${product.stock_count} left in stock!`
                  : 'Out of stock'
              }
            </span>
          </div>
        )}
      </div>

      {/* Bulk Pricing */}
      {product.bulk_pricing_enabled && product.bulk_pricing_tiers && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Bulk Pricing
          </h3>
          <div className="space-y-2">
            {product.bulk_pricing_tiers.map((tier, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedBulkTier === index
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
                onClick={() => setSelectedBulkTier(selectedBulkTier === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-900 dark:text-white">
                    {tier.min_quantity}{tier.max_quantity ? `-${tier.max_quantity}` : '+'} pieces
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    {formatPrice(tier.price)} each
                  </span>
                </div>
                {tier.discount_percent && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Save {tier.discount_percent}% per piece
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Quantity
        </label>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <span className="w-16 text-center font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </Button>
        </div>
      </div>

      {/* Total Price */}
      {quantity > 1 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-slate-900 dark:text-white">
              Total ({quantity} pieces):
            </span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={handleAddToCart}
            className={`${
              isInCart(product.id) 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            size="lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {isInCart(product.id) ? 'Remove from Cart' : 'Add to Cart'}
          </Button>
          <Button
            onClick={handleWhatsAppEnquiry}
            variant="outline"
            size="lg"
            className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            WhatsApp Enquiry
          </Button>
        </div>

        {/* Bulk Order Button */}
        {quantity >= 4 && (
          <Button
            variant="outline"
            size="lg"
            className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            onClick={() => {
              setBulkQuantity(quantity < 4 ? 4 : quantity);
              setIsBulkDialogOpen(true);
            }}
          >
            <Users className="w-5 h-5 mr-2" />
            Request Bulk Quote
          </Button>
        )}
      </div>

      {/* Bulk Quote Dialog */}
      <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Bulk Quote</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Product</label>
              <div className="mt-1 text-sm text-slate-900 dark:text-white">{product.name}</div>
            </div>
            <div>
              <label htmlFor="bulk-qty" className="text-sm font-medium text-slate-700 dark:text-slate-300">Desired Quantity</label>
              <Input
                id="bulk-qty"
                type="number"
                min={4}
                value={bulkQuantity}
                onChange={(e) => setBulkQuantity(Math.max(4, parseInt(e.target.value || '4')))}
                className="mt-1 w-32"
              />
              <p className="mt-1 text-xs text-slate-500">Minimum for bulk quote is 4 pieces.</p>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  const text = encodeURIComponent(`Bulk order enquiry:\nProduct: ${product.name}\nQuantity: ${bulkQuantity}`);
                  window.open(`https://wa.me/2349037725829?text=${text}`, '_blank');
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Continue on WhatsApp
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Info Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-2">
          <Truck className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Free Shipping</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Orders over ₦1,000,000</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Delivery</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">{getDeliveryEstimate()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Warranty</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">1 Year</p>
          </div>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Share2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Share this product:</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSocialShare('facebook')}
            className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Facebook className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSocialShare('twitter')}
            className="text-blue-400 border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Twitter className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSocialShare('instagram')}
            className="text-pink-600 border-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20"
          >
            <Instagram className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Payment Methods</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-slate-700 dark:text-slate-300">Pay on Delivery (Lagos only)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-slate-700 dark:text-slate-300">Bank Transfer</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-slate-700 dark:text-slate-300">POS Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
