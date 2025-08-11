import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { resend } from '@/lib/resend/client'

export async function POST(req: NextRequest) {
  // Check if Stripe is configured
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 503 }
    )
  }

  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    // Check if Supabase is configured
    if (!supabaseAdmin) {
      console.log('Supabase not configured, skipping database operations')
      return NextResponse.json({ received: true })
    }

    // Create or update customer
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .upsert({
        email: session.customer_email,
        name: session.customer_details?.name,
        phone: session.customer_details?.phone,
        stripe_customer_id: session.customer,
      }, {
        onConflict: 'email'
      })
      .select()
      .single()

    if (customerError) {
      console.error('Customer creation error:', customerError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Record purchase
    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from('purchases')
      .insert({
        customer_id: customer.id,
        stripe_payment_intent_id: session.payment_intent,
        stripe_checkout_session_id: session.id,
        package_type: session.metadata?.package_type || 'single',
        sessions_purchased: parseInt(session.metadata?.sessions_count || '1'),
        amount_paid: session.amount_total,
        includes_swingstick: false, // TODO: Check line items for SwingStick
        swingstick_quantity: 0,
      })
      .select()
      .single()

    if (purchaseError) {
      console.error('Purchase creation error:', purchaseError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Add session credits
    const { error: creditError } = await supabaseAdmin
      .from('session_credits')
      .insert({
        customer_id: customer.id,
        purchase_id: purchase.id,
        sessions_remaining: parseInt(session.metadata?.sessions_count || '1'),
        sessions_total: parseInt(session.metadata?.sessions_count || '1'),
      })

    if (creditError) {
      console.error('Credit creation error:', creditError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Send confirmation email if Resend is configured
    if (resend) {
      await resend.emails.send({
        from: 'Seattle Ball Machine <noreply@seattleballmachine.com>',
        to: session.customer_email!,
        subject: 'Your Seattle Ball Machine Rental is Confirmed!',
        html: `
          <h1>Thank you for your purchase!</h1>
          <p>You've purchased ${session.metadata?.sessions_count} session(s).</p>
          <p><a href="${process.env.NEXT_PUBLIC_URL}/rentalbooking">Click here to schedule your first session</a></p>
          <h2>Pickup Location</h2>
          <p>2116 4th Avenue West<br>Seattle, WA 98119</p>
          <p>Questions? Reply to this email or call (253) 252-9577</p>
        `
      })
    }
  }

  return NextResponse.json({ received: true })
}