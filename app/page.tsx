import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { homeKeys } from '@/lib/queries/home';
import { getProductsBySubcategory, getBestSellers, getFeaturedDeals, getFeaturedProducts } from '@/lib/products';
import { getAllSpaces } from '@/lib/categories';
import { HomeSectionsPayload } from '@/types/home';

import { NewArrivals } from '@/components/home/FeaturedProducts';
import { Hero } from '@/components/home/Hero';
import { StatsSection } from '@/components/home/StatsSection';
import { Categories } from '@/components/home/Categories';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import { Testimonials } from '@/components/home/Testimonials';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';
import { CTASection } from '@/components/home/CTASection';
import { OfficeTablesSection } from '@/components/home/OfficeTablesSection';
import { OfficeChairsSection } from '@/components/home/OfficeChairsSection';
import { BestSellers } from '@/components/home/BestSellers';

export default async function Home() {
  const queryClient = new QueryClient();

  // Prefetch home sections if feature flag is enabled
  if (process.env.NEXT_PUBLIC_FEATURE_COMBINED_HOME_SECTIONS === 'true') {
    // Fetch directly on server to avoid relative URL fetch issues and improve perf
    const [popularCategories, dealsOfWeek, newArrivals] = await Promise.all([
      getAllSpaces().catch(e => { console.error('Prefetch error topics:', e); return null; }),
      getFeaturedDeals().catch(e => { console.error('Prefetch error deals:', e); return null; }),
      getFeaturedProducts().catch(e => { console.error('Prefetch error arrivals:', e); return null; }),
    ]);

    const payload: HomeSectionsPayload = {
      popularCategories,
      dealsOfWeek,
      newArrivals
    };

    queryClient.setQueryData(homeKeys.all, payload);
  }

  // Fetch products (Legacy / Independent fetches)
  const officeTablesProducts = await getProductsBySubcategory('office-tables');
  const officeChairsProducts = await getProductsBySubcategory('office-chairs');
  const bestSellersProducts = await getBestSellers();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Hero />
      <StatsSection />
      <Categories />
      <NewArrivals />
      <BestSellers products={bestSellersProducts} />
      <OfficeTablesSection products={officeTablesProducts} />
      <OfficeChairsSection products={officeChairsProducts} />
      <WhyChooseUs />
      <Testimonials />
      <NewsletterSignup />
      <CTASection />
    </HydrationBoundary>
  );
}