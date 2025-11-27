import React from 'react';
import { Shield, Sparkles, DollarSign, Truck, Headphones, CheckCircle } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Shield,
      title: "STRONG & LONG-LASTING",
      description:
        "From a single sofa to 200 student chairs, our furniture is built tough to withstand daily use in Nigerian homes, offices, schools, and lounges.",
    },
    {
      icon: Sparkles,
      title: "DESIGNED FOR EVERY SPACE",
      description:
        "Stylish, comfortable, and practical — whether you're furnishing a home, a boardroom, a classroom, or an entire hotel.",
    },
    {
      icon: DollarSign,
      title: "CLEAR & FLEXIBLE PRICING",
      description:
        "Upfront, no-stories pricing with bulk discounts and flexible deals to fit your budget.",
    },
    {
      icon: Truck,
      title: "SWIFT DELIVERY, NO EXCUSES",
      description:
        "Whether it's 5 pieces or 500, we deliver quickly and reliably, nationwide.",
    },
    {
      icon: Headphones,
      title: "ALWAYS HERE FOR YOU",
      description:
        "Dedicated support on WhatsApp and phone. We don't disappear after payment — we stay with you before, during, and after delivery.",
    },
    {
      icon: CheckCircle,
      title: "YOUR PEACE OF MIND, GUARANTEED",
      description:
        "We stand by our word. If it's not what you ordered, we'll make it right. Simple.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl lg:text-5xl font-heading">
            Why You Should Choose Us
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
            Discover what makes our furniture and service stand out
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="rounded-lg bg-white dark:bg-slate-800 p-8 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-950 dark:text-slate-50 font-heading">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
