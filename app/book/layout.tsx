import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book a Tennis Ball Machine Rental | Seattle Ball Machine",
  description:
    "Book your tennis ball machine rental online. 2-hour sessions with 65 balls included, easy Queen Anne pickup. Single sessions, 3-packs, and 10-packs available.",
  alternates: {
    canonical: "https://www.seattleballmachine.com/book",
  },
  openGraph: {
    title: "Book a Tennis Ball Machine Rental | Seattle Ball Machine",
    description:
      "Book your tennis ball machine rental online. 2-hour sessions, 65 balls included, easy Queen Anne pickup.",
    url: "https://www.seattleballmachine.com/book",
  },
}

export default function BookLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
