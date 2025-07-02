"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  productName?: string;
}

export function WhatsAppButton({
  phoneNumber = "2348012345678", // Default phone number, replace with actual
  message = "Hi, I saw your furniture website and I'm interested in some products.",
  productName
}: WhatsAppButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const finalMessage = productName 
    ? `Hi, I'm interested in the ${productName} from Authentic Furniture. Can you provide more information?` 
    : message;
  
  const encodedMessage = encodeURIComponent(finalMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center">
          {isHovered && (
            <div className="mr-2 bg-white dark:bg-slate-800 py-2 px-3 rounded-lg shadow-md text-sm font-medium animate-fade-in">
              Chat with us
            </div>
          )}
          <Button
            size="lg" 
            className="rounded-full h-14 w-14 bg-green-500 hover:bg-green-600 transition-transform hover:scale-105"
          >
            <MessageCircle className="h-6 w-6 text-white" />
            <span className="sr-only">WhatsApp Contact</span>
          </Button>
        </div>
      </a>
    </div>
  );
}