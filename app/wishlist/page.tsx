import { Metadata } from 'next';
import { WishlistPageClient } from './WishlistPageClient';

export const metadata: Metadata = {
  title: 'My Wishlist | Authentic Furniture',
  description: 'View and manage your saved furniture items. Your personal collection of favorite products.',
  openGraph: {
    title: 'My Wishlist | Authentic Furniture',
    description: 'View and manage your saved furniture items.',
  },
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}
