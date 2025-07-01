"use client";

import { MessageCircle } from "lucide-react";

export function FloatingWhatsAppButton() {
  const handleWhatsAppClick = () => {
    const message = "Hi! I'm interested in your furniture products. Can you help me with more information?";
    const phoneNumber = "2348012345678";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-40 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 group"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
      
      {/* Subtle pulse effect - much less aggressive */}
      <div className="absolute inset-0 rounded-full bg-green-600 animate-ping opacity-20 group-hover:opacity-0 transition-opacity duration-300"></div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Chat with us on WhatsApp
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
      </div>
    </button>
  );
}