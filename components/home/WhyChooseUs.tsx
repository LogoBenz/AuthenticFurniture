import React from 'react';
import { StrongIcon, DesignedIcon, PricingIcon, DeliveryIcon, SupportIcon, PeaceIcon } from '../icons/PremiumIcons';

const WhyChooseUs = () => {
  const features = [
    {
      icon: StrongIcon,
      title: "STRONG & LONG-LASTING",
      description:
        "Our furniture is built tough to withstand daily use in Nigerian homes, offices, schools, and lounges.",
    },
    {
      icon: DesignedIcon,
      title: "DESIGNED FOR EVERY SPACE",
      description:
        "Stylish, comfortable, and practical. Whether you're furnishing a home, a boardroom, a classroom, or an entire hotel.",
    },
    {
      icon: PricingIcon,
      title: "CLEAR & FLEXIBLE PRICING",
      description:
        "Upfront, no-stories pricing with bulk discounts and flexible deals to fit your budget.",
    },
    {
      icon: DeliveryIcon,
      title: "SWIFT DELIVERY",
      description:
        "We deliver quickly and safely to your location, ensuring your furniture arrives in perfect condition.",
    },
    {
      icon: SupportIcon,
      title: "ALWAYS HERE FOR YOU",
      description:
        "Dedicated support on WhatsApp and phone. We don't disappear after payment. We stay with you before, during, and after delivery.",
    },
    {
      icon: PeaceIcon,
      title: "YOUR PEACE OF MIND, GUARANTEED",
      description:
        "We are a fully registered business (CAC & LLC, RC: 927635)",
    },
  ];

  return (
    <section className="py-10 sm:py-14 bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12 lg:mb-16">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50 sm:text-3xl lg:text-4xl font-heading">
            Why You Should Choose Us
          </h2>
        </div>
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0 scrollbar-hide">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="min-w-[85vw] sm:min-w-[calc(50vw-2rem)] md:min-w-0 snap-center rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-slate-100 dark:border-slate-700 group"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors duration-300 group-hover:bg-accent dark:group-hover:bg-accent group-hover:text-accent-foreground dark:group-hover:text-accent-foreground">
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
