import { fetchWithTimeout, FetchError } from '@/lib/api/client';
import { HomeSectionsPayload } from '@/types/home';

export const homeKeys = {
    all: ['home-sections'] as const,
};

export async function fetchHomeSections(): Promise<HomeSectionsPayload> {
    const res = await fetchWithTimeout('/api/home-sections');

    if (!res.ok) {
        throw new FetchError(res.status, res.statusText);
    }

    return res.json();
}
