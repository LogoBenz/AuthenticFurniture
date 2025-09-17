import { NewArrivals } from '@/components/home/FeaturedProducts';
import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import { Testimonials } from '@/components/home/Testimonials';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';
import { CTASection } from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <NewArrivals />
      <WhyChooseUs />
      <Testimonials />
      <NewsletterSignup />
      <CTASection />
    </>
  );
}