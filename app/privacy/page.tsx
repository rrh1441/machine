import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | Seattle Ball Machine Rental",
  description: "Privacy policy for Seattle Ball Machine Rental. Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "https://www.seattleballmachine.com/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
}
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-12">
      <Link href="/" className="flex items-center gap-2 mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="h-4 w-4" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl font-bold tracking-tight mb-6">Privacy Policy</h1>
      
      <div className="prose prose-green max-w-none">
        <p>Last Updated: April 6, 2025</p>
        
        <h2>1. Introduction</h2>
        <p>Seattle Ball Machine Rental ("we," "our," or "us"), a product of First Serve Seattle, owned by Simple Apps, LLC respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.</p>
        
        <h2>2. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li><strong>Personal Information:</strong> Name, email address, phone number, and payment information when you make a booking.</li>
          <li><strong>Usage Data:</strong> Information about how you interact with our website, including browsing history, clicks, and time spent on pages.</li>
          <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers.</li>
        </ul>
        
        <h2>3. How We Use Your Information</h2>
        <p>We use your information for the following purposes:</p>
        <ul>
          <li>To process and manage your bookings</li>
          <li>To communicate with you about your bookings and our services</li>
          <li>To improve our website and services</li>
          <li>To send promotional materials (with your consent)</li>
          <li>To comply with legal obligations</li>
        </ul>
        
        <h2>4. Sharing Your Information</h2>
        <p>We may share your information with:</p>
        <ul>
          <li>Service providers who help us operate our business</li>
          <li>Legal authorities when required by law</li>
          <li>Third parties in connection with a business transfer (e.g., merger or acquisition)</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
        
        <h2>5. Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
        
        <h2>6. Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access personal information we hold about you</li>
          <li>Correct inaccurate personal information</li>
          <li>Delete your personal information</li>
          <li>Object to or restrict certain processing activities</li>
          <li>Data portability</li>
        </ul>
        
        <h2>7. Cookies</h2>
        <p>We use cookies and similar technologies to enhance your experience on our website. You can manage cookie preferences through your browser settings.</p>
        
        <h2>8. Children's Privacy</h2>
        <p>Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.</p>
        
        <h2>9. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
        
        <h2>10. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at support@firstserveseattle.com</p>
      </div>
      
      <div className="mt-8">
        <Button asChild>
          <Link href="/booking">Book a Session</Link>
        </Button>
      </div>
    </div>
  )
}