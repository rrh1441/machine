// app/layout.tsx
import Script from "next/script";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import ClientAnalytics from "./components/ClientAnalytics"; // relative import
import MaintenancePopup from "../components/MaintenancePopup";
import { Analytics } from '@vercel/analytics/react';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata = {
  title: "Seattle Tennis Ball Machine Rental – Queen Anne Pickup",
  description: "Professional Hydrogen Proton ball machine rental in Queen Anne, Seattle. 2-hour sessions • 65 balls included • book online. Perfect your strokes.",
  keywords: ["tennis ball machine rental", "Seattle tennis", "Queen Anne tennis", "ball machine rental Seattle", "tennis practice Seattle", "Hydrogen Proton rental"],
  authors: [{ name: "Seattle Ball Machine Rental" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Seattle Tennis Ball Machine Rental – Queen Anne Pickup",
    description: "Professional Hydrogen Proton ball machine rental in Queen Anne, Seattle. 2-hour sessions • 65 balls included • book online.",
    url: "https://www.seattleballmachine.com",
    siteName: "Seattle Ball Machine Rental",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.seattleballmachine.com/images/tennis-ball-hero.png",
        width: 1200,
        height: 630,
        alt: "Seattle Tennis Ball Machine Rental - Hydrogen Proton ball machine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seattle Tennis Ball Machine Rental – Queen Anne Pickup",
    description: "Professional Hydrogen Proton ball machine rental in Queen Anne, Seattle. 2-hour sessions • 65 balls included.",
    images: ["https://www.seattleballmachine.com/images/tennis-ball-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.seattleballmachine.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
                <link rel="preload" as="image" href="/images/tennis-ball-hero.png" />
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Seattle Ball Machine Rental",
              "description": "Professional tennis ball machine rental service in Queen Anne, Seattle",
              "url": "https://www.seattleballmachine.com",
              "telephone": "Available via booking system",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Queen Anne (near W McGraw St & 4th Ave W)",
                "addressLocality": "Seattle",
                "addressRegion": "WA",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "47.6306",
                "longitude": "-122.3626"
              },
              "areaServed": "Seattle-Tacoma-Bellevue, WA",
              "priceRange": "$30-$40 per 2 hours",
              "serviceType": "Tennis Ball Machine Rental",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Tennis Ball Machine Rental Packages",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Single Session"
                    },
                    "price": "40",
                    "priceCurrency": "USD",
                    "description": "2 hours of ball machine rental with 65 balls"
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "3-Pack Sessions"
                    },
                    "price": "105",
                    "priceCurrency": "USD",
                    "description": "Three 2-hour sessions with 65 balls each"
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "10-Pack Sessions"
                    },
                    "price": "300",
                    "priceCurrency": "USD",
                    "description": "Ten 2-hour sessions with 65 balls each"
                  }
                ]
              }
            })
          }}
        />
        {/* WebSite Schema with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Seattle Ball Machine Rental",
              "url": "https://www.seattleballmachine.com",
              "description": "Professional tennis ball machine rental service in Queen Anne, Seattle",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.seattleballmachine.com/courts/{search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Seattle Ball Machine Rental",
              "url": "https://www.seattleballmachine.com",
              "logo": "https://www.seattleballmachine.com/images/tennis-ball-hero.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-253-252-9577",
                "contactType": "customer service",
                "email": "support@firstserveseattle.com",
                "areaServed": "US",
                "availableLanguage": "English"
              },
              "sameAs": []
            })
          }}
        />
        {/* Datafa.st Analytics Script */}
        <Script
          src="https://datafa.st/js/script.js"
          data-website-id="67f46250fc139202d6288041"
          data-domain="seattleballmachine.com"
          strategy="lazyOnload"
          defer
        />
      </head>
      <body className={`${playfair.variable} ${sourceSans.variable} font-sans`}>
        <MaintenancePopup />
        {children}
        <ClientAnalytics />
        <Analytics />
      </body>
    </html>
  );
}