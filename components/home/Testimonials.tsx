export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Oluwaseun Adebayo",
      role: "Office Manager, Lagos Tech Hub",
      content: "We furnished our entire office with Authentic Furniture. The quality is exceptional, and their team was professional throughout the process. Highly recommend for corporate spaces.",
    },
    {
      id: 2,
      name: "Chioma Okonkwo",
      role: "Interior Designer",
      content: "As an interior designer, I've worked with many furniture suppliers. Authentic Furniture stands out for their attention to detail and quality control. My clients are always impressed.",
    },
    {
      id: 3,
      name: "Ibrahim Musa",
      role: "Hotel Owner",
      content: "We ordered custom reception furniture for our boutique hotel. The craftsmanship and finish exceeded our expectations. Will definitely work with them for our next expansion.",
    },
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-center">
          What Our Clients Say
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Trusted by businesses and homeowners across Nigeria.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex flex-col h-full">
                <blockquote className="flex-grow">
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                </blockquote>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}