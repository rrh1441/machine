"use client"; // Make the whole layout a Client Component

import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "Seattle Ball Machine Rental",
  description: "Elevate your tennis game with professional ball machine rentals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://datafa.st/js/script.js"
          data-website-id="67f46250fc139202d6288041"
          data-domain="seattleballmachine.com"
          strategy="lazyOnload"
          defer
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}