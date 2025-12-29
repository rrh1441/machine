import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Booking Guide | Seattle Ball Machine Rental",
  description: "Post-booking guide for Seattle tennis ball machine rental. Pickup location, setup instructions, and contact information for your rental session.",
  alternates: {
    canonical: "https://www.seattleballmachine.com/guide",
  },
  openGraph: {
    title: "Booking Guide | Seattle Ball Machine Rental",
    description: "Everything you need to know for your tennis ball machine rental session in Seattle.",
    url: "https://www.seattleballmachine.com/guide",
  },
  robots: {
    index: false, // Don't index booking confirmation pages
    follow: true,
  },
}

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
