export default function PaymentOptionsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Flexible & Secure Payment Options</h1>
      <div className="space-y-6 text-slate-700 dark:text-slate-300 text-sm">
        <p>We offer several ways to pay for your convenience:</p>
        <section>
          <h2 className="text-lg font-semibold mb-2">Bank Transfer</h2>
          <p>Transfer directly to our company account. Account details will be provided at checkout.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-2">Pay on Delivery (POS or Cash)</h2>
          <p>Available for deliveries within Lagos only. You can pay with your card via our delivery agent's POS machine or with cash upon arrival.</p>
        </section>
      </div>
    </div>
  );
}



