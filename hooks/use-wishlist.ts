"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase as createClient } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

// Types
interface UseWishlistReturn {
  wishlist: string[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  wishlistCount: number;
  loading: boolean;
}

interface GuestWishlistData {
  productIds: string[];
  lastUpdated: string;
}

// Constants
const GUEST_WISHLIST_KEY = 'guest_wishlist';
const MAX_WISHLIST_ITEMS = 100;

// Error messages
const ERROR_MESSAGES = {
  ADD_FAILED: "Couldn't add to wishlist. Please try again.",
  REMOVE_FAILED: "Couldn't remove from wishlist. Please try again.",
  LOAD_FAILED: "Couldn't load your wishlist. Please refresh.",
  SYNC_FAILED: "Couldn't sync your wishlist. Changes saved locally.",
  STORAGE_FULL: "Wishlist is full. Remove items to add more."
};

export function useWishlist(): UseWishlistReturn {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const supabase = createClient;

  // Helper function to get guest wishlist from localStorage
  const getGuestWishlist = useCallback((): string[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(GUEST_WISHLIST_KEY);
      if (!stored) return [];
      
      const data: GuestWishlistData = JSON.parse(stored);
      return Array.isArray(data.productIds) ? data.productIds : [];
    } catch (error) {
      console.error('Error reading guest wishlist:', error);
      return [];
    }
  }, []);

  // Helper function to save guest wishlist to localStorage
  const saveGuestWishlist = useCallback((productIds: string[]) => {
    if (typeof window === 'undefined') return;
    
    try {
      const data: GuestWishlistData = {
        productIds,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving guest wishlist:', error);
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn(ERROR_MESSAGES.STORAGE_FULL);
      }
    }
  }, []);

  // Load wishlist from database (authenticated users)
  const loadWishlistFromDB = useCallback(async (): Promise<string[]> => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading wishlist from DB:', error);
        return [];
      }
      
      return data?.map((item: any) => item.product_id) || [];
    } catch (error) {
      console.error('Error loading wishlist from DB:', error);
      return [];
    }
  }, [user, supabase]);

  // Add product to database wishlist
  const addToWishlistDB = useCallback(async (productId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          product_id: productId
        });
      
      if (error) {
        if (error.code === '23505') {
          return true;
        }
        console.error('Error adding to wishlist DB:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error adding to wishlist DB:', error);
      return false;
    }
  }, [user, supabase]);

  // Remove product from database wishlist
  const removeFromWishlistDB = useCallback(async (productId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
      
      if (error) {
        console.error('Error removing from wishlist DB:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error removing from wishlist DB:', error);
      return false;
    }
  }, [user, supabase]);

  // Sync guest wishlist to database on login
  const syncGuestWishlistToDB = useCallback(async (guestWishlist: string[]) => {
    if (!user || guestWishlist.length === 0) return;
    
    try {
      const dbWishlist = await loadWishlistFromDB();
      const itemsToAdd = guestWishlist.filter(id => !dbWishlist.includes(id));
      
      if (itemsToAdd.length > 0) {
        const { error } = await supabase
          .from('wishlists')
          .insert(
            itemsToAdd.map(productId => ({
              user_id: user.id,
              product_id: productId
            }))
          );
        
        if (error) {
          console.error('Error syncing guest wishlist:', error);
          return;
        }
      }
      
      localStorage.removeItem(GUEST_WISHLIST_KEY);
      console.log(`Synced ${itemsToAdd.length} items from guest wishlist to database`);
    } catch (error) {
      console.error('Error syncing guest wishlist:', error);
    }
  }, [user, supabase, loadWishlistFromDB]);

  // Load initial wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      
      try {
        if (isAuthenticated && user) {
          const dbWishlist = await loadWishlistFromDB();
          const guestWishlist = getGuestWishlist();
          
          if (guestWishlist.length > 0) {
            await syncGuestWishlistToDB(guestWishlist);
            const updatedWishlist = await loadWishlistFromDB();
            setWishlist(updatedWishlist);
          } else {
            setWishlist(dbWishlist);
          }
        } else {
          const guestWishlist = getGuestWishlist();
          setWishlist(guestWishlist);
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadWishlist();
  }, [isAuthenticated, user, loadWishlistFromDB, getGuestWishlist, syncGuestWishlistToDB]);

  // Helper functions
  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlist.includes(productId);
  }, [wishlist]);

  const addToWishlist = useCallback(async (productId: string): Promise<void> => {
    console.log('🎯 addToWishlist called with:', productId);
    console.log('📋 Current wishlist:', wishlist);
    console.log('🔐 isAuthenticated:', isAuthenticated, 'user:', user?.id);
    
    if (isInWishlist(productId)) {
      console.log('⚠️ Product already in wishlist');
      return;
    }
    
    if (wishlist.length >= MAX_WISHLIST_ITEMS) {
      console.warn(ERROR_MESSAGES.STORAGE_FULL);
      return;
    }
    
    const newWishlist = [...wishlist, productId];
    console.log('📝 New wishlist will be:', newWishlist);
    setWishlist(newWishlist);
    
    try {
      if (isAuthenticated && user) {
        console.log('💾 Saving to database...');
        const success = await addToWishlistDB(productId);
        if (!success) {
          setWishlist(wishlist);
          console.error(ERROR_MESSAGES.ADD_FAILED);
        } else {
          console.log('✅ Saved to database successfully');
        }
      } else {
        console.log('💾 Saving to localStorage...');
        saveGuestWishlist(newWishlist);
        console.log('✅ Saved to localStorage');
      }
    } catch (error) {
      setWishlist(wishlist);
      console.error(ERROR_MESSAGES.ADD_FAILED, error);
    }
  }, [wishlist, isInWishlist, isAuthenticated, user, addToWishlistDB, saveGuestWishlist]);

  const removeFromWishlist = useCallback(async (productId: string): Promise<void> => {
    if (!isInWishlist(productId)) return;
    
    const newWishlist = wishlist.filter(id => id !== productId);
    setWishlist(newWishlist);
    
    try {
      if (isAuthenticated && user) {
        const success = await removeFromWishlistDB(productId);
        if (!success) {
          setWishlist(wishlist);
          console.error(ERROR_MESSAGES.REMOVE_FAILED);
        }
      } else {
        saveGuestWishlist(newWishlist);
      }
    } catch (error) {
      setWishlist(wishlist);
      console.error(ERROR_MESSAGES.REMOVE_FAILED, error);
    }
  }, [wishlist, isInWishlist, isAuthenticated, user, removeFromWishlistDB, saveGuestWishlist]);

  const toggleWishlist = useCallback(async (productId: string): Promise<void> => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  const clearWishlist = useCallback(async (): Promise<void> => {
    setWishlist([]);
    
    try {
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error clearing wishlist:', error);
        }
      } else {
        localStorage.removeItem(GUEST_WISHLIST_KEY);
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  }, [isAuthenticated, user, supabase]);

  return {
    wishlist,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    wishlistCount: wishlist.length,
    loading
  };
}
