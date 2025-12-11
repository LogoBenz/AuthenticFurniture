import { Product, Space } from '@/types';

export interface HomeSectionsPayload {
    popularCategories: Space[] | null;
    dealsOfWeek: Product[] | null;
    newArrivals: Product[] | null;
}
