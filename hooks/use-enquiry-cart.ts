"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Product } from "@/types";

export interface EnquiryCartItem {
  product: Product;
  addedAt: Date;
}

const CART_STORAGE_KEY = "authentic-furniture-enquiry-cart";

interface EnquiryCartContextType {
  cartItems: EnquiryCartItem[];
  addToCart: (product: Product) => boolean;
  removeFromCart: (productId: number) => boolean;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  getCartCount: () => number;
  generateWhatsAppMessage: () => string;
  isLoaded: boolean;
}

const EnquiryCartContext = createContext<EnquiryCartContextType | undefined>(undefined);

export function EnquiryCartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<EnquiryCartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        console.log('🔄 Loading cart from localStorage:', savedCart);
        
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) {
            const validItems = parsed
              .filter(item => {
                const isValid = item && 
                  item.product && 
                  typeof item.product.id === 'number' &&
                  item.product.name &&
                  item.product.slug;
                
                if (!isValid) {
                  console.warn('⚠️ Invalid cart item filtered out:', item);
                }
                return isValid;
              })
              .map((item: any) => ({
                ...item,
                addedAt: new Date(item.addedAt || Date.now())
              }));
            
            console.log('✅ Loaded valid cart items:', validItems.length);
            setCartItems(validItems);
          }
        }
      }
    } catch (error) {
      console.error("❌ Error loading cart from localStorage:", error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
      setCartItems([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        console.log('💾 Saving cart to localStorage:', cartItems.length, 'items');
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error("❌ Error saving cart to localStorage:", error);
      }
    }
  }, [cartItems, isLoaded]);

  // Monitor cart changes for debugging
  useEffect(() => {
    console.log('🛒 Cart state updated:', {
      itemCount: cartItems.length,
      items: cartItems.map(item => ({ 
        id: item.product.id, 
        name: item.product.name,
        addedAt: item.addedAt 
      }))
    });
  }, [cartItems]);

  const addToCart = useCallback((product: Product) => {
    console.log('🛒 addToCart called:', {
      productId: product.id,
      productName: product.name,
      productValid: !!(product && typeof product.id === 'number')
    });
    
    if (!product || typeof product.id !== 'number') {
      console.error("❌ Invalid product data:", product);
      return false;
    }

    setCartItems(prev => {
      // Check if product already exists in cart
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        console.log('⚠️ Product already in cart:', product.name);
        return prev; // Don't add duplicates
      }
      
      const newItem: EnquiryCartItem = { 
        product, 
        addedAt: new Date() 
      };
      
      const newCart = [newItem, ...prev]; // Add to beginning for better UX
      console.log('✅ Product added to cart. New count:', newCart.length);
      return newCart;
    });
    return true;
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    console.log('🗑️ removeFromCart called:', productId);
    
    if (typeof productId !== 'number') {
      console.error("❌ Invalid product ID:", productId);
      return false;
    }

    setCartItems(prev => {
      const filtered = prev.filter(item => item.product.id !== productId);
      console.log('✅ Product removed from cart. New count:', filtered.length);
      return filtered;
    });
    return true;
  }, []);

  const clearCart = useCallback(() => {
    console.log('🗑️ Clearing entire cart');
    setCartItems([]);
  }, []);

  const isInCart = useCallback((productId: number) => {
    if (typeof productId !== 'number') return false;
    const inCart = cartItems.some(item => item.product.id === productId);
    return inCart;
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