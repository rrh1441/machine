// app/layout.tsx
import Script from "next/script";
import "./globals.css";
import ClientAnalytics from "./components/ClientAnalytics"; // Make sure the path is correct

export const metadata = {
  title: "Seattle Ball Machine Rental",
  description: "Elevate your tennis game with professional ball machine rentals in Queen Anne, Seattle.",
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
        <ClientAnalytics />
      </body>
    </html>
  );
}