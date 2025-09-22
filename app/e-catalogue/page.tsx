import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ECataloguePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center max-w-2xl mx-auto px-4">
        {/* Icon */}
        <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <BookOpen className="w-12 h-12 text-white" />
        </div>

        {/* Main Content */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
          E-Catalogue Coming Soon
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
          We're working on something amazing! Our comprehensive digital catalogue will showcase 
          all our furniture collections in an interactive, beautiful format.
        </p>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg border border-yellow-200 dark:border-slate-700">
            <Eye className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Interactive View</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">360° product views and zoom</p>
          </div>
          <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg border border-yellow-200 dark:border-slate-700">
            <Download className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Downloadable PDF</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Save and share offline</p>
          </div>
          <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg border border-yellow-200 dark:border-slate-700">
            <BookOpen className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Complete Collection</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">All products in one place</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            In the meantime, explore our products online or visit our showroom.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold px-8 py-3">
              <Link href="/products" className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Browse Products
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="border-yellow-400 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 px-8 py-3">
              <Link href="/showroom" className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Visit Showroom
              </Link>
            </Button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 pt-6 border-t border-yellow-200 dark:border-slate-700">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
