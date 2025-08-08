"use client";

import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setError(null);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          // Handle specific error types
          if (error.message?.includes('AuthRetryableFetchError') || error.message?.includes('fetch')) {
            setError('Network connection issue. Please check your internet connection.');
          } else {
            setError('Authentication error. Please try again.');
          }
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error: any) {
        console.error('Error in getInitialSession:', error);
        setError('Unable to connect to authentication service.');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          console.log('Auth state changed:', event, session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
          setError(null);
        } catch (error: any) {
          console.error('Auth state change error:', error);
          setError('Authentication state error.');
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        if (error.message?.includes('AuthRetryableFetchError') || error.message?.includes('fetch')) {
          setError('Network error during sign out. You may need to refresh the page.');
        } else {
          setError('Sign out failed. Please try again.');
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Sign out error:', error);
      setError('Sign out failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const retryConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error: any) {
      console.error('Retry connection failed:', error);
      setError('Still unable to connect. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    error,
    signOut,
    retryConnection,
    isAuthenticated: !!session,
  };
}