import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Providers } from "@/lib/providers";
import Script from "next/script";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

import { Exo_2 } from "next/font/google";

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Adding more weights for flexibility
  variable: "--font-exo-2",
});

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
      <body className={`${montserrat.className} ${exo2.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
