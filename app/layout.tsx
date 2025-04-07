// app/layout.tsx
import dynamic from "next/dynamic";
import Script from "next/script";
import "./globals.css";

const Analytics = dynamic(
  () => import("@vercel/analytics/react").then((mod) => mod.Analytics),
  { ssr: false }
);

export const metadata = {
  title: "Seattle Ball Machine Rental",
  description: "Elevate your tennis game with professional ball machine rentals in Queen Anne, Seattle.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
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
        {children}
        {/* Dynamically loaded Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}