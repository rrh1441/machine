import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reschedule Booking | Seattle Ball Machine Rental",
  alternates: {
    canonical: "https://www.seattleballmachine.com/book/reschedule",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function RescheduleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
