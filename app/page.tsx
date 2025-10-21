import { NewArrivals } from '@/components/home/FeaturedProducts';
import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import { Testimonials } from '@/components/home/Testimonials';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';
import { CTASection } from '@/components/home/CTASection';
import { OfficeTablesSection } from '@/components/home/OfficeTablesSection';
import { OfficeChairsSection } from '@/components/home/OfficeChairsSection';
import { BestSellers } from '@/components/home/BestSellers';
import { getProductsBySubcategory, getBestSellers } from '@/lib/products';

export default async function Home() {
  // Fetch products
  const officeTablesProducts = await getProductsBySubcategory('office-tables');
  const officeChairsProducts = await getProductsBySubcategory('office-chairs');
  const bestSellersProducts = await getBestSellers();

  return (
    <>
      <Hero />
      <Categories />
      <NewArrivals />
      <BestSellers products={bestSellersProducts} />
      <OfficeTablesSection products={officeTablesProducts} />
      <OfficeChairsSection products={officeChairsProducts} />
      <WhyChooseUs />
      <Testimonials />
      <NewsletterSignup />
      <CTASection />
    </>
  );
}