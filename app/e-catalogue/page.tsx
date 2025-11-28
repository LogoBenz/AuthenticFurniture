"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft, Download, Eye, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

export default function ECataloguePage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Here you would typically send the email to your backend
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800"
        >
          <div className="grid md:grid-cols-2">
            {/* Left Content Side */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-8 text-blue-800 dark:text-blue-400">
                <BookOpen className="w-8 h-8" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 font-heading">
                E-Catalogue Coming Soon
              </h1>

              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                We're crafting a comprehensive digital experience. Our new e-catalogue will feature
                interactive 3D views, detailed specifications, and our complete premium collection.
              </p>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="mb-8">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Get notified when it launches
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      className="flex-1"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white">
                      <Bell className="w-4 h-4 mr-2" />
                      Notify Me
                    </Button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-lg mb-8 flex items-center"
                >
                  <Bell className="w-5 h-5 mr-2" />
                  Thanks! We'll let you know when it's ready.
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white">
                  <Link href="/products">
                    Browse Online
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/showroom">
                    Visit Showroom
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Feature Side */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 md:p-12 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6">What to expect</h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0 text-blue-600">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Interactive Views</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Explore products in 360° detail with high-resolution zoom capabilities.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0 text-blue-600">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Offline Access</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Download specific collections or the full catalogue for offline presentation.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0 text-blue-600">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Complete Specs</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Detailed dimensions, material options, and customization guides.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-slate-500 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
