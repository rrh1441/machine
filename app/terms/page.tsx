import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | Seattle Ball Machine Rental",
  description: "Terms of service for Seattle Ball Machine Rental. Rental agreements, policies, and conditions for tennis ball machine rentals in Seattle.",
  alternates: {
    canonical: "https://www.seattleballmachine.com/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
}
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-12">
      <Link href="/" className="flex items-center gap-2 mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="h-4 w-4" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl font-bold tracking-tight mb-6">Terms of Service</h1>
      
      <div className="prose prose-green max-w-none">
        <p>Last Updated: February 3, 2026</p>

        <h2>1. Rental Agreement</h2>
        <p>By renting the Hydrogen Proton ball machine ("Equipment") from Seattle Ball Machine Rental, a product of First Serve Seattle, owned by Simple Apps, LLC, you agree to these Terms of Service. You must be at least 18 years old to rent the Equipment.</p>
        
        <h2>2. Rental Period</h2>
        <p>The rental period is for 2 hours per session, unless otherwise specified in your booking. There is a 15 minute grace period at the end of the rental. Late returns beyond this grace period will result in additional charges according to the following schedule:</p>
        <ul>
          <li>+15 minutes - free (grace period)</li>
          <li>16-30 minutes - $50</li>
          <li>31-45 minutes - $100</li>
          <li>46-60 minutes - $150</li>
          <li>+61 minutes - $400</li>
        </ul>
        <p>Any delayed return of more than an hour is subject to the maximum $400 fee.</p>
        
        <h2>3. Tennis Balls and Equipment</h2>
        <p>Rentals come with 65 tennis balls and a pickup basket. You will be responsible for a $1 per ball fee for any lost balls. Please return all equipment in the same condition as received.</p>
        
        <h2>4. Condition of Equipment</h2>
        <p>You are responsible for inspecting the Equipment upon pickup. By accepting the Equipment, you acknowledge it is in good working condition. You agree to return the Equipment in the same condition, normal wear and tear excepted.</p>
        
        <h2>5. Usage and Supervision</h2>
        <p>You may use the Equipment with friends or fellow players, but as the renter, you must be present during the entire rental period. You may not lend, sub-rent, or allow others to use the Equipment without your direct supervision. You remain fully responsible for the Equipment at all times during your rental period.</p>
        
        <h2>6. Prohibited Uses</h2>
        <p>The Equipment may not be:</p>
        <ul>
          <li>Used in a manner inconsistent with its intended purpose</li>
          <li>Modified, altered, or disassembled</li>
          <li>Exposed to extreme weather conditions</li>
          <li>Left unattended by the person who made the booking</li>
          <li>Used by or transferred to others without the renter being present</li>
        </ul>
        
        <h2>7. Damage and Loss</h2>
        <p>You are responsible for all damage to or loss of the Equipment while it is in your possession. You agree to pay for repairs or replacement if necessary.</p>
        
        <h2>8. Cancellation Policy</h2>
        <p>Cancellations made more than 24 hours before your session will receive a full refund. Cancellations within 24 hours may be rescheduled but are not eligible for refunds unless due to inclement weather.</p>
        
        <h2>9. Assumption of Risk and Liability Waiver</h2>
        <p><strong>PLEASE READ THIS SECTION CAREFULLY. BY RENTING THE EQUIPMENT, YOU ARE GIVING UP CERTAIN LEGAL RIGHTS.</strong></p>
        <p>You acknowledge that tennis and the use of ball machine equipment involves inherent risks, including but not limited to: physical injury from tennis balls, equipment malfunction, slips, falls, overexertion, and other hazards associated with athletic activity. You voluntarily assume all such risks, both known and unknown, even if arising from the negligence of Seattle Ball Machine Rental or others, and assume full responsibility for your participation.</p>
        <p>You hereby waive, release, and discharge Seattle Ball Machine Rental, First Serve Seattle, Simple Apps, LLC, and their officers, directors, employees, agents, and representatives from any and all liability, claims, demands, actions, or causes of action whatsoever arising out of or related to any loss, damage, or injury, including death, that may be sustained by you, or to any property belonging to you, while renting or using the Equipment, whether caused by the negligence of Seattle Ball Machine Rental or otherwise.</p>

        <h2>10. Indemnification</h2>
        <p>You agree to indemnify, defend, and hold harmless Seattle Ball Machine Rental, First Serve Seattle, Simple Apps, LLC, and their officers, directors, employees, agents, and representatives from and against any and all claims, damages, expenses, judgments, penalties, losses, and liabilities (including reasonable attorneys&apos; fees) arising out of or related to your use of the Equipment, your violation of these Terms, or your violation of any rights of a third party.</p>
        
        <h2>11. Governing Law</h2>
        <p>These Terms of Service are governed by the laws of the State of Washington.</p>
        
        <h2>12. Modifications</h2>
        <p>Seattle Ball Machine Rental reserves the right to modify these Terms of Service at any time. Continued use of our services constitutes acceptance of any modified terms.</p>

        <h2>13. Acknowledgment</h2>
        <p>By checking the waiver acceptance box during the booking process, you acknowledge that:</p>
        <ul>
          <li>You have read, understood, and agree to be bound by these Terms of Service</li>
          <li>You have read and understand the Assumption of Risk and Liability Waiver in Section 9</li>
          <li>You are at least 18 years of age</li>
          <li>You are voluntarily choosing to rent and use the Equipment</li>
          <li>Your electronic acceptance has the same legal effect as a handwritten signature</li>
        </ul>

        <h2>14. Contact Us</h2>
        <p>If you have any questions about these Terms of Service, please contact us at support@firstserveseattle.com</p>
      </div>
      
      <div className="mt-8">
        <Button asChild>
          <Link href="/booking">Book a Session</Link>
        </Button>
      </div>
    </div>
  )
}