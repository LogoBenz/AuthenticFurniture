import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { FloatingWhatsAppButton } from '@/components/ui/whatsapp-button';
import { EnquiryCartProvider } from '@/hooks/use-enquiry-cart';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Authentic Furniture | Premium Furniture for Nigerian Homes & Offices',
  description: 'High-quality imported furniture for homes, offices, and commercial spaces in Nigeria. Find ergonomic office chairs, luxury sofas, conference tables, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <EnquiryCartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <FloatingWhatsAppButton />
            </div>
          </EnquiryCartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}