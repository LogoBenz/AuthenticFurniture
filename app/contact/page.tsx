import Image from "next/image";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Contact Us | Authentic Furniture",
  description: "Get in touch with Authentic Furniture for inquiries about our premium furniture products for homes, offices, and commercial spaces in Nigeria.",
};

export default function ContactPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-12 max-w-3xl">
          Have questions or need assistance? We're here to help you find the perfect furniture for your space.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-amber-700 dark:text-amber-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <a 
                      href="tel:+2348012345678" 
                      className="text-muted-foreground hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
                    >
                      +234 801 234 5678
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-amber-700 dark:text-amber-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <a 
                      href="mailto:info@authenticfurniture.ng" 
                      className="text-muted-foreground hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
                    >
                      info@authenticfurniture.ng
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-amber-700 dark:text-amber-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium">Showroom & Warehouse</h3>
                    <p className="text-muted-foreground">
                      123 Warehouse District<br />
                      Ikeja, Lagos<br />
                      Nigeria
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-amber-700 dark:text-amber-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium">Business Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium mb-3">Connect with Us</h3>
                <p className="text-muted-foreground mb-4">
                  For the fastest response, reach out to us on WhatsApp.
                </p>
                <Button 
                  asChild
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <a 
                    href="https://wa.me/2348012345678?text=Hi%2C%20I%20saw%20your%20furniture%20website%20and%20I'm%20interested%20in%20some%20products." 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="relative h-[400px] lg:h-auto rounded-lg overflow-hidden">
            <Image
              src="https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Furniture showroom"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}