import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cancel Booking | Seattle Ball Machine Rental",
  alternates: {
    canonical: "https://www.seattleballmachine.com/book/cancel",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function CancelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
