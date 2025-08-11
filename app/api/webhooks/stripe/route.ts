import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { resend } from '@/lib/resend/client'
import { emailTemplates } from '@/lib/emails/templates'

export async function POST(req: NextRequest) {
  console.log('Stripe webhook received')
  
  // Check if Stripe is configured
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Stripe not configured - missing stripe client or webhook secret')
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 503 }
    )
  }

  const body = await req.text()
  const signature = headers().get('stripe-signature')!
  console.log('Webhook signature present:', !!signature)

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

  console.log('Webhook event type:', event.type)
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    console.log('Session ID:', session.id)
    console.log('Customer email:', session.customer_email)
    console.log('Metadata:', session.metadata)

    // Check if Supabase is configured
    if (!supabaseAdmin) {
      console.error('Supabase not configured, skipping database operations')
      return NextResponse.json({ received: true })
    }

    // Retrieve the session with line items to check for SwingStick
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      session.id,
      { expand: ['line_items'] }
    )

    // Check if SwingStick was purchased
    let includesSwingStick = false
    let swingStickQuantity = 0
    
    if (sessionWithLineItems.line_items) {
      for (const item of sessionWithLineItems.line_items.data) {
        // Check if this is a SwingStick product by product ID or name
        if (item.price?.product === process.env.STRIPE_PRODUCT_SWINGSTICK ||
            item.description?.toLowerCase().includes('swing') ||
            item.description?.toLowerCase().includes('stick')) {
          includesSwingStick = true
          swingStickQuantity += item.quantity || 0
        }
      }
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
        includes_swingstick: includesSwingStick,
        swingstick_quantity: swingStickQuantity,
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
      const emailContent = emailTemplates.purchaseConfirmation(
        parseInt(session.metadata?.sessions_count || '1'),
        includesSwingStick
      )
      
      await resend.emails.send({
        from: 'Seattle Ball Machine <noreply@seattleballmachine.com>',
        to: session.customer_email!,
        ...emailContent
      })
    }
  }

  return NextResponse.json({ received: true })
}