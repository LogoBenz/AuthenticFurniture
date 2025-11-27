import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Full Background Image with Parallax-like feel */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/luxury_office_cta.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Overlay for text contrast */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Glassmorphism Card */}
          <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 rounded-2xl p-8 md:p-16 text-center shadow-2xl overflow-hidden relative group">

            {/* Decorative Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/30 rounded-full blur-3xl group-hover:bg-blue-400/40 transition-all duration-1000"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-400/30 transition-all duration-1000"></div>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white font-heading drop-shadow-lg leading-tight">
              Ready to transform <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">your space?</span>
            </h2>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-blue-50/90 mb-10 leading-relaxed font-light drop-shadow-md">
              Whether you're furnishing a home, office, or commercial space,
              we're here to help you find the perfect furniture pieces that
              combine style, comfort, and durability.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Button
                asChild
                size="lg"
                className="bg-white text-slate-900 hover:bg-blue-50 hover:scale-105 transition-all duration-300 rounded-full px-12 py-8 text-lg font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-white/50"
              >
                <Link href="/products">Browse Products</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-black/20 border-white/30 text-white hover:bg-white/10 hover:border-white/60 rounded-full px-12 py-8 text-lg font-medium backdrop-blur-sm transition-all duration-300"
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