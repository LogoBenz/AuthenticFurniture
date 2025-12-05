import { useCallback, useEffect } from 'react';
import { supabase as createClient } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Types
interface UseWishlistReturn {
  wishlist: string[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;
  wishlistCount: number;
  loading: boolean;
}

interface GuestWishlistData {
  productIds: string[];
  lastUpdated: string;
}

// Constants
const GUEST_WISHLIST_KEY = 'guest_wishlist';
const GUEST_INFO_SHOWN_KEY = 'wishlist_guest_info_shown';
const MAX_WISHLIST_ITEMS = 100;
const QUERY_KEY = ['wishlist'];

// Error messages
const ERROR_MESSAGES = {
  ADD_FAILED: "Couldn't add to wishlist. Please try again.",
  REMOVE_FAILED: "Couldn't remove from wishlist. Please try again.",
  LOAD_FAILED: "Couldn't load your wishlist. Please refresh.",
  SYNC_FAILED: "Couldn't sync your wishlist. Changes saved locally.",
  STORAGE_FULL: "Wishlist is full. Remove items to add more."
};

export function useWishlist(): UseWishlistReturn {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const supabase = createClient;

  // --- Helpers for Guest Wishlist (LocalStorage) ---

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

  // --- React Query: Fetch Wishlist ---

  const { data: wishlist = [], isLoading: loading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      // If authenticated, fetch from DB
      if (isAuthenticated && user) {
        const { data, error } = await supabase
          .from('wishlists')
          .select('product_id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Note: active sync is handled in useEffect below
        return data?.map((item: any) => item.product_id) || [];
      }

      // If guest, fetch from LocalStorage
      return getGuestWishlist();
    },
    // Only refetch when auth state changes or window focus
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // --- React Query: Mutations ---

  const addMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('wishlists')
          .insert({ user_id: user.id, product_id: productId });

        if (error && error.code !== '23505') throw error; // Ignore duplicate error
      } else {
        const current = getGuestWishlist();
        if (!current.includes(productId)) {
          saveGuestWishlist([...current, productId]);
        }
      }
    },
    onMutate: async (productId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      // Snapshot previous value
      const previousWishlist = queryClient.getQueryData<string[]>(QUERY_KEY);

      // Optimistically update
      queryClient.setQueryData<string[]>(QUERY_KEY, (old = []) => {
        if (old.includes(productId)) return old;
        return [...old, productId];
      });

      return { previousWishlist };
    },
    onError: (err, newTodo, context) => {
      // Rollback
      queryClient.setQueryData(QUERY_KEY, context?.previousWishlist);
      console.error(ERROR_MESSAGES.ADD_FAILED, err);
      toast.error(ERROR_MESSAGES.ADD_FAILED);
    },
    onSuccess: () => {
      toast.success('Added to wishlist');

      // Show info tip for guests on first add
      if (!isAuthenticated && typeof window !== 'undefined') {
        const hasShownInfo = localStorage.getItem(GUEST_INFO_SHOWN_KEY);
        if (!hasShownInfo) {
          toast.info('Sign in to save your wishlist across devices', {
            duration: 6000,
            cancel: {
              label: 'Dismiss',
              onClick: () => { },
            },
          });
          localStorage.setItem(GUEST_INFO_SHOWN_KEY, 'true');
        }
      }
    },
    onSettled: () => {
      // Invalidate to refetch true state
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
      } else {
        const current = getGuestWishlist();
        saveGuestWishlist(current.filter(id => id !== productId));
      }
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previousWishlist = queryClient.getQueryData<string[]>(QUERY_KEY);

      queryClient.setQueryData<string[]>(QUERY_KEY, (old = []) => {
        return old.filter(id => id !== productId);
      });

      return { previousWishlist };
    },
    onError: (err, productId, context) => {
      queryClient.setQueryData(QUERY_KEY, context?.previousWishlist);
      console.error(ERROR_MESSAGES.REMOVE_FAILED, err);
      toast.error(ERROR_MESSAGES.REMOVE_FAILED);
    },
    onSuccess: () => {
      toast.success('Removed from wishlist');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        localStorage.removeItem(GUEST_WISHLIST_KEY);
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEY, []);
    }
  });

  // --- Realtime Subscription ---

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    console.log('🔌 Subscribing to wishlist changes');
    const channel = supabase
      .channel('wishlist_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wishlists',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('🔄 Realtime wishlist change:', payload);
          queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        }
      )
      .subscribe();

    return () => {
      console.log('🔌 Unsubscribing from wishlist changes');
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, user, queryClient, supabase]);

  // --- Sync Logic: Guest -> Auth ---

  useEffect(() => {
    const syncGuestWishlist = async () => {
      if (!isAuthenticated || !user) return;

      const guestItems = getGuestWishlist();
      if (guestItems.length === 0) return;

      try {
        // Create insert payload
        const inserts = guestItems.map(productId => ({
          user_id: user.id,
          product_id: productId
        }));

        // Upsert to DB (ignore duplicates handled by ON CONFLICT or separate check, 
        // but here we rely on Supabase ignoring if we used insert with onConflict if setup, 
        // or we just try insert and ignore errors for simplicity as duplicates will fail gracefully usually 
        // OR better: use upsert with ignoreDuplicates: true if policy allows)

        // Simple approach: insert loop or bulk insert. 
        // Supabase `upsert` with `ignoreDuplicates` is best.
        const { error } = await supabase
          .from('wishlists')
          .upsert(inserts, { onConflict: 'user_id,product_id', ignoreDuplicates: true });

        if (error) {
          console.error("Sync error:", error);
          // Don't clear local storage if sync fails so we can try again later? 
          // For now, we log it.
        } else {
          // Success: Clear guest wishlist and refetch
          localStorage.removeItem(GUEST_WISHLIST_KEY);
          toast.success("Wishlist synced with your account");
          queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        }
      } catch (err) {
        console.error("Sync exception:", err);
      }
    };

    if (isAuthenticated) {
      syncGuestWishlist();
    }
  }, [isAuthenticated, user, getGuestWishlist, queryClient, supabase]);

  // --- Public API ---

  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlist.includes(productId);
  }, [wishlist]);

  const addToWishlist = useCallback((productId: string) => {
    if (wishlist.length >= MAX_WISHLIST_ITEMS) {
      console.warn(ERROR_MESSAGES.STORAGE_FULL);
      toast.error(ERROR_MESSAGES.STORAGE_FULL);
      return;
    }
    addMutation.mutate(productId);
  }, [wishlist.length, addMutation]);

  const removeFromWishlist = useCallback((productId: string) => {
    removeMutation.mutate(productId);
  }, [removeMutation]);

  const toggleWishlist = useCallback((productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  const clearWishlist = useCallback(() => {
    clearMutation.mutate();
  }, [clearMutation]);

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
