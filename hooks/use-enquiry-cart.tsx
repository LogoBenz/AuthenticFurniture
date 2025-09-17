"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import type { Product } from "../types";

export interface EnquiryCartItem {
  product: Product;
  addedAt: Date;
}

const CART_STORAGE_KEY = "authentic-furniture-enquiry-cart";

interface EnquiryCartContextType {
  cartItems: EnquiryCartItem[];
  addToCart: (product: Product) => boolean;
  removeFromCart: (productId: string) => boolean;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartCount: () => number;
  generateWhatsAppMessage: () => string;
  isLoaded: boolean;
}

const EnquiryCartContext = createContext<EnquiryCartContextType | undefined>(undefined);

export function EnquiryCartProvider({ children }: { children: ReactNode }): JSX.Element {
  const [cartItems, setCartItems] = useState<EnquiryCartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) {
            const validItems = parsed
              .filter(item => {
                const isValid = item && 
                  item.product && 
                  typeof item.product.id === 'string' &&
                  item.product.name &&
                  item.product.slug;
                return isValid;
              })
              .map((item: any) => ({
                ...item,
                addedAt: new Date(item.addedAt || Date.now())
              }));
            setCartItems(validItems);
          }
        }
      }
    } catch (_) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
      setCartItems([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (_) {}
    }
  }, [cartItems, isLoaded]);

  const addToCart = useCallback((product: Product) => {
    if (!product || typeof product.id !== 'string') return false;
    setCartItems(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) return prev;
      const newItem: EnquiryCartItem = { product, addedAt: new Date() };
      return [newItem, ...prev];
    });
    return true;
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    if (typeof productId !== 'string') return false;
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    return true;
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const isInCart = useCallback((productId: string) => {
    if (typeof productId !== 'string') return false;
    return cartItems.some(item => item.product.id === productId);
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    return cartItems.length;
  }, [cartItems]);

  const generateWhatsAppMessage = useCallback(() => {
    if (cartItems.length === 0) return "";
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    let message = "Hi! I'm interested in the following furniture products from your website:\n\n";
    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   Category: ${item.product.category}\n`;
      message += `   Price: ${new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
      }).format(item.product.price)}\n`;
      message += `   Link: ${baseUrl}/products/${item.product.slug}\n\n`;
    });
    const totalValue = cartItems.reduce((sum, item) => sum + item.product.price, 0);
    message += `*Total estimated value: ${new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(totalValue)}*\n\n`;
    message += "Please provide more details about:\n";
    message += "• Availability and delivery timeline\n";
    message += "• Final pricing and any current promotions\n";
    message += "• Customization options\n";
    message += "• Delivery options to my location\n\n";
    message += "Thank you!";
    return message;
  }, [cartItems]);

  return (
    <EnquiryCartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      isInCart,
      getCartCount,
      generateWhatsAppMessage,
      isLoaded
    }}>
      {children}
    </EnquiryCartContext.Provider>
  );
}

export function useEnquiryCart() {
  const context = useContext(EnquiryCartContext);
  if (context === undefined) {
    throw new Error('useEnquiryCart must be used within an EnquiryCartProvider');
  }
  return context;
}
