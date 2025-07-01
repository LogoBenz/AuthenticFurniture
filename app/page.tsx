import { FeaturedProducts } from '@/components/products/FeaturedProducts';
import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { Testimonials } from '@/components/home/Testimonials';
import { CTASection } from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Testimonials />
      <CTASection />
    </>
  );
}