export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Delivery Across Nigeria</h1>
      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        <section>
          <h2 className="text-xl font-semibold mb-2">Lagos Deliveries</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Standard (3-5 business days): Flat rate of ₦5,000.</li>
            <li>Express (1-2 business days): Rate calculated at checkout based on location.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Nationwide Deliveries (Outside Lagos)</h2>
          <p className="text-sm">
            5-10 business days. Shipping cost is calculated at checkout based on your state and the size of your order. We partner with trusted local logistics companies to ensure your furniture arrives safely.
          </p>
        </section>
      </div>
    </div>
  );
}



