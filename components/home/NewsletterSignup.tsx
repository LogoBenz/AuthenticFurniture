"use client";

import { useState } from "react";
import Image from "next/image";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Column - Visual */}
            <div className="md:w-1/2 bg-blue-50 dark:bg-slate-700/50 relative min-h-[300px] md:min-h-full flex items-center justify-center p-8">
              <div className="relative w-full h-full min-h-[250px]">
                <Image
                  src="/newsletter_illustration.png"
                  alt="Newsletter illustration"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto md:mx-0">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 font-heading">
                  Sign up for 5% OFF
                </h2>

                <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                  Stay updated for new products, exclusive deals, and design inspiration delivered straight to your inbox.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-8 py-3 bg-[#FF4D30] hover:bg-[#E03E25] text-white font-bold tracking-wide rounded-lg transition-colors shadow-md hover:shadow-lg uppercase text-sm"
                  >
                    Get Updates
                  </button>
                </form>

                <p className="mt-6 text-xs text-slate-400 text-center md:text-left">
                  Your email is safe with us, we don't spam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
