import './globals.css';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter, DM_Sans } from 'next/font/google';
import { CrazyNavbar } from '@/components/layout/CrazyNavbar';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { FloatingWhatsAppButton } from '@/components/ui/whatsapp-button';
import { EnquiryCartProvider } from '@/hooks/use-enquiry-cart';
import { NewsletterPopup } from '@/components/ui/NewsletterPopup';
import { CompareBar } from '@/components/products/CompareBar';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';

// Professional font pairing - DM Sans for headings, Inter for body
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

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
      <body className={`${inter.variable} ${dmSans.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <EnquiryCartProvider>
              <div className="flex flex-col min-h-screen">
                <Suspense fallback={null}>
                  <CrazyNavbar />
                </Suspense>
                <MainLayoutWrapper>{children}</MainLayoutWrapper>
                <Footer />
                <FloatingWhatsAppButton />
                <NewsletterPopup />
                <CompareBar />
              </div>
            </EnquiryCartProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}