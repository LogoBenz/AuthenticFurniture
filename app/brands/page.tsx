export default function BrandsComingSoonPage() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
      <div className="absolute inset-0 -z-10 bg-white/60 dark:bg-slate-900/70" />
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold mb-3">The Workshop is Busy.</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          We're crafting partnerships with Nigeria's finest artisans and international brands. Something special is coming soon.
        </p>
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <input type="email" placeholder="Be the first to know" className="flex-1 px-3 py-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
          <button className="px-4 py-3 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold">Notify Me</button>
        </div>
      </div>
    </div>
  );
}



