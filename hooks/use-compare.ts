"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Product } from '@/types';

// Constants
const COMPARE_STORAGE_KEY = 'compare_list';
const MAX_COMPARE_ITEMS = 4;

interface UseCompareReturn {
    compareList: string[];
    isInCompare: (productId: string) => boolean;
    addToCompare: (product: Product) => void;
    removeFromCompare: (productId: string) => void;
    toggleCompare: (product: Product) => void;
    clearCompare: () => void;
    compareCount: number;
}

export function useCompare(): UseCompareReturn {
    const [compareList, setCompareList] = useState<string[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
            if (stored) {
                setCompareList(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading compare list:', error);
        }
    }, []);

    // Save to localStorage whenever list changes
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareList));
        } catch (error) {
            console.error('Error saving compare list:', error);
        }
    }, [compareList]);

    const isInCompare = useCallback((productId: string) => {
        return compareList.includes(productId);
    }, [compareList]);

    const addToCompare = useCallback((product: Product) => {
        if (compareList.length >= MAX_COMPARE_ITEMS) {
            toast.error(`You can only compare up to ${MAX_COMPARE_ITEMS} items`);
            return;
        }

        if (!compareList.includes(product.id.toString())) {
            setCompareList(prev => [...prev, product.id.toString()]);
            toast.success(`${product.name} added to compare`);
        }
    }, [compareList]);

    const removeFromCompare = useCallback((productId: string) => {
        setCompareList(prev => prev.filter(id => id !== productId));
        toast.info('Removed from compare');
    }, []);

    const toggleCompare = useCallback((product: Product) => {
        if (isInCompare(product.id.toString())) {
            removeFromCompare(product.id.toString());
        } else {
            addToCompare(product);
        }
    }, [isInCompare, addToCompare, removeFromCompare]);

    const clearCompare = useCallback(() => {
        setCompareList([]);
        toast.info('Compare list cleared');
    }, []);

    return {
        compareList,
        isInCompare,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        compareCount: compareList.length
    };
}
