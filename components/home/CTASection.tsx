import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-blue-600 dark:bg-blue-700">
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/276651/pexels-photo-276651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            }}
          ></div>
          <div className="relative z-10 px-6 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-white md:text-4xl">
              Ready to transform your space?
            </h2>
            <p className="max-w-2xl mx-auto text-white/90 mb-8">
              Whether you're furnishing a home, office, or commercial space,
              we're here to help you find the perfect furniture pieces that
              combine style, comfort, and durability.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-white/90 rounded-md px-8"
              >
                <Link href="/products">Browse Products</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white/10 rounded-md px-8"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}