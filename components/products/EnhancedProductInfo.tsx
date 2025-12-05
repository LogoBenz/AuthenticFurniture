"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Armchair,
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
  Linkedin,
  TrendingUp,
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
      case 'linkedin':
        shareUrl_platform = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }

    if (shareUrl_platform) {
      window.open(shareUrl_platform, '_blank', 'width=600,height=400');
    }
  };

  // Custom SVG Icons
  const FreeShippingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        <path d="M3.75 19a2 2 0 1 0 4 0a2 2 0 0 0-4 0m12.75 0a2 2 0 1 0 4 0a2 2 0 0 0-4 0m-8.75 0h8.75" />
        <path d="M20.5 19h1.75a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3.75a1 1 0 0 0-1 1v7.837L1.1 13.2a1 1 0 0 0-.349.759V18a1 1 0 0 0 1 1h2" />
        <path d="M5.75 14V8H7.5m0 3H5.75m11.063-3h-1.75v6h1.75m0-3h-1.75M21 8h-1.75v6H21m0-3h-1.75m-9.125 3V8h1.25a1.25 1.25 0 0 1 0 2.5h-1.25" />
        <path d="M10.125 10.5h.5a2 2 0 0 1 2 2V14" />
      </g>
    </svg>
  );

  const DeliveryIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        <path d="M19.5 19.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0m-10 0a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0" />
        <path d="M2 12v5c0 .935 0 1.402.201 1.75a1.5 1.5 0 0 0 .549.549c.348.201.815.201 1.75.201m10 0h-5m5.5-2V9c0-1.414 0-2.121-.44-2.56C14.122 6 13.415 6 12 6h-1m4.5 2.5h1.801c.83 0 1.245 0 1.589.195c.344.194.557.55.984 1.262l1.699 2.83c.212.354.318.532.373.728c.054.197.054.403.054.816V17c0 .935 0 1.402-.201 1.75a1.5 1.5 0 0 1-.549.549c-.348.201-.815.201-1.75.201M7.85 7.85l-1.35-.9V4.7M2 6.5a4.5 4.5 0 1 0 9 0a4.5 4.5 0 0 0-9 0" />
      </g>
    </svg>
  );

  const WarrantyIcon = () => (
    <svg width="24" height="24" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" strokeLinejoin="round">
        <path d="M1.082 7.626a.976.976 0 0 1 0-1.273q.338-.393.678-.773q-.103-.493-.198-.996a.976.976 0 0 1 .636-1.103q.49-.172.974-.331q.157-.479.327-.962A.976.976 0 0 1 4.6 1.552q.5.094.992.196q.374-.334.76-.666a.976.976 0 0 1 1.273 0q.39.334.764.67q.5-.105 1.009-.2a.976.976 0 0 1 1.102.636q.17.484.327.962q.484.16.974.331c.455.16.725.628.636 1.103q-.096.512-.201 1.013q.34.381.68.777a.976.976 0 0 1 .001 1.273q-.337.393-.678.773q.104.493.198.997a.976.976 0 0 1-.636 1.102q-.49.172-.974.331q-.158.48-.327.962a.976.976 0 0 1-1.102.637a53 53 0 0 1-.992-.197q-.374.335-.76.666a.976.976 0 0 1-1.273 0q-.39-.334-.764-.67q-.5.105-1.009.2a.976.976 0 0 1-1.102-.636a53 53 0 0 1-.327-.962a52 52 0 0 1-.974-.33a.976.976 0 0 1-.636-1.103q.096-.513.201-1.014a53 53 0 0 1-.68-.777Z" />
        <path strokeLinecap="round" d="M4.62 7.738L6.212 9.38C6.962 7.227 7.586 6.282 9 5" />
      </g>
    </svg>
  );

  const PayOnDeliveryIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        <path d="M2 4.5h6.757a3 3 0 0 1 2.122.879L14 8.5m-9 5H2m6.5-6l2 2a1.414 1.414 0 1 1-2 2L7 10c-.86.86-2.223.957-3.197.227L3.5 10" />
        <path d="M5 11v4.5c0 1.886 0 2.828.586 3.414S7.114 19.5 9 19.5h9c1.886 0 2.828 0 3.414-.586S22 17.386 22 15.5v-3c0-1.886 0-2.828-.586-3.414S19.886 8.5 18 8.5H9.5" />
        <path d="M15.25 14a1.75 1.75 0 1 1-3.5 0a1.75 1.75 0 0 1 3.5 0" />
      </g>
    </svg>
  );

  const BankTransferIcon = () => (
    <svg width="24" height="24" viewBox="0 0 496 496" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M208,120c0-13.232,10.768-24,24-24h40V80h-40c-22.056,0-40,17.944-40,40h-9.888L0,211.056V256h16v32h16v128H16v32H0v48h400v-48h-16v-32h-16V288h16v-32h16v-44.944L217.888,120H208z M32,432h48v16H32V432z M128,288v128h-16v32H96v-32H80V288h16v-32h16v32H128z M224,288v128h-16v32h-16v-32h-16V288h16v-32h16v32H224z M320,288v128h-16v32h-16v-32h-16V288h16v-32h16v32H320zM368,432v16h-48v-16H368z M336,416V288h16v128H336z M272,272h-48v-16h48V272z M256,288v128h-16V288H256z M272,432v16h-48v-16H272z M176,272h-48v-16h48V272z M160,288v128h-16V288H160z M176,432v16h-48v-16H176z M80,272H32v-16h48V272z M64,288v128H48V288H64z M384,464v16H16v-16H384z M368,272h-48v-16h48V272z M384,240h-80h-16h-80h-16h-80H96H16v-19.056L185.888,136H192v56h16v-56h6.112L384,220.944V240z" />
        <rect x="64" y="208" width="272" height="16" />
        <path d="M408,0c-48.52,0-88,39.48-88,88s39.48,88,88,88c48.52,0,88-39.48,88-88S456.52,0,408,0z M408,160c-39.704,0-72-32.296-72-72s32.296-72,72-72c39.704,0,72,32.296,72,72S447.704,160,408,160z" />
        <path d="M400,64h16c4.416,0,8,3.584,8,8h16c0-13.232-10.768-24-24-24V32h-16v16c-13.232,0-24,10.768-24,24s10.768,24,24,24h16c4.416,0,8,3.584,8,8s-3.584,8-8,8h-16c-4.416,0-8-3.584-8-8h-16c0,13.232,10.768,24,24,24v16h16v-16c13.232,0,24-10.768,24-24s-10.768-24-24-24h-16c-4.416,0-8-3.584-8-8S395.584,64,400,64z" />
        <rect x="288" y="80" width="16" height="16" />
        <path d="M448,312c0,13.232-10.768,24-24,24h-8v16h8c22.056,0,40-17.944,40-40V184h-16V312z" />
        <rect x="384" y="336" width="16" height="16" />
      </g>
    </svg>
  );

  const POSPaymentIcon = () => (
    <svg width="24" height="24" viewBox="0 0 496 496" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M32,256h208V144H32V256z M48,160h176v80H48V160z" />
        <path d="M48,328h48v-48H48V328z M64,296h16v16H64V296z" />
        <path d="M112,328h48v-48h-48V328z M128,296h16v16h-16V296z" />
        <path d="M176,328h48v-48h-48V328z M192,296h16v16h-16V296z" />
        <path d="M48,392h48v-48H48V392z M64,360h16v16H64V360z" />
        <path d="M112,392h48v-48h-48V392z M128,360h16v16h-16V360z" />
        <path d="M176,392h48v-48h-48V392z M192,360h16v16h-16V360z" />
        <path d="M48,456h48v-48H48V456z M64,424h16v16H64V424z" />
        <path d="M112,456h48v-48h-48V456z M128,424h16v16h-16V424z" />
        <path d="M176,456h48v-48h-48V456z M192,424h16v16h-16V424z" />
        <rect x="192" y="208" width="16" height="16" />
        <rect x="128" y="208" width="48" height="16" />
        <rect x="80" y="48" width="112" height="16" />
        <rect x="176" y="80" width="16" height="16" />
        <path d="M400,148.248V112c0-13.232-10.768-24-24-24H272v-8c0-17.648-14.352-32-32-32h-16V0H48v48H32C14.352,48,0,62.352,0,80l0.04,248.8l13.832,138.392C15.512,483.608,29.208,496,45.72,496h180.56c16.504,0,30.2-12.392,31.84-28.816L269.608,352h44.68C312.8,360.76,312,369.624,312,378.504c0,31.352,9.192,61.712,26.584,87.8l5.416,8.12V496h16v-26.424l-8.104-12.16C336.264,433.976,328,406.68,328,378.504c0-11.616,1.432-23.224,4.24-34.512l11.512-46.048L344,225.496c0-9.656,7.84-17.496,17.488-17.496c8.808,0,16.264,6.584,17.36,15.32L392.936,336h22.224l9.088-81.8L400,213.784v-44.696l80,66.664v75.216L440.264,461.96L440,496h16v-30.968l39.736-150.992L496,228.248L400,148.248z M64,16h16v16h16V16h16v16h16V16h16v16h16V16h16v16h16V16h16v96H64V16z M242.2,465.592c-0.816,8.216-7.664,14.408-15.92,14.408H45.72c-8.256,0-15.104-6.192-15.92-14.408L16,328V80c0-8.816,7.176-16,16-16h16v48H32v16h208v-16h-16V64h16c8.816,0,16,7.184,16,16l0.04,247.2L242.2,465.592z M384,200.824c-5.992-5.464-13.888-8.824-22.512-8.824C343.024,192,328,207.024,328,225.496v69.52L317.744,336H271.2l0.8-8V152v-48h104c4.416,0,8,3.584,8,8V200.824z M407.752,257.8l-3.984,35.848L400,263.536v-18.648L407.752,257.8z" />
        <path d="M304,184c5.64,0,11.152-1.52,16-4.368c4.848,2.848,10.36,4.368,16,4.368c17.648,0,32-14.352,32-32s-14.352-32-32-32c-5.64,0-11.152,1.52-16,4.368c-4.848-2.848-10.36-4.368-16-4.368c-17.648,0-32,14.352-32,32S286.352,184,304,184z M304,136c3.88,0,7.656,1.48,10.648,4.168l5.352,4.824l5.352-4.824C328.344,137.48,332.12,136,336,136c8.816,0,16,7.176,16,16c0,8.824-7.184,16-16,16c-3.88,0-7.656-1.48-10.648-4.168L320,159.008l-5.352,4.824C311.656,166.52,307.88,168,304,168c-8.824,0-16-7.176-16-16C288,143.176,295.176,136,304,136z" />
        <rect x="288" y="200" width="16" height="88" />
        <rect x="288" y="304" width="16" height="16" />
      </g>
    </svg>
  );

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Product Title */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-4xl font-bold text-gray-900">
          {product.name}
        </h1>

        {/* Badges Section */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Popular Badge with gradient */}
          {/* Popular Badge - Professional Look */}
          {product.popular_with && product.popular_with.length > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F172A] text-white shadow-sm border border-gray-800">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs font-medium tracking-wide">Popular with {product.popular_with[0]}</span>
            </div>
          )}

          {/* Model Number Chip */}
          {product.modelNo && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 px-2 py-1 bg-gray-100 rounded-md border border-gray-200">
              <Code className="w-3.5 h-3.5" />
              <span className="font-mono">
                {product.modelNo}
              </span>
            </div>
          )}

          {/* Discount Badge with gradient */}
          {discountPercent > 0 && (
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm rounded-full px-3 py-1 border-0 text-xs">
              -{discountPercent}% OFF
            </Badge>
          )}
        </div>
      </div>

      {/* Divider below badges section */}
      <div className="border-b border-gray-200"></div>

      {/* Pricing Section */}
      <div className="space-y-3">
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
        {/* Stock Counter - Clean Status Pill */}
        {/* Stock Counter - Minimal & Clean */}
        {product.stock_count !== undefined && (
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <div className={`w-2 h-2 rounded-full ${product.stock_count > 10 ? 'bg-green-500' : product.stock_count > 0 ? 'bg-amber-500' : 'bg-red-500'
              }`} />
            <span>
              {product.stock_count > 10
                ? `${product.stock_count} in stock`
                : product.stock_count > 0
                  ? `Low Stock: Only ${product.stock_count} left`
                  : 'Out of stock'
              }
            </span>
          </div>
        )}
      </div>

      {/* Bulk Pricing */}
      {
        product.bulk_pricing_enabled && product.bulk_pricing_tiers && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Bulk Pricing
            </h3>
            <div className="space-y-2">
              {product.bulk_pricing_tiers.map((tier, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedBulkTier === index
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
        )
      }

      {/* Quantity & Actions - Compact Inline Layout */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Quantity
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Quantity selector */}
          {/* Quantity selector - Premium Pill Design */}
          {/* Quantity selector - Premium Squarish Design */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1 shadow-inner">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-gray-900 shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200"
            >
              -
            </button>
            <span className="w-10 text-center font-semibold text-gray-900 text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-gray-900 shadow-sm hover:scale-105 active:scale-95 transition-all duration-200"
            >
              +
            </button>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 flex-1 w-full">
            <Button
              onClick={handleAddToCart}
              className="h-12 flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg font-semibold text-sm uppercase tracking-wide transition-all duration-200 hover:scale-[1.02]"
            >
              <Truck className="w-5 h-5 mr-2" />
              {isInCart(product.id) ? 'REMOVE FROM CART' : 'ADD TO CART'}
            </Button>
            <Button
              onClick={handleWhatsAppEnquiry}
              className="h-12 flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-sm rounded-lg font-semibold text-sm uppercase tracking-wide transition-all duration-200 hover:scale-[1.02]"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              BUY NOW
            </Button>
          </div>
        </div>
      </div>

      {/* Total Price */}
      {
        quantity > 1 && (
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
        )
      }

      {/* Bulk Order Button */}
      {
        quantity >= 4 && (
          <Button
            variant="outline"
            size="lg"
            className="w-full h-10 border-orange-600 text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 hover:scale-[1.01]"
            onClick={() => {
              setBulkQuantity(quantity < 4 ? 4 : quantity);
              setIsBulkDialogOpen(true);
            }}
          >
            <Users className="w-5 h-5 mr-2" />
            Request Bulk Quote
          </Button>
        )
      }

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
            <div className="text-gray-900 flex-shrink-0 mt-0.5">
              <FreeShippingIcon />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
              <p className="text-xs text-gray-600">Orders over ₦1,000,000</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-gray-900 flex-shrink-0 mt-0.5">
              <DeliveryIcon />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Delivery</p>
              <p className="text-xs text-gray-600">{getDeliveryEstimate()}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-gray-900 flex-shrink-0 mt-0.5">
              <WarrantyIcon />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Warranty</p>
              <p className="text-xs text-gray-600">1 Year</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Sharing - Fill Up Design */}
      <div className="flex justify-center items-center pt-4">
        <ul className="flex justify-center items-center list-none m-0">
          {[
            { icon: Facebook, label: "Facebook", color: "bg-[#3b5998]", onClick: () => handleSocialShare('facebook') },
            { icon: Twitter, label: "Twitter", color: "bg-[#1da1f2]", onClick: () => handleSocialShare('twitter') },
            { icon: Instagram, label: "Instagram", color: "bg-[#e1306c]", onClick: () => handleSocialShare('instagram') },
            { icon: Linkedin, label: "LinkedIn", color: "bg-[#0077b5]", onClick: () => handleSocialShare('linkedin') }
          ].map((social) => (
            <li key={social.label} className="relative group mx-2.5">
              <button
                onClick={social.onClick}
                aria-label={`Share on ${social.label}`}
                className="relative overflow-hidden flex justify-center items-center w-[50px] h-[50px] rounded-[20%] text-[#4d4d4d] bg-white transition-all duration-300 shadow-sm group-hover:shadow-[3px_2px_45px_0px_rgba(0,0,0,0.5)] group-hover:text-white"
              >
                <div className={`absolute bottom-0 left-0 w-full h-0 ${social.color} transition-all duration-300 ease-in-out group-hover:h-full`} />
                <social.icon className="relative z-10 w-[30px] h-[30px]" strokeWidth={1.5} />
              </button>
              <div className={`absolute -top-[30px] left-1/2 -translate-x-1/2 text-white px-[10px] py-[6px] rounded-[15px] opacity-0 invisible text-sm transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:-top-[50px] z-20 whitespace-nowrap ${social.color}`}>
                {social.label}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Methods - Premium Card Style */}
      <div className="bg-gray-100 rounded-lg p-4 sm:p-6 mt-auto">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Payment Methods</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <div className="text-gray-900 flex-shrink-0">
              <PayOnDeliveryIcon />
            </div>
            <span className="text-sm text-gray-700">Pay on Delivery</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-gray-900 flex-shrink-0">
              <BankTransferIcon />
            </div>
            <span className="text-sm text-gray-700">Bank Transfer</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-gray-900 flex-shrink-0">
              <POSPaymentIcon />
            </div>
            <span className="text-sm text-gray-700">POS Payment</span>
          </div>
        </div>
      </div>
    </div >
  );
}
