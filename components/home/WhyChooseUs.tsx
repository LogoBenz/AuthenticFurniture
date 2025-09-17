import React from 'react';

const WhyChooseUs = () => {
  const features = [
    {
      number: 1,
      title: "STRONG & LONG-LASTING",
      description:
        "From a single sofa to 200 student chairs, our furniture is built tough to withstand daily use in Nigerian homes, offices, schools, and lounges.",
    },
    {
      number: 2,
      title: "DESIGNED FOR EVERY SPACE",
      description:
        "Stylish, comfortable, and practical — whether you're furnishing a home, a boardroom, a classroom, or an entire hotel.",
    },
    {
      number: 3,
      title: "CLEAR & FLEXIBLE PRICING",
      description:
        "Upfront, no-stories pricing with bulk discounts and flexible deals to fit your budget.",
    },
    {
      number: 4,
      title: "SWIFT DELIVERY, NO EXCUSES",
      description:
        "Whether it's 5 pieces or 500, we deliver quickly and reliably, nationwide.",
    },
    {
      number: 5,
      title: "ALWAYS HERE FOR YOU",
      description:
        "Dedicated support on WhatsApp and phone. We don't disappear after payment — we stay with you before, during, and after delivery.",
    },
    {
      number: 6,
      title: "YOUR PEACE OF MIND, GUARANTEED",
      description:
        "We stand by our word. If it's not what you ordered, we'll make it right. Simple.",
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Why You Should Choose Us
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Discover what makes our furniture and service stand out
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {features.map((feature) => (
            <div key={feature.number} className="text-center group">
              {/* Number Circle */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-blue-700 group-hover:scale-105 transition-all duration-300">
                  <span className="text-white text-2xl font-bold">
                    {feature.number}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 tracking-wide uppercase">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
