import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Skylife Sciences Solutions | Advanced Pharmaceutical & Life Sciences R&D Solutions',
  description: 'Skylife Sciences Solutions provides advanced analytical, laboratory, pharmaceutical, biotechnology, and life sciences solutions to accelerate pharmaceutical research, drug discovery, and manufacturing excellence globally.',
  keywords: 'pharmaceutical R&D, drug discovery, biotechnology research, analytical testing, quality control, laboratory instruments, life sciences solutions',
  authors: [{ name: 'Skylife Sciences Solutions' }],
  icons: {
    icon: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
        
        {/* Hidden Google Translate Widget */}
        <div id="google_translate_element" style={{ display: 'none' }} />
        <Script id="google-translate-config" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
