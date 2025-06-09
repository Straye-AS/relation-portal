import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NeoSaaS - Modern SaaS Starter',
  description: 'A modern SaaS starter kit built with Next.js, TypeScript, Supabase and Tailwind CSS',
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    title: 'NeoSaaS - Modern SaaS Starter',
    description: 'A modern SaaS starter kit built with Next.js, TypeScript, Supabase and Tailwind CSS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NeoSaaS Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeoSaaS - Modern SaaS Starter',
    description: 'A modern SaaS starter kit built with Next.js, TypeScript, Supabase and Tailwind CSS',
    images: ['/og-image.png'],
    creator: '@neosaas',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      {/* <Script
          data-website-id="YOUR_WEBSITE_ID"
          data-domain="YOUR_DOMAIN.COM"
          src="https://datafa.st/js/script.js"
          strategy="afterInteractive"
        /> */}

        <meta property="og:url" content="https://demo.neosaas.dev" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="NeoSaaS - Modern SaaS Starter" />
        <meta property="og:description" content="A modern SaaS starter kit built with Next.js, TypeScript, Supabase and Tailwind CSS" />
        <meta property="og:image" content="https://demo.neosaas.dev/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="demo.neosaas.dev" />
        <meta property="twitter:url" content="https://demo.neosaas.dev" />
        <meta name="twitter:title" content="NeoSaaS - Modern SaaS Starter" />
        <meta name="twitter:description" content="A modern SaaS starter kit built with Next.js, TypeScript, Supabase and Tailwind CSS" />
        <meta name="twitter:image" content="https://demo.neosaas.dev/og-image.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}