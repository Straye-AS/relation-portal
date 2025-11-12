import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/lib/providers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Straye Relation - CRM for Straye Group",
  description:
    "Intern CRM og tilbudshåndtering for Straye Group - Administrer tilbud, kunder og prosjekter effektivt",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Straye Relation - CRM for Straye Group",
    description:
      "Intern CRM og tilbudshåndtering for Straye Group - Administrer tilbud, kunder og prosjekter effektivt",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Straye Relation",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no" suppressHydrationWarning>
      <head>
        {process.env.NEXT_PUBLIC_DATAFAST_WEBSITE_ID && (
          <Script
            data-website-id={process.env.NEXT_PUBLIC_DATAFAST_WEBSITE_ID}
            data-domain={process.env.NEXT_PUBLIC_DATAFAST_DOMAIN}
            src="https://datafa.st/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}