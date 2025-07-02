import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us | Authentic Furniture",
  description: "Learn about Authentic Furniture, Nigeria's premier imported furniture provider for homes, offices, and commercial spaces.",
};

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold tracking-tight mb-2">About Us</h1>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Get to know Authentic Furniture, Nigeria's trusted provider of high-quality imported furniture.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Furniture showroom"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Authentic Furniture was founded with a simple mission: to provide Nigerian homes and businesses with high-quality, stylish furniture at fair prices. What started as a small family business has grown into a trusted name in the Nigerian furniture market.
            </p>
            <p className="text-muted-foreground mb-4">
              We directly import premium furniture from China and other global markets, carefully selecting pieces that combine durability, style, and comfort. By cutting out middlemen, we're able to offer exceptional quality at competitive prices.
            </p>
            <p className="text-muted-foreground">
              Today, we're proud to serve a diverse clientele including homeowners, corporate offices, hotels, restaurants, and government institutions across Nigeria.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-xl mb-3">Quality Assurance</h3>
            <p className="text-muted-foreground">
              We personally inspect all furniture before it reaches our customers, ensuring each piece meets our strict quality standards for materials, construction, and finish.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-xl mb-3">Customer Service</h3>
            <p className="text-muted-foreground">
              Our dedicated team provides personalized assistance from selection to delivery, ensuring a seamless experience and complete satisfaction with your furniture purchase.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-xl mb-3">Nationwide Delivery</h3>
            <p className="text-muted-foreground">
              We offer reliable delivery services throughout Nigeria, with special care taken to ensure your furniture arrives in perfect condition, ready for immediate use.
            </p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Browse our extensive collection or contact us for personalized assistance with your furniture needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-amber-700 hover:bg-amber-800 text-white">
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}