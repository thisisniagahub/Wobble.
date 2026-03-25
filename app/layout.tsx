import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, DM_Serif_Display } from 'next/font/google';
import './globals.css';
import { Analytics } from "@vercel/analytics/react";
import { CustomCursor } from './components/custom-cursor';
import { buildAbsoluteUrl, siteConfig } from '@/lib/site-config';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-dm-serif',
});

export const viewport: Viewport = {
  themeColor: '#1A1A1A',
};

export const metadata: Metadata = {
  title: 'Wobble | Premium Panna Cotta',
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.siteUrl),
  applicationName: siteConfig.name,
  authors: [{ name: 'Wobble Team' }],
  generator: 'Next.js',
  keywords: ['panna cotta', 'dessert', 'gift box', 'premium dessert', 'wobble', 'malaysia', 'whatsapp order'],
  creator: 'Wobble Studio',
  publisher: 'Wobble Panna Cotta',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_MY',
    url: siteConfig.siteUrl,
    title: 'Wobble | Premium Panna Cotta',
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{
      url: buildAbsoluteUrl('/opengraph-image'),
      width: 1200,
      height: 630,
      alt: 'Wobble premium panna cotta'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wobble | Premium Panna Cotta',
    description: siteConfig.description,
    creator: '@wobblehq',
    images: [buildAbsoluteUrl('/opengraph-image')],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: siteConfig.name,
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${dmSerifDisplay.variable} [color-scheme:dark]`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className="font-sans antialiased pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
        suppressHydrationWarning
      >
        {/* Global Noise Texture Overlay */}
        <div className="fixed inset-0 z-50 pointer-events-none bg-noise" aria-hidden="true" />
        
        <CustomCursor />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
