export default function FAQPage() {
  const faqs = [
    {
      q: 'Do you deliver outside of Lagos?',
      a: 'Yes! We deliver nationwide. Delivery costs and times vary depending on your state. Just enter your address at checkout to see the final cost.'
    },
    {
      q: 'Can I pay on delivery?',
      a: 'Pay on Delivery (with POS or cash) is available for all orders within Lagos State. For orders outside Lagos, pre-payment via bank transfer is required.'
    },
    {
      q: 'Is the wood original? Can it handle the Nigerian climate?',
      a: 'Absolutely. We are known for quality. We use high-quality, treated wood designed to withstand local climate conditions without warping or damage from insects.'
    },
    {
      q: 'Can I negotiate the price?',
      a: 'Our online prices are our best prices, carefully set to give you the most value. However, for bulk purchases for a new home or office, please contact us directly for a custom quote.'
    },
    {
      q: 'Can I come and see the furniture before I buy?',
      a: 'Yes, you are welcome to visit our showroom at our Alaba International Market address to see and feel the quality for yourself before placing an order online.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {faqs.map((item, idx) => (
          <details key={idx} className="group py-4">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="font-medium text-slate-900 dark:text-white">{item.q}</span>
              <span className="ml-4 text-slate-500 group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}



