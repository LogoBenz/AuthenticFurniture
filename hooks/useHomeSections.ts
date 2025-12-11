"use client";

import { useQuery } from '@tanstack/react-query';
import { homeKeys, fetchHomeSections } from '@/lib/queries/home';
import { HomeSectionsPayload } from '@/types/home';

export function useHomeSections() {
    const isCombinedEnabled = process.env.NEXT_PUBLIC_FEATURE_COMBINED_HOME_SECTIONS === 'true';

    const { data, isLoading, error } = useQuery<HomeSectionsPayload, Error>({
        queryKey: homeKeys.all,
        queryFn: fetchHomeSections,
        // Spec: staleTime=5min, gcTime=15min, refetchOnWindowFocus=false, retry=1
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
        enabled: isCombinedEnabled, // Only run this query if feature flag is true
    });

    return {
        isCombinedEnabled,
        data,
        isLoading,
        error,
    };
}
