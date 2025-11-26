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
  Users,
  Package,
  Zap,
  Facebook,
  Instagram,
  Twitter,
  Star,
  Code
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
    window.open(`https://wa.me/2349037725829?text=${message}`, '_blank');
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
      {/* Product Title */}
      <div className="space-y-3">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          {product.name}
        </h1>
        
        {/* Badges Section */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Popular Badge with gradient */}
          {product.popular_with && product.popular_with.length > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold">Popular with {product.popular_with[0]}</span>
            </div>
          )}
          
          {/* Discount Badge with gradient */}
          {discountPercent > 0 && (
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm rounded-full px-3 py-1 border-0">
              -{discountPercent}% OFF
            </Badge>
          )}
        </div>
        
        {/* Model Number Chip */}
        {product.modelNo && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Code className="w-4 h-4" />
            <span className="px-2 py-1 bg-gray-100 rounded-md font-mono text-xs">
              {product.modelNo}
            </span>
          </div>
        )}
      </div>
      
      {/* Divider below badges section */}
      <div className="border-b border-gray-200"></div>

      {/* Pricing Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-[26px] font-semibold text-gray-900">
            {formatPrice(bulkPrice)}
          </span>
          {discountPercent > 0 && (
            <span className="text-xl text-gray-500 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Limited Time Deal */}
        {product.limited_time_deal?.enabled && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-semibold">
                Limited Time Deal: {product.limited_time_deal.discount_percent}% OFF
              </span>
            </div>
            <p className="text-red-700 text-sm mt-1">
              Ends {new Date(product.limited_time_deal.end_date).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Stock Counter */}
        {product.stock_count !== undefined && (
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">
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
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Bulk Pricing
          </h3>
          <div className="space-y-2">
            {product.bulk_pricing_tiers.map((tier, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedBulkTier === index
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedBulkTier(selectedBulkTier === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">
                    {tier.min_quantity}{tier.max_quantity ? `-${tier.max_quantity}` : '+'} pieces
                  </span>
                  <span className="text-blue-600 font-semibold">
                    {formatPrice(tier.price)} each
                  </span>
                </div>
                {tier.discount_percent && (
                  <p className="text-sm text-green-600 mt-1">
                    Save {tier.discount_percent}% per piece
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Actions - Compact Inline Layout */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">
          Quantity
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Quantity selector */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              -
            </button>
            <span className="w-12 text-center font-medium text-gray-900 leading-none">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              +
            </button>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2 flex-1 w-full sm:w-auto">
            <Button
              onClick={handleAddToCart}
              className="h-10 flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg font-medium text-base"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isInCart(product.id) ? 'REMOVE FROM CART' : 'ADD TO CART'}
            </Button>
            <Button
              onClick={handleWhatsAppEnquiry}
              className="h-10 flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm rounded-lg font-medium text-base"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              BUY NOW
            </Button>
          </div>
        </div>
      </div>

      {/* Total Price */}
      {quantity > 1 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">
              Total ({quantity} pieces):
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      )}

      {/* Bulk Order Button */}
      {quantity >= 4 && (
        <Button
          variant="outline"
          size="lg"
          className="w-full h-10 border-orange-600 text-orange-600 hover:bg-orange-50 rounded-lg"
          onClick={() => {
            setBulkQuantity(quantity < 4 ? 4 : quantity);
            setIsBulkDialogOpen(true);
          }}
        >
          <Users className="w-5 h-5 mr-2" />
          Request Bulk Quote
        </Button>
      )}

      {/* Bulk Quote Dialog */}
      <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Bulk Quote</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Product</label>
              <div className="mt-1 text-sm text-gray-900">{product.name}</div>
            </div>
            <div>
              <label htmlFor="bulk-qty" className="text-sm font-medium text-gray-700">Desired Quantity</label>
              <Input
                id="bulk-qty"
                type="number"
                min={4}
                value={bulkQuantity}
                onChange={(e) => setBulkQuantity(Math.max(4, parseInt(e.target.value || '4')))}
                className="mt-1 w-32"
              />
              <p className="mt-1 text-xs text-gray-500">Minimum for bulk quote is 4 pieces.</p>
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

      {/* Feature Row - Premium Card Style */}
      <div className="bg-gray-100 rounded-lg p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <Truck className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
              <p className="text-xs text-gray-600">Orders over ₦1,000,000</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Clock className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Delivery</p>
              <p className="text-xs text-gray-600">{getDeliveryEstimate()}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Warranty</p>
              <p className="text-xs text-gray-600">1 Year</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Share2 className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Share this product:</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleSocialShare('facebook')}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:text-blue-800 hover:border-blue-800 hover:bg-blue-50 transition-all duration-200 hover:scale-110"
            aria-label="Share on Facebook"
          >
            <Facebook className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleSocialShare('twitter')}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:text-blue-800 hover:border-blue-800 hover:bg-blue-50 transition-all duration-200 hover:scale-110"
            aria-label="Share on Twitter"
          >
            <Twitter className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleSocialShare('instagram')}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:text-blue-800 hover:border-blue-800 hover:bg-blue-50 transition-all duration-200 hover:scale-110"
            aria-label="Share on Instagram"
          >
            <Instagram className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Payment Methods - Premium Card Style */}
      <div className="bg-gray-100 rounded-lg p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Payment Methods</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-700">Pay on Delivery</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-700">Bank Transfer</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-700">POS Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
