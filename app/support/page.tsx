import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// Removed Input, Textarea, Label imports as they are no longer used

export default function SupportPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Link href="/" className="flex items-center gap-2 mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold tracking-tight mb-6">Support & FAQs</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {/* --- FAQ Items with your updates --- */}
            <AccordionItem value="item-1">
              <AccordionTrigger>How does pickup and return work?</AccordionTrigger>
              <AccordionContent>
                After booking, you'll receive detailed pickup and return instructions. Generally,
                pickup is available from our Queen Anne location in Seattle. We'll provide the exact
                address after your booking is confirmed.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What if it rains during my session?</AccordionTrigger>
              <AccordionContent>
                If your session is affected by rain, you can reschedule at no additional cost.
                Simply contact us within 24 hours of your session to arrange a new time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How many tennis balls are included?</AccordionTrigger>
              <AccordionContent>
                Each rental includes 75 tennis balls and a pickup basket. The balls are regularly
                replaced to ensure quality practice sessions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Do I need a special court to use the machine?</AccordionTrigger>
              <AccordionContent>
                The Hydrogen Proton ball machine works on any standard tennis court. You are
                responsible for securing your own court time at a facility of your choice. To find available open courts, check out firstserveseattle.com. Otherwise, use Seattle's reservation system.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>How do I transport the machine?</AccordionTrigger>
              <AccordionContent>
                The machine weighs less than 20 pounds making it
                easy to transport. It fits in most car trunks or back seats. We provide brief
                instructions during pickup on how to handle the equipment safely.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>What happens if the machine malfunctions?</AccordionTrigger>
              <AccordionContent>
                If the machine malfunctions during your session, contact us immediately. We will
                either help troubleshoot the issue or provide a full refund/reschedule. Our no-hassle
                guarantee ensures you'll never pay for a session where the equipment doesn't perform.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* --- Contact Card Updated --- */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              {/* Updated description */}
              <CardDescription>Have a question that's not answered here? Click below to email us.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* --- Replaced form with mailto button --- */}
              <Button asChild className="w-full">
                <a href="mailto:support@firstserveseattle.com">
                  Contact Support via Email
                </a>
              </Button>
            </CardContent>
          </Card>

          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">Quick Response Guarantee</h3>
            <p className="text-green-700 text-sm">
              We respond to all support inquiries within 2 hours during business hours
              (9am-7pm Pacific Time) and within 12 hours outside of business hours.
            </p>
          </div>
        </div>
        {/* --- End Contact Card --- */}

      </div>
    </div>
  )
}