// app/layout.tsx
import Script from "next/script";
import "./globals.css";
import ClientAnalytics from "./components/ClientAnalytics"; // relative import
import MaintenancePopup from "../components/MaintenancePopup";
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: "Seattle Tennis Ball Machine Rental – Queen Anne Pickup",
  description: "Professional Hydrogen Proton ball machine rental in Queen Anne, Seattle. 2-hour sessions • 65 balls included • book online. Perfect your strokes with solo practice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://www.seattleballmachine.com/" />
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
        {/* Datafa.st Analytics Script */}
        <Script
          src="https://datafa.st/js/script.js"
          data-website-id="67f46250fc139202d6288041"
          data-domain="seattleballmachine.com"
          strategy="lazyOnload"
          defer
        />
      </head>
      <body>
        <MaintenancePopup />
        {children}
        <ClientAnalytics />
        <Analytics />
      </body>
    </html>
  );
}