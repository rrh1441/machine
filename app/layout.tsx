import type { Metadata } from 'next'
import './globals.css'

// Define the site metadata with advanced title template
export const metadata: Metadata = {
  // Title Configuration:
  title: {
    // Default title used on the homepage or if a page doesn't specify one
    default: 'Seattle Ball Machine Rental',
    // Template used for other pages: %s will be replaced by the page's specific title
    template: '%s | Seattle Ball Machine Rental',
  },
  // Site description (good for SEO)
  description: 'Rent a Hydrogen Proton tennis ball machine in Queen Anne, Seattle. Easy online booking and convenient pickup.',
  // Optional: You can keep or remove the generator tag
  // generator: 'v0.dev',

  // --- Icon Handling ---
  // This metadata block assumes you are using the file-based convention:
  // Place your `favicon.ico`, `icon.png`/`icon.svg`, `apple-icon.png`
  // directly in the `app/` directory alongside this layout.tsx file.
  // Next.js will automatically detect them.

  // If you PREFER to keep icons in `public/` and link them explicitly,
  // you would uncomment and configure the 'icons' section below instead:
  /*
  icons: {
    icon: '/icon.png', // Assumes icon.png is in public/
    shortcut: '/favicon.ico', // Assumes favicon.ico is in public/
    apple: '/apple-icon.png', // Assumes apple-icon.png is in public/
    // other: { rel: 'other-icon', url: '/other-icon.png' }, // Example for other icons
  },
  */
}

// The RootLayout component remains the same
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* You could add classes here for default themes, fonts etc. if needed */}
      <body>
        {/* The ThemeProvider or other context providers would typically wrap children */}
        {children}
      </body>
    </html>
  )
}